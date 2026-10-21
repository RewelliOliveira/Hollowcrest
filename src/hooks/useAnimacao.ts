import { useRef, type RefObject } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { CONDICOES, lerMotion, type Condicoes, type Motion } from "../lib/motion";

export type ContextoAnimacao<T extends HTMLElement> = Condicoes & {
  el: T;
  q: (seletor: string) => Element[];
  M: Motion;
  /** Torna um handler seguro: animações criadas nele são revertidas junto com o contexto. */
  seguro: <A extends unknown[]>(fn: (...args: A) => void) => (...args: A) => void;
};

type Setup<T extends HTMLElement> = (ctx: ContextoAnimacao<T>) => void | (() => void);

/**
 * useGSAP + gsap.matchMedia com scope no container.
 * Reverte tudo ao desmontar, quando as dependências mudam ou quando uma condição
 * (reduced motion, breakpoint) muda. Aceita uma ref externa quando o container
 * precisa dela antes (ex.: para observar a visibilidade).
 */
export function useAnimacao<T extends HTMLElement = HTMLElement>(
  setup: Setup<T>,
  dependencies: unknown[] = [],
  refExterna?: RefObject<T | null>,
) {
  const refInterna = useRef<T>(null);
  const scope = refExterna ?? refInterna;

  useGSAP(
    () => {
      const el = scope.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(
        CONDICOES,
        (ctx) => {
          const M = lerMotion();
          const condicoes = ctx.conditions as Condicoes;
          if (!condicoes.desktop) M.dist *= 0.6;
          let n = 0;
          const seguro: ContextoAnimacao<T>["seguro"] = (fn) => {
            const nome = `handler${n++}`;
            ctx.add(nome, fn);
            return (ctx as unknown as Record<string, typeof fn>)[nome];
          };
          return setup({ el, q: gsap.utils.selector(el), M, seguro, ...condicoes });
        },
        el,
      );
      return () => mm.revert();
    },
    { scope, dependencies, revertOnUpdate: true },
  );

  return scope;
}
