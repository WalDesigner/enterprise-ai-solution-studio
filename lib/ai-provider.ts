import {
  createMockSolutionDraft,
  type AiErrorCategory,
  type AiProvider,
  type AiSolutionDraft,
  type AnalysisFormInput,
  type AnalysisProjectContext,
  type GenerateSolutionDraftResponse,
} from "@/lib/analysis-draft";
import {
  extractChatTextContent,
  parseAiDraft,
  REQUIRED_SECTION_TITLES,
} from "@/lib/ai-draft-parser";
import { fetchWithRetry } from "@/lib/provider-fetch";

type GenerateAnalysisDraftInput = {
  formState: AnalysisFormInput;
  projectContext: AnalysisProjectContext;
};

type OpenAITextResponse = {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
};

type ChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: unknown;
    };
  }>;
};

type GeminiGenerateContentResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
};

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const OPENROUTER_CHAT_URL = "https://openrouter.ai/api/v1/chat/completions";
const GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODELSCOPE_CHAT_URL =
  "https://api-inference.modelscope.cn/v1/chat/completions";
const GEMINI_GENERATE_CONTENT_BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta/models";

const DEFAULT_OPENAI_MODEL = "gpt-5.5-mini";
const DEFAULT_OPENROUTER_MODEL = "openrouter/free";
const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";
const DEFAULT_GROQ_MODEL = "llama-3.1-8b-instant";
const DEFAULT_MODELSCOPE_MODEL = "Qwen/Qwen3-30B-A3B-Instruct-2507";
const LEGACY_MODELSCOPE_MODEL = "Qwen/Qwen3-235B-A22B-Instruct-2507";
const PROVIDER_TIMEOUT_MS = 30_000;
const MODELSCOPE_MAX_ATTEMPTS = 2;
const MODELSCOPE_RETRY_DELAY_MS = 350;

const DRAFT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "title",
    "summary",
    "sections",
    "assumptions",
    "confidence",
    "nextStep",
  ],
  properties: {
    title: { type: "string" },
    summary: { type: "string" },
    sections: {
      type: "array",
      minItems: 6,
      maxItems: 6,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "content"],
        properties: {
          title: { type: "string" },
          content: { type: "string" },
        },
      },
    },
    assumptions: {
      type: "array",
      minItems: 2,
      maxItems: 4,
      items: { type: "string" },
    },
    confidence: { type: "string" },
    nextStep: { type: "string" },
  },
};

function buildPrompt(
  formState: AnalysisFormInput,
  projectContext: AnalysisProjectContext
) {
  return [
    "你是企业 AI 解决方案售前顾问。",
    "/no_think",
    "请根据客户需求表单生成一份结构化 AI 方案草案。",
    "不要输出思考过程、解释性前后缀或 markdown。",
    "输出必须是严格 JSON，不能包含 markdown。",
    "语言使用简体中文，语气专业、具体、可用于面试演示。",
    "不要虚构真实客户、真实上线结果、真实模型效果或真实 ROI。",
    "必须清楚体现：客户痛点、AI机会点、推荐方案、PoC范围、风险提示、下一步建议、假设和可信度。",
    "JSON 字段必须为：title, summary, sections, assumptions, confidence, nextStep。",
    `sections 必须包含 6 项，标题必须依次为：${REQUIRED_SECTION_TITLES.join("、")}。`,
    "",
    "当前表单输入：",
    JSON.stringify(formState, null, 2),
    "",
    "共享项目上下文：",
    JSON.stringify(projectContext, null, 2),
  ].join("\n");
}

function selectedProvider(): AiProvider {
  const configuredProvider = process.env.AI_PROVIDER?.toLowerCase();

  if (
    configuredProvider === "openai" ||
    configuredProvider === "openrouter" ||
    configuredProvider === "gemini" ||
    configuredProvider === "groq" ||
    configuredProvider === "modelscope" ||
    configuredProvider === "mock"
  ) {
    return configuredProvider;
  }

  return "mock";
}

