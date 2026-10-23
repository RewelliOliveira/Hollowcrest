import { useAnimacao } from "../../hooks/useAnimacao";
import { useLoopsPausaveis } from "../../hooks/useLoopsPausaveis";
import { gsap } from "../../lib/gsap";

const QUANTIDADE = 40;

const FLOCOS = Array.from({ length: QUANTIDADE }, (_, i) => ({
  esquerda: (i * 29 + 7) % 100,
  grande: i % 4 === 0,
}));

type NeveProps = {
  ativo?: boolean;
};

export function Neve({ ativo = true }: NeveProps) {
  const pausaveis = useLoopsPausaveis(ativo);
  const ref = useAnimacao<HTMLDivElement>(({ el, q, M, animar }) => {
    if (!animar) return;
    const altura = el.offsetHeight;
    const tweens = q("[data-floco]").map((floco) =>
      gsap
        .fromTo(
          floco,
          { y: 0, x: 0, autoAlpha: 1 },
          {
            keyframes: {
              y: [0, altura + M.dist],
              x: [0, gsap.utils.random(-M.dist, M.dist), gsap.utils.random(-M.dist, M.dist)],
            },
            duration: gsap.utils.random(M.slow * 6, M.slow * 10),
            ease: `steps(${Math.round(gsap.utils.random(40, 64))})`,
            repeat: -1,
          },
        )
        .progress(gsap.utils.random(0, 1)),
    );
    return pausaveis(el, tweens);
  });

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {FLOCOS.map((f, i) => (
        <span
          key={i}
          data-floco=""
          className={`invisible absolute -top-2 bg-text ${f.grande ? "size-1.5" : "size-1"}`}
          style={{ left: `${f.esquerda}%` }}
        />
      ))}
    </div>
  );
}
