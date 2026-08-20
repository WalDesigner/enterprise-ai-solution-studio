"use client";

import {
  ArrowRight,
  BadgeCheck,
  CheckCheck,
  Database,
  ShieldAlert,
  Target,
  Timer,
  WandSparkles,
} from "lucide-react";
import Link from "next/link";

import { WorkspaceShell } from "@/components/workspace-shell";
import { useWorkspaceProject } from "@/components/workspace-provider";

export default function PocPage() {
  const { activeProject } = useWorkspaceProject();

  const pocItems = [
    {
      title: "PoC目标",
      icon: Target,
      content: activeProject.pocPlan.goal,
    },
    {
      title: "验证指标",
      icon: CheckCheck,
      content: activeProject.pocPlan.metrics.join("、"),
    },
    {
      title: "测试数据",
      icon: Database,
      content: activeProject.pocPlan.testData.join("、"),
    },
    {
      title: "预期结果",
      icon: WandSparkles,
      content: activeProject.pocPlan.expected,
    },
    {
      title: "风险提示",
      icon: ShieldAlert,
      content: activeProject.pocPlan.risk,
    },
  ];

  return (
    <WorkspaceShell
      activeNav="poc"
      breadcrumb="PoC 验证 / 方案验证"
      title="PoC 验证模块"
      subtitle="在这里验证基于当前项目方案是否值得进入试点阶段，重点关注知识库效果、流程效率和业务接受度。"
      badge={`当前项目：${activeProject.projectName}`}
      backHref="/solution"
      backLabel="返回AI方案"
    >
      <div className="flex min-w-0 flex-col gap-5">
        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="grid min-w-0 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="min-w-0 p-5 sm:p-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                <Target className="size-3.5" aria-hidden="true" />
                PoC 验证判断
              </div>
              <h2 className="mt-4 max-w-3xl text-2xl font-semibold tracking-normal text-slate-950">
                先验证知识命中率、回答可用率和人工处理时长，而不是直接承诺全量上线。
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                {activeProject.pocPlan.goal}
              </p>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {activeProject.pocPlan.metrics.slice(0, 3).map((metric) => (
                  <div
                    key={metric}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <p className="text-xs font-medium text-slate-500">成功指标</p>
                    <p className="mt-1 text-sm font-semibold leading-6 text-slate-950">
                      {metric}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="border-t border-slate-200 bg-slate-950 p-5 text-white sm:p-6 lg:border-l lg:border-t-0">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <Timer className="size-4" aria-hidden="true" />
                验证范围
              </div>
              <h3 className="mt-4 text-xl font-semibold tracking-normal">
                控制在 1-2 个核心场景
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                使用 {activeProject.pocPlan.testData.slice(0, 3).join("、")} 作为首批样本，先证明方案可用，再进入部署规划。
              </p>
              <Link
                className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-medium text-slate-950 transition-colors hover:bg-slate-200"
                href="/deployment"
              >
                进入部署规划
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </aside>
          </div>

          <div className="grid border-t border-slate-100 bg-slate-50/70 md:grid-cols-3">
            {[
              ["测试数据", activeProject.pocPlan.testData.join("、")],
              ["预期结果", activeProject.pocPlan.expected],
              ["风险等级", activeProject.pocPlan.riskLevel],
            ].map(([label, value]) => (
              <div
                key={label}
                className="min-w-0 border-b border-slate-100 p-4 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
              >
                <p className="text-xs font-medium text-slate-500">{label}</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-950">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="grid gap-4 md:grid-cols-2">
            {pocItems.map((item, index) => {
              const Icon = item.icon;
              const isPrimary = index === 0;

              return (
                <article
                  key={item.title}
                  className={`rounded-2xl border p-4 shadow-sm ${
                    isPrimary
                      ? "border-slate-900 bg-slate-950 text-white md:col-span-2"
                      : "border-slate-200/80 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex size-9 items-center justify-center rounded-lg ${
                        isPrimary
                          ? "bg-white text-slate-950"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      <Icon className="size-4" aria-hidden="true" />
                    </div>
                    <h2
                      className={`text-base font-semibold ${
                        isPrimary ? "text-white" : "text-slate-950"
                      }`}
                    >
                      {item.title}
                    </h2>
                  </div>
                  <p
                    className={`mt-3 text-sm leading-6 ${
                      isPrimary ? "text-slate-300" : "text-slate-600"
                    }`}
                  >
                    {item.content}
                  </p>
                </article>
              );
            })}
          </div>

          <aside className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center gap-2">
              <Timer className="size-4 text-slate-500" aria-hidden="true" />
              <h2 className="text-base font-semibold text-slate-950">执行提示</h2>
            </div>
            <div className="mt-3 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
              当前 PoC 计划已基于 {activeProject.projectName} 的方案设计结果生成。
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              PoC 阶段建议只保留 1 到 2 个核心场景，优先验证能否在有限时间内形成可复用的售前结论。
            </p>

            <div className="mt-4 rounded-xl border border-slate-900 bg-slate-950 p-4 text-white">
              <p className="text-sm font-medium text-slate-200">下一步</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                当前仅展示验证框架，后续将接入真实数据和模型能力。
              </p>
            </div>
          </aside>
        </section>

        <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <BadgeCheck className="size-4 text-slate-500" aria-hidden="true" />
                <h2 className="text-base font-semibold text-slate-950">
                  PoC 决策门槛
                </h2>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                达到核心指标后进入部署规划；未达标时先收窄范围、补充数据或调整方案。
              </p>
            </div>
            <Link
              className="inline-flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 sm:w-auto"
              href="/deployment"
            >
              进入部署规划
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {[
              ["通过", "核心指标达标，进入部署"],
              ["条件通过", "补充数据后小范围试点"],
              ["不通过", "调整方案或终止投入"],
            ].map(([label, detail]) => (
              <div
                key={label}
                className="rounded-xl border border-slate-200 bg-slate-50 p-3"
              >
                <p className="text-xs font-semibold text-slate-950">{label}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {detail}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </WorkspaceShell>
  );
}
