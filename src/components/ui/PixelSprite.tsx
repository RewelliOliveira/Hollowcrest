import { useMemo, type Ref } from "react";
import { sprites, type NomePersonagem, type SpriteData } from "../../data/sprites";

type PixelSpriteProps = {
  nome: NomePersonagem;
  /** "estatico": um <path> por cor. "animavel": um <rect> por pixel, para montar e desfazer. */
  modo?: "estatico" | "animavel";
  /** Substitui a paleta original (mesma ordem de índices), para variações de cor. */
  paleta?: readonly string[];
  /** Texto alternativo. Sem ele, o sprite é decorativo (aria-hidden). */
  rotulo?: string;
  className?: string;
  ref?: Ref<SVGSVGElement>;
};

/** Junta os pixels de mesma cor em um único path, unindo sequências horizontais. */
function caminhosPorCor(sprite: SpriteData): string[] {
  const caminhos = sprite.paleta.map(() => "");
  let anterior: { x: number; y: number; cor: number; largura: number } | null = null;

  const fechar = () => {
    if (anterior) {
      caminhos[anterior.cor] += `M${anterior.x} ${anterior.y}h${anterior.largura}v1h-${anterior.largura}z`;
    }
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

export function PixelSprite({ nome, modo = "estatico", paleta, rotulo, className, ref }: PixelSpriteProps) {
  const sprite = sprites[nome];
  const cores = paleta ?? sprite.paleta;
  const caminhos = useMemo(() => caminhosPorCor(sprite), [sprite]);

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
      {modo === "estatico"
        ? caminhos.map((d, cor) => (d ? <path key={cor} d={d} fill={cores[cor]} /> : null))
        : sprite.pixels.map(([x, y, cor]) => (
            <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={cores[cor]} data-cor={cor} />
          ))}
    </svg>
  );
}
