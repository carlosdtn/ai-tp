import { providerContractRules } from "@ai-tp/core";
import { describe, expect, it } from "vitest";

describe("adapter boundary rules", () => {
  it("documents required provider contract rules", () => {
    expect(providerContractRules).toContain("mock-only-v1");
    expect(providerContractRules).toContain("exclude-secrets");
  });
});
