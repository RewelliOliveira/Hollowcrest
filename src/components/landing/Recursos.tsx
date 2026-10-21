import { RECURSOS, SECOES } from "../../data/pagina";
import { useAnimacao } from "../../hooks/useAnimacao";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import { IconePixel } from "../ui/IconePixel";

export function Recursos() {
  const ref = useAnimacao<HTMLElement>(({ q, M, animar }) => {
    if (!animar) return;
    const cards = q("[data-card]");
    gsap.set(cards, { autoAlpha: 0, y: M.dist });
    ScrollTrigger.batch(cards, {
      start: "top 88%",
      once: true,
      onEnter: (lote) => {
        gsap.to(lote, { autoAlpha: 1, y: 0, duration: M.dur, ease: M.ease, stagger: M.stagger * 3, overwrite: true });
        gsap.from(
          lote.map((card) => card.querySelector("[data-card-icone]")),
          { scale: 0, duration: M.fast, ease: M.easePop, stagger: M.stagger * 3, delay: M.fast },
        );
      },
    });
  });

  return (
    <section ref={ref} id={SECOES.recursos} aria-labelledby="recursos-titulo" className="secao">
      <div className="container-pagina">
        <h2 id="recursos-titulo" className="mb-12 text-center text-2xl text-accent">
          {RECURSOS.titulo}
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {RECURSOS.itens.map((item) => (
            <article key={item.titulo} data-card="" className="borda-pixel flex flex-col gap-4 bg-surface p-6">
              <span data-card-icone="" className="flex size-16 items-center justify-center bg-bg text-accent">
                <IconePixel nome={item.icone} className="size-10" />
              </span>
              <h3 className="text-xl">{item.titulo}</h3>
              <p className="text-muted">{item.texto}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
