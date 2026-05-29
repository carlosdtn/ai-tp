import { validateAIAnalysisOutput } from "@ai-tp/core";
import { describe, expect, it } from "vitest";

describe("provider validation", () => {
  it("rejects malformed provider responses", () => {
    const result = validateAIAnalysisOutput({ providerId: "bad" });
    expect(result.ok).toBe(false);
  });
});
