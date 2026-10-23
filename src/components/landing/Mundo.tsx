import { useRef, useState } from "react";
import { MUNDOS } from "../../data/mundos";
import { SECOES } from "../../data/pagina";
import { useAnimacao } from "../../hooks/useAnimacao";
import { usePreCarregarImagens } from "../../hooks/usePreCarregarImagens";
import { digitar, dissolverBlocos } from "../../lib/animacoes";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import { CaixaMundo } from "./CaixaMundo";
import { CenarioMundo } from "./CenarioMundo";
import { DissolucaoBlocos } from "./DissolucaoBlocos";

const IMAGENS = MUNDOS.map((mundo) => mundo.imagem);
const ETAPAS = MUNDOS.length;
const PARALLAX = 2.5;

export function Mundo() {
  const [ativo, setAtivo] = useState(0);
  const gatilho = useRef<ScrollTrigger | null>(null);
  usePreCarregarImagens(IMAGENS);

  const ref = useAnimacao<HTMLElement>(({ el, q, M, animar, seguro }) => {
    const cenarios = q("[data-cenario]");
    const textos = q("[data-texto-mundo]");
    const blocos = q("[data-bloco]");
    const so = (i: number) => (j: number) => (j === i ? 1 : 0);
    let atual = 0;
    let troca: gsap.core.Animation[] = [];

    const mostrar = seguro((i: number) => {
      if (i === atual) return;
      atual = i;
      setAtivo(i);
      troca.forEach((t) => t.kill());
      gsap.set(textos, { autoAlpha: so(i) });
      if (!animar) {
        gsap.set(cenarios, { autoAlpha: so(i) });
        troca = [];
        return;
      }
      troca = [dissolverBlocos(blocos, M).set(cenarios, { autoAlpha: so(i) }, "coberta"), digitar(textos[i], M, M.slow * 2)];
    });

    const tl = gsap.timeline({
      defaults: { ease: "none", duration: 1 },
      scrollTrigger: {
        trigger: el,
        start: "top top",
        end: `+=${ETAPAS * 80}%`,
        pin: true,
        scrub: animar ? 0.5 : false,
        onUpdate: ({ progress }) => mostrar(Math.min(ETAPAS - 1, Math.floor(progress * ETAPAS))),
      },
    });
    if (animar) {
      q("[data-parallax]").forEach((camada, i) => {
        tl.fromTo(camada, { xPercent: PARALLAX }, { xPercent: -PARALLAX }, i);
      });
    }

    const st = tl.scrollTrigger;
    gatilho.current = st ?? null;
    if (st) mostrar(Math.min(ETAPAS - 1, Math.floor(st.progress * ETAPAS)));
    return () => {
      gatilho.current = null;
      setAtivo(0);
    };
  });

  const irPara = (i: number) => {
    const st = gatilho.current;
    if (!st) return;
    window.scrollTo({ top: st.start + (st.end - st.start) * ((i + 0.5) / ETAPAS) });
  };

  return (
    <section
      ref={ref}
      id={SECOES.mundo}
      aria-labelledby="mundo-titulo"
      className="relative h-svh min-h-[34rem] overflow-clip bg-ceu"
    >
      {MUNDOS.map((mundo, i) => (
        <CenarioMundo key={mundo.id} mundo={mundo} visivel={i === 0} ativo={i === ativo} />
      ))}
      <DissolucaoBlocos />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-t from-bg via-bg via-40% to-transparent to-75% lg:bg-linear-to-r lg:from-bg/90 lg:via-bg/50 lg:via-35% lg:to-transparent lg:to-65%"
      />
      <div className="container-pagina relative flex h-full flex-col justify-end pb-4 md:pb-8 lg:justify-center lg:pt-16 lg:pb-0">
        <CaixaMundo ativo={ativo} onEscolher={irPara} />
      </div>
    </section>
  );
}
