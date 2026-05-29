import { describe, expect, it } from "vitest";
import {
  expectAIContract,
  expectBrokerContract,
  expectMarketDataContract,
} from "../../../tests/contract/provider-contracts";
import { createMockProviderSet } from "./mock-provider-factory";

describe("mock providers", () => {
  it("satisfy provider contracts", async () => {
    const providers = createMockProviderSet();
    await expectMarketDataContract(providers.marketDataProvider);
    await expectAIContract(providers.aiProvider, providers.marketDataProvider);
    const broker = await expectBrokerContract(providers.brokerProvider);
    expect(broker.status).toBe("accepted");
  });
});
