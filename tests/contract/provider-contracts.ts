import type { AIProvider, BrokerProvider, MarketDataProvider } from "@ai-tp/core";
import { createId, createTraceId } from "@ai-tp/core";
import { createSeedInstrument } from "@ai-tp/shared/testing";

export const providerContractContext = () => {
  const traceId = createTraceId();
  const workflowRunId = createId("WorkflowRun");
  const instrument = createSeedInstrument();
  return { traceId, workflowRunId, instrument };
};

export const expectMarketDataContract = async (provider: MarketDataProvider) => {
  const context = providerContractContext();
  const result = await provider.getSnapshot(context);
  if (!result.ok) {
    throw new Error(result.error.message);
  }
  return result.value;
};

export const expectAIContract = async (
  provider: AIProvider,
  marketDataProvider: MarketDataProvider,
) => {
  const context = providerContractContext();
  const marketData = await marketDataProvider.getSnapshot(context);
  if (!marketData.ok) {
    throw new Error(marketData.error.message);
  }
  const result = await provider.analyze({
    ...context,
    marketDataSnapshot: marketData.value,
    analysisPrompt: "Analyze for paper trading",
  });
  if (!result.ok) {
    throw new Error(result.error.message);
  }
  return result.value;
};

export const expectBrokerContract = async (provider: BrokerProvider) => {
  const context = providerContractContext();
  const result = await provider.simulatePaperAction({
    ...context,
    recommendationId: createId("Recommendation"),
    paperAction: "buy",
    quantity: 1,
    priceAssumption: 100,
  });
  if (!result.ok) {
    throw new Error(result.error.message);
  }
  return result.value;
};
