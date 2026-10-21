import { useState } from "react";
import { JOGO, NAV_LINKS, SECOES } from "../../data/pagina";

export function Navbar() {
  const [aberto, setAberto] = useState(false);
  const fechar = () => setAberto(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b-4 border-border bg-bg/95">
      <nav aria-label="Principal" className="container-pagina flex h-16 items-center justify-between gap-4">
        <a
          href={`#${SECOES.topo}`}
          onClick={fechar}
          className="font-display text-xs text-accent sm:text-sm"
          aria-label={`${JOGO}, início`}
        >
          {JOGO.toUpperCase()}
        </a>

        <button
          type="button"
          className="borda-pixel flex min-h-11 items-center bg-surface px-3 font-display text-xs md:hidden"
          aria-expanded={aberto}
          aria-controls="menu-principal"
          onClick={() => setAberto((v) => !v)}
        >
          {aberto ? "Fechar" : "Menu"}
        </button>

        <ul
          id="menu-principal"
          className={`${aberto ? "flex" : "hidden"} absolute inset-x-0 top-16 flex-col gap-1 border-b-4 border-border bg-bg p-4 md:static md:flex md:flex-row md:gap-6 md:border-0 md:bg-transparent md:p-0`}
        >
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={fechar}
                className="flex min-h-11 items-center font-display text-xs text-text hover:text-accent"
              >
                {link.rotulo}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
