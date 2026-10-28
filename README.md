# Hollowcrest

> Um RPG de ação medieval em pixel art 16-bit. Seis heróis, um reino sem luz e as últimas tochas acesas.

Landing page de apresentação do jogo **Hollowcrest**, construída com React, TypeScript, Tailwind CSS e GSAP. A página mistura animações de scroll, sprites em pixel art desenhados direto no navegador e uma estética retrô inspirada nos RPGs da era 16-bit.

---

## Sumário

- [Visão geral](#visão-geral)
- [Seções da página](#seções-da-página)
- [Stack](#stack)
- [Como rodar](#como-rodar)
- [Scripts disponíveis](#scripts-disponíveis)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Pipeline de pixel art](#pipeline-de-pixel-art)
- [Personalização](#personalização)
- [Deploy](#deploy)

---

## Visão geral

- **6 classes jogáveis**: Paladino, Arqueiro, Mago, Berserker, Lanceiro e Assassino, cada uma com história, habilidades, pontos fortes e fracos e atributos balanceados (todas somam 30 pontos).
- **3 mundos**: Montanhas de Skarn, Castelo de Hollowcrest e Bosque Cinzento, com cenários em pixel art e efeitos de ambiente (neve, brasas, janelas piscando).
- **Sprites em pixel art reais**: as artes originais passam por um tratamento em Python que as alinha a uma grade de pixels e limita a paleta.
- **Animações com GSAP + ScrollTrigger**, com montagem preguiçosa dos sprites (só quando chegam perto da tela).
- **Acessibilidade**: link "pular para o conteúdo", foco visível e conteúdo semântico.

## Seções da página

| Seção | Componente | Descrição |
| --- | --- | --- |
| Navegação | `Navbar` | Menu fixo com links para as seções |
| Abertura | `Hero` | Apresentação do jogo com texto digitado |
| Lenda | `Lenda` | A história do reino que perdeu a luz |
| Seleção de classe | `SelecaoClasse` | Roster dos seis heróis, no estilo tela de escolha de personagem |
| Codex | `Codex` | Ficha completa do herói selecionado: atributos, habilidades, equipamento |
| Recursos | `Recursos` | Destaques do jogo |
| Mundo | `Mundo` | Os três cenários com transição por dissolução em blocos |
| Encerramento | `Encerramento` | Chamada final |
| Rodapé | `Rodape` | Créditos e links |

## Stack

| Tecnologia | Uso |
| --- | --- |
| [React 19](https://react.dev) | Interface |
| [TypeScript](https://www.typescriptlang.org) | Tipagem |
| [Vite](https://vite.dev) | Dev server e build |
| [Tailwind CSS v4](https://tailwindcss.com) | Estilos, com tokens de tema em `src/tema.css` |
| [GSAP](https://gsap.com) + `@gsap/react` | Animações e ScrollTrigger |
| Python (Pillow, NumPy, SciPy) | Tratamento das artes em pixel art |

Fontes: **Press Start 2P** (títulos) e **VT323** (texto), via Google Fonts.

## Como rodar

**Pré-requisitos:** Node.js 24.x

```bash
git clone https://github.com/RewelliOliveira/Hollowcrest.git
cd Hollowcrest
npm install
npm run dev
```

A página abre em `http://localhost:5173`.

## Scripts disponíveis

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Checa os tipos (`tsc -b`) e gera o build de produção em `dist/` |
| `npm run preview` | Serve o build de produção localmente |
| `npm run lint` | Roda o ESLint |

## Estrutura de pastas

```
Hollowcrest/
├── scripts/
│   ├── tratar-personagens.py   # converte os sprites dos heróis em pixel art real
│   ├── tratar-mundos.py        # alinha os cenários dos mundos à grade de pixels
│   └── previas/                # comparações e relatórios gerados pelos scripts
├── src/
│   ├── assets/
│   │   ├── *.png                   # artes originais (nunca alteradas)
│   │   ├── personagens-tratados/   # sprites dos heróis já tratados
│   │   └── mundos-tratados/        # cenários dos mundos já tratados
│   ├── components/
│   │   ├── landing/            # seções e efeitos da página
│   │   └── ui/                 # componentes reutilizáveis (botão, barra, ícone, sprite)
│   ├── data/                   # conteúdo tipado: classes, mundos, ícones, sprites, textos
│   ├── hooks/                  # useAnimacao, useNaTela, usePreCarregarImagens
│   ├── lib/                    # configuração do GSAP e animações compartilhadas
│   ├── tema.css                # tokens de cor e fonte
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── vercel.json
└── vite.config.ts
```

## Pipeline de pixel art

As artes dos personagens e dos cenários foram geradas por IA e não seguem uma grade de pixels exata. Os scripts em `scripts/` corrigem isso. Os originais em `src/assets/` nunca são alterados.

**Requisitos:** Python 3 com `numpy`, `pillow` e `scipy`.

```bash
pip install numpy pillow scipy
```

### Personagens: `tratar-personagens.py`

1. Estima o tamanho do "bloco de pixel" de cada arte.
2. Limpa a transparência e remove ruído solto no fundo.
3. Reduz para a grade escolhida pegando a cor dominante de cada bloco.
4. Agrupa cores quase idênticas e limita a paleta (máx. 32 cores).
5. Padroniza a tela: mesmo tamanho, centralizados e com os pés na mesma linha de base.
6. Salva os PNGs em `src/assets/personagens-tratados/`, as prévias em `scripts/previas/` e os dados de pixel em `src/data/sprites.ts`.

```bash
py scripts/tratar-personagens.py
py scripts/tratar-personagens.py --grade 80
py scripts/tratar-personagens.py --grade 80 --grade-personagem mago=96
py scripts/tratar-personagens.py --max-cores 24
```

### Mundos: `tratar-mundos.py`

1. Estima o tamanho e a fase do bloco de pixel nos dois eixos.
2. Amostra o centro de cada bloco (nearest neighbor) para uma resolução base comum.
3. Detecta faixas e costuras escuras artificiais e gera um relatório.
4. Salva os PNGs em `src/assets/mundos-tratados/` e as prévias em `scripts/previas/`.

```bash
py scripts/tratar-mundos.py                # largura base 320
py scripts/tratar-mundos.py --largura 480
```

## Personalização

- **Cores e fontes:** tokens em `src/tema.css`. Ao trocar uma fonte, atualize também o link do Google Fonts em `index.html`.
- **Conteúdo:** todo o texto fica em `src/data/` (`classes.ts`, `mundos.ts`, `pagina.ts`).
- **Ícones:** desenhados em pixel art 8x8 como texto em `src/data/icones.ts` (`#` cor principal, `+` destaque, `.` vazio).
- **Animações:** configuração em `src/lib/motion.ts` e `src/lib/animacoes.ts`.

## Deploy

O projeto está configurado para a [Vercel](https://vercel.com) via `vercel.json`:

- Framework: Vite
- Build: `npm run build`
- Saída: `dist/`
- Cache imutável de um ano para os arquivos em `/assets/`
