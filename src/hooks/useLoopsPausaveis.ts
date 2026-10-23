import { useEffect, useRef } from "react";

type Estado = { ativo: boolean; naTela: boolean; loops: gsap.core.Animation[] };

function aplicar({ ativo, naTela, loops }: Estado) {
  loops.forEach((loop) => (ativo && naTela ? loop.resume() : loop.pause()));
}

/**
 * Loops infinitos (partículas, luzes) só rodam com o container na tela e `ativo` true.
 * Pausar mantém o ponto em que pararam: ao voltar, continuam de onde estavam.
 * Chame `registrar` dentro de useAnimacao e retorne a limpeza.
 */
export function useLoopsPausaveis(ativo = true) {
  const estado = useRef<Estado>({ ativo, naTela: true, loops: [] });

  useEffect(() => {
    estado.current.ativo = ativo;
    aplicar(estado.current);
  }, [ativo]);

  return (el: Element, loops: gsap.core.Animation[]) => {
    const atual = estado.current;
    atual.loops = loops;
    atual.naTela = true;
    aplicar(atual);
    const observador = new IntersectionObserver(([entrada]) => {
      atual.naTela = entrada.isIntersecting;
      aplicar(atual);
    });
    observador.observe(el);
    return () => {
      observador.disconnect();
      atual.loops = [];
    };
  };
}
