import { useMemo, useRef, useState } from "react";
import { CLASSE_POR_ID } from "../../data/classes";
import { sprites, type NomePersonagem } from "../../data/sprites";
import { useAnimacao } from "../../hooks/useAnimacao";
import { useNaTela } from "../../hooks/useNaTela";
import { desfazerPixels, montarPixels } from "../../lib/animacoes";
import { gsap, useGSAP } from "../../lib/gsap";
import { CONDICOES, lerMotion } from "../../lib/motion";
import { PixelSprite } from "./PixelSprite";

const AGRUPAMENTO_PADRAO = 4;

const MARGEM_ROLAGEM = "0px 0px -20% 0px";
const MARGEM_REDUZIDA = "25% 0px";

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
  const [margem] = useState(() => (window.matchMedia(CONDICOES.reduzir).matches ? MARGEM_REDUZIDA : MARGEM_ROLAGEM));

  const ref = useRef<HTMLDivElement>(null);
  const naTela = useNaTela(ref, entrada === "rolagem", margem);

  useAnimacao<HTMLDivElement>(
    ({ q, M, animar }) => {
      if (!animar || !naTela) return;
      const montagem = montarPixels(q("[data-pixel]"), M, { paused: true });
      let quadro = requestAnimationFrame(() => {
        quadro = requestAnimationFrame(() => montagem.play());
      });
      return () => cancelAnimationFrame(quadro);
    },
    [exibido, naTela],
    ref,
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

  const classe = CLASSE_POR_ID[exibido];
  const texto = rotulo ?? `${classe.classe} ${classe.nome}, ${classe.titulo}`;
  const sprite = useMemo(() => {
    if (!naTela) {
      const { largura, altura } = sprites[exibido];
      return <svg viewBox={`0 0 ${largura} ${altura}`} role="img" aria-label={texto} className="block h-auto w-full" />;
    }
    return (
      <PixelSprite
        key={exibido}
        nome={exibido}
        modo="animavel"
        agrupamento={agrupamento}
        rotulo={texto}
        className="block h-auto w-full overflow-visible"
      />
    );
  }, [exibido, agrupamento, texto, naTela]);

  return (
    <div ref={ref} className={className}>
      {sprite}
    </div>
  );
}
