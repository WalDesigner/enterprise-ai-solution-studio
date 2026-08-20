"use client";

import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  BarChart3,
  CheckCircle2,
  Clock3,
  ClipboardCopy,
  Download,
  DollarSign,
  FileChartColumn,
  FileText,
  Gauge,
  LineChart,
  ShieldAlert,
  Target,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

import { useWorkspaceProject } from "@/components/workspace-provider";
import { WorkspaceShell } from "@/components/workspace-shell";
import { getRoiPlan } from "@/lib/current-project";
import { cn } from "@/lib/utils";

function formatCurrency(value: number) {
  return `¥${value.toLocaleString("zh-CN")}`;
}

function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

export default function RoiPage() {
  const { activeProject } = useWorkspaceProject();
  const roiPlan = getRoiPlan(activeProject.id);

  const totalInvestment = Object.values(roiPlan.investment).reduce(
    (sum, value) => sum + value,
    0
  );
  const annualSavings = roiPlan.benefits.annualSavings;
  const netBenefit = annualSavings - totalInvestment;
  const roiPercent = (netBenefit / totalInvestment) * 100;
  const paybackMonths = (totalInvestment / annualSavings) * 12;

  const executiveMetrics = [
    {
      label: "投资建议",
      value: roiPlan.recommendationZh,
      detail: "基于项目阶段、数据成熟度和可量化收益判断",
      icon: BadgeCheck,
      tone: "border-emerald-200 bg-emerald-50 text-emerald-800",
    },
    {
      label: "风险等级",
      value: roiPlan.riskLevel,
      detail: "综合技术、数据、组织和集成风险",
      icon: ShieldAlert,
      tone: "border-amber-200 bg-amber-50 text-amber-800",
    },
    {
      label: "预计 ROI",
      value: formatPercent(roiPercent),
      detail: "按首年净收益 / 总投入估算",
      icon: TrendingUp,
      tone: "border-sky-200 bg-sky-50 text-sky-800",
    },
    {
      label: "回收期",
      value: `${paybackMonths.toFixed(1)} 个月`,
      detail: "按年化节省金额线性折算",
      icon: Clock3,
      tone: "border-violet-200 bg-violet-50 text-violet-800",
    },
    {
      label: "可信度",
      value: `${roiPlan.confidenceScore}/100`,
      detail: "取决于数据准备、PoC 范围和业务接受度",
      icon: Gauge,
      tone: "border-slate-200 bg-slate-50 text-slate-800",
    },
  ];

  const investmentItems = [
    {
      label: "初始部署成本",
      value: roiPlan.investment.initialDeploymentCost,
      detail: "工作台、模型接入和试点环境准备",
    },
    {
      label: "AI 平台 / API 成本",
      value: roiPlan.investment.platformApiCost,
      detail: "模型调用、RAG 检索和运行资源",
    },
    {
      label: "培训成本",
      value: roiPlan.investment.trainingCost,
      detail: "业务团队培训、验收和使用规范",
    },
    {
      label: "维护成本",
      value: roiPlan.investment.maintenanceCost,
      detail: "知识库更新、提示词维护和运行监控",
    },
    {
      label: "实施成本",
      value: roiPlan.investment.implementationCost,
      detail: "需求梳理、方案落地、PoC 支持和交付管理",
    },
  ];

  const benefitItems = [
    {
      label: "人力成本节省",
      value: formatCurrency(roiPlan.benefits.laborCostSavings),
      detail: "来自重复咨询、工单分流和资料检索的人工时间节省",
    },
    {
      label: "响应时间缩短",
      value: roiPlan.benefits.responseTimeReduction,
      detail: "提升客户服务和内部协同响应效率",
    },
    {
      label: "知识复用",
      value: roiPlan.benefits.knowledgeReuse,
      detail: "让产品手册、历史工单和销售材料变成可复用资产",
    },
    {
      label: "流程自动化",
      value: roiPlan.benefits.processAutomation,
      detail: "优先覆盖高频、低风险、规则相对明确的重复流程",
    },
    {
      label: "服务质量提升",
      value: roiPlan.benefits.serviceQualityImprovement,
      detail: "提高新人处理一致性和管理层可见性",
    },
  ];

  const roiMetrics = [
    { label: "总投入", value: formatCurrency(totalInvestment) },
    { label: "年度节省", value: formatCurrency(annualSavings) },
    { label: "首年净收益", value: formatCurrency(netBenefit) },
    { label: "ROI", value: formatPercent(roiPercent) },
    { label: "回收期", value: `${paybackMonths.toFixed(1)} 个月` },
  ];

  const riskItems = [
    { label: "技术风险", ...roiPlan.risks.technicalRisk },
    { label: "数据准备度", ...roiPlan.risks.dataReadiness },
    {
      label: "组织采纳",
      ...roiPlan.risks.organizationAdoption,
    },
    {
      label: "流程复杂度",
      ...roiPlan.risks.processComplexity,
    },
    { label: "集成风险", ...roiPlan.risks.integrationRisk },
  ];

  return (
    <WorkspaceShell
      activeNav="roi"
      breadcrumb="ROI 报告 / 投资回报评估"
      title="ROI 报告"
      subtitle="将部署规划转化为管理层能直接判断的投资回报结论，回答这个 AI 项目是否值得投入、多久回本、风险在哪里。"
      badge={`当前项目：${activeProject.projectName}`}
      backHref="/deployment"
      backLabel="返回部署规划"
    >
      <div className="flex min-w-0 flex-col gap-5">
        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
                  <FileChartColumn className="size-3.5" aria-hidden="true" />
                  管理层摘要
                </div>
                <h2 className="mt-3 text-2xl font-semibold tracking-normal text-slate-950">
                  {activeProject.customerName} AI 投资回报评估
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                  基于当前需求分析、方案设计、PoC 计划和部署路径，建议以
                  {activeProject.timeline} 的节奏推进，先验证高频重复场景，再扩大到跨部门流程。
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    { label: "生成管理层摘要", icon: FileText },
                    { label: "复制汇报口径", icon: ClipboardCopy },
                    { label: "导出ROI报告", icon: Download },
                  ].map((action) => {
                    const Icon = action.icon;

                    return (
                      <button
                        key={action.label}
                        className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 shadow-sm"
                        type="button"
                        disabled
                        title="静态演示按钮，后续可接入真实生成或导出能力"
                      >
                        <Icon className="size-3.5" aria-hidden="true" />
                        {action.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Link
                className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800"
                href="/deployment"
              >
                查看部署规划
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-5">
            {executiveMetrics.map((metric) => {
              const Icon = metric.icon;

              return (
                <article
                  key={metric.label}
                  className={cn("rounded-xl border p-4", metric.tone)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-medium opacity-80">{metric.label}</p>
                    <Icon className="size-4 shrink-0" aria-hidden="true" />
                  </div>
                  <h3 className="mt-3 break-words text-lg font-semibold leading-7">
                    {metric.value}
                  </h3>
                  <p className="mt-2 text-xs leading-5 opacity-80">{metric.detail}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Banknote className="size-4 text-slate-500" aria-hidden="true" />
                  <h2 className="text-base font-semibold text-slate-950">
                    投入概览
                  </h2>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  首期投入以 PoC 和部门级试点为主，避免一开始进入重型建设。
                </p>
              </div>
              <span className="w-fit rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500">
                总投入 {formatCurrency(totalInvestment)}
              </span>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {investmentItems.map((item) => (
                <article
                  key={item.label}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="text-xs font-medium text-slate-500">{item.label}</p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-950">
                    {formatCurrency(item.value)}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-slate-900 bg-slate-950 p-5 text-white shadow-sm sm:p-6">
            <div className="flex items-center gap-2">
              <Target className="size-4 text-slate-300" aria-hidden="true" />
              <h2 className="text-base font-semibold">最终建议</h2>
            </div>
            <div className="mt-4 rounded-xl border border-white/10 bg-white/10 p-4">
              <p className="text-xs font-medium text-slate-300">咨询结论</p>
              <h3 className="mt-2 text-2xl font-semibold">
                {roiPlan.recommendationZh}
              </h3>
              <p className="mt-1 text-sm text-slate-300">
                {roiPlan.recommendationZh} · 风险等级 {roiPlan.riskLevel}
              </p>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              {roiPlan.finalReasoning}
            </p>
            <div className="mt-5 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4">
              <p className="text-sm font-medium text-emerald-100">建议下一步</p>
              <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                先以受控 PoC / pilot 锁定业务收益，PoC 后重新校准 ROI 假设，再决定是否扩大部署。
              </p>
            </div>
          </aside>
        </section>

        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <LineChart className="size-4 text-slate-500" aria-hidden="true" />
                <h2 className="text-base font-semibold text-slate-950">
                  预期业务收益
                </h2>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                收益不只看成本节省，也看知识复用、流程效率和服务质量。
              </p>
            </div>
            <span className="w-fit rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              年度节省 {formatCurrency(annualSavings)}
            </span>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {benefitItems.map((item) => (
              <article
                key={item.label}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <p className="text-xs font-medium text-slate-500">{item.label}</p>
                <h3 className="mt-2 break-words text-base font-semibold leading-6 text-slate-950">
                  {item.value}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
              </article>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-950">
                  年度收益拆解
                </h3>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  将年度节省拆成可解释的业务来源，便于管理层评审。
                </p>
              </div>
              <span className="w-fit rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
                合计 {formatCurrency(annualSavings)}
              </span>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              {roiPlan.benefits.savingsBreakdown.map((item) => (
                <article
                  key={item.label}
                  className="rounded-lg border border-slate-200 bg-white p-3"
                >
                  <p className="text-xs font-medium text-slate-500">{item.label}</p>
                  <p className="mt-2 text-lg font-semibold text-slate-950">
                    {formatCurrency(item.value)}
                  </p>
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    {item.detail}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="grid items-start gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
          <div className="h-fit rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="size-4 text-slate-500" aria-hidden="true" />
              <h2 className="text-base font-semibold text-slate-950">
                ROI 计算口径
              </h2>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              计算口径：首年净收益 = 年度节省 - 总投入；ROI = 首年净收益 / 总投入。
            </p>

            <div className="mt-5 space-y-3">
              {roiMetrics.map((metric, index) => (
                <div
                  key={metric.label}
                  className={cn(
                    "flex items-center justify-between gap-4 rounded-xl border p-4",
                    index === 3
                      ? "border-slate-900 bg-slate-950 text-white"
                      : "border-slate-200 bg-slate-50 text-slate-950"
                  )}
                >
                  <p className="text-sm font-medium opacity-80">{metric.label}</p>
                  <p className="text-lg font-semibold">{metric.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-slate-950">
                计算假设
              </h3>
              <ul className="mt-3 space-y-2">
                {roiPlan.assumptions.map((assumption) => (
                  <li
                    key={assumption}
                    className="flex gap-2 text-sm leading-6 text-slate-600"
                  >
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-slate-400" />
                    <span>{assumption}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-2">
              <ShieldAlert className="size-4 text-slate-500" aria-hidden="true" />
              <h2 className="text-base font-semibold text-slate-950">
                风险评估
              </h2>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              风险不是阻止项目推进，而是决定 PoC 范围和上线顺序。
            </p>

            <div className="mt-5 grid gap-3 lg:grid-cols-2">
              {riskItems.map((risk) => (
                <article
                  key={risk.label}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-slate-950">
                        {risk.label}
                      </h3>
                    </div>
                    <span className="w-fit rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                      {risk.level}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{risk.detail}</p>
                  <p className="mt-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-6 text-slate-700">
                    建议：{risk.action}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-slate-500" aria-hidden="true" />
                <h2 className="text-base font-semibold text-slate-950">
                  ROI 证据链
                </h2>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                说明管理层结论如何从客户诊断、PoC 假设与部署边界逐步形成。
              </p>
            </div>
            <span className="w-fit rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500">
              基于证据的 ROI
            </span>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "需求分析输入",
                value: activeProject.painPoints.slice(0, 2).join("；"),
              },
              {
                label: "PoC 验证假设",
                value: activeProject.pocPlan.metrics.slice(0, 3).join("、"),
              },
              {
                label: "部署成本边界",
                value: activeProject.recommendedSolution.deployment,
              },
              {
                label: "管理层结论",
                value: `${roiPlan.recommendationZh}，预计 ROI ${formatPercent(roiPercent)}`,
              },
            ].map((item, index) => (
              <article
                key={item.label}
                className={cn(
                  "rounded-xl border p-4",
                  index === 3
                    ? "border-slate-900 bg-slate-950 text-white"
                    : "border-slate-200 bg-slate-50 text-slate-700"
                )}
              >
                <p className="text-xs font-medium opacity-70">
                  证据 {index + 1}
                </p>
                <h3 className="mt-2 text-sm font-semibold">{item.label}</h3>
                <p className="mt-2 text-xs leading-5 opacity-75">{item.value}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_320px] lg:items-center">
            <div>
              <div className="flex items-center gap-2">
                <DollarSign className="size-4 text-slate-500" aria-hidden="true" />
                <h2 className="text-base font-semibold text-slate-950">
                  管理层汇报口径
                </h2>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                本项目不建议直接承诺“全面自动化”或一次性全量上线。更稳妥的路径是：
                先用受控 PoC / pilot 验证知识库、Agent 工作流和流程效率；PoC
                后根据真实命中率、人工节省和业务采纳度重新校准 ROI。只要数据范围和流程边界受控，当前风险属于可管理范围。
              </p>
            </div>
            <div className="rounded-xl border border-slate-900 bg-slate-950 p-4 text-white">
              <p className="text-sm font-medium text-slate-300">一句话结论</p>
              <p className="mt-2 text-lg font-semibold leading-7">
                在控制数据和流程风险的前提下，该 AI 项目具备进入试点的投资价值。
              </p>
            </div>
          </div>
        </section>
      </div>
    </WorkspaceShell>
  );
}
