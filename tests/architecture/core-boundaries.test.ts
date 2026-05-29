import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const forbidden = ["next", "react", "drizzle-orm", "postgres", "@ai-tp/providers-mock"];

describe("core architecture boundaries", () => {
  it("does not import adapter or framework modules", () => {
    const files = listTsFiles("packages/core/src").filter((file) => !file.endsWith(".test.ts"));
    const violations = files.flatMap((file) => {
      const source = readFileSync(file, "utf8");
      return forbidden
        .filter((token) => source.includes(`from "${token}`))
        .map((token) => `${file}: ${token}`);
    });
    expect(violations).toEqual([]);
  });
});

const listTsFiles = (dir: string): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? listTsFiles(path) : path.endsWith(".ts") ? [path] : [];
  });
