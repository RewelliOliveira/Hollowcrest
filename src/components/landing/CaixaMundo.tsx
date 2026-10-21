import { MUNDOS } from "../../data/mundos";
import { MUNDO } from "../../data/pagina";
import { TextoDigitado } from "../ui/TextoDigitado";

type CaixaMundoProps = {
  ativo: number;
  onEscolher: (indice: number) => void;
};

export function CaixaMundo({ ativo, onEscolher }: CaixaMundoProps) {
  return (
    <div className="borda-pixel bg-surface/90 p-4 sm:p-6 md:max-w-lg lg:max-w-md">
      <h2 id="mundo-titulo" className="text-xl text-accent md:text-2xl">
        {MUNDO.titulo}
      </h2>
      <div className="mt-3 grid md:mt-4">
        {MUNDOS.map((mundo, i) => (
          <div key={mundo.id} data-texto-mundo="" className={`[grid-area:1/1] ${i === 0 ? "" : "invisible"}`}>
            <TextoDigitado as="h3" texto={mundo.nome} className="text-xs text-text md:text-sm" />
            <TextoDigitado texto={mundo.descricao} className="mt-2 md:text-lg" />
          </div>
        ))}
      </div>
      <nav aria-label={MUNDO.rotuloLista} className="mt-3 md:mt-5">
        <ul className="flex flex-col">
          {MUNDOS.map((mundo, i) => {
            const atual = i === ativo;
            return (
              <li key={mundo.id}>
                <button
                  type="button"
                  aria-current={atual ? "step" : undefined}
                  onClick={() => onEscolher(i)}
                  className={`flex min-h-11 w-full items-center gap-3 text-left font-display text-xs ${atual ? "text-accent" : "text-muted hover:text-text"}`}
                >
                  <span aria-hidden="true" className={`size-2 shrink-0 ${atual ? "bg-accent" : "bg-border-forte"}`} />
                  {mundo.nome}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
