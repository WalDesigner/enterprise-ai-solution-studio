"use client";

import { WorkspaceShell } from "@/components/workspace-shell";
import { useWorkspaceProject } from "@/components/workspace-provider";
import { DetailRows, NextStep, WorkflowPanel } from "@/components/workflow-content";

export default function PocPage() {
  const { activeProject } = useWorkspaceProject();
  const plan = activeProject.pocPlan;
  return (
    <WorkspaceShell activeNav="poc" breadcrumb="PoC 验证" title="先做小试验，再决定是否上线"
      subtitle="PoC 是小范围可行性验证。这页说明测什么、用什么数据、达到什么条件才继续。"
      badge="03 / 验证计划 · 非实测结果" backHref="/solution" backLabel="返回 AI 方案">
      <div className="space-y-5">
        <WorkflowPanel title="这次试验要回答的问题">
          <p className="max-w-4xl text-lg font-medium leading-8 text-slate-900">{plan.goal}</p>
          <p className="mt-3 text-sm text-slate-500">案例参考周期：{activeProject.timeline} · 风险等级：{plan.riskLevel}</p>
        </WorkflowPanel>
        <div className="grid gap-5 md:grid-cols-2">
          <WorkflowPanel title="验收指标" description="执行时逐项记录基线与结果；这里展示的是计划目标。">
            <ol className="space-y-3">{plan.metrics.map((metric, index) => (
              <li key={metric} className="flex gap-3 rounded-xl bg-slate-50 p-4 text-sm leading-6">
                <span className="font-semibold text-teal-700">0{index + 1}</span><span>{metric}</span>
              </li>
            ))}</ol>
          </WorkflowPanel>
          <WorkflowPanel title="准备哪些测试数据" description="先明确样本来源与可使用范围，再开始验证。">
            <ul className="space-y-3 text-sm leading-6 text-slate-700">{plan.testData.map(item => <li key={item} className="border-l-2 border-slate-200 pl-3">{item}</li>)}</ul>
            <p className="mt-5 rounded-lg bg-amber-50 p-3 text-xs leading-6 text-amber-900">只使用获授权的脱敏样本；模型输出需要业务人员复核。</p>
          </WorkflowPanel>
        </div>
        <WorkflowPanel title="预期产出与决策条件">
          <DetailRows items={[{ label: "预期结果", value: plan.expected }, { label: "需要关注的风险", value: plan.risk }]} />
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[["通过", "核心指标达到约定门槛，再讨论部署。"], ["条件通过", "补充数据或收窄范围，继续小规模验证。"], ["不通过", "调整方案或停止投入，不直接全量上线。"]].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-slate-200 p-4"><h3 className="text-sm font-semibold">{label}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{value}</p></div>
            ))}
          </div>
        </WorkflowPanel>
        <NextStep title="下一步：了解试点如何部署" description="可以继续浏览部署方案；浏览页面不会执行测试，也不会把当前案例自动标记为验收通过。" href="/deployment" label="查看部署规划" />
      </div>
    </WorkspaceShell>
  );
}
