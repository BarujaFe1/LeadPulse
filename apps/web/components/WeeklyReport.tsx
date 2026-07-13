type Props = { highlights: string[] };

export function WeeklyReport({ highlights }: Props) {
  return (
    <section className="panel" aria-labelledby="weekly-title">
      <h2 id="weekly-title">Relatório semanal</h2>
      <ul className="highlights">
        {highlights.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
