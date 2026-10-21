// Paisagem em pixel art para a seção "O Mundo": cada camada vira um path em degraus.
// As coordenadas são pixels de arte de uma tela de 320x120.

export const LARGURA = 320;
export const ALTURA = 120;

/** Gerador pseudoaleatório com semente: a paisagem é sempre a mesma. */
function aleatorio(semente: number) {
  let s = semente;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const px = (x: number, y: number, l = 1, a = 1) => `M${x} ${y}h${l}v${a}h-${l}z`;

/** Silhueta em degraus: para cada coluna, preenche do topo `y(x)` até o chão da tela. */
function silhueta(y: (x: number) => number, passo = 1) {
  let d = `M0 ${ALTURA}`;
  for (let x = 0; x < LARGURA; x += passo) {
    const topo = Math.round(y(x));
    d += `V${topo}H${x + passo}`;
  }
  return `${d}V${ALTURA}z`;
}

function estrelas() {
  const r = aleatorio(7);
  let d = "";
  for (let i = 0; i < 70; i++) d += px(Math.floor(r() * LARGURA), Math.floor(r() * 55));
  return d;
}

function lua(cx: number, cy: number, raio: number) {
  let d = "";
  for (let y = -raio; y <= raio; y++) {
    const meia = Math.round(Math.sqrt(raio * raio - y * y));
    d += px(cx - meia, cy + y, meia * 2);
  }
  return d;
}

const montanhasLonge = (x: number) =>
  62 - 14 * Math.abs(Math.sin(x * 0.021)) - 9 * Math.abs(Math.sin(x * 0.057 + 1.3)) - 4 * Math.sin(x * 0.13);

const colinas = (x: number) => 94 - 6 * Math.sin(x * 0.03 + 2) - 3 * Math.sin(x * 0.09);

/** Torres e muralhas do castelo sobre a colina, com ameias. */
const PARTES_CASTELO = [
  { x0: 132, x1: 196, topo: 70 }, // muralha
  { x0: 126, x1: 138, topo: 54 },
  { x0: 150, x1: 164, topo: 40 }, // torre de menagem
  { x0: 172, x1: 180, topo: 50 },
  { x0: 190, x1: 202, topo: 56 },
];

function castelo(x: number) {
  let topo = colinas(x);
  for (const p of PARTES_CASTELO) {
    if (x >= p.x0 && x < p.x1) {
      const ameia = (x - p.x0) % 4 < 2 ? 0 : 2;
      topo = Math.min(topo, p.topo + ameia);
    }
  }
  // ponta da torre de menagem
  if (x >= 155 && x < 159) topo = Math.min(topo, 32);
  return topo;
}

function janelas() {
  return [
    [131, 60],
    [155, 46],
    [158, 52],
    [175, 56],
    [195, 62],
    [142, 76],
    [185, 76],
  ]
    .map(([x, y]) => px(x, y, 1, 2))
    .join("");
}

function floresta() {
  const r = aleatorio(42);
  const arvores: { cx: number; altura: number }[] = [];
  for (let cx = -6; cx < LARGURA + 6; cx += 5 + Math.floor(r() * 6)) {
    arvores.push({ cx, altura: 14 + Math.floor(r() * 14) });
  }
  const base = 112;
  return (x: number) => {
    let topo = 108 - Math.sin(x * 0.05) * 2;
    for (const a of arvores) {
      const dx = Math.abs(x - a.cx);
      if (dx <= a.altura / 3) topo = Math.min(topo, base - a.altura + Math.floor(dx * 3));
    }
    return topo;
  };
}

export const CAMADAS = {
  estrelas: estrelas(),
  lua: lua(262, 24, 9),
  montanhasLonge: silhueta(montanhasLonge, 2),
  colinas: silhueta(colinas, 2),
  castelo: silhueta(castelo),
  janelas: janelas(),
  floresta: silhueta(floresta()),
  chao: silhueta(() => 115),
};
