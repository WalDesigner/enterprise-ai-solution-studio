export type AnalysisFormInput = {
  customerName: string;
  industry: string;
  companySize: string;
  department: string;
  painPoints: string;
  existingSystems: string;
  dataSituation: string;
  aiGoals: string;
  timeline: string;
  budgetRange: string;
};

export type AnalysisProjectContext = {
  projectName: string;
  customerName: string;
  industry: string;
  companySize: string;
  department: string;
  painPoints: readonly string[];
  existingSystems: readonly string[];
  dataSituation: string;
  aiGoals: readonly string[];
  budgetRange: string;
  timeline: string;
  aiOpportunities: readonly string[];
  recommendedSolution: {
    model: string;
    agent: string;
    rag: string;
    workflow: string;
    deployment: string;
  };
  pocPlan: {
    goal: string;
    metrics: readonly string[];
    testData: readonly string[];
    expected: string;
    risk: string;
    riskLevel: string;
  };
};

export type AiSolutionDraftSection = {
  title: string;
  content: string;
};

export type AiSolutionDraft = {
  title: string;
  summary: string;
  sections: AiSolutionDraftSection[];
  assumptions: string[];
  confidence: string;
  nextStep: string;
};

export type AiGenerationSource = "real-ai" | "mock-fallback";

export type AiProvider =
  | "openai"
  | "openrouter"
  | "gemini"
  | "groq"
  | "modelscope"
  | "mock";

export type AiErrorCategory =
  | "missing_key"
  | "unauthorized"
  | "model_unavailable"
  | "provider_error"
  | "timeout"
  | "network_error"
  | null;

export type GenerateSolutionDraftResponse = {
  source: AiGenerationSource;
  provider: AiProvider;
  errorCategory: AiErrorCategory;
  draft: AiSolutionDraft;
  note: string;
};

export function normalizeItems(value: string, fallback: readonly string[]) {
  const items = value
    .split(/[；;,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);

  return items.length ? items : fallback;
}

export function createMockSolutionDraft(
  formState: AnalysisFormInput,
  project: AnalysisProjectContext
): AiSolutionDraft {
  const painPoints = normalizeItems(formState.painPoints, project.painPoints);
  const systems = normalizeItems(formState.existingSystems, project.existingSystems);
  const goals = normalizeItems(formState.aiGoals, project.aiGoals);
  const customerName = formState.customerName || project.customerName;
  const timeline = formState.timeline || project.timeline;
  const budgetRange = formState.budgetRange || project.budgetRange;

  return {
    title: "AI方案草案",
    summary: `基于当前表单输入，建议优先从 ${customerName} 的售后知识库、工单分流和销售线索分析三条链路切入，先做可演示、可验证、可扩展的售前方案。`,
    sections: [
      {
        title: "客户痛点总结",
        content: `${customerName} 当前的核心问题集中在 ${painPoints.join("；")}。现有系统以 ${systems.join("、")} 为主，${formState.dataSituation || project.dataSituation} 这会直接影响售后响应效率与管理层对 AI 投入价值的判断。`,
      },
      {
        title: "AI机会点分析",
        content: `当前最值得切入的机会点包括 ${project.aiOpportunities.join("、")}。结合表单中的目标 ${goals.join("；")}，最优先的是将 ${formState.department || project.department} 的高频咨询和工单处理流程结构化，降低人工重复判断。`,
      },
      {
        title: "推荐AI方案",
        content: `建议采用 ${project.recommendedSolution.model}，并围绕 ${project.recommendedSolution.agent} 构建业务 Agent；知识层采用 ${project.recommendedSolution.rag}，工作流按照 ${project.recommendedSolution.workflow} 推进。`,
      },
      {
        title: "PoC验证范围",
        content: `PoC 控制在 ${timeline}，测试数据优先使用 ${project.pocPlan.testData.join("、")}。核心目标是验证知识命中率、回答可用率和人工处理时长是否有明显改善。`,
      },
      {
        title: "风险提示",
        content: `当前主要风险是 ${project.pocPlan.risk}。建议先控制数据范围和业务流程边界，保留人工确认节点，避免在 PoC 阶段承诺生产级自动化效果。`,
      },
      {
        title: "ROI假设",
        content: `若知识检索时间下降 40%，一线人员重复咨询减少 25%，销售线索初筛效率提升 30%，则该方案具备较高的 ROI 潜力，预算可优先覆盖 ${budgetRange}。`,
      },
    ],
    assumptions: [
      "当前输出基于表单输入和共享 mock 项目数据生成。",
      "真实 ROI 需要在 PoC 后用业务指标重新校准。",
      "上线前需要完成数据脱敏、权限边界和人工复核机制。",
    ],
    confidence: "中等：适合售前方案初稿，不替代正式技术评审。",
    nextStep: "进入 AI 方案设计页，细化模型、RAG、Agent 工作流和 PoC 验证指标。",
  };
}
