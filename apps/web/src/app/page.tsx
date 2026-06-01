import Link from "next/link";
import { loadDashboardData } from "../lib/application";

export default async function DashboardPage() {
  const data = await loadDashboardData();
  return (
    <section>
      <h1>AI Trading Platform</h1>
      <p className="muted">Paper-trading recommendations with mock providers only.</p>
      <div className="grid">
        <article className="panel">
          <h2>Watchlist</h2>
          <p>{data.watchlist.name}</p>
          <p className="muted">{data.watchlist.instruments.length} instrument</p>
        </article>
        <article className="panel">
          <h2>Recommendations</h2>
          <p>{data.recommendations.length} generated</p>
          <Link href="/recommendations">Review decisions</Link>
        </article>
        <article className="panel">
          <h2>Provider Logs</h2>
          <p>{data.providerLogs.length} mock provider calls</p>
        </article>
        <article className="panel">
          <h2>Performance</h2>
          <p>{data.performanceSummary.evaluatedCount} evaluated outcomes</p>
          <Link href="/performance">Track accuracy</Link>
        </article>
      </div>
    </section>
  );
}
