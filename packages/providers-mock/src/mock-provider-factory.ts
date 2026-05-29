import type { AIProvider, BrokerProvider, MarketDataProvider } from "@ai-tp/core";
import { createAlternateMockAIProvider } from "./alternate-mock-ai-provider";
import { createMockAIProvider } from "./mock-ai-provider";
import { createMockBrokerProvider } from "./mock-broker-provider";
import { createMockMarketDataProvider } from "./mock-market-data-provider";

export type MockProviderSet = {
  aiProvider: AIProvider;
  brokerProvider: BrokerProvider;
  marketDataProvider: MarketDataProvider;
};

export const createMockProviderSet = (options?: { alternateAI?: boolean }): MockProviderSet => ({
  aiProvider: options?.alternateAI ? createAlternateMockAIProvider() : createMockAIProvider(),
  brokerProvider: createMockBrokerProvider(),
  marketDataProvider: createMockMarketDataProvider(),
});
