import { ATRIBUTO_MAX, ATRIBUTOS, type Atributo, type Classe } from "../../data/classes";
import { CODEX } from "../../data/pagina";
import { sprites } from "../../data/sprites";
import { useAnimacao } from "../../hooks/useAnimacao";
import { digitar, encherBarras } from "../../lib/animacoes";
import { gsap } from "../../lib/gsap";
import { BarraBlocos } from "../ui/BarraBlocos";
import { IconePixel } from "../ui/IconePixel";
import { SpriteAnimado } from "../ui/SpriteAnimado";
import { TextoDigitado } from "../ui/TextoDigitado";

type FichaHeroiProps = {
  classe: Classe;
};

const ROTULO = "font-display text-xs uppercase text-ink-accent";

export function FichaHeroi({ classe }: FichaHeroiProps) {
  const ref = useAnimacao<HTMLDivElement>(
    ({ el, q, M, animar }) => {
      if (!animar) return;
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 70%", once: true } });
      q("[data-digitar]").forEach((grupo, i) => tl.add(digitar(grupo, M, M.slow), i * M.stagger));
      tl.add(encherBarras(q('[data-bloco="cheio"]'), M), 0);
      tl.from(q("[data-habilidade-icone]"), { autoAlpha: 0, scale: 0, ease: M.easePop, duration: M.fast, stagger: M.stagger * 2 }, 0);

      const sprite = q("[data-respirar]")[0] as HTMLElement | undefined;
      if (sprite) {
        const umPixel = () => sprite.offsetWidth / sprites[classe.id].largura;
        gsap
          .timeline({
            repeat: -1,
            yoyo: true,
            scrollTrigger: { trigger: el, toggleActions: "play pause resume pause" },
          })
          .to(sprite, { y: () => -umPixel(), duration: M.slow, ease: "steps(1)" })
          .to(q("[data-sombra]"), { scaleX: 0.92, duration: M.slow, ease: "steps(1)" }, 0);
      }
    },
    [classe.id],
  );

  return (
    <div ref={ref} className="borda-pixel grid bg-parchment text-ink lg:grid-cols-2">
      <div className="flex flex-col gap-6 border-parchment-2 p-5 sm:p-8 lg:border-r-4">
        <div className="relative flex flex-col items-center pt-4">
          <div data-respirar="" className="w-44 sm:w-56">
            <SpriteAnimado nome={classe.id} />
          </div>
          <div data-sombra="" aria-hidden="true" className="-mt-2 h-3 w-36 bg-parchment-2 sm:w-44" />
        </div>

        <div>
          <p className={ROTULO}>
            {classe.classe} · {classe.estilo}
          </p>
          <h3 className="mt-3 text-xl">{classe.nome}</h3>
          <TextoDigitado texto={classe.titulo} className="mt-2 text-lg text-ink-muted" />
        </div>

        <div className="flex items-center gap-3">
          <span className={ROTULO}>{CODEX.rotulos.dificuldade}</span>
          <span className="sr-only">
            {classe.dificuldade} de 3
          </span>
          <span className="flex gap-1" aria-hidden="true">
            {[1, 2, 3].map((n) => (
              <IconePixel
                key={n}
                nome="estrela"
                className={`size-6 [--cor-icone-2:currentColor] ${n <= classe.dificuldade ? "text-ink-accent" : "text-parchment-2"}`}
              />
            ))}
          </span>
        </div>

        <div>
          <h4 className={`${ROTULO} mb-4`}>{CODEX.rotulos.atributos}</h4>
          <div className="flex flex-col gap-3">
            {(Object.keys(ATRIBUTOS) as Atributo[]).map((atributo) => (
              <BarraBlocos
                key={atributo}
                rotulo={ATRIBUTOS[atributo]}
                valor={classe.atributos[atributo]}
                max={ATRIBUTO_MAX}
                tom="pergaminho"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 border-t-4 border-parchment-2 p-5 sm:p-8 lg:border-t-0">
        <dl className="grid gap-4">
          <div>
            <dt className={ROTULO}>{CODEX.rotulos.origem}</dt>
            <TextoDigitado as="dd" texto={classe.origem} className="mt-1" />
          </div>
          <div>
            <dt className={ROTULO}>{CODEX.rotulos.historia}</dt>
            <TextoDigitado as="dd" texto={classe.historia} className="mt-1" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className={ROTULO}>{CODEX.rotulos.arma}</dt>
              <TextoDigitado as="dd" texto={classe.arma} className="mt-1" />
            </div>
            <div>
              <dt className={ROTULO}>{CODEX.rotulos.equipamento}</dt>
              <TextoDigitado as="dd" texto={classe.equipamento} className="mt-1" />
            </div>
          </div>
        </dl>

        <div>
          <h4 className={`${ROTULO} mb-4`}>{CODEX.rotulos.habilidades}</h4>
          <ul className="grid gap-4">
            {classe.habilidades.map((h) => (
              <li key={h.nome} className="flex gap-4">
                <span
                  data-habilidade-icone=""
                  className="flex size-12 shrink-0 items-center justify-center bg-ink text-parchment [--cor-icone-2:var(--color-accent)]"
                >
                  <IconePixel nome={h.icone} className="size-8" />
                </span>
                <div>
                  <p className="font-display text-xs leading-relaxed">{h.nome}</p>
                  <TextoDigitado texto={h.descricao} className="text-ink-muted" />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h4 className={`${ROTULO} mb-2`}>{CODEX.rotulos.fortes}</h4>
            <ul className="grid gap-1">
              {classe.fortes.map((f) => (
                <li key={f} className="flex gap-2">
                  <span aria-hidden="true" className="text-ink-accent">+</span>
                  <TextoDigitado as="span" texto={f} />
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className={`${ROTULO} mb-2`}>{CODEX.rotulos.fracos}</h4>
            <ul className="grid gap-1">
              {classe.fracos.map((f) => (
                <li key={f} className="flex gap-2">
                  <span aria-hidden="true" className="text-ink-muted">−</span>
                  <TextoDigitado as="span" texto={f} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
