// The managed API catalog changes independently of this application's releases.
export const DEFAULT_MODELSCOPE_MODEL = "Qwen/Qwen3.5-35B-A3B";

export function resolveModelScopeModel(configured?: string) {
  const model = configured?.trim();
  if (!model || [
    "Qwen/Qwen3-235B-A22B-Instruct-2507",
    "Qwen/Qwen3-30B-A3B-Instruct-2507",
  ].includes(model)) return DEFAULT_MODELSCOPE_MODEL;
  return model;
}

export type ProviderFailure =
  | "unauthorized" | "model_unavailable" | "invalid_request"
  | "rate_limited" | "quota_exhausted" | "provider_error";

// Inspect only to classify; never return or log upstream text (it may echo secrets).
export function classifyProviderFailure(status: number, payload: unknown): ProviderFailure {
  const object = payload && typeof payload === "object" ? payload as Record<string, unknown> : {};
  const nested = object.error ?? object.errors;
  const error = nested && typeof nested === "object" && !Array.isArray(nested)
    ? nested as Record<string, unknown> : object;
  const message = [error.code, error.type, error.message]
    .filter((value): value is string => typeof value === "string").join(" ").toLowerCase();
  if (status === 401) return "unauthorized";
  if (/quota|insufficient.?balance|credit|余额|额度/.test(message)) return "quota_exhausted";
  if (status === 403) return "unauthorized";
  if (status === 429) return "rate_limited";
  if (status === 404 || /model.*(not.?found|not.?exist|unavailable|not.?support|deprecated|offline)|模型.*(不存在|下线|不可用|不支持)/.test(message)) return "model_unavailable";
  if (status === 400 || status === 422) return "invalid_request";
  return "provider_error";
}

export const providerFailureHints: Record<ProviderFailure, string> = {
  unauthorized: "模型服务认证或权限失败，需要维护者检查授权。",
  model_unavailable: "当前模型不存在或不再提供服务，需要更换为可用模型。",
  invalid_request: "模型服务拒绝请求参数，需要维护者检查模型与参数兼容性。",
  rate_limited: "模型服务触发频率限制，请稍后再试。",
  quota_exhausted: "模型服务额度不足，需要维护者检查账户额度。",
  provider_error: "模型服务暂时异常，请稍后再试。",
};

export async function readProviderFailure(response: Response): Promise<ProviderFailure> {
  const reader = response.body?.getReader();
  if (!reader) return classifyProviderFailure(response.status, null);
  let text = "";
  let bytes = 0;
  const decoder = new TextDecoder();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 8192) return classifyProviderFailure(response.status, null);
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    return classifyProviderFailure(response.status, JSON.parse(text));
  } catch {
    return classifyProviderFailure(response.status, null);
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}
