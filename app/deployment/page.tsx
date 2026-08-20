"use client";

import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  CloudCog,
  Database,
  GitBranch,
  KeyRound,
  Layers3,
  LockKeyhole,
  MonitorCog,
  Network,
  Radar,
  Rocket,
  ServerCog,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

import { WorkspaceShell } from "@/components/workspace-shell";
import { useWorkspaceProject } from "@/components/workspace-provider";
import { cn } from "@/lib/utils";

const readinessCards = [
  {
    label: "部署模式",
    value: "轻量试点",
    detail: "先跑部门级 PoC，再逐步扩展权限和审计。",
  },
  {
    label: "上线节奏",
    value: "6 周试点",
    detail: "以业务验证和低风险上线为主。",
  },
  {
    label: "安全边界",
    value: "受控接入",
    detail: "限制数据范围、保留人工确认节点。",
  },
  {
    label: "交付状态",
    value: "规划中",
    detail: "已具备进入部署讨论的方案基础。",
  },
] as const;

const rolloutSteps = [
  {
    phase: "第 1 阶段",
    title: "环境与数据准备",
    description: "确认试点部门、数据范围、知识源清单和系统接入边界。",
  },
  {
    phase: "第 2 阶段",
    title: "PoC 能力部署",
    description: "部署前端工作台、模型调用、RAG 检索和核心 Agent 流程。",
  },
  {
    phase: "第 3 阶段",
    title: "权限与审计补齐",
    description: "补充角色权限、操作日志、人工确认和异常回退机制。",
  },
  {
    phase: "第 4 阶段",
    title: "业务试点上线",
    description: "围绕验证指标观察效果，沉淀 ROI 和后续扩展建议。",
  },
] as const;

