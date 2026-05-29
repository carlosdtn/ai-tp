import type {
  InstrumentId,
  JournalEntryId,
  PaperSimulationId,
  RecommendationId,
  Timestamp,
} from "./primitives";

export type JournalEntryType = "note" | "outcome" | "system";

export type JournalEntry = {
  id: JournalEntryId;
  instrumentId?: InstrumentId;
  recommendationId?: RecommendationId;
  paperSimulationId?: PaperSimulationId;
  author: string;
  content: string;
  tags: string[];
  entryType: JournalEntryType;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};
