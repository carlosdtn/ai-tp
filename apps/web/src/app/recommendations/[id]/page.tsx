import { ProviderLogSummary } from "../../../components/provider-log-summary";
import { RiskAssessment } from "../../../components/risk-assessment";
import { ScoreBreakdown } from "../../../components/score-breakdown";
import { loadDashboardData } from "../../../lib/application";
import { toRecommendationViewModel } from "../recommendation-view-model";

export default async function RecommendationDetailPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await loadDashboardData();
  const recommendation =
    data.recommendations.find((item) => item.id === id) ?? data.recommendations[0];
  if (!recommendation) {
    return <p>No recommendation found.</p>;
  }
  const vm = toRecommendationViewModel(recommendation, data.providerLogs);
  return (
    <section>
      <h1>Paper Recommendation Audit</h1>
      <p className="muted">Trace {vm.traceId}</p>
      <article className="panel">
        <h2>
          {vm.action.toUpperCase()} - {vm.status}
        </h2>
        <p>{vm.explanation}</p>
      </article>
      <div className="grid">
        <ScoreBreakdown score={vm.score} confidence={vm.confidence} />
        <RiskAssessment status={vm.riskStatus} />
        <ProviderLogSummary logs={vm.providerLogs} />
      </div>
    </section>
  );
}
