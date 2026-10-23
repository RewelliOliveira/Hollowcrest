"""Trata os sprites dos personagens gerados por IA e os converte em pixel art real.

Etapas:
  1. Estima o tamanho do "bloco de pixel" de cada arte (periodicidade das bordas
     entre cores). Se as estimativas não forem consistentes entre os personagens,
     usa uma grade comum (largura da imagem original -> N pixels) para todos.
  2. Limpa a transparência (alpha 0 ou 255) e remove ruído solto no fundo.
  3. Reduz para a grade escolhida pegando a cor dominante de cada bloco.
  4. Agrupa cores quase idênticas e limita a paleta (máx. 32 cores).
  5. Padroniza a tela: mesmo tamanho, centralizados, pés na mesma linha de base.
  6. Salva PNGs em src/assets/personagens-tratados/, prévias em scripts/previas/
     e os dados de pixel em src/data/sprites.ts.

Uso:
  py scripts/tratar-personagens.py                      # grade padrão + prévias de todas as grades
  py scripts/tratar-personagens.py --grade 80
  py scripts/tratar-personagens.py --grade 80 --grade-personagem mago=96
  py scripts/tratar-personagens.py --max-cores 24

Os arquivos originais em src/assets/ nunca são alterados.
"""

from __future__ import annotations

import argparse
import json
from dataclasses import dataclass
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

RAIZ = Path(__file__).resolve().parent.parent
ORIGEM = RAIZ / "src" / "assets"
DESTINO = ORIGEM / "personagens-tratados"
PREVIAS = Path(__file__).resolve().parent / "previas"
SPRITES_TS = RAIZ / "src" / "data" / "sprites.ts"

# arquivo original -> nome usado no projeto
PERSONAGENS = {
    "archer.png": "arqueiro",
    "mage.png": "mago",
    "beserker.png": "berserker",
    "lancer.png": "lanceiro",
    "assassin.png": "assassino",
    "paladin.png": "paladino",
}

GRADES_CANDIDATAS = (64, 80, 96, 128, 148)  # 148 ~ bloco nativo de 6,75px
GRADE_PADRAO = 96
MAX_CORES = 32
BIN_SHIFT = 4  # agrupa cada canal em 16 níveis para votar a cor do bloco
PASSO_LAB = 4.0  # pré-fusão de cores praticamente idênticas
DELTA_E_QUASE_IGUAL = 6.0  # cores com diferença menor que isso são a mesma cor
ALPHA_MINIMO = 128  # acima disso o pixel é opaco
RUIDO_AREA_MAX = 60  # manchas soltas menores que isso (px originais) são ruído
COBERTURA_MINIMA = 0.5  # fração opaca do bloco para ele virar pixel
PESO_CONTORNO = 1.6  # favorece o contorno escuro na escolha da cor do bloco
MARGEM = 2  # pixels de folga em volta do maior personagem
FUNDO_PREVIA = (20, 18, 26, 255)  # cor de fundo da página (#14121a)
ESCALA_PREVIA = 8


# ---------------------------------------------------------------------------
# Cor
# ---------------------------------------------------------------------------

def rgb_para_lab(rgb: np.ndarray) -> np.ndarray:
    c = rgb.astype(np.float64) / 255.0
    c = np.where(c > 0.04045, ((c + 0.055) / 1.055) ** 2.4, c / 12.92)
    m = np.array([
        [0.4124564, 0.3575761, 0.1804375],
        [0.2126729, 0.7151522, 0.0721750],
        [0.0193339, 0.1191920, 0.9503041],
    ])
    xyz = c @ m.T / np.array([0.95047, 1.0, 1.08883])
    f = np.where(xyz > 216 / 24389, np.cbrt(xyz), (24389 / 27 * xyz + 16) / 116)
    return np.stack([
        116 * f[..., 1] - 16,
        500 * (f[..., 0] - f[..., 1]),
        200 * (f[..., 1] - f[..., 2]),
    ], axis=-1)


def luminancia(rgb: np.ndarray) -> np.ndarray:
    return rgb[..., 0] * 0.299 + rgb[..., 1] * 0.587 + rgb[..., 2] * 0.114


