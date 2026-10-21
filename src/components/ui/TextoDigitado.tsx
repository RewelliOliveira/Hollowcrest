import { Fragment, type ElementType } from "react";

type TextoDigitadoProps = {
  texto: string;
  as?: ElementType;
  className?: string;
};

export function TextoDigitado({ texto, as: Tag = "p", className }: TextoDigitadoProps) {
  const palavras = texto.split(" ");
  return (
    <Tag className={className}>
      <span className="sr-only">{texto}</span>
      <span aria-hidden="true" data-digitar="">
        {palavras.map((palavra, i) => (
          <Fragment key={i}>
            <span className="whitespace-nowrap">
              {[...palavra].map((letra, j) => (
                <span key={j} data-letra="">
                  {letra}
                </span>
              ))}
            </span>
            {i < palavras.length - 1 ? " " : null}
          </Fragment>
        ))}
      </span>
    </Tag>
  );
}
