import { LENDA, SECOES } from "../../data/pagina";
import { useAnimacao } from "../../hooks/useAnimacao";
import { digitar } from "../../lib/animacoes";
import { gsap } from "../../lib/gsap";
import { TextoDigitado } from "../ui/TextoDigitado";

export function Lenda() {
  const ref = useAnimacao<HTMLElement>(({ el, q, M, animar }) => {
    if (!animar) return;
    gsap.from(q("[data-caixa]"), {
      autoAlpha: 0,
      scaleY: 0,
      transformOrigin: "50% 100%",
      duration: M.fast,
      ease: M.easePop,
      scrollTrigger: { trigger: el, start: "top 75%", toggleActions: "play none none none" },
    });
    q("[data-linha]").forEach((linha) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: linha, start: "top 80%", toggleActions: "play none none none" } });
      tl.from(linha.querySelector("[data-marcador]"), { autoAlpha: 0, duration: M.fast, ease: "steps(1)" }).add(
        digitar(linha, M),
      );
    });
    gsap.to(q("[data-continuar]"), {
      y: 4,
      duration: M.fast,
      ease: "steps(1)",
      repeat: -1,
      yoyo: true,
      scrollTrigger: { trigger: el, toggleActions: "play pause resume pause" },
    });
  });

  return (
    <section ref={ref} id={SECOES.lenda} aria-labelledby="lenda-titulo" className="secao">
      <div className="container-pagina max-w-3xl">
        <h2 id="lenda-titulo" className="mb-10 text-center text-2xl text-accent">
          {LENDA.titulo}
        </h2>

        <div data-caixa="" className="borda-pixel relative bg-surface px-5 pt-10 pb-8 sm:px-8">
          <p className="borda-pixel borda-pixel-ouro absolute -top-5 left-4 bg-bg px-3 py-1 font-display text-xs text-accent">
            {LENDA.narrador}
          </p>
          <div className="flex flex-col gap-5">
            {LENDA.linhas.map((linha) => (
              <div key={linha} data-linha="" className="flex gap-3">
                <span data-marcador="" aria-hidden="true" className="mt-2.5 size-2 shrink-0 bg-accent" />
                <TextoDigitado texto={linha} className="text-lg" />
              </div>
            ))}
          </div>
          <span
            data-continuar=""
            aria-hidden="true"
            className="absolute right-5 bottom-3 font-display text-xs text-accent"
          >
            ▼
          </span>
        </div>
      </div>
    </section>
  );
}
