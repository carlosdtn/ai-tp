import { repositories, runRecommendations } from "../application";
import { formatRecommendationSummary, printJson } from "../output";

export const handleRecommendationsCommand = async (args: string[]): Promise<void> => {
  const action = args[0];
  if (action === "run") {
    const watchlist = valueAfter(args, "--watchlist") ?? "AI Paper Ideas";
    const scenario = valueAfter(args, "--scenario");
    const result = await runRecommendations(watchlist, scenario);
    if (!result.ok) {
      printJson(result.error);
      return;
    }
    printJson(result.value);
    return;
  }
  if (action === "show") {
    const id = valueAfter(args, "--id");
    const recommendations = await repositories.recommendations.list();
    const recommendation = recommendations.find((item) => item.id === id) ?? recommendations[0];
    process.stdout.write(
      recommendation
        ? `${formatRecommendationSummary(recommendation)}\n`
        : "No recommendation found\n",
    );
  }
};

const valueAfter = (args: string[], key: string): string | undefined => {
  const index = args.indexOf(key);
  return index >= 0 ? args[index + 1] : undefined;
};
