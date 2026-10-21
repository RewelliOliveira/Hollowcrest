import { HERO, JOGO, SECOES } from "../../data/pagina";
import { useAnimacao } from "../../hooks/useAnimacao";
import { gsap } from "../../lib/gsap";
import { BotaoPixel } from "../ui/BotaoPixel";
import { SpriteAnimado } from "../ui/SpriteAnimado";
import { Brasas } from "./Brasas";

export function Hero() {
  const ref = useAnimacao<HTMLElement>(({ q, M, animar }) => {
    if (!animar) return;
    gsap
      .timeline({ defaults: { ease: M.ease, duration: M.dur } })
      .from(q("[data-hero-rotulo]"), { autoAlpha: 0, y: -M.dist * 0.5 })
      .from(q("[data-hero-letra]"), { autoAlpha: 0, y: -M.dist, stagger: M.stagger }, "<0.1")
      .from(q("[data-hero-sub]"), { autoAlpha: 0, y: M.dist * 0.5 }, "-=0.3")
      .from(q("[data-hero-cta]"), { autoAlpha: 0, y: M.dist * 0.5, ease: M.easePop, stagger: M.stagger * 2 }, "-=0.3")
      .from(q("[data-hero-tocha]"), { autoAlpha: 0, duration: M.slow }, 0);
  });

  return (
    <section
      ref={ref}
      id={SECOES.topo}
      aria-labelledby="hero-titulo"
      className="relative flex min-h-svh items-center overflow-clip pt-20 pb-12"
    >
      <div data-hero-tocha="" aria-hidden="true" className="brilho-tocha absolute -top-1/4 -left-1/4 size-[80vmax]" />
      <div data-hero-tocha="" aria-hidden="true" className="brilho-sangue absolute -right-1/3 -bottom-1/3 size-[70vmax]" />
      <Brasas />

      <div className="container-pagina relative grid items-center gap-8 lg:grid-cols-[1.25fr_1fr]">
        <div className="flex flex-col items-start gap-6 text-left">
          <p data-hero-rotulo="" className="font-display text-xs text-accent uppercase">
            {HERO.rotulo}
          </p>
          <h1 id="hero-titulo" aria-label={JOGO} className="text-display text-text">
            <span aria-hidden="true" className="whitespace-nowrap">
              {[...JOGO.toUpperCase()].map((letra, i) => (
                <span key={i} data-hero-letra="" className="inline-block">
                  {letra}
                </span>
              ))}
            </span>
          </h1>
          <p data-hero-sub="" className="max-w-xl text-lg text-muted">
            {HERO.subtitulo}
          </p>
          <div className="flex flex-wrap gap-4">
            <BotaoPixel data-hero-cta="" href={`#${SECOES.selecao}`}>
              {HERO.cta}
            </BotaoPixel>
            <BotaoPixel data-hero-cta="" href={`#${SECOES.mundo}`} variante="secundario">
              {HERO.ctaSecundario}
            </BotaoPixel>
          </div>
        </div>

        <div className="relative mx-auto w-56 sm:w-72 lg:w-full lg:max-w-sm">
          <SpriteAnimado nome="paladino" entrada="carregar" rotulo={HERO.rotuloSprite} />
          <div aria-hidden="true" className="mx-auto -mt-2 h-3 w-3/4 bg-chao" />
        </div>
      </div>
    </section>
  );
}
