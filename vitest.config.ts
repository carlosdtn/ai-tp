import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: [
      {
        find: "@ai-tp/shared/testing",
        replacement: fileURLToPath(
          new URL("./packages/shared/src/testing/index.ts", import.meta.url),
        ),
      },
      {
        find: "@ai-tp/providers-mock",
        replacement: fileURLToPath(
          new URL("./packages/providers-mock/src/index.ts", import.meta.url),
        ),
      },
      {
        find: "@ai-tp/persistence-drizzle",
        replacement: fileURLToPath(
          new URL("./packages/persistence-drizzle/src/index.ts", import.meta.url),
        ),
      },
      {
        find: "@ai-tp/core",
        replacement: fileURLToPath(new URL("./packages/core/src/index.ts", import.meta.url)),
      },
      {
        find: "@ai-tp/shared",
        replacement: fileURLToPath(new URL("./packages/shared/src/index.ts", import.meta.url)),
      },
    ],
  },
  test: {
    environment: "node",
    include: ["packages/**/*.test.ts", "tests/**/*.test.ts"],
    coverage: {
      reporter: ["text", "lcov"],
    },
  },
});
