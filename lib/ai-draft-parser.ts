import type {
  AiSolutionDraft,
  AiSolutionDraftSection,
} from "./analysis-draft";

export const REQUIRED_SECTION_TITLES = [
  "客户痛点总结",
  "AI机会点分析",
  "推荐AI方案",
  "PoC验证范围",
  "风险提示",
  "ROI假设",
] as const;

const DEFAULT_ASSUMPTIONS = [
  "当前草案基于模型返回内容自动整理。",
  "真实 ROI 和上线效果仍需在 PoC 后用业务指标校准。",
] as const;

const SECTION_KEY_MAP: Array<{
  aliases: readonly string[];
  keys: readonly string[];
  title: (typeof REQUIRED_SECTION_TITLES)[number];
}> = [
  {
    title: "客户痛点总结",
    aliases: ["客户痛点总结", "客户痛点", "痛点总结"],
    keys: ["painPoints", "customerPainPoints", "painPointSummary", "客户痛点总结"],
  },
  {
    title: "AI机会点分析",
    aliases: ["AI机会点分析", "AI机会点", "机会点分析"],
    keys: ["aiOpportunities", "opportunityAnalysis", "AI机会点分析"],
  },
  {
    title: "推荐AI方案",
    aliases: ["推荐AI方案", "推荐方案", "AI方案"],
    keys: ["recommendedSolution", "solution", "推荐AI方案"],
  },
  {
    title: "PoC验证范围",
    aliases: ["PoC验证范围", "PoC范围", "验证范围"],
    keys: ["pocScope", "pocPlan", "PoC验证范围"],
  },
  {
    title: "风险提示",
    aliases: ["风险提示", "风险"],
    keys: ["risks", "risk", "风险提示"],
  },
  {
    title: "ROI假设",
    aliases: ["ROI假设", "ROI"],
    keys: ["roiAssumptions", "roi", "ROI假设"],
  },
];

function removeThinkBlocks(text: string) {
  return text
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/<think>[\s\S]*$/gi, "")
    .trim();
}

function stripCodeFence(text: string) {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function extractJsonCandidates(text: string) {
  const normalizedText = stripCodeFence(text);
  const candidates = [normalizedText];
  const jsonStart = normalizedText.indexOf("{");
  const jsonEnd = normalizedText.lastIndexOf("}");

  if (jsonStart >= 0 && jsonEnd > jsonStart) {
    candidates.push(normalizedText.slice(jsonStart, jsonEnd + 1));
  }

  return [...new Set(candidates)].flatMap((candidate) => {
    const withoutTrailingCommas = candidate.replace(/,\s*([}\]])/g, "$1");
    return candidate === withoutTrailingCommas
      ? [candidate]
      : [candidate, withoutTrailingCommas];
  });
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function asText(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value
      .map((item) => asText(item))
      .filter(Boolean)
      .join("；");
  }

  const record = asRecord(value);
  if (record) {
    return Object.values(record)
      .map((item) => asText(item))
      .filter(Boolean)
      .join("；");
  }

  return "";
}

function firstTextField(record: Record<string, unknown>, keys: readonly string[]) {
  for (const key of keys) {
    const value = asText(record[key]);
    if (value) return value;
  }

  return "";
}

function canonicalSectionTitle(value: string) {
  const normalizedValue = value.replace(/[\s:：\-_/]/g, "").toLowerCase();

  return SECTION_KEY_MAP.find(({ aliases }) =>
    aliases.some((alias) =>
      normalizedValue.includes(alias.replace(/[\s:：\-_/]/g, "").toLowerCase())
    )
  )?.title;
}

function normalizeArraySections(value: unknown[]) {
  const parsedSections = value
    .map((item, index) => {
      if (typeof item === "string") {
        const content = item.trim();
        return content
          ? {
              canonicalTitle: undefined,
              content,
              title: REQUIRED_SECTION_TITLES[index] ?? `方案章节 ${index + 1}`,
            }
          : null;
      }

      const record = asRecord(item);
      if (!record) return null;

      const title =
        firstTextField(record, ["title", "heading", "name", "sectionTitle"]) ||
        REQUIRED_SECTION_TITLES[index] ||
        `方案章节 ${index + 1}`;
      const content = firstTextField(record, [
        "content",
        "description",
        "summary",
        "detail",
        "text",
        "value",
      ]);

      return content
        ? {
            canonicalTitle: canonicalSectionTitle(title),
            content,
            title,
          }
        : null;
    })
    .filter(
      (
        section
      ): section is {
        canonicalTitle: (typeof REQUIRED_SECTION_TITLES)[number] | undefined;
        content: string;
        title: string;
      } => Boolean(section)
    );

  const sectionsByTitle = new Map(
    parsedSections
      .filter((section) => section.canonicalTitle)
      .map((section) => [section.canonicalTitle, section.content] as const)
  );

  if (
    REQUIRED_SECTION_TITLES.every((title) => sectionsByTitle.has(title))
  ) {
    return REQUIRED_SECTION_TITLES.map((title) => ({
      title,
      content: sectionsByTitle.get(title) as string,
    }));
  }

  return parsedSections
    .slice(0, REQUIRED_SECTION_TITLES.length)
    .map((section, index) => ({
      title: REQUIRED_SECTION_TITLES[index],
      content: section.content,
    }));
}

function normalizeSections(value: unknown): AiSolutionDraftSection[] {
  if (Array.isArray(value)) {
    return normalizeArraySections(value);
  }

  const record = asRecord(value);
  if (!record) return [];

  return SECTION_KEY_MAP.flatMap(({ title, keys }) => {
    const content = firstTextField(record, keys);
    return content ? [{ title, content }] : [];
  });
}

