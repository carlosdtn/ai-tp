import type { PerformanceSummary } from "@ai-tp/core";

type PerformanceSummaryProps = {
  summary: PerformanceSummary;
};

export const PerformanceSummaryPanel = ({ summary }: PerformanceSummaryProps) => (
  <div className="grid">
    <article className="panel">
      <h2>Evaluated</h2>
      <p>{summary.evaluatedCount} recommendations</p>
      <p className="muted">{summary.unresolvedCount} unresolved</p>
    </article>
    <article className="panel">
      <h2>Win rate</h2>
      <p>{formatRate(summary.winRate)}</p>
      <p className="muted">Loss {formatRate(summary.lossRate)}</p>
    </article>
    <article className="panel">
      <h2>Average return</h2>
      <p>{summary.averageReturnPct}%</p>
      <p className="muted">Neutral {formatRate(summary.neutralRate)}</p>
    </article>
  </div>
);

const formatRate = (value: number) => `${Math.round(value * 100)}%`;
