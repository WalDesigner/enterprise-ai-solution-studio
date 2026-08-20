"use client";

import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  ClipboardList,
  Database,
  LoaderCircle,
  Network,
  Save,
  Target,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { WorkspaceShell } from "@/components/workspace-shell";
import { useWorkspaceProject } from "@/components/workspace-provider";
import {
  createMockSolutionDraft,
  type AiErrorCategory,
  type AiGenerationSource,
  type AiProvider,
  type AiSolutionDraft,
  type AnalysisFormInput,
  type AnalysisProjectContext,
  type GenerateSolutionDraftResponse,
} from "@/lib/analysis-draft";

type AnalysisFormState = AnalysisFormInput;

function getGenerationStage(elapsedSeconds: number) {
  if (elapsedSeconds < 4) {
    return "正在整理客户需求与项目上下文";
  }

  if (elapsedSeconds < 12) {
    return "正在请求模型服务生成咨询草案";
  }

  return "正在校验章节、假设与下一步建议";
}

function GenerationProgress({ elapsedSeconds }: { elapsedSeconds: number }) {
  const stage = getGenerationStage(elapsedSeconds);

  return (
    <div
      aria-live="polite"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl rounded-2xl border border-violet-200 bg-white/95 p-4 shadow-2xl backdrop-blur sm:inset-x-6 lg:left-[292px] lg:right-6"
      data-testid="generation-status"
      role="status"
    >
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
          <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-950">
              AI 正在生成方案草案
            </p>
            <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium tabular-nums text-slate-600">
              {elapsedSeconds}s
            </span>
          </div>
          <p className="mt-1 text-xs leading-5 text-slate-600">{stage}</p>
          <div
            aria-label="AI 方案生成进度"
            aria-valuetext={stage}
            className="mt-3 h-1.5 overflow-hidden rounded-full bg-violet-100"
            role="progressbar"
          >
            <span className="ai-progress-indicator block h-full w-1/2 rounded-full bg-violet-600" />
          </div>
          <p className="mt-2 text-[11px] leading-4 text-slate-500">
            通常需要 10–30 秒。生成完成后会自动保存，并同步到 AI 方案页面。
          </p>
        </div>
      </div>
    </div>
  );
}

function buildFormSections(project: {
  customerName: string;
  industry: string;
  companySize: string;
  department: string;
  painPoints: readonly string[];
  existingSystems: readonly string[];
  dataSituation: string;
  aiGoals: readonly string[];
  timeline: string;
  budgetRange: string;
}) {
  return [
    {
      title: "客户基本信息",
      description: "用于判断行业场景、组织规模和主要业务责任方。",
      fields: [
        { key: "customerName", label: "客户名称", placeholder: project.customerName },
        { key: "industry", label: "所属行业", placeholder: project.industry },
        { key: "companySize", label: "企业规模", placeholder: project.companySize },
        { key: "department", label: "业务部门", placeholder: project.department },
      ],
    },
    {
      title: "现状与约束",
      description: "用于识别 AI 落地阻力、数据基础和系统集成复杂度。",
      fields: [
        { key: "painPoints", label: "当前痛点", placeholder: project.painPoints.join("；") },
        { key: "existingSystems", label: "现有系统", placeholder: project.existingSystems.join("、") },
        { key: "dataSituation", label: "数据情况", placeholder: project.dataSituation },
      ],
    },
    {
      title: "目标与资源",
      description: "用于估算 PoC 范围、上线节奏和 ROI 汇报口径。",
      fields: [
        { key: "aiGoals", label: "AI落地目标", placeholder: project.aiGoals.join("；") },
        { key: "timeline", label: "期望上线周期", placeholder: project.timeline },
        { key: "budgetRange", label: "预算范围", placeholder: project.budgetRange },
      ],
    },
  ] as const;
}

