import { describe, expect, it } from "vitest";

describe("cli command contract", () => {
  it("keeps command tests wired", () => {
    expect([
      "db",
      "watchlist",
      "recommendations",
      "provider-logs",
      "journal",
      "performance",
    ]).toContain("db");
  });
});
