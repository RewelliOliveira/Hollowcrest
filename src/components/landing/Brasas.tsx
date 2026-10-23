import { useAnimacao } from "../../hooks/useAnimacao";
import { useLoopsPausaveis } from "../../hooks/useLoopsPausaveis";
import { gsap } from "../../lib/gsap";

const QUANTIDADE = 28;

const BRASAS = Array.from({ length: QUANTIDADE }, (_, i) => ({
  esquerda: (i * 37 + 11) % 100,
  grande: i % 3 === 0,
  vermelha: i % 4 === 1,
}));

type BrasasProps = {
  ativo?: boolean;
};

export function Brasas({ ativo = true }: BrasasProps) {
  const pausaveis = useLoopsPausaveis(ativo);
  const ref = useAnimacao<HTMLDivElement>(({ el, q, M, animar }) => {
    if (!animar) return;
    const altura = el.offsetHeight;
    const brasas = q("[data-brasa]");
    const tweens = brasas.map((brasa) =>
      gsap.fromTo(
        brasa,
        { y: 0, x: 0, autoAlpha: 0 },
        {
          keyframes: {
            y: [0, -altura * gsap.utils.random(0.5, 0.95)],
            x: [0, gsap.utils.random(-M.dist, M.dist), gsap.utils.random(-M.dist, M.dist)],
            autoAlpha: [0, 1, 1, 0],
          },
          duration: gsap.utils.random(M.slow * 4, M.slow * 7),
          ease: `steps(${Math.round(gsap.utils.random(24, 40))})`,
          repeat: -1,
          delay: gsap.utils.random(0, M.slow * 5),
        },
      ),
    );
    return pausaveis(el, tweens);
  });

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {BRASAS.map((b, i) => (
        <span
          key={i}
          data-brasa=""
          className={`invisible absolute bottom-0 ${b.grande ? "size-1.5" : "size-1"} ${b.vermelha ? "bg-accent-2" : "bg-accent"}`}
          style={{ left: `${b.esquerda}%` }}
        />
      ))}
    </div>
  );
}
