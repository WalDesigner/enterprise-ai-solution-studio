import assert from "node:assert/strict";
import test from "node:test";

import {
  fetchWithRetry,
  isRetryableProviderStatus,
} from "../../lib/provider-fetch.ts";

const retryOptions = {
  maxAttempts: 2,
  retryDelayMs: 0,
  timeoutMs: 1_000,
};

test("classifies transient provider statuses as retryable", () => {
  assert.equal(isRetryableProviderStatus(408), true);
  assert.equal(isRetryableProviderStatus(429), true);
  assert.equal(isRetryableProviderStatus(503), true);
  assert.equal(isRetryableProviderStatus(401), false);
  assert.equal(isRetryableProviderStatus(422), false);
});

test("retries one transient network failure", async () => {
  let calls = 0;
  const fetcher = async () => {
    calls += 1;

    if (calls === 1) {
      throw new TypeError("fetch failed");
    }

    return new Response("{}", { status: 200 });
  };

  const response = await fetchWithRetry(
    "https://example.com/chat",
    { method: "POST" },
    retryOptions,
    fetcher
  );

  assert.equal(response.status, 200);
  assert.equal(calls, 2);
});

test("retries a transient provider status but not an authorization error", async () => {
  let transientCalls = 0;
  const transientFetcher = async () => {
    transientCalls += 1;
    return new Response("{}", {
      status: transientCalls === 1 ? 503 : 200,
    });
  };

  const recoveredResponse = await fetchWithRetry(
    "https://example.com/chat",
    { method: "POST" },
    retryOptions,
    transientFetcher
  );

  let unauthorizedCalls = 0;
  const unauthorizedFetcher = async () => {
    unauthorizedCalls += 1;
    return new Response("{}", { status: 401 });
  };

  const unauthorizedResponse = await fetchWithRetry(
    "https://example.com/chat",
    { method: "POST" },
    retryOptions,
    unauthorizedFetcher
  );

  assert.equal(recoveredResponse.status, 200);
  assert.equal(transientCalls, 2);
  assert.equal(unauthorizedResponse.status, 401);
  assert.equal(unauthorizedCalls, 1);
});
