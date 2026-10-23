import { CENARIO, type Mundo } from "../../data/mundos";
import { Brasas } from "./Brasas";
import { JanelasPiscando } from "./JanelasPiscando";
import { Neve } from "./Neve";

type CenarioMundoProps = {
  mundo: Mundo;
  visivel: boolean;
  ativo: boolean;
};

export function CenarioMundo({ mundo, visivel, ativo }: CenarioMundoProps) {
  const { efeito } = mundo;
  return (
    <div data-cenario="" className={`absolute inset-0 ${visivel ? "" : "invisible"}`}>
      <div data-parallax="" className="absolute -inset-x-[3%] top-0 bottom-[40%] will-change-transform lg:bottom-0">
        <img
          src={mundo.imagem}
          alt={mundo.alt}
          width={CENARIO.largura}
          height={CENARIO.altura}
          decoding="async"
          className="pixelado size-full object-cover object-right"
        />
        {efeito.tipo === "janelas" && <JanelasPiscando janelas={efeito.janelas} ativo={ativo} />}
      </div>
      {efeito.tipo === "neve" && <Neve ativo={ativo} />}
      {efeito.tipo === "brasas" && <Brasas ativo={ativo} />}
    </div>
  );
}
