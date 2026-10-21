import { MUNDO, SECOES } from "../../data/pagina";
import { CAMADAS, LARGURA } from "../../data/paisagem";
import { useAnimacao } from "../../hooks/useAnimacao";
import { gsap } from "../../lib/gsap";
import { CamadaPaisagem as Camada } from "./CamadaPaisagem";

export function Mundo() {
  const ref = useAnimacao<HTMLElement>(({ el, q, M, animar, desktop }) => {
    if (!animar) return;
    const camadas = q("[data-camada]");
    const regioes = q("[data-regiao]");

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: desktop
        ? { trigger: el, start: "top top", end: "+=150%", pin: true, scrub: 0.5 }
        : { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.5 },
    });
    camadas.forEach((camada) => {
      const p = Number((camada as SVGElement).dataset.camada);
      tl.fromTo(camada, { xPercent: p * 1.6 }, { xPercent: -p * 1.6 }, 0);
    });
    if (desktop) {
      tl.from(
        regioes,
        { autoAlpha: 0, x: -M.dist, ease: M.easePop, duration: 0.15, stagger: 0.3 },
        0.1,
      );
    }
  });

  return (
    <section
      ref={ref}
      id={SECOES.mundo}
      aria-labelledby="mundo-titulo"
      className="relative h-svh min-h-[34rem] overflow-clip bg-ceu"
    >
      <Camada profundidade={0}>
        <rect y={60} width={LARGURA} height={60} className="fill-ceu-2" />
        <path d={CAMADAS.estrelas} className="fill-muted" />
        <path d={CAMADAS.lua} className="fill-lua" />
      </Camada>
      <Camada profundidade={1}>
        <path d={CAMADAS.montanhasLonge} className="fill-montanha-longe" />
      </Camada>
      <Camada profundidade={2}>
        <path d={CAMADAS.castelo} className="fill-castelo" />
        <path d={CAMADAS.janelas} className="fill-accent" />
      </Camada>
      <Camada profundidade={3}>
        <path d={CAMADAS.colinas} className="fill-montanha" />
      </Camada>
      <Camada profundidade={4}>
        <path d={CAMADAS.floresta} className="fill-floresta" />
      </Camada>
      <Camada profundidade={5}>
        <path d={CAMADAS.chao} className="fill-chao" />
      </Camada>

      <div className="container-pagina relative pt-24">
        <div className="borda-pixel max-w-md bg-surface/90 p-5 sm:p-6">
          <h2 id="mundo-titulo" className="text-2xl text-accent">
            {MUNDO.titulo}
          </h2>
          <p className="mt-4 text-lg">{MUNDO.texto}</p>
          <ul className="mt-5 flex flex-col gap-2">
            {MUNDO.regioes.map((regiao) => (
              <li key={regiao} data-regiao="" className="flex items-center gap-3 font-display text-xs text-muted">
                <span aria-hidden="true" className="size-2 bg-accent" />
                {regiao}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