function normalizeAssumptions(value: unknown) {
  const assumptions = Array.isArray(value)
    ? value.map((item) => asText(item)).filter(Boolean).slice(0, 4)
    : asText(value)
        .split(/[；;\n]/)
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 4);

  for (const defaultAssumption of DEFAULT_ASSUMPTIONS) {
    if (assumptions.length >= 2) break;
    if (!assumptions.includes(defaultAssumption)) {
      assumptions.push(defaultAssumption);
    }
  }

  return assumptions;
}

function normalizeDraftRecord(record: Record<string, unknown>) {
  const sections = normalizeSections(record.sections ?? record);

  if (
    sections.length !== REQUIRED_SECTION_TITLES.length ||
    sections.some((section) => !section.content.trim())
  ) {
    return null;
  }

  return {
    title:
      firstTextField(record, ["title", "name", "方案标题"]) || "AI方案草案",
    summary:
      firstTextField(record, ["summary", "overview", "摘要", "方案摘要"]) ||
      "已根据当前客户输入生成可用于售前沟通的 AI 方案草案。",
    sections,
    assumptions: normalizeAssumptions(
      record.assumptions ??
        record.keyAssumptions ??
        record.riskAssumptions ??
        record.关键假设
    ),
    confidence:
      firstTextField(record, ["confidence", "confidenceLevel", "可信度"]) ||
      "中等：模型已返回完整方案内容，仍需售前顾问复核。",
    nextStep:
      firstTextField(record, [
        "nextStep",
        "nextSteps",
        "nextAction",
        "下一步",
      ]) || "进入 AI 方案页面，细化 PoC 范围和验证指标。",
  } satisfies AiSolutionDraft;
}

function normalizeDraft(parsed: unknown): AiSolutionDraft | null {
  const record = asRecord(parsed);
  if (!record) return null;

  const nestedRecords = [
    record,
    asRecord(record.draft),
    asRecord(record.data),
    asRecord(record.result),
    asRecord(record.output),
  ].filter((item): item is Record<string, unknown> => Boolean(item));

  for (const candidate of nestedRecords) {
    const draft = normalizeDraftRecord(candidate);
    if (draft) return draft;
  }

  return null;
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseMarkdownDraft(text: string): AiSolutionDraft | null {
  const normalizedText = stripCodeFence(removeThinkBlocks(text))
    .replace(/\r\n/g, "\n")
    .trim();

  if (!normalizedText) return null;

  const sectionMatches = REQUIRED_SECTION_TITLES.map((title) => {
    const aliases =
      SECTION_KEY_MAP.find((section) => section.title === title)?.aliases ?? [
        title,
      ];
    const pattern = new RegExp(
      `(?:^|\\n)\\s*(?:#{1,4}\\s*)?(?:\\d+[.、]\\s*)?(?:\\*\\*)?(?:${aliases
        .map((alias) => escapeRegex(alias))
        .join("|")})(?:\\*\\*)?\\s*[:：]?\\s*\\n?`,
      "i"
    );
    const match = normalizedText.match(pattern);
    return match?.index === undefined
      ? null
      : {
          title,
          index: match.index,
          end: match.index + match[0].length,
        };
  });

  if (sectionMatches.some((match) => !match)) return null;

  const orderedMatches = (
    sectionMatches as Array<{
      title: (typeof REQUIRED_SECTION_TITLES)[number];
      index: number;
      end: number;
    }>
  ).sort((left, right) => left.index - right.index);

  const sectionsByTitle = new Map(
    orderedMatches.map((match, index) => {
      const next = orderedMatches[index + 1];
      const content = normalizedText
        .slice(match.end, next ? next.index : normalizedText.length)
        .replace(
          /(?:^|\n)\s*(?:#{1,4}\s*)?(?:关键假设|可信度|下一步)[\s\S]*$/i,
          ""
        )
        .replace(/^[-*]\s*/gm, "")
        .trim();

      return [match.title, content] as const;
    })
  );

  if (
    REQUIRED_SECTION_TITLES.some(
      (title) => !sectionsByTitle.get(title)?.trim()
    )
  ) {
    return null;
  }

  const firstSectionIndex = Math.min(
    ...orderedMatches.map((match) => match.index)
  );
  const summary = normalizedText
    .slice(0, firstSectionIndex)
    .replace(/^#+\s*/gm, "")
    .replace(/^[-*]\s*/gm, "")
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(-2)
    .join(" ");

  return {
    title: "AI方案草案",
    summary:
      summary || "已根据当前客户输入生成可用于售前沟通的 AI 方案草案。",
    sections: REQUIRED_SECTION_TITLES.map((title) => ({
      title,
      content: sectionsByTitle.get(title) as string,
    })),
    assumptions: [...DEFAULT_ASSUMPTIONS],
    confidence: "中等：模型已返回可用方案内容，但仍需售前顾问复核。",
    nextStep:
      "进入 AI 方案设计页，细化模型、RAG、Agent 工作流和 PoC 验证指标。",
  };
}

export function extractChatTextContent(content: unknown) {
  if (typeof content === "string") return content.trim();

  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === "string") return item.trim();
        const record = asRecord(item);
        return record
          ? firstTextField(record, ["text", "content", "value"])
          : "";
      })
      .filter(Boolean)
      .join("\n");
  }

  const record = asRecord(content);
  return record ? JSON.stringify(record) : "";
}

export function parseAiDraft(text: string): AiSolutionDraft | null {
  const cleanedText = removeThinkBlocks(text);

  for (const candidate of extractJsonCandidates(cleanedText)) {
    try {
      const draft = normalizeDraft(JSON.parse(candidate));
      if (draft) return draft;
    } catch {
      // Try the next extraction strategy, then fall back to markdown parsing.
    }
  }

  return parseMarkdownDraft(cleanedText);
}
