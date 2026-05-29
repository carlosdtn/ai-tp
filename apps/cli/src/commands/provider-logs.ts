import { repositories } from "../application";
import { printJson } from "../output";

export const handleProviderLogsCommand = async (): Promise<void> => {
  printJson(await repositories.providerLogs.list());
};
