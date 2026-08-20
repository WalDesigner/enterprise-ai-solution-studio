import assert from "node:assert/strict";
import test from "node:test";

import {
  extractChatTextContent,
  parseAiDraft,
  REQUIRED_SECTION_TITLES,
} from "../../lib/ai-draft-parser.ts";

const completeSections = REQUIRED_SECTION_TITLES.map((title, index) => ({
  title,
  content: `第 ${index + 1} 个章节内容`,
}));

test("parses a strict JSON draft", () => {
  const draft = parseAiDraft(
    JSON.stringify({
      title: "制造业 AI 方案",
      summary: "围绕售后知识与工单分流建立 PoC。",
      sections: completeSections,
      assumptions: ["数据已脱敏。", "业务指标可获取。"],
      confidence: "高",
      nextStep: "进入方案设计。",
    })
  );

  assert.equal(draft?.title, "制造业 AI 方案");
  assert.equal(draft?.sections.length, 6);
  assert.deepEqual(
    draft?.sections.map((section) => section.title),
    REQUIRED_SECTION_TITLES
  );
});

test("removes thinking text, fences and trailing commas", () => {
  const draft = parseAiDraft(`
<think>这里是不会展示的思考过程。</think>
以下是方案：
\`\`\`json
{
  "draft": {
    "title": "带前后缀的方案",
    "summary": "返回内容包含解释文字和代码围栏。",
    "sections": ${JSON.stringify(completeSections)},
    "assumptions": ["数据可用。", "需要人工复核。"],
    "confidence": "中等",
    "nextStep": "进入 PoC。",
  },
}
\`\`\`
`);

  assert.equal(draft?.title, "带前后缀的方案");
  assert.equal(draft?.sections.length, 6);
});

test("normalizes Chinese object fields and fills safe metadata defaults", () => {
  const draft = parseAiDraft(
    JSON.stringify({
      方案标题: "中文字段方案",
      方案摘要: "模型使用中文字段返回结果。",
      客户痛点总结: "售后知识分散。",
      AI机会点分析: "可构建知识增强检索。",
      推荐AI方案: "采用知识库与 Agent 分流。",
      PoC验证范围: "验证高频问题与历史工单。",
      风险提示: "保留人工复核与权限边界。",
      ROI假设: "PoC 后校准人效收益。",
    })
  );

  assert.equal(draft?.title, "中文字段方案");
  assert.equal(draft?.assumptions.length, 2);
  assert.match(draft?.confidence ?? "", /中等/);
  assert.match(draft?.nextStep ?? "", /AI 方案/);
});

test("reorders section arrays by recognized headings", () => {
  const reversedSections = [...completeSections]
    .reverse()
    .map((section) => ({
      heading: section.title,
      description: section.content,
    }));
  const draft = parseAiDraft(
    JSON.stringify({
      summary: "章节顺序不稳定。",
      sections: reversedSections,
    })
  );

  assert.deepEqual(
    draft?.sections.map((section) => section.title),
    REQUIRED_SECTION_TITLES
  );
  assert.equal(draft?.sections[0]?.content, "第 1 个章节内容");
});

test("parses a six-section Markdown response", () => {
  const draft = parseAiDraft(`
# 天津汽车零部件企业 AI 方案
以下为可用于售前沟通的建议。

## 客户痛点
售后知识分散，工单响应不稳定。

## AI机会点
将产品资料与历史工单形成检索增强知识源。

## 推荐方案
采用 ModelScope 模型、RAG 与 Agent 分流。

## PoC范围
用两周验证高频问题命中率和工单分流效率。

## 风险
数据需脱敏，关键结论保留人工确认。

## ROI
PoC 后基于响应时长和人效指标校准。
`);

  assert.equal(draft?.sections.length, 6);
  assert.deepEqual(
    draft?.sections.map((section) => section.title),
    REQUIRED_SECTION_TITLES
  );
});

test("rejects content that cannot produce all six business sections", () => {
  const draft = parseAiDraft(
    JSON.stringify({
      summary: "内容不完整。",
      sections: completeSections.slice(0, 5),
    })
  );

  assert.equal(draft, null);
});

test("extracts string, array and object chat-completion content", () => {
  assert.equal(extractChatTextContent("  文本内容  "), "文本内容");
  assert.equal(
    extractChatTextContent([
      { type: "text", text: "第一段" },
      { type: "text", content: "第二段" },
    ]),
    "第一段\n第二段"
  );
  assert.equal(
    extractChatTextContent({ title: "对象形式", sections: completeSections }),
    JSON.stringify({ title: "对象形式", sections: completeSections })
  );
});
