import { ATRIBUTO_MAX, ATRIBUTOS, type Atributo, type Classe } from "../../data/classes";
import { SELECAO } from "../../data/pagina";
import { useAnimacao } from "../../hooks/useAnimacao";
import { digitar, encherBarras } from "../../lib/animacoes";
import { gsap } from "../../lib/gsap";
import { BarraBlocos } from "../ui/BarraBlocos";
import { BotaoPixel } from "../ui/BotaoPixel";

type PainelClasseProps = {
  classe: Classe;
  onVerFicha: () => void;
};

export function PainelClasse({ classe, onVerFicha }: PainelClasseProps) {
  const ref = useAnimacao<HTMLDivElement>(
    ({ el, q, M, animar }) => {
      if (!animar) return;
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 80%", toggleActions: "play none none none" } });
      tl.from(q("[data-painel-nome]"), { autoAlpha: 0, x: -M.dist, duration: M.fast, ease: M.ease })
        .add(digitar(q("[data-painel-frase]")[0], M, M.slow), "<")
        .add(encherBarras(q('[data-bloco="cheio"]'), M), "<");
    },
    [classe.id],
  );

  return (
    <div ref={ref} className="borda-pixel flex flex-col gap-6 bg-surface p-5 sm:p-8">
      <div data-painel-nome="" aria-live="polite">
        <p className="font-display text-xs text-accent-2-texto uppercase">{classe.classe}</p>
        <h3 className="mt-3 text-xl text-accent">{classe.nome}</h3>
        <p className="mt-2 text-lg text-muted">{classe.titulo}</p>
      </div>

      <blockquote data-painel-frase="" className="border-l-4 border-accent pl-4 text-lg">
        <span className="sr-only">{classe.frase}</span>
        <span aria-hidden="true" data-digitar="">
          {[...`“${classe.frase}”`].map((letra, i) => (
            <span key={i} data-letra="">
              {letra}
            </span>
          ))}
        </span>
      </blockquote>

      <div className="flex flex-col gap-3">
        {(Object.keys(ATRIBUTOS) as Atributo[]).map((atributo) => (
          <BarraBlocos
            key={atributo}
            rotulo={ATRIBUTOS[atributo]}
            valor={classe.atributos[atributo]}
            max={ATRIBUTO_MAX}
          />
        ))}
      </div>

      <BotaoPixel onClick={onVerFicha} className="self-start">
        {SELECAO.verFicha}
      </BotaoPixel>
    </div>
  );
}
