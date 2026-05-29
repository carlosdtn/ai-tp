import { type Result, err, ok } from "../domain/result";

export type TradingMode = "paper" | "live";

export const assertPaperTradingOnly = (mode: TradingMode): Result<"paper"> => {
  if (mode !== "paper") {
    return err("LIVE_TRADING_NOT_ALLOWED", "Live trading is not allowed in this platform version.");
  }
  return ok("paper");
};
