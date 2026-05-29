import { createJournalEntry } from "@ai-tp/core";
import { repositories } from "../application";
import { printJson } from "../output";

export const handleJournalCommand = async (args: string[]): Promise<void> => {
  const content = valueAfter(args, "--content") ?? "Paper-trading note";
  const recommendationId = valueAfter(args, "--recommendation");
  const result = await createJournalEntry(
    {
      recommendationId,
      author: "cli",
      content,
      tags: [],
      entryType: "note",
    },
    repositories.journal,
  );
  printJson(result);
};

const valueAfter = (args: string[], key: string): string | undefined => {
  const index = args.indexOf(key);
  return index >= 0 ? args[index + 1] : undefined;
};
