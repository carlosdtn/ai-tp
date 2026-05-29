import { handleJournalCommand } from "./commands/journal";
import { handleProviderLogsCommand } from "./commands/provider-logs";
import { handleRecommendationsCommand } from "./commands/recommendations";
import { handleWatchlistCommand } from "./commands/watchlist";

const rawArgs = process.argv.slice(2);
const normalizedArgs = rawArgs[0] === "--" ? rawArgs.slice(1) : rawArgs;
const [command, ...args] = normalizedArgs;

if (command === "watchlist") {
  await handleWatchlistCommand(args);
} else if (command === "recommendations") {
  await handleRecommendationsCommand(args);
} else if (command === "provider-logs") {
  await handleProviderLogsCommand();
} else if (command === "journal") {
  await handleJournalCommand(args);
} else {
  process.stdout.write(
    "Usage: ai-tp <watchlist|recommendations|provider-logs|journal> [...args]\n",
  );
}
