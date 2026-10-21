import bosque from "../assets/mundos-tratados/bosque.png";
import hollowcrest from "../assets/mundos-tratados/hollowcrest.png";
import skarn from "../assets/mundos-tratados/skarn.png";

/** Resolução base dos cenários tratados (scripts/tratar-mundos.py), em pixels de arte. */
export const CENARIO = { largura: 320, altura: 239 } as const;

/** x, y, largura e altura em pixels de arte do cenário. */
export type Retangulo = readonly [x: number, y: number, largura: number, altura: number];

export type EfeitoMundo = { tipo: "neve" } | { tipo: "brasas" } | { tipo: "janelas"; janelas: readonly Retangulo[] };

export type Mundo = {
  id: string;
  nome: string;
  descricao: string;
  imagem: string;
  alt: string;
  efeito: EfeitoMundo;
};

export const MUNDOS: readonly Mundo[] = [
  {
    id: "skarn",
    nome: "Montanhas de Skarn",
    descricao:
      "Picos de gelo onde a aurora verde ainda dança no céu. Os clãs de Skarn guardam as trilhas, e a última torre de vigia mantém o fogo aceso contra a nevasca.",
    imagem: skarn,
    alt: "Montanhas nevadas sob uma aurora verde, com pinheiros cobertos de neve e uma torre de vigia iluminada na encosta, à direita.",
    efeito: { tipo: "neve" },
  },
  {
    id: "hollowcrest",
    nome: "Castelo de Hollowcrest",
    descricao:
      "A crista de pedra onde a Aurora repousava. Hoje o castelo do rei sem sol vigia a noite eterna, e ao longe brilham as ruínas da Torre de Vidro.",
    imagem: hollowcrest,
    alt: "Castelo escuro de janelas acesas sobre um rochedo, diante da lua cheia, com as ruínas de uma torre de cristal ao fundo e pinheiros em primeiro plano.",
    efeito: {
      tipo: "janelas",
      janelas: [
        [262, 47, 2, 4],
        [268, 48, 1, 3],
        [245, 58, 1, 3],
        [262, 61, 2, 3],
        [268, 61, 1, 3],
        [286, 71, 1, 3],
        [290, 72, 1, 2],
        [219, 77, 2, 3],
        [293, 87, 1, 3],
        [236, 92, 1, 3],
        [216, 93, 1, 3],
        [246, 93, 1, 6],
        [249, 94, 1, 4],
        [252, 94, 1, 5],
        [256, 93, 1, 6],
        [265, 108, 1, 4],
        [269, 108, 1, 4],
        [273, 108, 1, 4],
        [293, 110, 1, 2],
        [295, 109, 1, 3],
        [297, 109, 1, 3],
        [194, 111, 2, 3],
        [282, 111, 2, 3],
        [241, 136, 1, 3],
      ],
    },
  },
  {
    id: "bosque",
    nome: "Bosque Cinzento",
    descricao:
      "Árvores mortas, névoa sem fim e brasas que flutuam sem fogo. Foi daqui que as feras sombrias saíram, e um velho santuário ainda guarda a última lanterna acesa.",
    imagem: bosque,
    alt: "Bosque de árvores secas e retorcidas coberto de névoa, com um pequeno santuário de pedra iluminado por uma lanterna, à direita.",
    efeito: { tipo: "brasas" },
  },
];
