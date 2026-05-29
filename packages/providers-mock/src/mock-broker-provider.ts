import type { BrokerProvider } from "@ai-tp/core";
import { createId, err, ok } from "@ai-tp/core";

export const createMockBrokerProvider = (): BrokerProvider => ({
  providerId: "mock-broker",
  async simulatePaperAction(request) {
    if (request.paperAction === "avoid") {
      return err(
        "RISK_REJECTED",
        "Paper simulation rejected because recommendation action is avoid.",
      );
    }
    return ok({
      providerId: "mock-broker",
      paperSimulationId: createId("PaperSimulation"),
      status: "accepted",
      reason: "Paper-only simulation accepted by mock broker.",
      buyingPowerImpact: request.quantity * request.priceAssumption,
    });
  },
});
