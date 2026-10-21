import { MINIATURAS } from "../../data/miniaturas";
import type { NomePersonagem } from "../../data/sprites";

type MiniaturaProps = {
  nome: NomePersonagem;
  alt?: string;
  className?: string;
};

export function Miniatura({ nome, alt = "", className = "" }: MiniaturaProps) {
  const src = MINIATURAS[nome];
  const mascara = `url(${src}) center / contain no-repeat`;
  return (
    <span data-miniatura="" className={`relative block ${className}`}>
      <img src={src} alt={alt} width={111} height={149} loading="lazy" className="pixelado block h-auto w-full" />
      <span
        data-flash=""
        aria-hidden="true"
        className="pointer-events-none invisible absolute inset-0 bg-flash opacity-0"
        style={{ mask: mascara, WebkitMask: mascara }}
      />
    </span>
  );
}
