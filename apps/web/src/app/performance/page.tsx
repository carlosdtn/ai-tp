import { PerformanceSummaryPanel } from "../../components/performance-summary";
import { loadDashboardData } from "../../lib/application";

export default async function PerformancePage() {
  const data = await loadDashboardData();

  return (
    <section>
      <h1>Recommendation Performance</h1>
      <p className="muted">Paper-trading outcome tracking from mock market-data snapshots.</p>
      <PerformanceSummaryPanel summary={data.performanceSummary} />
      <div className="grid">
        {data.outcomes.map((outcome) => (
          <article className="panel" key={outcome.id}>
            <h2>{outcome.classification.toUpperCase()}</h2>
            <p>{outcome.percentReturn ?? 0}% return</p>
            <p className="muted">
              Policy: {outcome.policy.expectedDirection}, {outcome.policy.horizonDays} days
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
