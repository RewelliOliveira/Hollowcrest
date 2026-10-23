import { CENARIO, type Retangulo } from "../../data/mundos";
import { useAnimacao } from "../../hooks/useAnimacao";
import { useLoopsPausaveis } from "../../hooks/useLoopsPausaveis";
import { gsap } from "../../lib/gsap";

type JanelasPiscandoProps = {
  janelas: readonly Retangulo[];
  ativo?: boolean;
};

export function JanelasPiscando({ janelas, ativo = true }: JanelasPiscandoProps) {
  const pausaveis = useLoopsPausaveis(ativo);
  const ref = useAnimacao<HTMLDivElement>(({ el, q, M, animar }) => {
    if (!animar) return;
    const tweens = q("[data-janela]").map((janela) =>
      gsap.to(janela, {
        autoAlpha: 1,
        duration: gsap.utils.random(M.fast * 0.3, M.fast),
        ease: "steps(1)",
        repeat: -1,
        yoyo: true,
        repeatDelay: gsap.utils.random(M.slow, M.slow * 4),
        delay: gsap.utils.random(0, M.slow * 3),
      }),
    );
    return pausaveis(el, tweens);
  });

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0">
      <svg
        viewBox={`0 0 ${CENARIO.largura} ${CENARIO.altura}`}
        preserveAspectRatio="xMaxYMid slice"
        shapeRendering="crispEdges"
        className="size-full"
      >
        {janelas.map(([x, y, largura, altura]) => (
          <rect
            key={`${x}-${y}`}
            data-janela=""
            x={x}
            y={y}
            width={largura}
            height={altura}
            className="invisible fill-lua"
          />
        ))}
      </svg>
    </div>
  );
}
