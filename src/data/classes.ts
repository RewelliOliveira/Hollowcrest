import type { NomePersonagem } from "./sprites";
import type { NomeIcone } from "./icones";

export const ATRIBUTOS = {
  forca: "Força",
  agilidade: "Agilidade",
  magia: "Magia",
  defesa: "Defesa",
  vida: "Vida",
} as const;

export type Atributo = keyof typeof ATRIBUTOS;

/** Valor máximo de cada atributo (número de blocos da barra). */
export const ATRIBUTO_MAX = 10;

export type Habilidade = {
  nome: string;
  descricao: string;
  icone: NomeIcone;
};

export type Classe = {
  id: NomePersonagem;
  classe: string;
  nome: string;
  titulo: string;
  frase: string;
  origem: string;
  historia: string;
  arma: string;
  equipamento: string;
  estilo: string;
  habilidades: readonly [Habilidade, Habilidade, Habilidade];
  fortes: readonly string[];
  fracos: readonly string[];
  /** Soma 30 em todas as classes, para manter o equilíbrio. */
  atributos: Record<Atributo, number>;
  dificuldade: 1 | 2 | 3;
};

export const CLASSES: readonly Classe[] = [
  {
    id: "paladino",
    classe: "Paladino",
    nome: "Aldric Valmont",
    titulo: "O Escudo da Aurora",
    frase: "Enquanto eu estiver de pé, nenhuma tocha se apaga.",
    origem: "Cidadela de Solmarc, último templo da Ordem da Aurora",
    historia:
      "Aldric jurou proteger a chama sagrada na noite em que o céu escureceu. Quando a Ordem caiu, ele carregou o último fragmento de sol no escudo e marchou sozinho para Hollowcrest.",
    arma: "Espada longa Juramento",
    equipamento: "Armadura de placas, escudo solar e manto branco",
    estilo: "Tanque e suporte",
    habilidades: [
      { nome: "Juramento da Aurora", descricao: "Ergue o escudo e absorve o dano dos aliados próximos.", icone: "escudo" },
      { nome: "Golpe Radiante", descricao: "Corte carregado de luz que fere mais as criaturas da sombra.", icone: "espada" },
      { nome: "Bênção Solar", descricao: "Cura o grupo aos poucos enquanto ele estiver em combate.", icone: "coracao" },
    ],
    fortes: ["Muito resistente", "Protege o grupo", "Forte contra mortos-vivos"],
    fracos: ["Lento para se mover", "Pouco dano à distância"],
    atributos: { forca: 6, agilidade: 3, magia: 5, defesa: 9, vida: 7 },
    dificuldade: 1,
  },
  {
    id: "arqueiro",
    classe: "Arqueiro",
    nome: "Wren Folhaverde",
    titulo: "A Flecha do Bosque Cinzento",
    frase: "Eu acerto antes que você me veja.",
    origem: "Bosque Cinzento, na fronteira norte",
    historia:
      "Criado entre os caçadores da fronteira, Wren aprendeu a ler o vento antes de aprender a ler palavras. Quando as feras sombrias saíram da floresta, foi a sua flecha que deu o primeiro alarme.",
    arma: "Arco longo de teixo",
    equipamento: "Capuz de caçador, gibão de couro e aljava de penas de corvo",
    estilo: "Dano à distância",
    habilidades: [
      { nome: "Chuva de Flechas", descricao: "Dispara uma rajada que cobre uma área inteira.", icone: "flecha" },
      { nome: "Olho de Falcão", descricao: "Marca um alvo: o próximo disparo é sempre crítico.", icone: "alvo" },
      { nome: "Passo do Vento", descricao: "Salta para trás e ganha distância do perigo.", icone: "pena" },
    ],
    fortes: ["Ataca de longe", "Muito ágil", "Ótimo contra alvos isolados"],
    fracos: ["Frágil de perto", "Depende de espaço aberto"],
    atributos: { forca: 6, agilidade: 9, magia: 3, defesa: 5, vida: 7 },
    dificuldade: 2,
  },
  {
    id: "mago",
    classe: "Mago",
    nome: "Mestre Ithiel",
    titulo: "O Guardião da Ametista",
    frase: "A escuridão também obedece a quem conhece o seu nome.",
    origem: "Torre de Vidro de Myrrh, hoje em ruínas",
    historia:
      "Ithiel passou trezentos anos estudando o cristal que guarda a última faísca de magia do reino. Agora que as sombras querem o cristal, o velho mago deixou a torre pela primeira vez em um século.",
    arma: "Cajado com cristal de ametista",
    equipamento: "Manto rúnico, chapéu de viagem e grimório antigo",
    estilo: "Dano mágico em área",
    habilidades: [
      { nome: "Lança de Ametista", descricao: "Projétil de cristal que atravessa vários inimigos.", icone: "cristal" },
      { nome: "Tempestade Arcana", descricao: "Raios caem sobre uma área por alguns segundos.", icone: "raio" },
      { nome: "Barreira Rúnica", descricao: "Cria um círculo que bloqueia projéteis inimigos.", icone: "runa" },
    ],
    fortes: ["Maior dano em área", "Controle do campo de batalha", "Alcance longo"],
    fracos: ["Pouca vida", "Precisa de tempo para conjurar"],
    atributos: { forca: 3, agilidade: 5, magia: 10, defesa: 5, vida: 7 },
    dificuldade: 3,
  },
  {
    id: "berserker",
    classe: "Berserker",
    nome: "Torvald Barba-Rubra",
    titulo: "A Fúria das Terras Geladas",
    frase: "Quanto mais eu sangro, mais forte eu bato.",
    origem: "Clãs de Skarn, além das montanhas de gelo",
    historia:
      "Torvald perdeu o clã inteiro para a noite eterna e jurou não descansar enquanto houver uma sombra viva. Os bardos dizem que ele já derrubou um dragão de gelo só com as mãos.",
    arma: "Machado de batalha de duas lâminas",
    equipamento: "Peles de lobo, braçadeiras cravejadas e cinto de clã",
    estilo: "Corpo a corpo explosivo",
    habilidades: [
      { nome: "Fúria Sanguínea", descricao: "Quanto menos vida, maior o dano dos golpes.", icone: "chama" },
      { nome: "Redemoinho", descricao: "Gira o machado e atinge todos ao redor.", icone: "machado" },
      { nome: "Grito de Guerra", descricao: "Assusta os inimigos próximos e reduz a defesa deles.", icone: "caveira" },
    ],
    fortes: ["Maior força do grupo", "Muita vida", "Destrói grupos de perto"],
    fracos: ["Sem magia", "Arrisca a própria vida"],
    atributos: { forca: 10, agilidade: 6, magia: 1, defesa: 5, vida: 8 },
    dificuldade: 2,
  },
  {
    id: "lanceiro",
    classe: "Lanceiro",
    nome: "Cael Ferrovento",
    titulo: "O Estandarte Escarlate",
    frase: "Mantenha a linha. Ninguém passa.",
    origem: "Guarda Real de Hollowcrest",
    historia:
      "Cael era só um soldado raso quando o rei desapareceu. Na noite da queda, segurou o portão leste sozinho até o amanhecer que nunca veio, e o estandarte escarlate virou símbolo da resistência.",
    arma: "Lança de guerra com estandarte",
    equipamento: "Cota de malha, elmo de aço e escudo redondo",
    estilo: "Controle e alcance médio",
    habilidades: [
      { nome: "Estocada Longa", descricao: "Ataque de alcance médio que empurra o alvo para trás.", icone: "lanca" },
      { nome: "Muralha de Escudos", descricao: "Trava a posição e bloqueia ataques frontais.", icone: "escudo" },
      { nome: "Investida", descricao: "Avança em linha reta e derruba quem estiver no caminho.", icone: "seta" },
    ],
    fortes: ["Mantém inimigos à distância", "Equilibrado", "Bom para iniciantes"],
    fracos: ["Pouco dano em área", "Fraco quando cercado"],
    atributos: { forca: 7, agilidade: 6, magia: 2, defesa: 7, vida: 8 },
    dificuldade: 1,
  },
  {
    id: "assassino",
    classe: "Assassino",
    nome: "Vesper",
    titulo: "A Lâmina do Crepúsculo",
    frase: "Você não vai ouvir o segundo passo.",
    origem: "Becos de Nocthar, a cidade sem lampiões",
    historia:
      "Ninguém sabe o verdadeiro nome de Vesper. Antes, servia a quem pagasse mais; agora caça os nobres que venderam a luz do reino às sombras, um por um.",
    arma: "Par de adagas curvas",
    equipamento: "Capuz e máscara de pano, couro escuro e cinto de venenos",
    estilo: "Furtividade e dano rápido",
    habilidades: [
      { nome: "Passo das Sombras", descricao: "Fica invisível e reaparece atrás do alvo.", icone: "lua" },
      { nome: "Lâmina Envenenada", descricao: "Cada golpe aplica um veneno que dura alguns segundos.", icone: "adaga" },
      { nome: "Golpe Fatal", descricao: "Finaliza na hora inimigos com pouca vida.", icone: "caveira" },
    ],
    fortes: ["Agilidade máxima", "Dano crítico altíssimo", "Escolhe as próprias lutas"],
    fracos: ["Defesa muito baixa", "Exige precisão"],
    atributos: { forca: 8, agilidade: 10, magia: 4, defesa: 3, vida: 5 },
    dificuldade: 3,
  },
];

export const CLASSE_POR_ID = Object.fromEntries(CLASSES.map((c) => [c.id, c])) as Record<NomePersonagem, Classe>;
