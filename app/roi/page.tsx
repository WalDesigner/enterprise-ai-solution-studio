"use client";

import { WorkspaceShell } from "@/components/workspace-shell";
import { useWorkspaceProject } from "@/components/workspace-provider";
import { DetailRows, NextStep, WorkflowPanel } from "@/components/workflow-content";
import { getRoiPlan } from "@/lib/current-project";

function formatCurrency(value: number) { return `¥${value.toLocaleString("zh-CN")}`; }
function formatPercent(value: number) { return `${Math.round(value)}%`; }

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
    <WorkspaceShell activeNav="roi" breadcrumb="ROI 报告" title="算清投入，再判断是否值得做"
      subtitle="ROI 是投资回报率。以下按案例假设估算首年收益，不代表真实业务成绩或收益承诺。"
      badge="05 / 投资回报估算" backHref="/deployment" backLabel="返回部署规划">
      <div className="space-y-5">
        <WorkflowPanel title={`案例建议：${roiPlan.recommendationZh}`} description={`风险等级：${roiPlan.riskLevel} · 评估依据需通过实际 PoC 校准`}>
          <p className="max-w-4xl text-sm leading-7 text-slate-700">{roiPlan.finalReasoning}</p>
          <dl className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4" data-testid="roi-summary">
            {[
              { label: "首年总投入", value: formatCurrency(totalInvestment) },
              { label: "年度节省估算", value: formatCurrency(annualSavings) },
              { label: "预计首年 ROI", value: formatPercent(roiPercent) },
              { label: "预计回收期", value: `${paybackMonths.toFixed(1)} 个月` },
            ].map(item => <div key={item.label} className="rounded-xl bg-slate-50 p-4"><dt className="text-xs text-slate-500">{item.label}</dt><dd className="mt-2 break-words text-xl font-semibold tabular-nums text-slate-950 sm:text-2xl">{item.value}</dd></div>)}
          </dl>
        </WorkflowPanel>
        <div className="grid gap-5 xl:grid-cols-2">
          <WorkflowPanel title="成本花在哪里" description="以下为案例中的首年成本口径，单位：人民币。">
            <DetailRows items={investmentItems.map(item => ({ label: item.label, value: <div><span className="font-semibold tabular-nums">{formatCurrency(item.value)}</span><p className="mt-1 text-xs leading-5 text-slate-500">{item.detail}</p></div> }))} />
          </WorkflowPanel>
          <WorkflowPanel title="预期收益来自哪里" description="各项节省属于假设，需要用实际业务基线校准。">
            <DetailRows items={roiPlan.benefits.savingsBreakdown.map(item => ({ label: item.label, value: <div><span className="font-semibold tabular-nums">{formatCurrency(item.value)}</span><p className="mt-1 text-xs leading-5 text-slate-500">{item.detail}</p></div> }))} />
          </WorkflowPanel>
        </div>
        <WorkflowPanel title="计算口径与假设">
          <DetailRows items={[
            { label: "首年净收益", value: `年度节省 − 总投入 = ${formatCurrency(netBenefit)}` },
            { label: "ROI", value: `首年净收益 ÷ 总投入 × 100% = ${formatPercent(roiPercent)}` },
            { label: "回收期", value: `总投入 ÷ 年度节省 × 12 = ${paybackMonths.toFixed(1)} 个月（按均匀节省估算）` },
          ]} />
          <ul className="mt-5 space-y-2 rounded-xl bg-amber-50/70 p-4 text-sm leading-6 text-amber-900">{roiPlan.assumptions.map(item => <li key={item}>· {item}</li>)}</ul>
          <details className="mt-5 border-t border-slate-100 pt-4"><summary className="cursor-pointer text-sm font-medium text-slate-700">展开业务收益与案例评分说明</summary><div className="mt-4"><DetailRows items={benefitItems.map(item => ({ label: item.label, value: <>{item.value}<p className="text-xs text-slate-500">{item.detail}</p></> }))} /><p className="mt-4 text-xs leading-6 text-slate-500">案例预设置信评分：{roiPlan.confidenceScore}/100；不是统计置信度，也不是系统实测评分。</p></div></details>
        </WorkflowPanel>
        <WorkflowPanel title="哪些风险会改变结论">
          <div className="divide-y divide-slate-100">{riskItems.map(item => (
            <details key={item.label} className="py-3 first:pt-0 last:pb-0"><summary className="cursor-pointer text-sm font-medium text-slate-800">{item.label}<span className="ml-3 text-xs font-normal text-slate-500">{item.level}</span></summary><p className="mt-3 text-sm leading-6 text-slate-600">{item.detail}</p><p className="mt-2 text-sm leading-6 text-teal-800">应对：{item.action}</p></details>
          ))}</div>
        </WorkflowPanel>
        <NextStep title="用验证数据，校准这份估算" description="这条体验路径已浏览到最后。实际决策仍需回到 PoC，用真实的成本、样本和效果修正假设。" href="/poc" label="回看 PoC 验证指标" />
      </div>
    </WorkspaceShell>
  );
}
