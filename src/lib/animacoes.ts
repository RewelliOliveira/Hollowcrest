// Receitas de animação reutilizadas pelas seções. Sempre chamadas dentro de useAnimacao/useGSAP.
import { gsap } from "./gsap";
import type { Motion } from "./motion";

type Alvo = gsap.TweenTarget;

/** Espalhamento dos pixels, em pixels de arte (unidades do viewBox do sprite). */
const espalhar = (M: Motion) => () => gsap.utils.random(-M.dist * 2, M.dist * 2, 1);

/** Um atraso aleatório por pixel, compartilhado pelos tweens de movimento e de visibilidade. */
function atrasosAleatorios(quantidade: number, total: number) {
  const atrasos = Array.from({ length: quantidade }, () => gsap.utils.random(0, total));
  return (i: number) => atrasos[i];
}

/** Liga/desliga de uma vez: opacidade parcial em milhares de grupos SVG pesa muito na pintura. */
export const INSTANTE = 0.001;

/**
 * Lê o transform de todos os pixels antes de qualquer escrita. O GSAP guarda em cache,
 * e assim não força um layout por elemento (layout thrashing) ao iniciar os tweens.
 */
function prepararPixels(pixels: Alvo) {
  const lista = gsap.utils.toArray<Element>(pixels);
  lista.forEach((el) => gsap.getProperty(el, "x"));
  return lista;
}

/**
 * Pixels vêm de posições aleatórias e se encaixam quadro a quadro.
 * Cada pixel aparece inteiro no início do seu movimento (sem fade).
 */
export function montarPixels(pixels: Alvo, M: Motion, extra: gsap.TimelineVars = {}) {
  const lista = prepararPixels(pixels);
  const atraso = atrasosAleatorios(lista.length, M.slow * 0.8);
  return gsap
    .timeline(extra)
    .fromTo(
      lista,
      { x: espalhar(M), y: espalhar(M) },
      { x: 0, y: 0, duration: M.dur, ease: M.ease, snap: { x: 1, y: 1 }, stagger: atraso },
      0,
    )
    .fromTo(lista, { autoAlpha: 0 }, { autoAlpha: 1, duration: INSTANTE, ease: "none", stagger: atraso }, 0);
}

/** Pixels se soltam quadro a quadro e cada um some ao fim do seu movimento. */
export function desfazerPixels(pixels: Alvo, M: Motion, extra: gsap.TimelineVars = {}) {
  const lista = prepararPixels(pixels);
  const atraso = atrasosAleatorios(lista.length, M.dur * 0.5);
  return gsap
    .timeline(extra)
    .to(
      lista,
      {
        x: espalhar(M),
        y: () => gsap.utils.random(-M.dist * 3, -M.dist, 1),
        duration: M.fast,
        ease: M.easePop,
        snap: { x: 1, y: 1 },
        stagger: atraso,
        overwrite: true,
      },
      0,
    )
    .fromTo(
      lista,
      { autoAlpha: 1 },
      { autoAlpha: 0, duration: INSTANTE, ease: "none", stagger: atraso, immediateRender: false },
      M.fast,
    );
}

/**
 * Máquina de escrever: as letras (marcadas com data-letra) aparecem uma a uma.
 * `duracaoMax` limita o tempo total em textos longos.
 */
export function digitar(grupo: Element, M: Motion, duracaoMax = Infinity) {
  const letras = grupo.querySelectorAll("[data-letra]");
  const passo = Math.min(M.digitar, duracaoMax / Math.max(letras.length, 1));
  return gsap.fromTo(
    letras,
    { autoAlpha: 0 },
    { autoAlpha: 1, duration: passo, ease: "steps(1)", stagger: passo },
  );
}

/** Blocos cheios das barras de atributo entram em sequência, da esquerda para a direita. */
export function encherBarras(blocos: Element[], M: Motion) {
  return gsap.from(blocos, {
    scaleY: 0,
    autoAlpha: 0,
    transformOrigin: "50% 100%",
    duration: M.fast,
    ease: M.easePop,
    stagger: (_i, el: HTMLElement) => Number(el.dataset.indice) * M.stagger,
  });
}

/** Piscar branco de "dano", como quando um inimigo é atingido. */
export function piscarDano(flash: Element, alvo: Element, M: Motion) {
  return gsap
    .timeline()
    .fromTo(flash, { autoAlpha: 0 }, { autoAlpha: 1, duration: M.fast, ease: "steps(2)", repeat: 3, yoyo: true })
    .fromTo(alvo, { x: -2 }, { x: 2, duration: M.fast / 2, ease: "steps(1)", repeat: 3, yoyo: true, clearProps: "x" }, 0);
}

/**
 * Transição de tela dos RPGs 16-bit: blocos cobrem a cena em ordem aleatória e somem em
 * seguida. Troque a cena no rótulo "coberta" da timeline retornada.
 */
export function dissolverBlocos(blocos: Alvo, M: Motion) {
  const passo = { amount: M.fast, from: "random" } as const;
  return gsap
    .timeline()
    .to(blocos, { autoAlpha: 1, duration: INSTANTE, ease: "none", stagger: passo })
    .addLabel("coberta")
    .to(blocos, { autoAlpha: 0, duration: INSTANTE, ease: "none", stagger: passo });
}

/** Pausa loops infinitos (partículas, luzes) enquanto o container está fora da tela. Retorna a limpeza. */
export function pausarForaDaTela(el: Element, animacoes: gsap.core.Animation[]) {
  const observador = new IntersectionObserver(([entrada]) =>
    animacoes.forEach((a) => (entrada.isIntersecting ? a.resume() : a.pause())),
  );
  observador.observe(el);
  return () => observador.disconnect();
}