function keyForProvider(provider: AiProvider) {
  switch (provider) {
    case "openai":
      return process.env.OPENAI_API_KEY;
    case "openrouter":
      return process.env.OPENROUTER_API_KEY;
    case "gemini":
      return process.env.GEMINI_API_KEY;
    case "groq":
      return process.env.GROQ_API_KEY;
    case "modelscope":
      return process.env.MODELSCOPE_API_KEY;
    case "mock":
      return undefined;
  }
}

function modelForProvider(provider: AiProvider) {
  switch (provider) {
    case "openai":
      return process.env.OPENAI_MODEL ?? DEFAULT_OPENAI_MODEL;
    case "openrouter":
      return process.env.OPENROUTER_MODEL ?? DEFAULT_OPENROUTER_MODEL;
    case "gemini":
      return process.env.GEMINI_MODEL ?? DEFAULT_GEMINI_MODEL;
    case "groq":
      return process.env.GROQ_MODEL ?? DEFAULT_GROQ_MODEL;
    case "modelscope": {
      const configuredModel = process.env.MODELSCOPE_MODEL;
      return !configuredModel || configuredModel === LEGACY_MODELSCOPE_MODEL
        ? DEFAULT_MODELSCOPE_MODEL
        : configuredModel;
    }
    case "mock":
      return "mock";
  }
}

function errorCategoryFromStatus(status: number): AiErrorCategory {
  if (status === 401 || status === 403) {
    return "unauthorized";
  }

  if (status === 400 || status === 404 || status === 422) {
    return "model_unavailable";
  }

  return "provider_error";
}

function isTimeoutError(error: unknown) {
  return (
    error instanceof Error &&
    (error.name === "TimeoutError" || error.name === "AbortError")
  );
}

function fallbackResult(
  input: GenerateAnalysisDraftInput,
  provider: AiProvider,
  errorCategory: AiErrorCategory,
  note: string
): GenerateSolutionDraftResponse {
  return {
    source: "mock-fallback",
    provider,
    errorCategory,
    draft: createMockSolutionDraft(input.formState, input.projectContext),
    note,
  };
}

function realResult(
  draft: AiSolutionDraft,
  provider: Exclude<AiProvider, "mock">
): GenerateSolutionDraftResponse {
  return {
    source: "real-ai",
    provider,
    errorCategory: null,
    draft,
    note: `已通过服务端 ${provider} 模型服务生成结构化 AI 方案草案。`,
  };
}

function extractOpenAIText(response: OpenAITextResponse) {
  if (response.output_text) {
    return response.output_text;
  }

  return (
    response.output
      ?.flatMap((item) => item.content ?? [])
      .map((content) => content.text)
      .find((text): text is string => Boolean(text)) ?? ""
  );
}

function extractChatText(response: ChatCompletionResponse) {
  return extractChatTextContent(response.choices?.[0]?.message?.content);
}

function extractGeminiText(response: GeminiGenerateContentResponse) {
  return (
    response.candidates
      ?.flatMap((candidate) => candidate.content?.parts ?? [])
      .map((part) => part.text)
      .find((text): text is string => Boolean(text)) ?? ""
  );
}

async function callOpenAI(input: GenerateAnalysisDraftInput, apiKey: string) {
  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: "POST",
    signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: modelForProvider("openai"),
      input: [
        {
          role: "system",
          content:
            "你是企业 AI 售前顾问，负责把客户需求转化为可验证的 AI 解决方案草案。",
        },
        {
          role: "user",
          content: buildPrompt(input.formState, input.projectContext),
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "enterprise_ai_solution_draft",
          strict: true,
          schema: DRAFT_SCHEMA,
        },
      },
    }),
  });

  if (!response.ok) {
    return {
      text: "",
      errorCategory: errorCategoryFromStatus(response.status),
      status: response.status,
    };
  }

  const payload = (await response.json()) as OpenAITextResponse;
  return { text: extractOpenAIText(payload), errorCategory: null, status: 200 };
}

