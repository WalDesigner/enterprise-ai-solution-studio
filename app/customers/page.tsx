"use client";

import { ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { WorkspaceShell } from "@/components/workspace-shell";
import { projectCatalog, getWorkflowStageLabel } from "@/lib/current-project";
import { useWorkspaceProject } from "@/components/workspace-provider";

const caseLabels: Record<string, { title: string; description: string }> = {
  "tj-auto-parts-upgrade": { title: "售后服务提效", description: "从分散的知识与工单，找到 AI 切入点。" },
  "tj-auto-parts-group": { title: "售后知识库", description: "把产品资料组织成可讨论的知识问答方案。" },
  "north-marine-supply": { title: "审批流程协同", description: "设计小范围试验，检验流程改进是否有效。" },
  "north-china-saas-growth": { title: "销售增长评估", description: "规划部署与投入，判断方案值不值得做。" },
};

export default function CustomersPage() {
  const router = useRouter();
  const { activeProject, switchProject } = useWorkspaceProject();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [industry, setIndustry] = useState("全部");
  const [stage, setStage] = useState("全部");
  const selected = projectCatalog.find((project) => project.id === (selectedId ?? activeProject.id)) ?? projectCatalog[0];
  const industries = [...new Set(projectCatalog.map((project) => project.industry))];
  const stages = [...new Set(projectCatalog.map((project) => project.workflowStage))];
  const filtered = projectCatalog.filter((project) =>
    [project.customerName, project.projectName, project.owner, project.industry, caseLabels[project.id].title].join(" ").toLowerCase().includes(query.trim().toLowerCase()) &&
    (industry === "全部" || project.industry === industry) &&
    (stage === "全部" || project.workflowStage === stage)
  );

  return (
    <WorkspaceShell activeNav="customers" breadcrumb="客户管理" title="选择一个客户案例，开始体验"
      subtitle="四个客户，四类业务问题。先选你感兴趣的案例，再进入它的项目工作区。" badge="脱敏案例 · 无需注册">
      <section aria-labelledby="case-list-title" className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="case-list-title" className="text-lg font-semibold">1. 选择业务案例</h2>
          <p className="text-sm text-slate-500">当前工作区：{activeProject.customerName}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {filtered.map((project) => {
            const isSelected = selected.id === project.id;
            return (
              <button key={project.id} type="button" aria-pressed={isSelected} onClick={() => setSelectedId(project.id)}
                className={`relative flex min-w-0 flex-col rounded-2xl border-2 p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700 ${isSelected ? "border-teal-700 bg-teal-50/70" : "border-slate-200 bg-white hover:border-teal-400"}`}>
                <span className="flex w-full items-center justify-between gap-2 text-xs text-slate-600">
                  {project.industry}<span className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${isSelected ? "border-teal-700 bg-teal-700 text-white" : "border-slate-300"}`}>{isSelected && <Check className="size-3" aria-hidden="true" />}</span>
                </span>
                <span className="mt-4 text-base font-semibold text-slate-950 sm:text-lg">{caseLabels[project.id].title}</span>
                <span className="mt-2 text-sm leading-6 text-slate-600">{project.customerName}</span>
                <span className="mt-3 hidden text-sm leading-6 text-slate-600 sm:block">{caseLabels[project.id].description}</span>
                <span className="mt-auto pt-4 text-xs font-medium text-teal-800">{getWorkflowStageLabel(project.workflowStage)}{project.id === activeProject.id ? " · 当前工作区" : ""}</span>
              </button>
            );
          })}
        </div>
        {!filtered.length && <div role="status" className="rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-600">没有匹配的案例。<button className="ml-3 font-semibold text-teal-800 underline" onClick={() => { setQuery(""); setIndustry("全部"); setStage("全部"); }}>清除筛选</button></div>}
        <details className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <summary className="cursor-pointer text-sm font-medium text-slate-600">搜索与筛选 · {filtered.length} / {projectCatalog.length} 个案例</summary>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <label className="text-xs text-slate-600">搜索客户或业务问题<input value={query} onChange={(event) => setQuery(event.target.value)} className="mt-2 block min-h-11 w-full min-w-0 rounded-lg border border-slate-300 px-3 text-base" placeholder="客户、负责人、业务问题" /></label>
            <label className="text-xs text-slate-600"><span id="industry-label">行业</span><select aria-labelledby="industry-label" value={industry} onChange={(event) => setIndustry(event.target.value)} className="mt-2 block min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-base"><option>全部</option>{industries.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="text-xs text-slate-600"><span id="stage-label">项目阶段</span><select aria-labelledby="stage-label" value={stage} onChange={(event) => setStage(event.target.value)} className="mt-2 block min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-base"><option>全部</option>{stages.map((item) => <option key={item} value={item}>{getWorkflowStageLabel(item)}</option>)}</select></label>
          </div>
        </details>
      </section>
      <section aria-labelledby="selected-case-title" className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <p className="text-sm font-semibold text-teal-800">2. 查看所选案例，进入项目</p>
        <h2 id="selected-case-title" className="mt-2 text-xl font-semibold text-slate-950">{selected.projectName}</h2>
        <p className="mt-2 text-sm text-slate-500">{selected.companySize} · {selected.department}</p>
        <div className="my-5 grid gap-5 md:grid-cols-2">
          <div><h3 className="text-sm font-semibold">要解决的问题</h3><ul className="mt-2 space-y-2 text-sm leading-6 text-slate-600">{selected.painPoints.map((item) => <li key={item}>— {item}</li>)}</ul></div>
          <div><h3 className="text-sm font-semibold">希望达到的目标</h3><ul className="mt-2 space-y-2 text-sm leading-6 text-slate-600">{selected.aiGoals.map((item) => <li key={item}>— {item}</li>)}</ul></div>
        </div>
        <div className="flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-sm leading-6 text-slate-500">这是预设在“{getWorkflowStageLabel(selected.workflowStage)}”阶段的案例。选择卡片只预览；进入后才切换工作区，原项目的本地草案会保留。</p>
          <button type="button" onClick={() => { switchProject(selected.id); router.push(selected.continueHref); }} className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-teal-800 px-5 text-sm font-semibold text-white hover:bg-teal-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700">进入{getWorkflowStageLabel(selected.workflowStage)}<ArrowRight className="size-4" aria-hidden="true" /></button>
        </div>
      </section>
    </WorkspaceShell>
  );
}
