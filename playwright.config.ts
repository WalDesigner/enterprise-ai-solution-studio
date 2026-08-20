import { defineConfig } from "@playwright/test";

const baseURL = process.env.QA_BASE_URL ?? "http://127.0.0.1:3100";

export default defineConfig({
  testDir: "./tests/browser",
  outputDir: "test-results/playwright",
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL,
    channel: "chrome",
    viewport: { width: 1440, height: 1000 },
    trace: "retain-on-failure",
  },
  webServer: process.env.QA_BASE_URL
    ? undefined
    : {
        command: "HOSTNAME=127.0.0.1 PORT=3100 npm run start",
        url: baseURL,
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
