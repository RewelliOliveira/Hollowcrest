import { useRef, useState, type KeyboardEvent } from "react";
import { CLASSES } from "../../data/classes";
import type { NomePersonagem } from "../../data/sprites";
import { useAnimacao } from "../../hooks/useAnimacao";
import { piscarDano } from "../../lib/animacoes";
import { Miniatura } from "../ui/Miniatura";

type RosterClassesProps = {
  selecionado: NomePersonagem;
  onSelecionar: (nome: NomePersonagem) => void;
};

export function RosterClasses({ selecionado, onSelecionar }: RosterClassesProps) {
  const botoes = useRef<(HTMLButtonElement | null)[]>([]);
  const [foco, setFoco] = useState(() => CLASSES.findIndex((c) => c.id === selecionado));

  const ref = useAnimacao<HTMLDivElement>(({ q, M, animar, seguro }) => {
    if (!animar) return;
    const remover = q("[data-opcao]").map((botao) => {
      const flash = botao.querySelector("[data-flash]");
      const miniatura = botao.querySelector("[data-miniatura]");
      if (!flash || !miniatura) return () => {};
      const atingir = seguro(() => piscarDano(flash, miniatura, M));
      botao.addEventListener("pointerenter", atingir);
      return () => botao.removeEventListener("pointerenter", atingir);
    });
    return () => remover.forEach((f) => f());
  });

  const mover = (indice: number) => {
    const alvo = (indice + CLASSES.length) % CLASSES.length;
    setFoco(alvo);
    botoes.current[alvo]?.focus();
  };

  const aoTeclar = (e: KeyboardEvent<HTMLDivElement>) => {
    const acoes: Record<string, () => void> = {
      ArrowRight: () => mover(foco + 1),
      ArrowDown: () => mover(foco + 1),
      ArrowLeft: () => mover(foco - 1),
      ArrowUp: () => mover(foco - 1),
      Home: () => mover(0),
      End: () => mover(CLASSES.length - 1),
    };
    const acao = acoes[e.key];
    if (acao) {
      e.preventDefault();
      acao();
    }
  };

  return (
    <div
      ref={ref}
      role="group"
      aria-label="Classes"
      onKeyDown={aoTeclar}
      className="grid grid-cols-3 gap-3 sm:gap-4 lg:grid-cols-6"
    >
      {CLASSES.map((classe, i) => {
        const ativo = classe.id === selecionado;
        return (
          <button
            key={classe.id}
            ref={(el) => {
              botoes.current[i] = el;
            }}
            type="button"
            data-opcao=""
            aria-pressed={ativo}
            tabIndex={i === foco ? 0 : -1}
            onFocus={() => setFoco(i)}
            onClick={() => {
              setFoco(i);
              onSelecionar(classe.id);
            }}
            className={`borda-pixel group relative flex flex-col items-center gap-2 px-2 pt-3 pb-2 ${
              ativo ? "borda-pixel-ouro bg-surface-2" : "bg-surface hover:bg-surface-2"
            }`}
          >
            <span
              aria-hidden="true"
              className={`absolute -top-6 font-display text-xs text-accent ${ativo ? "visible" : "invisible"}`}
            >
              ▼
            </span>
            <Miniatura nome={classe.id} className="w-14 sm:w-16" />
            <span className={`font-display text-xs ${ativo ? "text-accent" : "text-muted"}`}>
              {classe.classe}
            </span>
          </button>
        );
      })}
    </div>
  );
}
