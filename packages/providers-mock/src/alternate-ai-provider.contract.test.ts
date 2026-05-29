import { describe, expect, it } from "vitest";
import { expectAIContract } from "../../../tests/contract/provider-contracts";
import { createAlternateMockAIProvider } from "./alternate-mock-ai-provider";
import { createMockMarketDataProvider } from "./mock-market-data-provider";

describe("alternate mock AI provider", () => {
  it("satisfies the same AI provider contract", async () => {
    const analysis = await expectAIContract(
      createAlternateMockAIProvider(),
      createMockMarketDataProvider(),
    );
    expect(analysis.providerId).toBe("alternate-mock-ai");
  });
});
