import arqueiro from "../assets/personagens-tratados/arqueiro.png";
import assassino from "../assets/personagens-tratados/assassino.png";
import berserker from "../assets/personagens-tratados/berserker.png";
import lanceiro from "../assets/personagens-tratados/lanceiro.png";
import mago from "../assets/personagens-tratados/mago.png";
import paladino from "../assets/personagens-tratados/paladino.png";
import type { NomePersonagem } from "./sprites";

/** PNGs tratados (111x149), para miniaturas com image-rendering: pixelated. */
export const MINIATURAS: Record<NomePersonagem, string> = {
  arqueiro,
  assassino,
  berserker,
  lanceiro,
  mago,
  paladino,
};
