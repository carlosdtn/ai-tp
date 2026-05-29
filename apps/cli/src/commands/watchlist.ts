import { addInstrument, createWatchlist, repositories } from "../application";
import { printJson } from "../output";

export const handleWatchlistCommand = async (args: string[]): Promise<void> => {
  const action = args[0];
  if (action === "create") {
    const name = valueAfter(args, "--name") ?? "AI Paper Ideas";
    printJson(await createWatchlist(name));
    return;
  }
  if (action === "add-instrument") {
    const watchlist = valueAfter(args, "--watchlist") ?? "AI Paper Ideas";
    const symbol = valueAfter(args, "--symbol") ?? "AAPL";
    printJson(await addInstrument(watchlist, symbol));
    return;
  }
  printJson(await repositories.watchlists.list());
};

const valueAfter = (args: string[], key: string): string | undefined => {
  const index = args.indexOf(key);
  return index >= 0 ? args[index + 1] : undefined;
};
