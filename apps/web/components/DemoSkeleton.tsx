export function DemoSkeleton() {
  return (
    <div className="skeleton-grid" aria-busy="true" aria-label="Carregando cockpit">
      {Array.from({ length: 6 }).map((_, index) => (
        <div className="skeleton-card" key={index} />
      ))}
      <div className="skeleton-panel" />
      <div className="skeleton-panel" />
    </div>
  );
}
