import { useMemo, type Ref } from "react";
import { sprites, type NomePersonagem, type SpriteData } from "../../data/sprites";

type PixelSpriteProps = {
  nome: NomePersonagem;
  modo?: "estatico" | "animavel";
  agrupamento?: number;
  paleta?: readonly string[];
  rotulo?: string;
  className?: string;
  ref?: Ref<SVGSVGElement>;
};

type Bloco = { chave: string; caminhos: Map<number, string> };

const pixel = (x: number, y: number, largura = 1) => `M${x} ${y}h${largura}v1h-${largura}z`;

function caminhosPorCor(sprite: SpriteData): string[] {
  const caminhos = sprite.paleta.map(() => "");
  let anterior: { x: number; y: number; cor: number; largura: number } | null = null;

  const fechar = () => {
    if (anterior) caminhos[anterior.cor] += pixel(anterior.x, anterior.y, anterior.largura);
  };

  for (const [x, y, cor] of sprite.pixels) {
    if (anterior && anterior.y === y && anterior.cor === cor && anterior.x + anterior.largura === x) {
      anterior.largura += 1;
    } else {
      fechar();
      anterior = { x, y, cor, largura: 1 };
    }
  }
  fechar();
  return caminhos;
}

function blocosPorArea(sprite: SpriteData, n: number): Bloco[] {
  const blocos = new Map<string, Bloco>();
  for (const [x, y, cor] of sprite.pixels) {
    const chave = `${Math.floor(x / n)}-${Math.floor(y / n)}`;
    let bloco = blocos.get(chave);
    if (!bloco) {
      bloco = { chave, caminhos: new Map() };
      blocos.set(chave, bloco);
    }
    bloco.caminhos.set(cor, (bloco.caminhos.get(cor) ?? "") + pixel(x, y));
  }
  return [...blocos.values()];
}

export function PixelSprite({
  nome,
  modo = "estatico",
  agrupamento = 1,
  paleta,
  rotulo,
  className,
  ref,
}: PixelSpriteProps) {
  const sprite = sprites[nome];
  const cores = paleta ?? sprite.paleta;
  const caminhos = useMemo(() => (modo === "estatico" ? caminhosPorCor(sprite) : []), [sprite, modo]);
  const blocos = useMemo(
    () => (modo === "animavel" && agrupamento > 1 ? blocosPorArea(sprite, agrupamento) : []),
    [sprite, modo, agrupamento],
  );

  let conteudo;
  if (modo === "estatico") {
    conteudo = caminhos.map((d, cor) => (d ? <path key={cor} d={d} fill={cores[cor]} /> : null));
  } else if (agrupamento > 1) {
    conteudo = blocos.map((bloco) => (
      <g key={bloco.chave} data-pixel="">
        {[...bloco.caminhos].map(([cor, d]) => (
          <path key={cor} d={d} fill={cores[cor]} />
        ))}
      </g>
    ));
  } else {
    conteudo = sprite.pixels.map(([x, y, cor]) => (
      <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={cores[cor]} data-pixel="" />
    ));
  }

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${sprite.largura} ${sprite.altura}`}
      shapeRendering="crispEdges"
      className={className}
      role={rotulo ? "img" : undefined}
      aria-label={rotulo}
      aria-hidden={rotulo ? undefined : true}
    >
      {conteudo}
    </svg>
  );
}