async function callChatProvider(
  input: GenerateAnalysisDraftInput,
  provider: "openrouter" | "groq" | "modelscope",
  apiKey: string
) {
  const endpoint =
    provider === "openrouter"
      ? OPENROUTER_CHAT_URL
      : provider === "groq"
        ? GROQ_CHAT_URL
        : MODELSCOPE_CHAT_URL;

  const response = await fetchWithRetry(
    endpoint,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        ...(provider === "openrouter"
          ? {
              "HTTP-Referer":
                "https://enterprise-ai-solution-studio.netlify.app",
              "X-OpenRouter-Title": "企业 AI 解决方案工作台",
            }
          : {}),
      },
      body: JSON.stringify({
        model: modelForProvider(provider),
        messages: [
          {
            role: "system",
            content:
              "你是企业 AI 售前顾问，负责输出严格 JSON 格式的咨询方案草案。",
          },
          {
            role: "user",
            content: buildPrompt(input.formState, input.projectContext),
          },
        ],
        ...(provider === "modelscope"
          ? {}
          : { response_format: { type: "json_object" } }),
        temperature: 0.2,
        max_tokens: provider === "modelscope" ? 1600 : 1800,
      }),
    },
    {
      maxAttempts: provider === "modelscope" ? MODELSCOPE_MAX_ATTEMPTS : 1,
      retryDelayMs: MODELSCOPE_RETRY_DELAY_MS,
      timeoutMs: PROVIDER_TIMEOUT_MS,
    }
  );

  if (!response.ok) {
    return {
      text: "",
      errorCategory: errorCategoryFromStatus(response.status),
      status: response.status,
    };
  }

  const payload = (await response.json()) as ChatCompletionResponse;
  return { text: extractChatText(payload), errorCategory: null, status: 200 };
}

async function callGemini(input: GenerateAnalysisDraftInput, apiKey: string) {
  const model = encodeURIComponent(modelForProvider("gemini"));
  const response = await fetch(
    `${GEMINI_GENERATE_CONTENT_BASE_URL}/${model}:generateContent`,
    {
      method: "POST",
      signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
      headers: {
        "x-goog-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: buildPrompt(input.formState, input.projectContext),
              },
            ],
          },
        ],
        generationConfig: {
          responseFormat: {
            text: {
              mimeType: "application/json",
              schema: DRAFT_SCHEMA,
            },
          },
          temperature: 0.2,
          maxOutputTokens: 1800,
        },
      }),
    }
  );

  if (!response.ok) {
    return {
      text: "",
      errorCategory: errorCategoryFromStatus(response.status),
      status: response.status,
    };
  }

  const payload = (await response.json()) as GeminiGenerateContentResponse;
  return { text: extractGeminiText(payload), errorCategory: null, status: 200 };
}

export async function generateAnalysisDraft(
  input: GenerateAnalysisDraftInput
): Promise<GenerateSolutionDraftResponse> {
  const provider = selectedProvider();

  if (provider === "mock") {
    return fallbackResult(
      input,
      "mock",
      "missing_key",
      "未配置 AI 模型服务，已使用模拟兜底，公开 Demo 仍可正常演示。"
    );
  }

  const apiKey = keyForProvider(provider);

  if (!apiKey) {
    return fallbackResult(
      input,
      provider,
      "missing_key",
      `当前 AI_PROVIDER=${provider}，但缺少对应 API key，已自动切换为模拟兜底。`
    );
  }

  try {
    const result =
      provider === "openai"
        ? await callOpenAI(input, apiKey)
        : provider === "gemini"
          ? await callGemini(input, apiKey)
          : await callChatProvider(input, provider, apiKey);

    if (result.errorCategory) {
      return fallbackResult(
        input,
        provider,
        result.errorCategory,
        `${provider} 模型服务返回 ${result.status}，已自动切换为模拟兜底。`
      );
    }

    const draft = parseAiDraft(result.text);

    if (!draft) {
      return fallbackResult(
        input,
        provider,
        "provider_error",
        `${provider} 模型服务返回内容未通过结构化解析，已自动切换为模拟兜底。`
      );
    }

    return realResult(draft, provider);
  } catch (error) {
    const errorCategory: AiErrorCategory = isTimeoutError(error)
      ? "timeout"
      : "network_error";

    return fallbackResult(
      input,
      provider,
      errorCategory,
      errorCategory === "timeout"
        ? `${provider} 模型服务未在 ${PROVIDER_TIMEOUT_MS / 1000} 秒内完成，已自动切换为模拟兜底。`
        : `${provider} 模型服务请求失败，已自动切换为模拟兜底，保证 Demo 可继续使用。`
    );
  }
}
