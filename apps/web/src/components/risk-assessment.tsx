export function RiskAssessment({ status }: { status: string }) {
  return (
    <article className="panel">
      <h2>Risk</h2>
      <p>{status}</p>
      <p className="muted">Paper-trading validation only.</p>
    </article>
  );
}
