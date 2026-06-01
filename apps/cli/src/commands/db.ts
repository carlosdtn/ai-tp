import { initializePersistence, persistenceStatus } from "../application";
import { printJson } from "../output";

export const handleDbCommand = async (args: string[]): Promise<void> => {
  const action = args[0];
  if (action === "init") {
    printJson(await initializePersistence());
    return;
  }
  if (action === "status") {
    printJson(persistenceStatus());
    return;
  }
  process.stdout.write("Usage: ai-tp db <init|status>\n");
};
