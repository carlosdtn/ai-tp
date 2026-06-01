import { evaluatePerformance, loadPerformanceSummary } from "../application";
import { printJson } from "../output";

export const handlePerformanceCommand = async (args: string[]): Promise<void> => {
  const action = args[0];
  if (action === "evaluate") {
    const recommendationId = valueAfter(args, "--recommendation");
    const entryPrice = numberAfter(args, "--entry-price");
    const evaluationPrice = numberAfter(args, "--evaluation-price");

    if (!recommendationId || entryPrice === undefined || evaluationPrice === undefined) {
      printJson({
        error:
          "Usage: ai-tp performance evaluate --recommendation <id> --entry-price <number> --evaluation-price <number>",
      });
      return;
    }

    const expectedDirection = directionAfter(args, "--direction");
    const horizonDays = numberAfter(args, "--horizon-days");
    const result = await evaluatePerformance({
      recommendationId,
      entryPrice,
      evaluationPrice,
      ...(expectedDirection ? { expectedDirection } : {}),
      ...(horizonDays === undefined ? {} : { horizonDays }),
    });
    printJson(result.ok ? result.value : result.error);
    return;
  }

  if (action === "summary") {
    printJson(await loadPerformanceSummary());
    return;
  }

  process.stdout.write("Usage: ai-tp performance <evaluate|summary> [...args]\n");
};

const valueAfter = (args: string[], key: string): string | undefined => {
  const index = args.indexOf(key);
  return index >= 0 ? args[index + 1] : undefined;
};

const numberAfter = (args: string[], key: string): number | undefined => {
  const value = valueAfter(args, key);
  if (!value) {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const directionAfter = (args: string[], key: string): "up" | "down" | "flat" | undefined => {
  const value = valueAfter(args, key);
  return value === "up" || value === "down" || value === "flat" ? value : undefined;
};
