"use client";

import { WorkspaceShell } from "@/components/workspace-shell";
import { useWorkspaceProject } from "@/components/workspace-provider";
import { DetailRows, NextStep, WorkflowPanel } from "@/components/workflow-content";

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
  const layers = [
    { label: "使用入口", value: "企业工作台：统一查看需求、方案与验证计划。" },
    { label: "模型接入", value: activeProject.recommendedSolution.model },
    { label: "知识增强", value: activeProject.recommendedSolution.rag },
    { label: "Agent 工作流", value: activeProject.recommendedSolution.agent },
    { label: "企业系统边界", value: activeProject.existingSystems.join("、") },
  ];
  return (
    <WorkspaceShell activeNav="deployment" breadcrumb="部署规划" title="把试验方案，落到上线计划"
      subtitle="明确部署方式、实施顺序与安全边界。这是客户试点的参考规划，不是云服务控制台。"
      badge="04 / 部署规划" backHref="/poc" backLabel="返回 PoC 验证">
      <div className="space-y-5">
        <WorkflowPanel title="推荐部署方式">
          <p className="max-w-4xl text-lg font-medium leading-8">{activeProject.recommendedSolution.deployment}</p>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500"><span>参考周期：{activeProject.timeline}</span><span>预算范围：{activeProject.budgetRange}</span><span>业务责任方：{activeProject.department}</span></div>
        </WorkflowPanel>
        <div className="grid gap-5 xl:grid-cols-2">
          <WorkflowPanel title="系统如何分工" description="以下包含拟建设的能力；不代表本工作台已接入企业系统、RAG 或 Agent 执行。">
            <DetailRows items={layers} />
          </WorkflowPanel>
          <WorkflowPanel title="按什么顺序实施" description="各阶段完成验收再推进，不一次性扩大范围。">
            <ol className="space-y-5">{rolloutSteps.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-teal-50 text-xs font-semibold text-teal-800">0{index + 1}</span>
                <div><h3 className="text-sm font-semibold">{step.title}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{step.description}</p></div>
              </li>
            ))}</ol>
          </WorkflowPanel>
        </div>
        <WorkflowPanel title="上线前必须确认的边界">
          <DetailRows items={[
            { label: "数据质量", value: activeProject.dataSituation },
            { label: "访问权限", value: "按部门、角色和资料类型限定可访问范围，知识源使用白名单。" },
            { label: "人工复核", value: "高风险输出与关键业务操作保留人工确认，不直接替代业务判断。" },
            { label: "故障与回滚", value: "约定失败回退、人工接管与恢复方式；在试点前演练。" },
            { label: "验收与记录", value: "明确负责人、验收指标与日志范围；只在获授权后接入真实数据。" },
          ]} />
        </WorkflowPanel>
        <NextStep title="下一步：核算这笔投入是否值得" description="结合部署成本和预期收益，查看 ROI 的估算口径与风险假设。" href="/roi" label="查看 ROI 估算" />
      </div>
    </WorkspaceShell>
  );
}
