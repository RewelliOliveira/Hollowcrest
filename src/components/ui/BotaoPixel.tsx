import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variante = "primario" | "secundario";

const ESTILOS: Record<Variante, string> = {
  primario: "borda-pixel-ouro bg-accent text-accent-contrast hover:bg-text",
  secundario: "bg-surface text-text hover:bg-surface-2",
};

const BASE =
  "borda-pixel sombra-pixel inline-flex min-h-11 items-center justify-center gap-3 px-5 py-3 font-display text-xs uppercase leading-relaxed transition-transform active:translate-y-1";

type BotaoPixelProps = { variante?: Variante; children: ReactNode; className?: string } & (
  | ({ href: string } & ComponentPropsWithoutRef<"a">)
  | ({ href?: undefined } & ComponentPropsWithoutRef<"button">)
);

export function BotaoPixel({ variante = "primario", className = "", children, ...props }: BotaoPixelProps) {
  const classes = `${BASE} ${ESTILOS[variante]} ${className}`;
  if (props.href !== undefined) {
    return (
      <a {...(props as ComponentPropsWithoutRef<"a">)} className={classes}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" {...(props as ComponentPropsWithoutRef<"button">)} className={classes}>
      {children}
    </button>
  );
}
