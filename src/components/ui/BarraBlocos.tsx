type BarraBlocosProps = {
  rotulo: string;
  valor: number;
  max: number;
  tom?: "noite" | "pergaminho";
};

const TONS = {
  noite: { cheio: "bg-accent", vazio: "bg-surface-2", texto: "text-muted" },
  pergaminho: { cheio: "bg-ink-accent", vazio: "bg-parchment-2", texto: "text-ink-muted" },
} as const;

export function BarraBlocos({ rotulo, valor, max, tom = "noite" }: BarraBlocosProps) {
  const cores = TONS[tom];
  return (
    <div className="grid grid-cols-[6.5rem_1fr_1.5rem] items-center gap-3 sm:grid-cols-[7.5rem_1fr_1.5rem]">
      <span className={`font-display text-xs uppercase ${cores.texto}`}>{rotulo}</span>
      <div
        role="meter"
        aria-label={rotulo}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={valor}
        className="flex gap-0.5"
      >
        {Array.from({ length: max }, (_, i) => (
          <span key={i} className={`h-3 flex-1 ${cores.vazio}`}>
            {i < valor ? (
              <span data-bloco="cheio" data-indice={i} className={`block h-full w-full ${cores.cheio}`} />
            ) : null}
          </span>
        ))}
      </div>
      <span className={`text-right font-display text-xs ${cores.texto}`} aria-hidden="true">
        {valor}
      </span>
    </div>
  );
}
