import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^@lakatos\/pabst\/runtime$/,
        replacement: fileURLToPath(
          new URL("./src/runtime.ts", import.meta.url),
        ),
      },
      {
        // pabst from source; a vitest child, which runs generated tests
        // with no aliases, resolves dist/ by the package's own name.
        find: /^@lakatos\/pabst$/,
        replacement: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
      },
    ],
  },
  test: {
    include: ["tests/**/*.test.ts"],
    // The bin suites spawn dist/cli.js, so one build before any file runs.
    globalSetup: [
      fileURLToPath(new URL("./tests/global-setup.ts", import.meta.url)),
    ],
    coverage: {
      provider: "v8",
      all: true,
      include: ["src/**/*.ts"],
      exclude: ["**/*.d.ts"],
      reporter: ["text", "html"],
      thresholds: {
        // Ratchet: vitest raises these on local runs; CI only enforces.
        autoUpdate: true,
        statements: 100,
        branches: 98.17,
        functions: 100,
        lines: 100,
      },
    },
  },
});
