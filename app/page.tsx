"use client";

import { ArrowRight, ClipboardCheck, FileText, SearchCheck } from "lucide-react";
import Link from "next/link";
import { WorkspaceShell } from "@/components/workspace-shell";
import { useWorkspaceProject } from "@/components/workspace-provider";
import { WorkflowStepper } from "@/components/workflow-stepper";
import { getWorkflowStageAction, getWorkflowStageLabel, projectCatalog } from "@/lib/current-project";

const guideSteps = [
  { title: "说清业务问题", detail: "填写客户背景、业务痛点和目标。已准备好示例，不必从空白开始。", output: "输入：一份客户需求", href: "/analysis", icon: SearchCheck },
  { title: "得到方案草案", detail: "在需求分析页生成 AI 草案，再到方案页查看并复核建议。", output: "产物：方案建议与风险", href: "/solution", icon: FileText },
  { title: "判断值不值得做", detail: "用案例了解如何小范围试验、安排上线，并估算投入与回报。", output: "产物：验证与交付思路", href: "/poc", icon: ClipboardCheck },
] as const;

export default function Home() {
  const { activeProject, switchProject } = useWorkspaceProject();
  return (
    <WorkspaceShell activeNav="dashboard" breadcrumb="使用指引"
      title="把企业需求，整理成可讨论的 AI 方案"
      subtitle="给售前顾问和方案交付人员使用：先理解客户的问题，再生成方案草案，最后评估如何验证、上线和计算回报。"
      badge="交互式案例演示">
      <div className="space-y-6">
        <section aria-labelledby="getting-started" className="rounded-2xl border border-teal-200/70 bg-gradient-to-br from-teal-50 to-white p-5 sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold tracking-wide text-teal-700">第一次来？从这里开始</p>
              <h2 id="getting-started" className="mt-2 text-xl font-semibold text-slate-950">例如：客服查资料太慢，AI 能帮上什么忙？</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">用一个示例客户走一遍“需求 → 草案 → 验证”的路径。无需注册；只浏览案例不会调用模型。</p>
            </div>
            <Link href="/analysis#analysis-form" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-teal-800 px-5 text-sm font-semibold text-white transition-colors hover:bg-teal-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700">
              从需求开始体验 <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            {guideSteps.map((step, index) => {
              const Icon = step.icon;
              return <li key={step.title} className="rounded-xl border border-slate-200/80 bg-white/90 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-teal-700"><Icon className="size-4" aria-hidden="true" />0{index + 1}</div>
                <h3 className="mt-3 font-semibold text-slate-950">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{step.detail}</p>
                <Link href={step.href} className="mt-3 inline-flex min-h-10 items-center gap-1 text-xs font-semibold text-teal-800 underline-offset-4 hover:underline">{step.output}<ArrowRight className="size-3.5" aria-hidden="true" /></Link>
              </li>;
            })}
          </ol>
          <p className="mt-4 text-xs leading-5 text-slate-600">真实 AI 位于需求分析的生成按钮；后续验证、部署与回报页面是案例推演，不会自动执行企业任务。</p>
        </section>
        <section aria-labelledby="current-project" className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">继续当前项目 · <span>{activeProject.lastUpdated}</span></p>
              <h2 id="current-project" className="mt-2 text-xl font-semibold text-slate-950">{activeProject.projectName}</h2>
              <p className="mt-2 text-sm text-slate-600">{activeProject.industry} · 案例阶段：{getWorkflowStageLabel(activeProject.workflowStage)}</p>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">当前要解决：{activeProject.painPoints[0]}。</p>
            </div>
            <div className="flex shrink-0 flex-col gap-2">
              <Link href={activeProject.continueHref} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-700">{getWorkflowStageAction(activeProject.workflowStage)}<ArrowRight className="size-4" aria-hidden="true" /></Link>
              <Link href="/customers" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-600 hover:bg-slate-50">切换项目</Link>
            </div>
          </div>
          <div className="mt-6 border-t border-slate-100 pt-5"><WorkflowStepper projectStage={activeProject.workflowStage} viewedStage={activeProject.workflowStage} autoScroll={false} /></div>
          <p className="mt-3 text-xs leading-5 text-slate-500">阶段状态来自案例预设；浏览页面不会把项目标为完成。你填写的需求和生成的草案保存在当前浏览器。</p>
        </section>
        <details className="rounded-xl border border-slate-200 bg-white p-5">
          <summary className="cursor-pointer text-sm font-semibold text-slate-700">更多案例与项目动态</summary>
          <div className="mt-5 grid gap-6 lg:grid-cols-2">
            <section aria-label="切换演示案例">
              <h2 className="text-sm font-semibold text-slate-950">换一个业务场景</h2>
              <div className="mt-3 space-y-2">
                {projectCatalog.map((project) => <button key={project.id} type="button" onClick={() => switchProject(project.id)} aria-pressed={project.id === activeProject.id} className="block min-h-11 w-full rounded-lg border border-slate-200 p-3 text-left text-sm text-slate-700 hover:border-teal-500 aria-pressed:border-teal-600 aria-pressed:bg-teal-50">
                  {project.projectName}{project.id === activeProject.id ? " · 当前" : ""}
                </button>)}
              </div>
            </section>
            <section aria-label="案例预设动态">
              <h2 className="text-sm font-semibold text-slate-950">案例预设动态</h2>
              <ul className="mt-3 divide-y divide-slate-100">
                {activeProject.recentActivity.map((activity) => <li key={activity.time} className="py-3 first:pt-0"><p className="text-xs text-slate-500">{activity.time}</p><h3 className="mt-1 text-sm font-medium">{activity.title}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{activity.detail}</p></li>)}
              </ul>
            </section>
          </div>
        </details>
        <details className="rounded-xl border border-slate-200 bg-white p-5">
          <summary className="cursor-pointer text-sm font-semibold text-slate-700">术语速查：PoC、ROI、RAG 与 Agent 是什么？</summary>
          <dl className="mt-4 grid gap-4 text-sm leading-6 sm:grid-cols-2">
            <div><dt className="font-semibold">PoC · 小范围验证</dt><dd className="text-slate-600">先用少量样本测试方案是否值得继续投入；这里展示验证计划。</dd></div>
            <div><dt className="font-semibold">ROI · 投入回报</dt><dd className="text-slate-600">比较预计收益和成本；这里的数字是案例假设，不是真实业绩。</dd></div>
            <div><dt className="font-semibold">RAG · 先查资料再回答</dt><dd className="text-slate-600">为模型提供相关知识后再生成回答；本作品展示设计，不提供真实检索。</dd></div>
            <div><dt className="font-semibold">Agent · 按步骤调用工具</dt><dd className="text-slate-600">让模型参与任务规划与工具使用；本作品展示方案，不运行后台智能体。</dd></div>
          </dl>
        </details>
      </div>
    </WorkspaceShell>
  );
}
