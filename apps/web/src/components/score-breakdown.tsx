export function ScoreBreakdown({ score, confidence }: { score: number; confidence: number }) {
  return (
    <article className="panel">
      <h2>Score</h2>
      <p>{score}</p>
      <p className="muted">Confidence {confidence}</p>
    </article>
  );
}
