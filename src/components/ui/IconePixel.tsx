import { ICONES, type NomeIcone } from "../../data/icones";

type IconePixelProps = {
  nome: NomeIcone;
  className?: string;
};

function caminhos(linhas: readonly string[]) {
  let principal = "";
  let destaque = "";
  linhas.forEach((linha, y) => {
    [...linha].forEach((c, x) => {
      const px = `M${x} ${y}h1v1h-1z`;
      if (c === "#") principal += px;
      else if (c === "+") destaque += px;
    });
  });
  return { principal, destaque };
}

const CAMINHOS = Object.fromEntries(
  Object.entries(ICONES).map(([nome, linhas]) => [nome, caminhos(linhas)]),
) as Record<NomeIcone, { principal: string; destaque: string }>;

export function IconePixel({ nome, className }: IconePixelProps) {
  const { principal, destaque } = CAMINHOS[nome];
  return (
    <svg viewBox="0 0 8 8" shapeRendering="crispEdges" aria-hidden="true" className={className}>
      <path d={destaque} style={{ fill: "var(--cor-icone-2, var(--color-accent-2))" }} />
      <path d={principal} fill="currentColor" />
    </svg>
  );
}
