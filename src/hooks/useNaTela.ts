import { useEffect, useState, type RefObject } from "react";

/**
 * Vira true (uma única vez) quando o elemento entra na área visível, ampliada ou
 * reduzida por `margem` (mesmo formato do rootMargin). Com `ativo` false, já começa true.
 */
export function useNaTela(ref: RefObject<Element | null>, ativo = true, margem = "0px") {
  const [naTela, setNaTela] = useState(!ativo);

  useEffect(() => {
    const el = ref.current;
    if (naTela || !el) return;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        setNaTela(true);
        observador.disconnect();
      },
      { rootMargin: margem },
    );
    observador.observe(el);
    return () => observador.disconnect();
  }, [ref, naTela, margem]);

  return naTela;
}
