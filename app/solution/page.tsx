"use client";

import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  ClipboardList,
  Cpu,
  Database,
  Layers3,
  Network,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  Workflow,
} from "lucide-react";
import Link from "next/link";

import { WorkspaceShell } from "@/components/workspace-shell";
import { useWorkspaceProject } from "@/components/workspace-provider";
import { cn } from "@/lib/utils";

const confidenceItems = [
  { label: "业务匹配度", value: "高", tone: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  { label: "实施复杂度", value: "中", tone: "text-amber-700 bg-amber-50 border-amber-200" },
  { label: "ROI潜力", value: "较高", tone: "text-sky-700 bg-sky-50 border-sky-200" },
  { label: "下一步", value: "PoC验证", tone: "text-slate-700 bg-slate-50 border-slate-200" },
] as const;

export default function SolutionPage() {
  const { activeProject, getAnalysisSession } = useWorkspaceProject();
  const analysisSession = getAnalysisSession(activeProject.id);

  const solutionBlocks = [
    {
      title: "推荐AI模型",
      description: activeProject.recommendedSolution.model,
      insight: "用于承接通用理解、摘要、问答和方案草案生成。",
      icon: Sparkles,
    },
    {
      title: "推荐Agent",
      description: activeProject.recommendedSolution.agent,
      insight: "将高频判断、分流和人工确认节点组织成可演示流程。",
      icon: Network,
    },
    {
      title: "推荐RAG方案",
      description: activeProject.recommendedSolution.rag,
      insight: "优先接入可解释、可验证、客户熟悉的业务资料。",
      icon: Database,
    },
    {
      title: "推荐工作流",
      description: activeProject.recommendedSolution.workflow,
      insight: "从需求分析推进到价值评估，便于售前汇报和后续交付。",
      icon: Workflow,
    },
    {
      title: "推荐部署方式",
      description: activeProject.recommendedSolution.deployment,
      insight: "先低成本验证业务价值，再逐步补齐权限、审计和集成。",
      icon: Cpu,
    },
  ];

  const decisionPoints = [
    {
      title: "优先解决的问题",
      items: activeProject.painPoints,
      icon: Target,
    },
    {
      title: "AI机会点",
      items: activeProject.aiOpportunities,
      icon: BrainCircuit,
    },
    {
      title: "PoC验证重点",
      items: activeProject.pocPlan.metrics,
      icon: ClipboardList,
    },
  ];

  return (
    <WorkspaceShell
      activeNav="solution"
      breadcrumb="AI 方案 / 方案设计器"
      title="AI 方案设计模块"
      subtitle="基于当前项目数据与需求分析结果，输出可用于售前沟通、PoC 准备和部署规划的第一版方案。"
      badge={`当前方案已关联 ${activeProject.projectName}`}
      backHref="/analysis"
      backLabel="返回需求分析"
    >
      <div className="flex min-w-0 flex-col gap-5">
        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
                  <Layers3 className="size-3.5" aria-hidden="true" />
                  推荐方案总览
                </div>
                <h2 className="mt-3 text-xl font-semibold tracking-normal text-slate-950">
                  {activeProject.projectName}
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                  方案判断：{activeProject.customerName} 的核心价值不在“炫技式自动化”，而在先把售后知识、工单分流和销售线索判断做成可验证闭环，再进入 PoC 指标验证。
                </p>
              </div>

              <Link
                className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800"
                href="/poc"
              >
                进入PoC验证
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-4">
            {confidenceItems.map((item) => (
              <div
                key={item.label}
                className={cn("rounded-xl border px-4 py-3", item.tone)}
              >
                <p className="text-xs font-medium opacity-80">{item.label}</p>
                <p className="mt-1 text-lg font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        {analysisSession?.draft ? (
          <section
            className="overflow-hidden rounded-2xl border border-violet-200 bg-white shadow-sm"
            data-testid="synced-analysis-draft"
          >
            <div className="border-b border-violet-100 bg-violet-50/70 px-5 py-4 sm:px-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-2.5 py-1 text-xs font-semibold text-violet-700">
                    <Sparkles className="size-3.5" aria-hidden="true" />
                    已同步需求分析草案
                  </div>
                  <h2 className="mt-3 text-base font-semibold text-slate-950">
                    {analysisSession.draft.title}
                  </h2>
                  <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-600">
                    {analysisSession.draft.summary}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2 text-xs font-medium">
                  <span className="rounded-full border border-violet-200 bg-white px-2.5 py-1 text-violet-700">
                    {analysisSession.draftSource === "real-ai"
                      ? "真实 AI"
                      : "模拟兜底"}
                  </span>
                  <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-slate-600">
                    {new Date(analysisSession.updatedAt).toLocaleTimeString(
                      "zh-CN",
                      { hour: "2-digit", minute: "2-digit" }
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-3 p-5 sm:p-6 lg:grid-cols-3">
              {analysisSession.draft.sections.slice(0, 3).map((section) => (
                <article
                  key={section.title}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <h3 className="text-sm font-semibold text-slate-950">
                    {section.title}
                  </h3>
                  <p className="mt-2 line-clamp-4 text-sm leading-6 text-slate-600">
                    {section.content}
                  </p>
                </article>
              ))}
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-xs leading-5 text-slate-500">
                方案页已引用当前项目最近一次分析结果；返回修改并重新生成后会自动更新。
              </p>
              <Link
                className="text-sm font-medium text-violet-700 hover:text-violet-900"
                href="/analysis#analysis-form"
              >
                返回需求分析
              </Link>
            </div>
          </section>
        ) : null}

        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2">
                <Target className="size-4 text-slate-500" aria-hidden="true" />
                <h2 className="text-base font-semibold text-slate-950">
                  方案适配逻辑
                </h2>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                当前客户属于 {activeProject.industry}，业务责任方为 {activeProject.department}。
                现有系统包括 {activeProject.existingSystems.join("、")}。因此第一版方案应避免重集成，优先使用企业知识增强和人工确认节点，快速验证业务收益。
              </p>
            </div>
            <div className="grid min-w-0 gap-3 sm:grid-cols-3 lg:w-[520px]">
              {[
                ["客户规模", activeProject.companySize],
                ["验证周期", activeProject.timeline],
                ["预算口径", activeProject.budgetRange],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="text-xs font-medium text-slate-500">{label}</p>
                  <p className="mt-2 break-words text-sm font-semibold leading-6 text-slate-950">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid min-w-0 gap-5 2xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-slate-500" aria-hidden="true" />
                  <h2 className="text-base font-semibold text-slate-950">
                    推荐方案
                  </h2>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  面向售前演示的方案结构，强调为什么选、先验证什么、怎么交付。
                </p>
              </div>
              <span className="w-fit rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500">
                AI 方案草案
              </span>
            </div>

            <div className="mt-5 grid min-w-0 gap-4 lg:grid-cols-2">
              {solutionBlocks.map((item, index) => {
                const Icon = item.icon;
                const isPrimary = index === 0;

                return (
                  <article
                    key={item.title}
                    className={cn(
                      "min-w-0 rounded-2xl border p-4",
                      isPrimary
                        ? "border-slate-900 bg-slate-950 text-white lg:col-span-2"
                        : "border-slate-200 bg-slate-50"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "flex size-10 shrink-0 items-center justify-center rounded-lg shadow-sm",
                          isPrimary
                            ? "bg-white text-slate-950"
                            : "bg-white text-slate-700"
                        )}
                      >
                        <Icon className="size-5" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <h3
                          className={cn(
                            "text-sm font-semibold",
                            isPrimary ? "text-white" : "text-slate-950"
                          )}
                        >
                          {item.title}
                        </h3>
                        <p
                          className={cn(
                            "mt-2 break-words text-sm leading-6",
                            isPrimary ? "text-slate-200" : "text-slate-600"
                          )}
                        >
                          {item.description}
                        </p>
                        <p
                          className={cn(
                            "mt-3 text-xs leading-5",
                            isPrimary ? "text-slate-300" : "text-slate-500"
                          )}
                        >
                          {item.insight}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <aside className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-slate-500" aria-hidden="true" />
              <h2 className="text-base font-semibold text-slate-950">决策依据</h2>
            </div>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              把技术方案翻译成客户能理解的业务判断。
            </p>

            <div className="mt-5 space-y-4">
              {decisionPoints.map((group) => {
                const Icon = group.icon;

                return (
                  <div
                    key={group.title}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="size-4 text-slate-500" aria-hidden="true" />
                      <h3 className="text-sm font-semibold text-slate-950">
                        {group.title}
                      </h3>
                    </div>
                    <ul className="mt-3 space-y-2">
                      {group.items.map((item) => (
                        <li key={item} className="flex gap-2 text-sm leading-6 text-slate-600">
                          <CheckCircle2
                            className="mt-1 size-4 shrink-0 text-emerald-600"
                            aria-hidden="true"
                          />
                          <span className="min-w-0 break-words">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </aside>
        </section>

        <section className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-2">
              <Rocket className="size-4 text-slate-500" aria-hidden="true" />
              <h2 className="text-base font-semibold text-slate-950">下一步工作流</h2>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              方案设计完成后，建议进入 PoC 验证，优先用客户现有资料验证知识命中率、回答可用率和人工处理时长改善情况。
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {activeProject.pocPlan.metrics.slice(0, 3).map((metric) => (
                <div
                  key={metric}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="text-xs text-slate-500">验证指标</p>
                  <p className="mt-1 break-words text-sm font-medium text-slate-950">
                    {metric}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <aside className="min-w-0 rounded-2xl border border-slate-900 bg-slate-950 p-5 text-white shadow-sm sm:p-6">
            <p className="text-sm font-medium text-slate-300">项目摘要</p>
            <h2 className="mt-3 text-lg font-semibold tracking-normal">
              准备进入 PoC 验证
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              风险等级：{activeProject.pocPlan.riskLevel}。当前方案适合先做轻量验证，再根据结果进入部署规划。
            </p>
            <Link
              className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-medium text-slate-950 transition-colors hover:bg-slate-200"
              href="/poc"
            >
              进入PoC验证
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </aside>
        </section>
      </div>
    </WorkspaceShell>
  );
}