def reduzir_paleta(cores: np.ndarray, contagem: np.ndarray, max_cores: int) -> np.ndarray:
    """Agrupa cores próximas (Ward em Lab). Retorna o rótulo do grupo de cada cor.

    Funde primeiro tudo que é praticamente igual; depois, se ainda passar do limite,
    funde os pares de menor custo. O custo de Ward preserva cores raras mas muito
    diferentes (olhos, cristal), que ficariam caras de fundir.
    """
    n = len(cores)
    centro = rgb_para_lab(cores)
    peso = contagem.astype(np.float64)
    grupo = np.arange(n)
    ativo = np.ones(n, dtype=bool)

    def distancias(i: int) -> np.ndarray:
        return np.linalg.norm(centro - centro[i], axis=1)

    dist = np.linalg.norm(centro[:, None, :] - centro[None, :, :], axis=-1)
    np.fill_diagonal(dist, np.inf)

    while ativo.sum() > 1:
        a, b = np.unravel_index(np.argmin(dist), dist.shape)
        if dist[a, b] >= DELTA_E_QUASE_IGUAL:
            if ativo.sum() <= max_cores:
                break
            custo = np.outer(peso, peso) / np.add.outer(peso, peso) * dist ** 2
            a, b = np.unravel_index(np.argmin(custo), custo.shape)

        total = peso[a] + peso[b]
        centro[a] = (centro[a] * peso[a] + centro[b] * peso[b]) / total
        peso[a] = total
        grupo[grupo == b] = a
        ativo[b] = False
        dist[b, :] = dist[:, b] = np.inf
        linha = np.where(ativo, distancias(a), np.inf)
        linha[a] = np.inf
        dist[a, :] = dist[:, a] = linha

    _, rotulo = np.unique(grupo, return_inverse=True)
    return rotulo


# ---------------------------------------------------------------------------
# Detecção da grade
# ---------------------------------------------------------------------------

def estimar_bloco(rgba: np.ndarray, mascara: np.ndarray) -> tuple[float, float]:
    """Estima o tamanho do bloco pela periodicidade das bordas entre cores.

    Retorna (tamanho em px, confiança 0..1).
    """
    rgb = rgba[..., :3].astype(np.int32)
    dx = (np.abs(np.diff(rgb, axis=1)).sum(2) > 40) & mascara[:, 1:] & mascara[:, :-1]
    dy = (np.abs(np.diff(rgb, axis=0)).sum(2) > 40) & mascara[1:] & mascara[:-1]
    perfis = (dx.sum(0).astype(float), dy.sum(1).astype(float))

    melhor = (0.0, 0.0)
    for periodo in np.arange(4.0, 24.0, 0.25):
        score = 0.0
        for perfil in perfis:
            fase = np.exp(2j * np.pi * np.arange(len(perfil)) / periodo)
            score += abs((perfil * fase).sum()) / max(perfil.sum(), 1.0)
        score /= 2
        if score > melhor[0]:
            melhor = (score, periodo)
    return melhor[1], melhor[0]


# ---------------------------------------------------------------------------
# Tratamento
# ---------------------------------------------------------------------------

@dataclass
class Sprite:
    nome: str
    paleta: np.ndarray  # (n, 3) uint8
    indices: np.ndarray  # (h, w) int, -1 = transparente


def carregar(arquivo: Path) -> tuple[np.ndarray, np.ndarray]:
    rgba = np.array(Image.open(arquivo).convert("RGBA"))
    mascara = rgba[..., 3] >= ALPHA_MINIMO

    # remove manchas pequenas soltas no fundo (ruído da remoção de fundo)
    rotulos, n = ndimage.label(mascara, structure=np.ones((3, 3)))
    if n:
        areas = ndimage.sum(mascara, rotulos, index=np.arange(1, n + 1))
        pequenas = np.flatnonzero(areas < RUIDO_AREA_MAX) + 1
        mascara &= ~np.isin(rotulos, pequenas)
    return rgba, mascara


