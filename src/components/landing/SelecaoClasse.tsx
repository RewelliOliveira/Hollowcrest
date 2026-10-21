import { useState } from "react";
import { CLASSE_POR_ID } from "../../data/classes";
import { SECOES, SELECAO } from "../../data/pagina";
import type { NomePersonagem } from "../../data/sprites";
import { SpriteAnimado } from "../ui/SpriteAnimado";
import { PainelClasse } from "./PainelClasse";
import { RosterClasses } from "./RosterClasses";

type SelecaoClasseProps = {
  onVerFicha: (nome: NomePersonagem) => void;
};

export function SelecaoClasse({ onVerFicha }: SelecaoClasseProps) {
  const [selecionado, setSelecionado] = useState<NomePersonagem>("paladino");
  const classe = CLASSE_POR_ID[selecionado];

  return (
    <section id={SECOES.selecao} aria-labelledby="selecao-titulo" className="secao bg-surface/40">
      <div className="container-pagina flex flex-col gap-10">
        <header className="text-center">
          <h2 id="selecao-titulo" className="text-2xl text-accent">
            {SELECAO.titulo}
          </h2>
          <p className="mt-4 text-muted">{SELECAO.instrucao}</p>
        </header>

        <RosterClasses selecionado={selecionado} onSelecionar={setSelecionado} />

        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="borda-pixel relative flex flex-col items-center justify-end overflow-clip bg-bg px-6 pt-10 pb-6">
            <div aria-hidden="true" className="brilho-tocha absolute inset-0" />
            <SpriteAnimado nome={selecionado} className="relative w-48 sm:w-60" />
            <div aria-hidden="true" className="relative -mt-2 h-3 w-40 bg-chao sm:w-52" />
          </div>
          <PainelClasse classe={classe} onVerFicha={() => onVerFicha(selecionado)} />
        </div>
      </div>
    </section>
  );
}
