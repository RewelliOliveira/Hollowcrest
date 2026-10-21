// Personalidade de movimento vinda dos tokens --motion-* de src/tema.css.
// Todas as animações leem deste objeto: nada de durações ou eases soltos.

export type Motion = {
  /** entradas, quadro a quadro */
  ease: string;
  /** trocas de estado e scrub */
  easeInOut: string;
  /** elementos pequenos: botões, blocos de barra, ícones */
  easePop: string;
  dur: number;
  fast: number;
  slow: number;
  stagger: number;
  dist: number;
  /** segundos por letra na máquina de escrever */
  digitar: number;
};

/** Chame dentro de hooks: lê getComputedStyle, só existe no navegador. */
export function lerMotion(el: Element = document.documentElement): Motion {
  const css = getComputedStyle(el);
  const token = (nome: string, padrao: string) => css.getPropertyValue(nome).trim() || padrao;
  const dur = parseFloat(token("--motion-duration", "0.6"));
  return {
    ease: token("--motion-ease", "steps(6)"),
    easeInOut: token("--motion-ease-in-out", "steps(10)"),
    easePop: token("--motion-ease-pop", "steps(3)"),
    dur,
    fast: dur * 0.5,
    slow: dur * 1.6,
    stagger: parseFloat(token("--motion-stagger", "0.05")),
    dist: parseFloat(token("--motion-distance", "32")),
    digitar: parseFloat(token("--motion-digitar", "0.02")),
  };
}

export const CONDICOES = {
  animar: "(prefers-reduced-motion: no-preference)",
  reduzir: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 768px)",
  ponteiroFino: "(hover: hover) and (pointer: fine)",
} as const;

export type Condicoes = Record<keyof typeof CONDICOES, boolean>;