def reduzir(rgba: np.ndarray, mascara: np.ndarray, bloco: float, max_cores: int) -> tuple[np.ndarray, np.ndarray]:
    ys, xs = np.nonzero(mascara)
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    rgb = rgba[y0:y1, x0:x1, :3]
    msk = mascara[y0:y1, x0:x1]
    h, w = msk.shape
    linhas, colunas = max(1, round(h / bloco)), max(1, round(w / bloco))
    # bordas ancoradas embaixo, para a linha dos pés ficar completa
    by = np.round(h - np.arange(linhas, -1, -1) * h / linhas).astype(int)
    bx = np.round(np.arange(colunas + 1) * w / colunas).astype(int)

    # cada pixel cai num "bin" de cor; o bin mais votado do bloco decide a cor,
    # assim cores raras mas dominantes no bloco (olhos, cristal) sobrevivem
    q = (rgb >> BIN_SHIFT).astype(np.int64)
    bins = (q[..., 0] << 16) | (q[..., 1] << 8) | q[..., 2]
    bins[~msk] = -1
    peso_px = np.where(luminancia(rgb.astype(float)) < 50, PESO_CONTORNO, 1.0)

    cor_bloco = np.zeros((linhas, colunas, 3))
    opaco_bloco = np.zeros((linhas, colunas), dtype=bool)
    for i in range(linhas):
        for j in range(colunas):
            celula = bins[by[i]:by[i + 1], bx[j]:bx[j + 1]]
            if celula.size == 0 or (celula >= 0).mean() < COBERTURA_MINIMA:
                continue
            validos = celula >= 0
            valores, inv = np.unique(celula[validos], return_inverse=True)
            votos = np.bincount(inv, weights=peso_px[by[i]:by[i + 1], bx[j]:bx[j + 1]][validos])
            px = rgb[by[i]:by[i + 1], bx[j]:bx[j + 1]][celula == valores[np.argmax(votos)]]
            cor_bloco[i, j] = px.mean(axis=0)
            opaco_bloco[i, j] = True

    # pré-fusão: blocos cuja cor arredondada em Lab é igual já são a mesma cor
    cor_opaca = cor_bloco[opaco_bloco]
    chave = np.round(rgb_para_lab(cor_opaca) / PASSO_LAB).astype(np.int64)
    _, inverso, contagem = np.unique(chave, axis=0, return_inverse=True, return_counts=True)
    inverso = inverso.reshape(-1)
    cores = np.zeros((len(contagem), 3))
    np.add.at(cores, inverso, cor_opaca)
    cores /= contagem[:, None]
    rotulo = reduzir_paleta(cores, contagem, max_cores)
    n = rotulo.max() + 1
    paleta = np.zeros((n, 3))
    for k in range(n):
        sel = rotulo == k
        paleta[k] = (cores[sel] * contagem[sel, None]).sum(0) / contagem[sel].sum()

    indices = np.full((linhas, colunas), -1, dtype=np.int64)
    indices[opaco_bloco] = rotulo[inverso.reshape(-1)]
    return np.round(paleta).astype(np.uint8), indices


def recortar(indices: np.ndarray) -> np.ndarray:
    ys, xs = np.nonzero(indices >= 0)
    return indices[ys.min():ys.max() + 1, xs.min():xs.max() + 1]


def padronizar(sprites: list[Sprite], grades: dict[str, int], grade_base: int) -> list[Sprite]:
    """Mesma tela para todos, centralizados e com os pés na mesma linha de base.

    Um personagem com grade própria maior ganha uma tela proporcionalmente maior.
    """
    larg = max(s.indices.shape[1] * grade_base / grades[s.nome] for s in sprites)
    alt = max(s.indices.shape[0] * grade_base / grades[s.nome] for s in sprites)
    saida = []
    for s in sprites:
        fator = grades[s.nome] / grade_base
        tela_w = round((larg + 2 * MARGEM) * fator)
        tela_h = round((alt + 2 * MARGEM) * fator)
        h, w = s.indices.shape
        tela = np.full((tela_h, tela_w), -1, dtype=np.int64)
        topo = tela_h - round(MARGEM * fator) - h
        esq = (tela_w - w) // 2
        tela[topo:topo + h, esq:esq + w] = s.indices
        saida.append(Sprite(s.nome, s.paleta, tela))
    return saida


def para_imagem(s: Sprite) -> Image.Image:
    h, w = s.indices.shape
    rgba = np.zeros((h, w, 4), dtype=np.uint8)
    opaco = s.indices >= 0
    rgba[opaco, :3] = s.paleta[s.indices[opaco]]
    rgba[opaco, 3] = 255
    return Image.fromarray(rgba, "RGBA")


