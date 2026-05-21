import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // react() transforms TSX (tsconfig sets jsx:"preserve" for Next, which vite's
  // esbuild won't transform on its own).
  plugins: [tsconfigPaths(), react()],
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
