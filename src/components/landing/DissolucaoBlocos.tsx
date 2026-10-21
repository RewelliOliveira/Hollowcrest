const BLOCOS = 240;

export function DissolucaoBlocos() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 grid grid-cols-8 content-start overflow-hidden md:grid-cols-12 xl:grid-cols-16"
    >
      {Array.from({ length: BLOCOS }, (_, i) => (
        <span key={i} data-bloco="" className="invisible aspect-square bg-chao shadow-[0_0_0_1px_var(--color-chao)]" />
      ))}
    </div>
  );
}
