import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    globals: true,
    // Sandboxed dev environments block worker-thread IPC; forks + no parallelism is reliable.
    pool: "forks",
    fileParallelism: false,
    isolate: false,
  },
});
