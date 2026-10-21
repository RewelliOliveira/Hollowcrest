import { useMemo, useState } from "react";
import { CLASSE_POR_ID } from "../../data/classes";
import type { NomePersonagem } from "../../data/sprites";
import { useAnimacao } from "../../hooks/useAnimacao";
import { desfazerPixels, montarPixels } from "../../lib/animacoes";
import { gsap, useGSAP } from "../../lib/gsap";
import { CONDICOES, lerMotion } from "../../lib/motion";
import { PixelSprite } from "./PixelSprite";

const AGRUPAMENTO_PADRAO = 4;

type SpriteAnimadoProps = {
  nome: NomePersonagem;
  entrada?: "carregar" | "rolagem";
  agrupamento?: number;
  rotulo?: string;
  className?: string;
};

export function SpriteAnimado({
  nome,
  entrada = "rolagem",
  agrupamento = AGRUPAMENTO_PADRAO,
  rotulo,
  className,
}: SpriteAnimadoProps) {
  const [exibido, setExibido] = useState(nome);

  const ref = useAnimacao<HTMLDivElement>(
    ({ el, q, M, animar }) => {
      if (!animar) return;
      montarPixels(
        q("[data-pixel]"),
        M,
        entrada === "rolagem" ? { scrollTrigger: { trigger: el, start: "top 80%", once: true } } : {},
      );
    },
    [exibido],
  );

  useGSAP(
    () => {
      if (nome === exibido) return;
      const pixels = gsap.utils.toArray<Element>("[data-pixel]", ref.current);
      if (window.matchMedia(CONDICOES.reduzir).matches || pixels.length === 0) {
        gsap.delayedCall(0, () => setExibido(nome));
        return;
      }
      desfazerPixels(pixels, lerMotion(), { onComplete: () => setExibido(nome) });
    },
    { scope: ref, dependencies: [nome, exibido], revertOnUpdate: true },
  );

  const sprite = useMemo(() => {
    const classe = CLASSE_POR_ID[exibido];
    return (
      <PixelSprite
        key={exibido}
        nome={exibido}
        modo="animavel"
        agrupamento={agrupamento}
        rotulo={rotulo ?? `${classe.classe} ${classe.nome}, ${classe.titulo}`}
        className="block h-auto w-full overflow-visible"
      />
    );
  }, [exibido, agrupamento, rotulo]);

  return (
    <div ref={ref} className={className}>
      {sprite}
    </div>
  );
}