const opportunities = [
  {
    title: "可自动化流程",
    description: "适合先梳理重复查询、工单分流、线索评分等高频流程。",
    icon: ClipboardList,
  },
  {
    title: "可构建知识库",
    description: "可将产品手册、历史工单、销售材料沉淀为 RAG 知识源。",
    icon: Database,
  },
  {
    title: "可引入Agent工作流",
    description: "适合连接 CRM、工单系统、消息工具和人工审批节点。",
    icon: Network,
  },
  {
    title: "可做ROI评估",
    description: "可围绕人效提升、响应时长、转化率和返工率建立指标。",
    icon: BrainCircuit,
  },
];

const providerLabels: Record<AiProvider, string> = {
  openai: "OpenAI",
  openrouter: "OpenRouter",
  gemini: "Gemini",
  groq: "Groq",
  modelscope: "ModelScope",
  mock: "模拟兜底",
};

const errorCategoryLabels: Record<Exclude<AiErrorCategory, null>, string> = {
  missing_key: "缺少 API key",
  unauthorized: "认证失败",
  model_unavailable: "模型不可用",
  provider_error: "模型服务错误",
  timeout: "服务超时",
  network_error: "网络错误",
};

function createInitialFormState(activeProject: ReturnType<typeof useWorkspaceProject>["activeProject"]) {
  return {
    customerName: activeProject.customerName,
    industry: activeProject.industry,
    companySize: activeProject.companySize,
    department: activeProject.department,
    painPoints: activeProject.painPoints.join("；"),
    existingSystems: activeProject.existingSystems.join("、"),
    dataSituation: activeProject.dataSituation,
    aiGoals: activeProject.aiGoals.join("；"),
    timeline: activeProject.timeline,
    budgetRange: activeProject.budgetRange,
  };
}

function createProjectContext(
  activeProject: ReturnType<typeof useWorkspaceProject>["activeProject"]
): AnalysisProjectContext {
  return {
    projectName: activeProject.projectName,
    customerName: activeProject.customerName,
    industry: activeProject.industry,
    companySize: activeProject.companySize,
    department: activeProject.department,
    painPoints: activeProject.painPoints,
    existingSystems: activeProject.existingSystems,
    dataSituation: activeProject.dataSituation,
    aiGoals: activeProject.aiGoals,
    budgetRange: activeProject.budgetRange,
    timeline: activeProject.timeline,
    aiOpportunities: activeProject.aiOpportunities,
    recommendedSolution: activeProject.recommendedSolution,
    pocPlan: activeProject.pocPlan,
  };
}

