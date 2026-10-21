import { useRef, type KeyboardEvent } from "react";
import { CLASSES, CLASSE_POR_ID } from "../../data/classes";
import { CODEX, SECOES } from "../../data/pagina";
import type { NomePersonagem } from "../../data/sprites";
import { IconePixel } from "../ui/IconePixel";
import { Miniatura } from "../ui/Miniatura";
import { FichaHeroi } from "./FichaHeroi";

type CodexProps = {
  heroi: NomePersonagem;
  onTrocar: (nome: NomePersonagem) => void;
};

const BOTAO_SETA = "borda-pixel flex size-11 shrink-0 items-center justify-center bg-surface text-accent hover:bg-surface-2";

export function Codex({ heroi, onTrocar }: CodexProps) {
  const abas = useRef<(HTMLButtonElement | null)[]>([]);
  const indice = CLASSES.findIndex((c) => c.id === heroi);

  const irPara = (i: number, focar = false) => {
    const alvo = (i + CLASSES.length) % CLASSES.length;
    onTrocar(CLASSES[alvo].id);
    if (focar) abas.current[alvo]?.focus();
  };

  const aoTeclar = (e: KeyboardEvent<HTMLDivElement>) => {
    const acoes: Record<string, () => void> = {
      ArrowRight: () => irPara(indice + 1, true),
      ArrowLeft: () => irPara(indice - 1, true),
      Home: () => irPara(0, true),
      End: () => irPara(CLASSES.length - 1, true),
    };
    const acao = acoes[e.key];
    if (acao) {
      e.preventDefault();
      acao();
    }
  };

  return (
    <section id={SECOES.codex} tabIndex={-1} aria-labelledby="codex-titulo" className="secao outline-none">
      <div className="container-pagina flex flex-col gap-8">
        <header className="text-center">
          <h2 id="codex-titulo" className="text-2xl text-accent">
            {CODEX.titulo}
          </h2>
          <p className="mt-4 text-muted">{CODEX.subtitulo}</p>
        </header>

        <div className="flex flex-wrap items-center justify-between gap-3 lg:flex-nowrap">
          <button type="button" className={BOTAO_SETA} aria-label={CODEX.rotulos.anterior} onClick={() => irPara(indice - 1)}>
            <IconePixel nome="seta" className="size-6 -scale-x-100" />
          </button>
          <div
            role="tablist"
            aria-label="Heróis do Códex"
            onKeyDown={aoTeclar}
            className="order-first grid w-full grid-cols-3 gap-2 lg:order-none lg:flex-1 lg:grid-cols-6"
          >
            {CLASSES.map((classe, i) => {
              const ativo = classe.id === heroi;
              return (
                <button
                  key={classe.id}
                  ref={(el) => {
                    abas.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`codex-aba-${classe.id}`}
                  aria-selected={ativo}
                  aria-controls="codex-ficha"
                  tabIndex={ativo ? 0 : -1}
                  onClick={() => onTrocar(classe.id)}
                  className={`borda-pixel flex min-h-11 items-center justify-center gap-2 px-2 py-1 font-display text-xs ${
                    ativo ? "borda-pixel-ouro bg-accent text-accent-contrast" : "bg-surface text-muted hover:bg-surface-2"
                  }`}
                >
                  <Miniatura nome={classe.id} className="hidden w-6 xl:block" />
                  {classe.classe}
                </button>
              );
            })}
          </div>
          <button type="button" className={BOTAO_SETA} aria-label={CODEX.rotulos.proximo} onClick={() => irPara(indice + 1)}>
            <IconePixel nome="seta" className="size-6" />
          </button>
        </div>

        <div role="tabpanel" id="codex-ficha" aria-labelledby={`codex-aba-${heroi}`}>
          <FichaHeroi classe={CLASSE_POR_ID[heroi]} />
        </div>
      </div>
    </section>
  );
}
