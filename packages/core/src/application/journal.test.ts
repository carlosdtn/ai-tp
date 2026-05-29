import { describe, expect, it } from "vitest";
import { createJournalEntry } from "./journal";

describe("createJournalEntry", () => {
  it("links notes to recommendations", async () => {
    const result = await createJournalEntry(
      {
        recommendationId: "rec_1",
        author: "test",
        content: "Reviewed paper outcome.",
        tags: ["paper"],
        entryType: "note",
      },
      {
        async save(entry) {
          return entry;
        },
        async findById() {
          return undefined;
        },
        async list() {
          return [];
        },
      },
    );
    expect(result.ok).toBe(true);
  });
});
