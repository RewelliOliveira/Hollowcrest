import { CLASSES } from "../../data/classes";
import { ENCERRAMENTO, SECOES } from "../../data/pagina";
import { useAnimacao } from "../../hooks/useAnimacao";
import { gsap } from "../../lib/gsap";
import { Miniatura } from "../ui/Miniatura";

export function Encerramento() {
  const ref = useAnimacao<HTMLElement>(({ el, q, M, animar }) => {
    if (!animar) return;
    gsap
      .timeline({ scrollTrigger: { trigger: el, start: "top 70%", once: true } })
      .from(q("[data-heroi]"), { autoAlpha: 0, y: M.dist * 1.5, duration: M.dur, ease: M.ease, stagger: M.stagger * 3 })
      .from(q("[data-fim-titulo]"), { autoAlpha: 0, scale: 1.2, duration: M.dur, ease: M.easePop }, "-=0.2")
      .from(q("[data-fim-frase]"), { autoAlpha: 0, y: M.dist * 0.5, duration: M.dur, ease: M.ease }, "-=0.2");
  });

  return (
    <section
      ref={ref}
      id={SECOES.encerramento}
      aria-labelledby="fim-titulo"
      className="secao relative overflow-clip"
    >
      <div aria-hidden="true" className="brilho-tocha absolute inset-0" />
      <div className="container-pagina relative flex flex-col items-center gap-10 text-center">
        <ul className="grid w-full max-w-4xl grid-cols-3 items-end gap-4 sm:grid-cols-6">
          {CLASSES.map((classe) => (
            <li key={classe.id} data-heroi="" className="flex flex-col items-center gap-2">
              <Miniatura nome={classe.id} alt={`${classe.classe} ${classe.nome}`} className="w-full max-w-28" />
              <span aria-hidden="true" className="h-2 w-3/4 bg-chao" />
            </li>
          ))}
        </ul>
        <h2 id="fim-titulo" data-fim-titulo="" className="text-3xl text-accent">
          {ENCERRAMENTO.titulo}
        </h2>
        <p data-fim-frase="" className="max-w-2xl text-lg text-muted">
          {ENCERRAMENTO.frase}
        </p>
      </div>
    </section>
  );
}
