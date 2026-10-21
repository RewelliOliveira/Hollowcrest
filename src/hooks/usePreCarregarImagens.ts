import { useEffect } from "react";

/** Baixa e decodifica as imagens antes do uso, para a troca não piscar. */
export function usePreCarregarImagens(urls: readonly string[]) {
  useEffect(() => {
    urls.forEach((url) => {
      const img = new Image();
      img.src = url;
      img.decode().catch(() => {});
    });
  }, [urls]);
}
