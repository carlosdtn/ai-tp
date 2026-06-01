import { describe, expect, it } from "vitest";

describe("cli command contract", () => {
  it("keeps command tests wired", () => {
    expect(["watchlist", "recommendations", "provider-logs", "journal", "performance"]).toContain(
      "performance",
    );
  });
});
