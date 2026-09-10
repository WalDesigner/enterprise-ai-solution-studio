"use client";

import Link from "next/link";
import { WorkspaceShell } from "@/components/workspace-shell";
import { useWorkspaceProject } from "@/components/workspace-provider";
import { DetailRows, NextStep, WorkflowPanel } from "@/components/workflow-content";

export default function SolutionPage() {
  const { activeProject, getAnalysisSession } = useWorkspaceProject();
  const analysisSession = getAnalysisSession(activeProject.id);
  const recommendations = [
    { label: "AI 模型", value: activeProject.recommendedSolution.model },
    { label: "Agent 分工", value: activeProject.recommendedSolution.agent },
    { label: "RAG 知识增强", value: activeProject.recommendedSolution.rag },
    { label: "业务工作流", value: activeProject.recommendedSolution.workflow },
    { label: "部署方式", value: activeProject.recommendedSolution.deployment },
  ];

  return (
    <WorkspaceShell activeNav="solution" breadcrumb="AI 方案" title="从需求，形成可讨论的方案"
      subtitle="先看需求分析草案，再对照案例选型。把需要验证的假设带到下一步，而不是直接承诺上线效果。"
      badge="02 / AI 方案" backHref="/analysis" backLabel="返回需求分析">
      <div className="space-y-5">
        {analysisSession?.draft ? (
          <section data-testid="synced-analysis-draft" className="rounded-2xl border border-teal-200 bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-semibold text-teal-800">已同步需求分析草案</p>
              <span className="rounded-full bg-teal-50 px-3 py-1 text-xs text-teal-800">{analysisSession.draftSource === "real-ai" ? "真实 AI" : "模拟兜底"} · {new Date(analysisSession.updatedAt).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}</span>
            </div>
            <h2 className="mt-3 text-xl font-semibold">{analysisSession.draft.title}</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">{analysisSession.draft.summary}</p>
            <div className="mt-5 grid gap-3 lg:grid-cols-3">
              {analysisSession.draft.sections.slice(0, 3).map(section => (
                <article key={section.title} className="rounded-xl bg-slate-50 p-4">
                  <h3 className="text-sm font-semibold">{section.title}</h3>
                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">{section.content}</p>
                </article>
              ))}
            </div>
            <Link href="/analysis#analysis-form" className="mt-4 inline-flex min-h-11 items-center text-sm font-medium text-teal-800 hover:underline">查看完整草案 / 修改需求 →</Link>
          </section>
        ) : (
          <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-5">
            <h2 className="font-semibold">还没有生成需求分析草案</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">可以先浏览下面的案例方案；想体验 AI 生成，请先确认客户需求。</p>
            <Link href="/analysis#analysis-form" className="mt-3 inline-flex min-h-11 items-center font-medium text-teal-800 hover:underline">填写需求并生成草案 →</Link>
          </section>
        )}
        <WorkflowPanel title="案例方案 · 技术如何服务业务" description="以下选型来自当前客户的预设案例，不会被上方 AI 草案自动改写。">
          <DetailRows items={recommendations} />
        </WorkflowPanel>
        <div className="grid gap-5 md:grid-cols-2">
          <WorkflowPanel title="为什么这样设计">
            <p className="text-sm leading-7 text-slate-600">{activeProject.customerName} · {activeProject.industry}</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">{activeProject.painPoints.map(item => <li key={item} className="border-l-2 border-teal-200 pl-3">{item}</li>)}</ul>
            <p className="mt-4 text-xs leading-6 text-slate-500">现有系统：{activeProject.existingSystems.join("、")}</p>
          </WorkflowPanel>
          <WorkflowPanel title="优先验证什么">
            <ul className="space-y-3 text-sm leading-6 text-slate-700">{activeProject.pocPlan.metrics.map((item, index) => <li key={item} className="flex gap-3"><span className="font-semibold text-teal-700">0{index + 1}</span><span>{item}</span></li>)}</ul>
            <p className="mt-4 text-xs leading-6 text-slate-500">参考周期：{activeProject.timeline} · 预算：{activeProject.budgetRange}</p>
          </WorkflowPanel>
        </div>
        <NextStep title="下一步：把方案变成小范围试验" description="明确测试数据、成功指标和风险，判断是否值得继续投入。" href="/poc" label="查看 PoC 验证计划" />
      </div>
    </WorkspaceShell>
  );
}