def tratar(arquivos: dict[str, tuple[np.ndarray, np.ndarray]], grades: dict[str, int], grade_base: int, max_cores: int) -> list[Sprite]:
    sprites = []
    for nome, (rgba, mascara) in arquivos.items():
        bloco = rgba.shape[1] / grades[nome]
        paleta, indices = reduzir(rgba, mascara, bloco, max_cores)
        sprites.append(Sprite(nome, paleta, recortar(indices)))
    return padronizar(sprites, grades, grade_base)


# ---------------------------------------------------------------------------
# Prévias
# ---------------------------------------------------------------------------

def com_fundo(img: Image.Image) -> Image.Image:
    fundo = Image.new("RGBA", img.size, FUNDO_PREVIA)
    fundo.alpha_composite(img)
    return fundo


def lado_a_lado(imagens: list[Image.Image], espaco: int = 16) -> Image.Image:
    alt = max(i.height for i in imagens)
    larg = sum(i.width for i in imagens) + espaco * (len(imagens) - 1)
    folha = Image.new("RGBA", (larg, alt), FUNDO_PREVIA)
    x = 0
    for i in imagens:
        folha.alpha_composite(i, (x, alt - i.height))
        x += i.width + espaco
    return folha


def original_limpo(rgba: np.ndarray, mascara: np.ndarray) -> Image.Image:
    copia = rgba.copy()
    copia[..., 3] = np.where(mascara, 255, 0)
    ys, xs = np.nonzero(mascara)
    return Image.fromarray(copia, "RGBA").crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))


def ampliar(img: Image.Image, escala: int) -> Image.Image:
    return img.resize((img.width * escala, img.height * escala), Image.Resampling.NEAREST)


def ajustar_altura(img: Image.Image, altura: int) -> Image.Image:
    return img.resize((round(img.width * altura / img.height), altura), Image.Resampling.NEAREST)


# ---------------------------------------------------------------------------
# Saída TypeScript
# ---------------------------------------------------------------------------

CARACTERES_COR = "0123456789abcdefghijklmnopqrstuv"  # um caractere por cor da paleta (máx. 32)
CARACTERE_VAZIO = "."


def gerar_ts(sprites: list[Sprite]) -> str:
    """Cada sprite vira um mapa de texto (uma string por linha, um caractere por pixel).

    Bem mais leve de baixar e de interpretar que uma lista de [x, y, cor]; os pixels
    são decodificados uma vez quando o módulo carrega.
    """
    linhas = [
        "// Arquivo gerado por scripts/tratar-personagens.py. Não editar à mão.",
        "",
        "/** Um pixel do sprite: coluna, linha e índice da cor na paleta. */",
        "export type Pixel = readonly [x: number, y: number, cor: number];",
        "",
        "export type SpriteData = {",
        "  readonly largura: number;",
        "  readonly altura: number;",
        "  readonly paleta: readonly string[];",
        "  readonly pixels: readonly Pixel[];",
        "};",
        "",
        f'const CORES = "{CARACTERES_COR}";',
        "",
        "/** Mapa: uma string por linha, um caractere por pixel (índice em CORES ou \".\" para vazio). */",
        "function decodificar(paleta: readonly string[], mapa: readonly string[]): SpriteData {",
        "  const pixels: Pixel[] = [];",
        "  mapa.forEach((linha, y) => {",
        "    for (let x = 0; x < linha.length; x++) {",
        "      const cor = CORES.indexOf(linha[x]);",
        "      if (cor >= 0) pixels.push([x, y, cor]);",
        "    }",
        "  });",
        "  return { largura: mapa[0].length, altura: mapa.length, paleta, pixels };",
        "}",
        "",
    ]
    for s in sprites:
        assert len(s.paleta) <= len(CARACTERES_COR), f"{s.nome}: paleta com mais de {len(CARACTERES_COR)} cores"
        paleta = ",".join(f'"#{r:02x}{g:02x}{b:02x}"' for r, g, b in s.paleta.tolist())
        mapa = [
            "".join(CARACTERES_COR[i] if i >= 0 else CARACTERE_VAZIO for i in linha)
            for linha in s.indices.tolist()
        ]
        linhas += [
            f"export const {s.nome} = decodificar(",
            f"  [{paleta}],",
            "  [",
            *(f'    "{m}",' for m in mapa),
            "  ],",
            ");",
            "",
        ]
    nomes = ", ".join(s.nome for s in sprites)
    linhas += [
        f"export const sprites = {{ {nomes} }} as const;",
        "",
        "export type NomePersonagem = keyof typeof sprites;",
        "",
    ]
    return "\n".join(linhas)


