import assert from "node:assert/strict";
import test from "node:test";
import { analysisRequestFailure } from "../../lib/analysis-request-error.ts";
import { DEFAULT_MODELSCOPE_MODEL, resolveModelScopeModel, classifyProviderFailure, readProviderFailure } from "../../lib/provider-policy.ts";

test("migrates legacy defaults while respecting an explicit current model", () => {
  for (const model of [undefined, "", "Qwen/Qwen3-30B-A3B-Instruct-2507", "Qwen/Qwen3-235B-A22B-Instruct-2507"]) {
    assert.equal(resolveModelScopeModel(model), DEFAULT_MODELSCOPE_MODEL);
  }
  assert.equal(resolveModelScopeModel(" custom/model "), "custom/model");
});

test("application HTTP failures are not mislabeled as network failures", () => {
  assert.equal(analysisRequestFailure(429).category, "rate_limited");
  assert.equal(analysisRequestFailure(413).category, "invalid_request");
  assert.equal(analysisRequestFailure(503).category, "provider_error");
});

test("distinguishes request, model, authentication, quota and rate failures", () => {
  assert.equal(classifyProviderFailure(400, {error:{message:"model does not exist"}}), "model_unavailable");
  assert.equal(classifyProviderFailure(400, {error:{message:"enable_thinking must be false"}}), "invalid_request");
  assert.equal(classifyProviderFailure(400, {error:{code:"quota_exhausted"}}), "quota_exhausted");
  assert.equal(classifyProviderFailure(401, {}), "unauthorized");
  assert.equal(classifyProviderFailure(429, {}), "rate_limited");
  assert.equal(classifyProviderFailure(503, {}), "provider_error");
});

test("upstream error details never escape the classifier", async () => {
  const result = await readProviderFailure(new Response(JSON.stringify({error:{message:"invalid parameter SECRET_TEST_SENTINEL"}}), {status:400}));
  assert.equal(result, "invalid_request");
  assert.ok(!result.includes("SECRET_TEST_SENTINEL"));
  assert.equal(await readProviderFailure(new Response("<html>gateway</html>", {status:503})), "provider_error");
  assert.equal(await readProviderFailure(new Response("x".repeat(9000), {status:400})), "invalid_request");
});
