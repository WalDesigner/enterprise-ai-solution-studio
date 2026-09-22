// These are errors from our application/gateway, not upstream model errors.
export function analysisRequestFailure(status: number) {
  if (status === 429) return {
    category: "rate_limited" as const,
    note: "请求过于频繁，请稍后重试。本次为模拟示例，不是真实 AI 结果。",
  };
  if (status === 400 || status === 413 || status === 422) return {
    category: "invalid_request" as const,
    note: "需求输入格式不正确或内容过长，请检查输入。本次为模拟示例，不是真实 AI 结果。",
  };
  return {
    category: "provider_error" as const,
    note: "生成服务暂时不可用，请稍后重试。本次为模拟示例，不是真实 AI 结果。",
  };
}
