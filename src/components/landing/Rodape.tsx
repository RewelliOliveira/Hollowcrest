import { JOGO, NAV_LINKS, RODAPE, SECOES } from "../../data/pagina";

export function Rodape() {
  return (
    <footer className="border-t-4 border-border bg-surface py-10">
      <div className="container-pagina flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-3">
          <a href={`#${SECOES.topo}`} className="font-display text-sm text-accent">
            {JOGO.toUpperCase()}
          </a>
          <p className="max-w-sm text-muted">{RODAPE.creditos}</p>
          <p className="text-muted">{RODAPE.direitos}</p>
        </div>
        <nav aria-label="Rodapé">
          <ul className="grid grid-cols-2 gap-x-8 gap-y-1 sm:flex sm:gap-6">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="flex min-h-11 items-center font-display text-xs hover:text-accent">
                  {link.rotulo}
                </a>
              </li>
            ))}
            <li>
              <a href={`#${SECOES.topo}`} className="flex min-h-11 items-center font-display text-xs text-accent">
                {RODAPE.voltar} ▲
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
