import { useEffect, useState } from "react";
import { Codex } from "./components/landing/Codex";
import { Encerramento } from "./components/landing/Encerramento";
import { Hero } from "./components/landing/Hero";
import { Lenda } from "./components/landing/Lenda";
import { Mundo } from "./components/landing/Mundo";
import { Navbar } from "./components/landing/Navbar";
import { Recursos } from "./components/landing/Recursos";
import { Rodape } from "./components/landing/Rodape";
import { SelecaoClasse } from "./components/landing/SelecaoClasse";
import { PULAR_CONTEUDO, SECOES } from "./data/pagina";
import type { NomePersonagem } from "./data/sprites";
import { ScrollTrigger } from "./lib/gsap";

function App() {
  const [heroiCodex, setHeroiCodex] = useState<NomePersonagem>("paladino");

  useEffect(() => {
    // As fontes pixeladas mudam a altura do texto: recalcula os gatilhos de scroll.
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }, []);

  const verFicha = (nome: NomePersonagem) => {
    setHeroiCodex(nome);
    const codex = document.getElementById(SECOES.codex);
    codex?.scrollIntoView({ block: "start" });
    codex?.focus({ preventScroll: true });
  };

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only z-[60] bg-accent px-4 py-2 font-display text-xs text-accent-contrast focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        {PULAR_CONTEUDO}
      </a>
      <Navbar />
      <main id="conteudo">
        <Hero />
        <Lenda />
        <SelecaoClasse onVerFicha={verFicha} />
        <Codex heroi={heroiCodex} onTrocar={setHeroiCodex} />
        <Recursos />
        <Mundo />
        <Encerramento />
      </main>
      <Rodape />
    </>
  );
}

export default App;
