"use client";

import {
  ArrowRight,
  BarChart3,
  ClipboardCheck,
  Database,
  LineChart,
  Network,
  SearchCheck,
  ServerCog,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { WorkspaceShell } from "@/components/workspace-shell";
import {
  getWorkflowStageAction,
  getWorkflowStageIndex,
  getWorkflowStageLabel,
  PRODUCT_NAME_ZH,
  PRODUCT_TAGLINE_ZH,
  projectCatalog,
} from "@/lib/current-project";
import { useWorkspaceProject } from "@/components/workspace-provider";
import { cn } from "@/lib/utils";

type FeatureCard = {
  title: string;
  description: string;
  icon: typeof SearchCheck;
  metric: string;
  tone: string;
  href?: string;
};

const featureCards: ReadonlyArray<FeatureCard> = [
  {
    title: "需求分析",
    description: "梳理客户行业、业务痛点、目标指标和可落地 AI 场景。",
    icon: SearchCheck,
    metric: "场景识别",
    tone: "bg-sky-50 text-sky-700 ring-sky-100",
    href: "/analysis",
  },
  {
    title: "AI方案生成",
    description: "输出方案结构、技术选型原因、PoC 范围和实施优先级。",
    icon: Sparkles,
    metric: "方案草案",
    tone: "bg-violet-50 text-violet-700 ring-violet-100",
    href: "/solution",
  },
  {
    title: "Agent工作流",
    description: "展示跨工具任务编排、人工确认节点和自动化执行路径。",
    icon: Network,
    metric: "流程设计",
    tone: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  },
  {
    title: "RAG知识库",
    description: "模拟企业知识检索、问答增强和售后知识沉淀流程。",
    icon: Database,
    metric: "知识增强",
    tone: "bg-amber-50 text-amber-700 ring-amber-100",
  },
  {
    title: "部署规划",
    description: "规划模型接入、数据边界、上线步骤和交付风险。",
    icon: ServerCog,
    metric: "交付路径",
    tone: "bg-slate-100 text-slate-700 ring-slate-200",
    href: "/deployment",
  },
  {
    title: "ROI报告",
    description: "评估成本、收益、验证指标和管理层汇报口径。",
    icon: LineChart,
    metric: "价值评估",
    tone: "bg-rose-50 text-rose-700 ring-rose-100",
    href: "/roi",
  },
] as const;

const workflowTaskLabels = ["需求分析", "AI方案", "PoC验证", "部署规划", "ROI评估"] as const;

const recentProjects = projectCatalog.slice(1);

function getTaskState(index: number, currentStageIndex: number) {
  if (index < currentStageIndex) {
    return {
      label: "已完成",
      tone: "border-emerald-200 bg-emerald-50 text-emerald-700",
      dot: "bg-emerald-500",
    };
  }

  if (index === currentStageIndex) {
    return {
      label: "进行中",
      tone: "border-slate-900 bg-slate-950 text-white",
      dot: "bg-white",
    };
  }

  return {
    label: "待开始",
    tone: "border-slate-200 bg-slate-50 text-slate-500",
    dot: "bg-slate-300",
  };
}

export default function Home() {
  const { activeProject, switchProject } = useWorkspaceProject();
  const currentStageIndex = getWorkflowStageIndex(activeProject.workflowStage);

  const taskStates = useMemo(
    () =>
      workflowTaskLabels.map((label, index) => ({
        taskLabel: label,
        index,
        ...getTaskState(index, currentStageIndex),
      })),
    [currentStageIndex]
  );

  return (
    <WorkspaceShell
      activeNav="dashboard"
      breadcrumb="总览"
      title={PRODUCT_NAME_ZH}
      subtitle={PRODUCT_TAGLINE_ZH}
      badge="交互式案例演示"
    >
      <section>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-medium text-slate-500">当前演示项目</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                  {activeProject.projectName}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {activeProject.customerName} · {activeProject.projectStatus}
                </p>
              </div>
              <div className="grid min-w-56 gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-500">当前阶段</span>
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
                    {getWorkflowStageLabel(activeProject.workflowStage)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-500">项目负责人</span>
                  <span className="font-medium text-slate-950">{activeProject.owner}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-500">数据属性</span>
                  <span className="font-medium text-slate-950">{activeProject.lastUpdated}</span>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs text-slate-500">客户</p>
                <p className="mt-1 text-sm font-medium text-slate-950">
                  {activeProject.customerName}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs text-slate-500">行业</p>
                <p className="mt-1 text-sm font-medium text-slate-950">
                  {activeProject.industry}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs text-slate-500">状态</p>
                <p className="mt-1 text-sm font-medium text-slate-950">
                  {activeProject.projectStatus}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs text-slate-500">下一步入口</p>
                <p className="mt-1 text-sm font-medium text-slate-950">
                  {getWorkflowStageAction(activeProject.workflowStage)}
                  <span className="ml-1 text-xs font-normal text-slate-400">
                    {activeProject.continueHref}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800"
                href={activeProject.continueHref}
              >
                {getWorkflowStageAction(activeProject.workflowStage)}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-950"
                href="/customers"
              >
                切换项目
              </Link>
              <p className="text-sm text-slate-500">
                当前项目状态已同步到全站工作流，切换客户后会自动更新。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="size-4 text-slate-500" aria-hidden="true" />
            <h2 className="text-base font-semibold text-slate-950">今日待完成</h2>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            根据当前案例所处阶段展示的咨询交付推进节奏。
          </p>

          <div className="mt-5 space-y-3">
            {taskStates.map((task) => (
              <div
                key={task.taskLabel}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-4 py-3",
                  task.tone
                )}
              >
                <span
                  className={cn("size-2.5 rounded-full", task.dot)}
                  aria-hidden="true"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{task.taskLabel}</p>
                  <p
                    className={cn(
                      "mt-1 text-xs",
                      task.index === currentStageIndex
                        ? "text-white/75"
                        : task.index < currentStageIndex
                          ? "text-emerald-600"
                          : "text-slate-400"
                    )}
                  >
                    {task.index === currentStageIndex
                      ? "当前正在执行"
                      : task.index < currentStageIndex
                        ? "已完成"
                        : "待开始"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-500">项目动态</p>
              <h2 className="mt-2 text-base font-semibold text-slate-950">
                最近活动
              </h2>
            </div>
            <BarChart3 className="size-5 text-slate-400" aria-hidden="true" />
          </div>

          <div className="mt-5 space-y-3">
            {activeProject.recentActivity.map((activity) => (
              <div
                key={`${activity.time}-${activity.title}`}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-slate-950">{activity.title}</p>
                  <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-500">
                    {activity.time}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {activity.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-950">客户管理入口</h2>
              <p className="mt-1 text-sm text-slate-500">
                所有客户均为脱敏案例，用于演示从分析到 ROI 的完整交付路径。
              </p>
            </div>
            <Users className="size-5 text-slate-400" aria-hidden="true" />
          </div>

          <div className="mt-5 grid gap-3">
            {recentProjects.map((project) => (
              <div
                key={project.id}
                className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-slate-950">{project.projectName}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {project.customerName} · {project.projectStatus}
                  </p>
                </div>
                <button
                  className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-950"
                  type="button"
                  onClick={() => switchProject(project.id)}
                >
                  切换到此项目
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-900 bg-slate-950 p-5 text-white shadow-sm">
          <p className="text-sm font-medium text-slate-300">下一步行动</p>
          <h2 className="mt-3 text-xl font-semibold tracking-normal">
            继续推进当前项目工作流
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            现在可以继续补充客户需求，进入 AI 方案设计，再逐步推进 PoC 验证、部署规划和 ROI 评估。
          </p>
          <Link
            className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-lg bg-white px-4 text-sm font-medium text-slate-950 hover:bg-slate-200"
            href={activeProject.continueHref}
          >
            {getWorkflowStageAction(activeProject.workflowStage)}
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {featureCards.map((feature) => {
          const Icon = feature.icon;
          const card = (
            <article className="h-full rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-colors hover:border-slate-300">
              <div className="flex items-start justify-between gap-4">
                <div
                  className={cn(
                    "flex size-10 items-center justify-center rounded-xl ring-1",
                    feature.tone
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500">
                  {feature.metric}
                </span>
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-950">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {feature.description}
              </p>
              {feature.href ? (
                <p className="mt-4 text-xs font-medium text-sky-700">
                  进入 {feature.title} →
                </p>
              ) : null}
            </article>
          );

          if (feature.href) {
            return (
              <Link
                key={feature.title}
                className="block rounded-2xl outline-none transition-transform focus-visible:ring-3 focus-visible:ring-sky-200"
                href={feature.href}
              >
                {card}
              </Link>
            );
          }

          return <div key={feature.title}>{card}</div>;
        })}
      </section>
    </WorkspaceShell>
  );
}
