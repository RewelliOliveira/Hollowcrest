import type { ReactNode } from "react";
import { ALTURA, LARGURA } from "../../data/paisagem";

type CamadaPaisagemProps = {
  profundidade: number;
  children: ReactNode;
};

export function CamadaPaisagem({ profundidade, children }: CamadaPaisagemProps) {
  return (
    <svg
      data-camada={profundidade}
      viewBox={`0 0 ${LARGURA} ${ALTURA}`}
      preserveAspectRatio="xMidYMax slice"
      shapeRendering="crispEdges"
      aria-hidden="true"
      className="absolute inset-y-0 -left-[15%] h-full w-[130%]"
    >
      {children}
    </svg>
  );
}
