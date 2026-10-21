import type { NomeIcone } from "./icones";

export const JOGO = "Hollowcrest";

export const SECOES = {
  topo: "topo",
  lenda: "lenda",
  selecao: "herois",
  codex: "codex",
  recursos: "recursos",
  mundo: "mundo",
  encerramento: "fim",
} as const;

export const NAV_LINKS: readonly { href: string; rotulo: string }[] = [
  { href: `#${SECOES.lenda}`, rotulo: "Lenda" },
  { href: `#${SECOES.selecao}`, rotulo: "Heróis" },
  { href: `#${SECOES.codex}`, rotulo: "Códex" },
  { href: `#${SECOES.recursos}`, rotulo: "Recursos" },
  { href: `#${SECOES.mundo}`, rotulo: "Mundo" },
];

export const PULAR_CONTEUDO = "Pular para o conteúdo";

export const HERO = {
  rotulo: "RPG de ação · pixel art 16-bit",
  subtitulo: "O sol se apagou sobre o reino. Seis heróis carregam as últimas tochas.",
  cta: "Conhecer os heróis",
  ctaSecundario: "Explorar o mundo",
  rotuloSprite: "Aldric, o paladino, de armadura prateada, escudo solar e espada longa",
};

export const LENDA = {
  titulo: "A Lenda",
  narrador: "Cronista",
  linhas: [
    "Há mil invernos, a Aurora repousava no alto de Hollowcrest, a crista de pedra que coroa o reino.",
    "Enquanto ela brilhava, nenhuma sombra ousava cruzar as muralhas.",
    "Até que um rei ambicioso vendeu a luz em troca de uma coroa eterna, e a noite caiu para nunca mais acabar.",
    "Hoje, as tochas se apagam uma a uma. Seis heróis ainda carregam uma chama. Talvez seja o bastante.",
  ],
};

export const SELECAO = {
  titulo: "Escolha seu herói",
  instrucao: "Use as setas para navegar e Enter para escolher.",
  verFicha: "Ver ficha completa",
};

export const CODEX = {
  titulo: "Códex dos Heróis",
  subtitulo: "Fichas guardadas na biblioteca de Solmarc.",
  rotulos: {
    origem: "Origem",
    historia: "História",
    arma: "Arma principal",
    equipamento: "Equipamento",
    estilo: "Estilo de jogo",
    habilidades: "Habilidades",
    fortes: "Pontos fortes",
    fracos: "Pontos fracos",
    atributos: "Atributos",
    dificuldade: "Dificuldade",
    anterior: "Herói anterior",
    proximo: "Próximo herói",
  },
};

export const RECURSOS: {
  titulo: string;
  itens: readonly { titulo: string; texto: string; icone: NomeIcone }[];
} = {
  titulo: "O que te espera",
  itens: [
    {
      titulo: "Combate",
      texto: "Golpes quadro a quadro, esquivas no tempo certo e combos que mudam a cada classe.",
      icone: "espada",
    },
    {
      titulo: "Exploração",
      texto: "Masmorras, florestas e ruínas cheias de segredos, atalhos e passagens escondidas.",
      icone: "mapa",
    },
    {
      titulo: "Chefões",
      texto: "Guardiões gigantes com padrões próprios, que punem quem não presta atenção.",
      icone: "caveira",
    },
    {
      titulo: "Progressão",
      texto: "Novas habilidades, equipamentos forjados e uma árvore de talentos para cada herói.",
      icone: "estrela",
    },
  ],
};

export const MUNDO = {
  titulo: "O Mundo",
  texto:
    "Das montanhas geladas de Skarn às ruínas da Torre de Vidro, Hollowcrest esconde um reino inteiro sob a noite eterna.",
  regioes: ["Montanhas de Skarn", "Castelo de Hollowcrest", "Bosque Cinzento"],
};

export const ENCERRAMENTO = {
  titulo: "As tochas ainda queimam",
  frase: "Seis chamas contra uma noite sem fim. Quando a Aurora voltar a nascer, todos vão lembrar de quem a acendeu.",
};

export const RODAPE = {
  creditos: `${JOGO} é um projeto vitrine. Pixel art, textos e ilustrações originais.`,
  direitos: `© 2026 ${JOGO}`,
  voltar: "Voltar ao topo",
};
