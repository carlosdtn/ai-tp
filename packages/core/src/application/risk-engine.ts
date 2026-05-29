import type { RiskAssessment, ScoreResult } from "../domain/recommendation";

export const assessRisk = (score: ScoreResult): RiskAssessment => {
  const warnings: string[] = [];
  const rejectionReasons: string[] = [];

  if (score.confidence < 0.5) {
    warnings.push("Confidence is below the preferred review threshold.");
  }

  if (score.score < 0.35) {
    rejectionReasons.push("Score is below the minimum paper recommendation threshold.");
  }

  const status =
    rejectionReasons.length > 0 ? "rejected" : warnings.length > 0 ? "warning" : "passed";

  return {
    workflowRunId: score.workflowRunId,
    instrumentId: score.instrumentId,
    status,
    riskFactors: score.factors.map((factor) => factor.name),
    warnings,
    rejectionReasons,
    constraints: {
      minimumScore: 0.35,
      preferredConfidence: 0.5,
      liveTradingAllowed: false,
    },
  };
};
