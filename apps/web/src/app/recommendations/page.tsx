import Link from "next/link";
import { loadDashboardData } from "../../lib/application";
import { toRecommendationViewModel } from "./recommendation-view-model";

export default async function RecommendationsPage() {
  const data = await loadDashboardData();
  const items = data.recommendations.map((item) =>
    toRecommendationViewModel(item, data.providerLogs),
  );
  return (
    <section>
      <h1>Recommendations</h1>
      <div className="grid">
        {items.map((item) => (
          <article className="panel" key={item.id}>
            <h2>{item.action.toUpperCase()} paper recommendation</h2>
            <p>
              Score {item.score} / Confidence {item.confidence}
            </p>
            <p className="muted">Risk: {item.riskStatus}</p>
            <Link href={`/recommendations/${item.id}`}>Open audit detail</Link>
          </article>
        ))}
      </div>
    </section>
  );
}
