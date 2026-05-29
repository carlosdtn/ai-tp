import type { JournalEntry as JournalEntryModel } from "@ai-tp/core";

export function JournalEntry({ entry }: { entry: JournalEntryModel }) {
  return (
    <article className="panel">
      <h2>{entry.entryType}</h2>
      <p>{entry.content}</p>
      <p className="muted">{entry.createdAt}</p>
    </article>
  );
}