# ---------------------------------------------------------------------------
# Principal
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--grade", type=int, default=GRADE_PADRAO, help="largura da imagem original em pixels de arte")
    parser.add_argument("--grade-personagem", action="append", default=[], metavar="NOME=N", help="grade própria para um personagem")
    parser.add_argument("--max-cores", type=int, default=MAX_CORES)
    parser.add_argument("--sem-previas", action="store_true", help="não gera as prévias das grades candidatas")
    args = parser.parse_args()

    arquivos: dict[str, tuple[np.ndarray, np.ndarray]] = {}
    relatorio: dict[str, dict[str, float]] = {}
    print("Detecção do bloco de pixel:")
    for arquivo, nome in PERSONAGENS.items():
        rgba, mascara = carregar(ORIGEM / arquivo)
        arquivos[nome] = (rgba, mascara)
        bloco, confianca = estimar_bloco(rgba, mascara)
        relatorio[nome] = {"bloco": bloco, "confianca": round(confianca, 3)}
        print(f"  {nome:10s} bloco ~{bloco:5.2f}px  confiança {confianca:.2f}  -> grade nativa ~{rgba.shape[1] / bloco:.0f}px")

    blocos = [r["bloco"] for r in relatorio.values()]
    confiavel = min(r["confianca"] for r in relatorio.values()) >= 0.3 and (max(blocos) - min(blocos)) <= 0.5
    print("  detecção confiável e consistente" if confiavel else "  detecção NÃO confiável ou inconsistente entre personagens: use as prévias de grade")

    PREVIAS.mkdir(parents=True, exist_ok=True)
    DESTINO.mkdir(parents=True, exist_ok=True)

    if not args.sem_previas:
        por_grade: dict[int, list[Sprite]] = {}
        for g in GRADES_CANDIDATAS:
            por_grade[g] = tratar(arquivos, {n: g for n in arquivos}, g, args.max_cores)
            folha = lado_a_lado([com_fundo(ampliar(para_imagem(s), 4)) for s in por_grade[g]])
            folha.save(PREVIAS / f"grade-{g}-todos.png")
        for i, nome in enumerate(arquivos):
            altura = 640
            pecas = [ajustar_altura(com_fundo(original_limpo(*arquivos[nome])), altura)]
            for g in GRADES_CANDIDATAS:
                spr = recortar(por_grade[g][i].indices)
                pecas.append(ajustar_altura(com_fundo(para_imagem(Sprite(nome, por_grade[g][i].paleta, spr))), altura))
            lado_a_lado(pecas).save(PREVIAS / f"grades-{nome}.png")

    grades = {n: args.grade for n in arquivos}
    for item in args.grade_personagem:
        nome, valor = item.split("=")
        grades[nome] = int(valor)

    sprites = tratar(arquivos, grades, args.grade, args.max_cores)
    print(f"\nGrade final: {args.grade}px de largura (bloco {1000 / args.grade:.1f}px no original)")
    for s in sprites:
        img = para_imagem(s)
        img.save(DESTINO / f"{s.nome}.png")
        h, w = s.indices.shape
        original = com_fundo(original_limpo(*arquivos[s.nome]))
        ampliado = com_fundo(ampliar(img, ESCALA_PREVIA))
        lado_a_lado([ajustar_altura(original, ampliado.height), ampliado]).save(PREVIAS / f"{s.nome}-comparacao.png")
        relatorio[s.nome].update(
            grade=grades[s.nome], tela=f"{w}x{h}", cores=len(s.paleta), pixels=int((s.indices >= 0).sum())
        )
        print(f"  {s.nome:10s} tela {w}x{h}  cores {len(s.paleta):2d}  pixels {(s.indices >= 0).sum()}")

    SPRITES_TS.parent.mkdir(parents=True, exist_ok=True)
    ts = gerar_ts(sprites)
    SPRITES_TS.write_text(ts, encoding="utf-8")
    print(f"\nsrc/data/sprites.ts: {len(ts.encode('utf-8')) / 1024:.1f} KB")
    (PREVIAS / "relatorio.json").write_text(json.dumps(relatorio, indent=2, ensure_ascii=False), encoding="utf-8")


if __name__ == "__main__":
    main()
