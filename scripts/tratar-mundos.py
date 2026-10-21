"""Trata os cenários dos mundos gerados por IA e os alinha à grade de pixels real.

Etapas:
  1. Estima o tamanho e a fase do "bloco de pixel" de cada cenário (periodicidade
     das bordas entre cores, nos dois eixos).
  2. Amostra o centro de cada bloco (nearest neighbor, sem interpolação) para uma
     resolução base igual nos três cenários.
  3. Procura colunas e linhas artificialmente escuras (faixas, costuras) e reporta.
  4. Salva PNGs em src/assets/mundos-tratados/ e prévias em scripts/previas/.

Uso:
  py scripts/tratar-mundos.py                 # largura base 320 (bloco nativo)
  py scripts/tratar-mundos.py --largura 480

Os arquivos originais em src/assets/ nunca são alterados.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

RAIZ = Path(__file__).resolve().parent.parent
ORIGEM = RAIZ / "src" / "assets"
DESTINO = ORIGEM / "mundos-tratados"
PREVIAS = Path(__file__).resolve().parent / "previas"

MUNDOS = {
    "mundo-skarn.png": "skarn",
    "mundo-hollowcrest.png": "hollowcrest",
    "mundo-bosque.png": "bosque",
}

LARGURA_PADRAO = 320
# faixas horizontais escuras no céu (linhas na grade de 320 px), pintadas com as vizinhas
FAIXAS_DISFARCAR = {"hollowcrest": [(104, 105), (117, 118), (126, 127)]}
QUEDA_MINIMA_FAIXA = 8.0
PERIODOS = np.arange(2.0, 8.0, 0.005)
LIMIAR_FAIXA = 10.0  # queda de luminância (0-255) em relação às vizinhas
JANELA_FAIXA = 7
ESCALA_PREVIA = 3


def luminancia(rgb: np.ndarray) -> np.ndarray:
    return rgb[..., 0] * 0.299 + rgb[..., 1] * 0.587 + rgb[..., 2] * 0.114


def estimar_grade(lum: np.ndarray, eixo: int) -> tuple[float, float]:
    """Retorna (período, fase) do bloco de pixel ao longo do eixo."""
    energia = np.abs(np.diff(lum, axis=eixo)).sum(axis=1 - eixo)
    energia = energia - energia.mean()
    posicoes = np.arange(len(energia)) + 0.5  # a borda fica entre dois pixels
    melhor = (0.0, 0.0, 0.0)
    for periodo in PERIODOS:
        soma = (energia * np.exp(2j * np.pi * posicoes / periodo)).sum()
        if abs(soma) > melhor[0]:
            melhor = (abs(soma), periodo, soma)
    _, periodo, soma = melhor
    fase = (np.angle(soma) / (2 * np.pi) * periodo) % periodo
    return float(periodo), float(fase)


def amostrar(rgb: np.ndarray, largura: int, altura: int, fase_x: float, fase_y: float) -> np.ndarray:
    alt_orig, larg_orig = rgb.shape[:2]
    passo_x = larg_orig / largura
    passo_y = alt_orig / altura
    deslocamento_x = (fase_x % passo_x) - passo_x if fase_x % passo_x > passo_x / 2 else fase_x % passo_x
    deslocamento_y = (fase_y % passo_y) - passo_y if fase_y % passo_y > passo_y / 2 else fase_y % passo_y
    xs = np.clip(np.floor(deslocamento_x + (np.arange(largura) + 0.5) * passo_x), 0, larg_orig - 1).astype(int)
    ys = np.clip(np.floor(deslocamento_y + (np.arange(altura) + 0.5) * passo_y), 0, alt_orig - 1).astype(int)
    return rgb[np.ix_(ys, xs)]


def disfarcar_faixas(rgb: np.ndarray, faixas: list[tuple[int, int]]) -> tuple[np.ndarray, int]:
    """Repinta só os pixels de céu da faixa que estão mais escuros que as duas vizinhas.

    A metade de cima da faixa copia a linha acima e a de baixo copia a linha abaixo,
    preservando o degrau do degradê. Castelo, cristal e árvores ficam intactos.
    """
    saida = rgb.copy()
    lum = luminancia(rgb.astype(np.float64))
    trocados = 0
    for inicio, fim in faixas:
        acima, abaixo = inicio - 1, fim + 1
        meio = (inicio + fim) / 2
        for y in range(inicio, fim + 1):
            ceu = (lum[acima] - lum[y] > QUEDA_MINIMA_FAIXA) & (lum[abaixo] - lum[y] > QUEDA_MINIMA_FAIXA)
            ceu &= rgb[y, :, 2] > rgb[y, :, 0] + 20
            origem = acima if y <= meio else abaixo
            saida[y, ceu] = rgb[origem, ceu]
            trocados += int(ceu.sum())
    return saida, trocados


def procurar_faixas(rgb: np.ndarray) -> dict[str, list[dict[str, float]]]:
    """Linhas/colunas inteiras mais escuras que as vizinhas (costuras artificiais)."""
    lum = luminancia(rgb.astype(np.float64))
    achados: dict[str, list[dict[str, float]]] = {"colunas": [], "linhas": []}
    for eixo, chave in ((0, "colunas"), (1, "linhas")):
        perfil = lum.mean(axis=eixo)
        base = ndimage.median_filter(perfil, JANELA_FAIXA, mode="nearest")
        queda = base - perfil
        borda = (lum.shape[1 - eixo] if eixo == 0 else lum.shape[0])
        for i in np.where(queda > LIMIAR_FAIXA)[0]:
            achados[chave].append({"posicao": int(i), "queda": round(float(queda[i]), 1), "total": borda})
    return achados


def previa_comparacao(original: Image.Image, tratada: Image.Image, nome: str) -> None:
    escala = ESCALA_PREVIA
    ampliada = tratada.resize((tratada.width * escala, tratada.height * escala), Image.NEAREST)
    orig = original.resize(ampliada.size, Image.NEAREST)
    tela = Image.new("RGB", (ampliada.width * 2 + 16, ampliada.height), (20, 18, 26))
    tela.paste(orig, (0, 0))
    tela.paste(ampliada, (ampliada.width + 16, 0))
    tela.save(PREVIAS / f"mundo-{nome}-comparacao.png")

    recorte_x, recorte_y, lado = int(tratada.width * 0.72), int(tratada.height * 0.3), 64
    zoom = 8
    caixa_t = (recorte_x, recorte_y, recorte_x + lado, recorte_y + lado)
    fator_x = original.width / tratada.width
    fator_y = original.height / tratada.height
    caixa_o = tuple(int(v) for v in (recorte_x * fator_x, recorte_y * fator_y,
                                     (recorte_x + lado) * fator_x, (recorte_y + lado) * fator_y))
    zoom_t = tratada.crop(caixa_t).resize((lado * zoom, lado * zoom), Image.NEAREST)
    zoom_o = original.crop(caixa_o).resize((lado * zoom, lado * zoom), Image.NEAREST)
    detalhe = Image.new("RGB", (lado * zoom * 2 + 16, lado * zoom), (20, 18, 26))
    detalhe.paste(zoom_o, (0, 0))
    detalhe.paste(zoom_t, (lado * zoom + 16, 0))
    detalhe.save(PREVIAS / f"mundo-{nome}-detalhe.png")


def marcar_faixas(tratada: Image.Image, faixas: dict[str, list[dict[str, float]]], nome: str) -> None:
    escala = ESCALA_PREVIA
    img = tratada.resize((tratada.width * escala, tratada.height * escala), Image.NEAREST)
    desenho = ImageDraw.Draw(img)
    for f in faixas["colunas"]:
        x = f["posicao"] * escala + escala // 2
        desenho.line([(x, 0), (x, img.height)], fill=(255, 0, 255), width=1)
    for f in faixas["linhas"]:
        y = f["posicao"] * escala + escala // 2
        desenho.line([(0, y), (img.width, y)], fill=(255, 0, 255), width=1)
    img.save(PREVIAS / f"mundo-{nome}-faixas.png")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--largura", type=int, default=LARGURA_PADRAO)
    args = parser.parse_args()

    DESTINO.mkdir(exist_ok=True)
    PREVIAS.mkdir(exist_ok=True)
    relatorio: dict[str, object] = {}
    lado_a_lado: list[Image.Image] = []

    for arquivo, nome in MUNDOS.items():
        original = Image.open(ORIGEM / arquivo).convert("RGB")
        rgb = np.asarray(original)
        lum = luminancia(rgb.astype(np.float64))
        periodo_x, fase_x = estimar_grade(lum, 1)
        periodo_y, fase_y = estimar_grade(lum, 0)

        largura = args.largura
        altura = round(largura * original.height / original.width)
        amostrada = amostrar(rgb, largura, altura, fase_x, fase_y)
        trocados = 0
        if nome in FAIXAS_DISFARCAR and largura == LARGURA_PADRAO:
            amostrada, trocados = disfarcar_faixas(amostrada, FAIXAS_DISFARCAR[nome])
        tratada = Image.fromarray(amostrada)
        tratada.save(DESTINO / f"{nome}.png", optimize=True)

        faixas_orig = procurar_faixas(rgb)
        faixas = procurar_faixas(np.asarray(tratada))
        previa_comparacao(original, tratada, nome)
        marcar_faixas(tratada, faixas, nome)
        lado_a_lado.append(tratada)

        relatorio[nome] = {
            "original": list(original.size),
            "proporcao": round(original.width / original.height, 4),
            "bloco_estimado": [round(periodo_x, 3), round(periodo_y, 3)],
            "fase": [round(fase_x, 2), round(fase_y, 2)],
            "grade_nativa": [round(original.width / periodo_x, 1), round(original.height / periodo_y, 1)],
            "tratada": [largura, altura],
            "pixels_faixa_disfarcados": trocados,
            "cores": len(tratada.getcolors(1 << 24) or []),
            "faixas_original": faixas_orig,
            "faixas_tratada": faixas,
        }
        print(nome, json.dumps({k: v for k, v in relatorio[nome].items() if not k.startswith("faixas")}),
              "faixas:", len(faixas["colunas"]), "colunas,", len(faixas["linhas"]), "linhas")

    largura, altura = lado_a_lado[0].size
    escala = 2
    grade = Image.new("RGB", (largura * escala * 3 + 32, altura * escala), (20, 18, 26))
    for i, img in enumerate(lado_a_lado):
        grade.paste(img.resize((largura * escala, altura * escala), Image.NEAREST), (i * (largura * escala + 16), 0))
    grade.save(PREVIAS / "mundos-todos.png")

    (PREVIAS / "relatorio-mundos.json").write_text(json.dumps(relatorio, indent=2, ensure_ascii=False), encoding="utf-8")


if __name__ == "__main__":
    main()