export default function DeploymentPage() {
  const { activeProject } = useWorkspaceProject();

  const architectureLayers = [
    {
      title: "企业工作台",
      description: "统一承载需求分析、方案设计、PoC 验证和部署规划。",
      icon: MonitorCog,
    },
    {
      title: "模型接入层",
      description: activeProject.recommendedSolution.model,
      icon: CloudCog,
    },
    {
      title: "知识增强层",
      description: activeProject.recommendedSolution.rag,
      icon: Database,
    },
    {
      title: "Agent 工作流",
      description: activeProject.recommendedSolution.agent,
      icon: Network,
    },
    {
      title: "企业系统边界",
      description: activeProject.existingSystems.join("、"),
      icon: GitBranch,
    },
  ];

  const guardrails = [
    "先使用匿名化或脱敏数据完成试点验证",
    "模型输出保留人工确认与业务复核节点",
    "知识库同步采用白名单资料范围",
    "关键操作记录日志，便于复盘和验收",
    "上线前明确失败回退和人工接管流程",
  ];

  const riskControls = [
    {
      title: "数据质量风险",
      description: activeProject.dataSituation,
      action: "先做知识源清洗、标签统一和样例集验证。",
      icon: Database,
      tone: "border-amber-200 bg-amber-50 text-amber-800",
    },
    {
      title: "权限边界风险",
      description: "企业系统和知识库接入需要明确可访问范围。",
      action: "按部门、角色和资料类型分阶段开放。",
      icon: LockKeyhole,
      tone: "border-sky-200 bg-sky-50 text-sky-800",
    },
    {
      title: "业务接受度风险",
      description: "AI 输出不能直接替代关键业务判断。",
      action: "把人工确认节点保留在高风险流程中。",
      icon: ShieldCheck,
      tone: "border-emerald-200 bg-emerald-50 text-emerald-800",
    },
  ];

  return (
    <WorkspaceShell
      activeNav="deployment"
      breadcrumb="部署规划 / 交付方案"
      title="部署规划模块"
      subtitle="将 PoC 方案转化为可落地的上线计划，覆盖运行环境、系统边界、数据安全、权限审计和试点节奏。"
      badge={`当前项目：${activeProject.projectName}`}
      backHref="/poc"
      backLabel="返回 PoC"
    >
      <div className="flex min-w-0 flex-col gap-5">
        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
                  <ServerCog className="size-3.5" aria-hidden="true" />
                  部署蓝图
                </div>
                <h2 className="mt-3 break-words text-xl font-semibold tracking-normal text-slate-950">
                  {activeProject.recommendedSolution.deployment}
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                  先以小范围试点验证业务价值，再逐步补齐权限、审计、数据同步和运维机制，避免一开始就进入重型企业架构。
                </p>
              </div>

              <Link
                className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800"
                href="/roi"
              >
                进入ROI报告
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-4">
            {readinessCards.map((item) => (
              <article
                key={item.label}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <p className="text-xs font-medium text-slate-500">{item.label}</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-950">
                  {item.value}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid min-w-0 gap-5 2xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Layers3 className="size-4 text-slate-500" aria-hidden="true" />
                  <h2 className="text-base font-semibold text-slate-950">
                    部署架构
                  </h2>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  从用户入口到企业系统边界的最小可落地架构。
                </p>
              </div>
              <span className="w-fit rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500">
                MVP Delivery Blueprint
              </span>
            </div>

            <div className="mt-5 grid min-w-0 gap-3">
              {architectureLayers.map((layer, index) => {
                const Icon = layer.icon;
                const isPrimary = index === 0;

                return (
                  <article
                    key={layer.title}
                    className={cn(
                      "min-w-0 rounded-2xl border p-4",
                      isPrimary
                        ? "border-slate-900 bg-slate-950 text-white"
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
                          {layer.title}
                        </h3>
                        <p
                          className={cn(
                            "mt-2 break-words text-sm leading-6",
                            isPrimary ? "text-slate-200" : "text-slate-600"
                          )}
                        >
                          {layer.description}
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
              <KeyRound className="size-4 text-slate-500" aria-hidden="true" />
              <h2 className="text-base font-semibold text-slate-950">上线检查</h2>
            </div>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              面向企业客户交付前必须说清楚的控制点。
            </p>

            <div className="mt-5 space-y-3">
              {guardrails.map((item) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3"
                >
                  <CheckCircle2
                    className="mt-0.5 size-4 shrink-0 text-emerald-600"
                    aria-hidden="true"
                  />
                  <p className="text-sm leading-6 text-slate-600">{item}</p>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2">
            <Rocket className="size-4 text-slate-500" aria-hidden="true" />
            <h2 className="text-base font-semibold text-slate-950">实施节奏</h2>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            用可控的小步试点替代一次性大上线，让售前方案更容易被客户接受。
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {rolloutSteps.map((step) => (
              <article
                key={step.phase}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="inline-flex rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-500">
                  {step.phase}
                </div>
                <h3 className="mt-3 text-sm font-semibold text-slate-950">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-2">
              <Radar className="size-4 text-slate-500" aria-hidden="true" />
              <h2 className="text-base font-semibold text-slate-950">风险与控制</h2>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              部署规划不是堆技术，而是提前降低客户落地风险。
            </p>

            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              {riskControls.map((risk) => {
                const Icon = risk.icon;

                return (
                  <article
                    key={risk.title}
                    className={cn("rounded-2xl border p-4", risk.tone)}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="size-4" aria-hidden="true" />
                      <h3 className="text-sm font-semibold">{risk.title}</h3>
                    </div>
                    <p className="mt-3 text-sm leading-6 opacity-90">
                      {risk.description}
                    </p>
                    <p className="mt-3 text-xs leading-5 opacity-80">
                      控制方式：{risk.action}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>

          <aside className="min-w-0 rounded-2xl border border-slate-900 bg-slate-950 p-5 text-white shadow-sm sm:p-6">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="size-4 text-slate-300" aria-hidden="true" />
              <p className="text-sm font-medium text-slate-300">下一步</p>
            </div>
            <h2 className="mt-3 text-lg font-semibold tracking-normal">
              进入 ROI 评估
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              部署边界清楚后，可以把人效、响应时长和业务接受度转化为管理层可读的价值假设。
            </p>
            <Link
              className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-medium text-slate-950 transition-colors hover:bg-slate-200"
              href="/roi"
            >
              进入ROI报告
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </aside>
        </section>
      </div>
    </WorkspaceShell>
  );
}