function AnalysisWorkspace({
  activeProject,
}: {
  activeProject: ReturnType<typeof useWorkspaceProject>["activeProject"];
}) {
  const {
    clearAnalysisSession,
    getAnalysisSession,
    isHydrated,
    saveAnalysisSession,
  } = useWorkspaceProject();
  const [showDraft, setShowDraft] = useState(false);
  const [draft, setDraft] = useState<AiSolutionDraft | null>(null);
  const [draftSource, setDraftSource] = useState<AiGenerationSource | null>(null);
  const [draftProvider, setDraftProvider] = useState<AiProvider | null>(null);
  const [draftErrorCategory, setDraftErrorCategory] =
    useState<AiErrorCategory>(null);
  const [draftNote, setDraftNote] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationSeconds, setGenerationSeconds] = useState(0);
  const [formState, setFormState] = useState(() =>
    createInitialFormState(activeProject)
  );
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const draftRef = useRef<HTMLElement | null>(null);
  const didHydrateSessionRef = useRef(false);
  const skipNextSaveRef = useRef(false);
  const generationTimerRef = useRef<number | null>(null);
  const projectContext = createProjectContext(activeProject);

  useEffect(() => {
    if (!isHydrated || didHydrateSessionRef.current) {
      return;
    }

    const storedSession = getAnalysisSession(activeProject.id);
    didHydrateSessionRef.current = true;
    skipNextSaveRef.current = true;

    if (storedSession) {
      window.queueMicrotask(() => {
        setFormState(storedSession.formState);
        setDraft(storedSession.draft);
        setDraftSource(storedSession.draftSource);
        setDraftProvider(storedSession.draftProvider);
        setDraftErrorCategory(storedSession.draftErrorCategory);
        setDraftNote(storedSession.draftNote);
        setShowDraft(Boolean(storedSession.draft));
        setLastSavedAt(storedSession.updatedAt);
      });
    }
  }, [activeProject.id, getAnalysisSession, isHydrated]);

  useEffect(() => {
    if (!isHydrated || !didHydrateSessionRef.current) {
      return;
    }

    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false;
      return;
    }

    const timeout = window.setTimeout(() => {
      saveAnalysisSession(activeProject.id, {
        formState,
        draft,
        draftSource,
        draftProvider,
        draftErrorCategory,
        draftNote,
      });
      setLastSavedAt(new Date().toISOString());
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [
    activeProject.id,
    draft,
    draftErrorCategory,
    draftNote,
    draftProvider,
    draftSource,
    formState,
    isHydrated,
    saveAnalysisSession,
  ]);

  useEffect(() => {
    if (!showDraft || !draft) {
      return;
    }

    draftRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [showDraft, draft]);

  useEffect(
    () => () => {
      if (generationTimerRef.current) {
        window.clearInterval(generationTimerRef.current);
      }
    },
    []
  );

  const updateField = <K extends keyof AnalysisFormState>(
    key: K,
    value: AnalysisFormState[K]
  ) => {
    setFormState((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const resetAnalysis = () => {
    clearAnalysisSession(activeProject.id);
    setFormState(createInitialFormState(activeProject));
    setDraft(null);
    setDraftSource(null);
    setDraftProvider(null);
    setDraftErrorCategory(null);
    setDraftNote("");
    setShowDraft(false);
    setLastSavedAt(null);
    skipNextSaveRef.current = true;
  };

  const generateDraft = async () => {
    setIsGenerating(true);
    setShowDraft(false);
    setGenerationSeconds(0);

    if (generationTimerRef.current) {
      window.clearInterval(generationTimerRef.current);
    }

    generationTimerRef.current = window.setInterval(() => {
      setGenerationSeconds((current) => current + 1);
    }, 1000);

    try {
      const response = await fetch("/api/analysis/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formState,
          projectContext,
        }),
      });

      if (!response.ok) {
        throw new Error("AI generation request failed.");
      }

      const result = (await response.json()) as GenerateSolutionDraftResponse;

      setDraft(result.draft);
      setDraftSource(result.source);
      setDraftProvider(result.provider);
      setDraftErrorCategory(result.errorCategory);
      setDraftNote(result.note);
      setShowDraft(true);
      saveAnalysisSession(activeProject.id, {
        formState,
        draft: result.draft,
        draftSource: result.source,
        draftProvider: result.provider,
        draftErrorCategory: result.errorCategory,
        draftNote: result.note,
      });
      setLastSavedAt(new Date().toISOString());
    } catch {
      const fallbackDraft = createMockSolutionDraft(formState, projectContext);
      const fallbackNote =
        "AI 生成请求失败，已自动使用模拟兜底，公开 Demo 仍可继续演示。";

      setDraft(fallbackDraft);
      setDraftSource("mock-fallback");
      setDraftProvider("mock");
      setDraftErrorCategory("network_error");
      setDraftNote(fallbackNote);
      setShowDraft(true);
      saveAnalysisSession(activeProject.id, {
        formState,
        draft: fallbackDraft,
        draftSource: "mock-fallback",
        draftProvider: "mock",
        draftErrorCategory: "network_error",
        draftNote: fallbackNote,
      });
      setLastSavedAt(new Date().toISOString());
    } finally {
      if (generationTimerRef.current) {
        window.clearInterval(generationTimerRef.current);
        generationTimerRef.current = null;
      }
      setIsGenerating(false);
    }
  };

  const formSections = buildFormSections(activeProject);

  return (
    <WorkspaceShell
      activeNav="analysis"
      breadcrumb="需求分析 / 售前调研"
      title="AI 需求分析模块"
      subtitle="将客户背景、现有系统、数据基础和落地目标整理为可沟通的售前输入，为后续 AI 方案、PoC 范围和 ROI 评估打基础。"
      badge={`当前项目：${activeProject.projectName}`}
      backHref="/"
      backLabel="返回仪表盘"
    >
      <div className="flex min-w-0 flex-col gap-5">
        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="grid min-w-0 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="min-w-0 p-5 sm:p-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                <Target className="size-3.5" aria-hidden="true" />
                咨询判断
              </div>
              <h2 className="mt-4 max-w-3xl text-2xl font-semibold tracking-normal text-slate-950">
                当前客户主要问题集中在售后知识分散、重复咨询高、跨部门响应慢。
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                建议优先进入 AI 知识库 + Agent 分流 PoC 验证，用高频售后问题、历史工单和销售线索数据先证明业务价值，再扩大到部署规划与 ROI 汇报。
              </p>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {activeProject.painPoints.map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <div className="flex gap-2">
                      <CheckCircle2
                        className="mt-0.5 size-4 shrink-0 text-emerald-600"
                        aria-hidden="true"
                      />
                      <p className="text-sm font-medium leading-6 text-slate-800">
                        {item}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="border-t border-slate-200 bg-slate-950 p-5 text-white sm:p-6 lg:border-l lg:border-t-0">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <BrainCircuit className="size-4" aria-hidden="true" />
                推荐下一步
              </div>
              <h3 className="mt-4 text-xl font-semibold tracking-normal">
                先生成 AI 方案草案
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                当前输入已经足够支撑售前方案初稿。配置 ModelScope、OpenRouter、Gemini、Groq 或 OpenAI 模型服务后可生成真实 AI 咨询草案；未配置时自动使用模拟兜底。
              </p>
              <button
                aria-describedby={isGenerating ? "generation-help" : undefined}
                className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-medium text-slate-950 transition-colors hover:bg-slate-200 disabled:cursor-wait disabled:opacity-90"
                disabled={isGenerating}
                onClick={generateDraft}
                type="button"
              >
                {isGenerating ? (
                  <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <ArrowRight className="size-4" aria-hidden="true" />
                )}
                {isGenerating
                  ? `AI 生成中 · ${generationSeconds}s`
                  : "生成AI方案草案"}
              </button>
            </aside>
          </div>

          <div className="grid border-t border-slate-100 bg-slate-50/70 md:grid-cols-4">
            {opportunities.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="min-w-0 border-b border-slate-100 p-4 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white text-slate-700 shadow-sm">
                      <Icon className="size-4" aria-hidden="true" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-950">
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <div
          aria-busy={isGenerating}
          id="analysis-form"
          className="flex scroll-mt-6 flex-col gap-5"
        >
          <div className="flex flex-col gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-700 shadow-sm">
                <Save className="size-4" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-950">
                  当前项目自动保存
                </p>
                <p className="text-xs leading-5 text-emerald-700">
                  {lastSavedAt
                    ? `已保存于 ${new Date(lastSavedAt).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}，刷新或切换页面后仍可继续。`
                    : "输入内容将保存到当前浏览器，不上传客户数据。"}
                </p>
              </div>
            </div>
            <button
              className="text-left text-xs font-medium text-emerald-800 underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:opacity-50 sm:text-right"
              disabled={isGenerating}
              onClick={resetAnalysis}
              type="button"
            >
              重置当前分析
            </button>
          </div>

          {formSections.map((section) => (
            <div
              key={section.title}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
            >
              <div>
                <h2 className="text-base font-semibold text-slate-950">
                  {section.title}
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {section.description}
                </p>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {section.fields.map((field) => (
                  <label key={field.label} className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-slate-700">
                      {field.label}
                    </span>
                    <input
                      className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-base text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400 focus:ring-3 focus:ring-slate-100 sm:h-10 sm:text-sm"
                      placeholder={field.placeholder}
                      type="text"
                      value={formState[field.key]}
                      onChange={(event) =>
                        updateField(field.key, event.target.value)
                      }
                    />
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-950">
                  下一步：生成 AI 方案草案
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  有可用模型服务 key 时调用服务端真实 AI 生成；未配置或调用失败时自动使用模拟兜底，保证公开 Demo 可用。
                </p>
              </div>
              <Button
                className="h-11 w-full rounded-lg px-4 md:w-fit"
                disabled={isGenerating}
                onClick={generateDraft}
                type="button"
              >
                {isGenerating ? (
                  <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                ) : null}
                {isGenerating
                  ? `AI 生成中 · ${generationSeconds}s`
                  : "生成AI方案草案"}
              </Button>
            </div>
          </div>

          {showDraft ? (
            <section
              ref={draftRef}
              className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"
            >
              <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-6">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-emerald-700 shadow-sm">
                        AI方案草案已生成
                      </div>
                      <h2 className="mt-3 text-base font-semibold text-slate-950">
                        {draft?.title ?? "AI方案草案"}
                      </h2>
                      <p className="mt-1 text-sm text-slate-600">
                        {draft?.summary}
                      </p>
                      <p className="mt-2 text-xs font-medium text-slate-500">
                        {draftNote}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="w-fit rounded-full border border-emerald-200 bg-white px-2.5 py-1 text-xs font-medium text-emerald-700 shadow-sm">
                        {draftSource === "real-ai"
                          ? "真实 AI 生成"
                          : "模拟兜底"}
                      </span>
                      <span className="w-fit rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 shadow-sm">
                        模型服务：{" "}
                        {draftProvider ? providerLabels[draftProvider] : "未知"}
                      </span>
                      {draftErrorCategory ? (
                        <span className="w-fit rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 shadow-sm">
                          {errorCategoryLabels[draftErrorCategory]}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 p-5 sm:p-6 lg:grid-cols-2">
                {draft?.sections.map((section) => (
                  <article
                    key={section.title}
                    className="rounded-xl border border-slate-200 bg-white p-4"
                  >
                    <h3 className="text-sm font-semibold text-slate-950">
                      {section.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {section.content}
                    </p>
                  </article>
                ))}
              </div>

              <div className="grid gap-4 border-t border-slate-100 bg-white px-5 py-4 sm:px-6 lg:grid-cols-[1fr_1fr]">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-sm font-semibold text-slate-950">
                    关键假设
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {draft?.assumptions.map((item) => (
                      <li
                        key={item}
                        className="text-sm leading-6 text-slate-600"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-sm font-semibold text-slate-950">
                    可信度与下一步
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {draft?.confidence}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {draft?.nextStep}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-950">
                      下一步工作流
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      当前草案可直接进入方案设计阶段；真实 AI 与模拟兜底会在同一工作流内保持可解释边界。
                    </p>
                  </div>
                  <Link
                    className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 md:w-fit"
                    href="/solution"
                  >
                    进入AI方案设计
                  </Link>
                </div>
              </div>
            </section>
          ) : null}
        </div>

      </div>
      {isGenerating ? (
        <>
          <span className="sr-only" id="generation-help">
            AI 正在生成方案，完成前按钮不可重复提交。
          </span>
          <GenerationProgress elapsedSeconds={generationSeconds} />
        </>
      ) : null}
    </WorkspaceShell>
  );
}

export default function AnalysisPage() {
  const { activeProject } = useWorkspaceProject();

  return (
    <AnalysisWorkspace key={activeProject.id} activeProject={activeProject} />
  );
}
