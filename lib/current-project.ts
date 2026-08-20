export type WorkflowStageKey =
  | "analysis"
  | "solution"
  | "poc"
  | "deployment"
  | "roi";

export const PRODUCT_NAME_ZH = "企业 AI 解决方案工作台";
export const PRODUCT_TAGLINE_ZH = "售前方案与落地验证工作台";

export type ProjectActivity = {
  time: string;
  title: string;
  detail: string;
};

export type RoiRecommendation =
  | "Highly Recommended"
  | "Recommended"
  | "Conditional"
  | "Not Recommended";

export type RoiRiskItem = {
  level: string;
  detail: string;
  action: string;
};

export type RoiSavingsItem = {
  label: string;
  value: number;
  detail: string;
};

export type RoiPlan = {
  recommendation: RoiRecommendation;
  recommendationZh: string;
  riskLevel: string;
  confidenceScore: number;
  investment: {
    initialDeploymentCost: number;
    platformApiCost: number;
    trainingCost: number;
    maintenanceCost: number;
    implementationCost: number;
  };
  benefits: {
    laborCostSavings: number;
    annualSavings: number;
    responseTimeReduction: string;
    knowledgeReuse: string;
    processAutomation: string;
    serviceQualityImprovement: string;
    savingsBreakdown: readonly RoiSavingsItem[];
  };
  risks: {
    technicalRisk: RoiRiskItem;
    dataReadiness: RoiRiskItem;
    organizationAdoption: RoiRiskItem;
    processComplexity: RoiRiskItem;
    integrationRisk: RoiRiskItem;
  };
  assumptions: readonly string[];
  finalReasoning: string;
};

export type ProjectRecord = {
  id: string;
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
  projectStatus: string;
  workflowStage: WorkflowStageKey;
  owner: string;
  lastUpdated: string;
  continueHref: string;
  recentActivity: readonly ProjectActivity[];
};

export const workflowStages = [
  {
    key: "analysis",
    label: "需求输入",
    zhLabel: "需求分析",
    route: "/analysis",
  },
  {
    key: "solution",
    label: "方案设计",
    zhLabel: "AI 方案",
    route: "/solution",
  },
  { key: "poc", label: "验证计划", zhLabel: "PoC 验证", route: "/poc" },
  {
    key: "deployment",
    label: "部署路径",
    zhLabel: "部署规划",
    route: "/deployment",
  },
  { key: "roi", label: "价值评估", zhLabel: "ROI 报告", route: "/roi" },
] as const satisfies ReadonlyArray<{
  key: WorkflowStageKey;
  label: string;
  zhLabel: string;
  route: string;
}>;

export const projectCatalog = [
  {
    id: "tj-auto-parts-upgrade",
    projectName: "天津汽车零部件企业AI升级",
    customerName: "天津汽车零部件企业",
    industry: "制造业 / 汽配",
    companySize: "300-500 人，多工厂协同",
    department: "售后服务中心 / 质量管理部",
    painPoints: [
      "售后知识分散，查询依赖人工经验",
      "工单分流效率低，响应速度不稳定",
      "销售线索筛选缺少统一规则",
    ],
    existingSystems: ["ERP", "CRM", "知识库", "飞书", "企微", "Excel 台账"],
    dataSituation:
      "历史工单、产品手册、质检记录较完整，但格式分散，需要统一清洗和结构化。",
    aiGoals: [
      "提升售后响应效率",
      "降低新人培训成本",
      "提升销售线索筛选效率",
    ],
    budgetRange: "5-10万 PoC，后续按部门扩展",
    timeline: "2-3 周 PoC，6 周试点",
    aiOpportunities: ["自动化流程", "知识库增强", "Agent 协同", "ROI 评估"],
    recommendedSolution: {
      model: "通用大模型 + 企业知识增强",
      agent: "售后分流 Agent、线索分析 Agent、人工确认节点",
      rag: "接入产品手册、历史工单、FAQ 和销售材料",
      workflow: "需求分析 → 方案设计 → PoC 验证 → 部署规划 → ROI 汇报",
      deployment: "轻量前端工作台 + 托管模型 API + 分阶段权限与审计",
    },
    pocPlan: {
      goal: "验证企业知识库问答、工单分流和线索筛选三类能力是否能在真实业务中提升效率。",
      metrics: [
        "知识命中率",
        "回答可用率",
        "人工处理时长缩短比例",
        "业务接受度",
      ],
      testData: [
        "产品手册",
        "历史工单",
        "FAQ",
        "销售话术",
        "匿名化客户问题",
      ],
      expected:
        "输出一版可演示的售前验证结果，证明知识增强和工作流编排可以降低人工重复劳动。",
      risk: "静态 PoC 演示不代表真实模型效果，数据质量不足时需要二次校准。",
      riskLevel: "中等",
    },
    projectStatus: "需求分析进行中",
    workflowStage: "analysis",
    owner: "售前顾问 / Garen",
    lastUpdated: "脱敏案例数据",
    continueHref: "/analysis",
    recentActivity: [
      {
        time: "案例步骤 01",
        title: "项目范围确认",
        detail: "已识别售后知识、工单分流和销售线索三个优先场景。",
      },
      {
        time: "案例步骤 02",
        title: "需求输入整理",
        detail: "已归纳业务痛点、现有系统、数据基础和 AI 落地目标。",
      },
      {
        time: "案例步骤 03",
        title: "进入方案草案",
        detail: "下一步补全需求输入并生成可复核的 AI 方案草案。",
      },
    ],
  },
  {
    id: "tj-auto-parts-group",
    projectName: "天津汽车零部件集团售后知识库",
    customerName: "天津汽车零部件集团",
    industry: "制造业 / 汽配",
    companySize: "1000+ 人，跨厂区协作",
    department: "客户支持中心",
    painPoints: [
      "知识检索慢",
      "售后标准不统一",
      "工单复用率低",
    ],
    existingSystems: ["ERP", "知识库", "企微"],
    dataSituation: "历史知识文档和工单数据较多，但标签体系不一致。",
    aiGoals: ["知识问答提效", "售后分流提效"],
    budgetRange: "10-20万 PoC",
    timeline: "3 周 PoC，8 周试点",
    aiOpportunities: ["知识库增强", "流程自动化"],
    recommendedSolution: {
      model: "企业知识增强模型",
      agent: "售后问答 Agent",
      rag: "FAQ + 维保手册 + 工单历史",
      workflow: "分析 → 方案 → 验证",
      deployment: "托管模型 + 简单前端工作台",
    },
    pocPlan: {
      goal: "验证知识问答和工单复用是否可提升客服效率。",
      metrics: ["命中率", "响应时长", "一次解决率"],
      testData: ["维保手册", "售后 FAQ", "历史工单"],
      expected: "形成知识库演示和客服分流闭环。",
      risk: "数据标签不统一会影响检索效果。",
      riskLevel: "中等",
    },
    projectStatus: "AI方案设计中",
    workflowStage: "solution",
    owner: "方案顾问 / 张敏",
    lastUpdated: "脱敏案例数据",
    continueHref: "/solution",
    recentActivity: [
      {
        time: "案例步骤 01",
        title: "方案草案更新",
        detail: "补充知识库与问答 Agent 的推荐路径。",
      },
      {
        time: "案例步骤 02",
        title: "客户访谈完成",
        detail: "确认主要诉求是降低客服重复查询时间。",
      },
    ],
  },
  {
    id: "north-marine-supply",
    projectName: "北方海工供应链公司PoC验证",
    customerName: "北方海工供应链公司",
    industry: "制造业 / 海工",
    companySize: "500-800 人",
    department: "运营与供应链中心",
    painPoints: ["流程节点多", "人工审批多", "数据散落在不同系统"],
    existingSystems: ["ERP", "OA", "报表中心"],
    dataSituation: "流程日志和审批记录较完整，适合做 PoC 验证。",
    aiGoals: ["验证 Agent 协同", "缩短审批周期"],
    budgetRange: "8-15万 PoC",
    timeline: "2 周验证",
    aiOpportunities: ["Agent 协同", "流程自动化", "ROI 评估"],
    recommendedSolution: {
      model: "企业流程增强模型",
      agent: "审批协同 Agent",
      rag: "接入审批规范和历史流程",
      workflow: "分析 → 方案 → PoC",
      deployment: "内部试点 + 受控 API",
    },
    pocPlan: {
      goal: "验证流程自动化是否能缩短审批时间并降低重复沟通。",
      metrics: ["审批时长", "人工介入次数", "流程回退率"],
      testData: ["审批单", "流程日志", "历史报表"],
      expected: "输出可量化的流程效率提升结果。",
      risk: "流程复杂度高，需严格限定验证范围。",
      riskLevel: "偏高",
    },
    projectStatus: "PoC验证中",
    workflowStage: "poc",
    owner: "实施顾问 / 李强",
    lastUpdated: "脱敏案例数据",
    continueHref: "/poc",
    recentActivity: [
      {
        time: "案例步骤 01",
        title: "PoC 范围锁定",
        detail: "优先验证审批和流程协同。",
      },
      {
        time: "案例步骤 02",
        title: "测试数据整理",
        detail: "已收集审批单和流程日志样例。",
      },
    ],
  },
  {
    id: "north-china-saas-growth",
    projectName: "华北 SaaS 增长团队ROI评估",
    customerName: "华北 SaaS 增长团队",
    industry: "软件 / SaaS",
    companySize: "80-150 人",
    department: "增长与销售团队",
    painPoints: ["线索筛选粗放", "销售跟进节奏不稳定", "管理层需要 ROI 口径"],
    existingSystems: ["CRM", "数据看板", "工单系统"],
    dataSituation: "线索与转化数据较完整，适合做 ROI 评估与价值对比。",
    aiGoals: ["提升线索质量", "做 ROI 汇报"],
    budgetRange: "5-8万验证",
    timeline: "2 周验证",
    aiOpportunities: ["线索分析", "ROI 评估"],
    recommendedSolution: {
      model: "销售增长分析模型",
      agent: "线索评分 Agent",
      rag: "接入销售话术和客户问答",
      workflow: "分析 → 方案 → ROI",
      deployment: "轻量前端 + 分析 API",
    },
    pocPlan: {
      goal: "验证线索评分和 ROI 口径是否能帮助管理层决策。",
      metrics: ["线索转化率", "跟进效率", "ROI 可解释性"],
      testData: ["线索明细", "销售记录", "转化报表"],
      expected: "形成销售增长和价值评估的闭环说明。",
      risk: "销售数据口径不统一时，需要先做数据清洗。",
      riskLevel: "中等",
    },
    projectStatus: "部署规划中",
    workflowStage: "deployment",
    owner: "增长顾问 / 王婷",
    lastUpdated: "脱敏案例数据",
    continueHref: "/deployment",
    recentActivity: [
      {
        time: "案例步骤 01",
        title: "部署方案预留",
        detail: "当前已进入部署规划阶段。",
      },
      {
        time: "案例步骤 02",
        title: "ROI 口径确认",
        detail: "确定需展示成本收益与管理层汇报口径。",
      },
    ],
  },
] as const satisfies readonly ProjectRecord[];

export const defaultProjectId = projectCatalog[0].id;

export const projectRoiPlans: Record<string, RoiPlan> = {
  "tj-auto-parts-upgrade": {
    recommendation: "Recommended",
    recommendationZh: "建议推进",
    riskLevel: "中等",
    confidenceScore: 82,
    investment: {
      initialDeploymentCost: 35000,
      platformApiCost: 18000,
      trainingCost: 12000,
      maintenanceCost: 20000,
      implementationCost: 30000,
    },
    benefits: {
      laborCostSavings: 96000,
      annualSavings: 238000,
      responseTimeReduction: "售后问题首响时间预计下降 35%-45%",
      knowledgeReuse: "产品手册、FAQ、历史工单复用率预计提升 40%",
      processAutomation: "重复工单分流与线索初筛覆盖 30%-40%",
      serviceQualityImprovement: "新人处理一致性提升，一次解决率预计提升 15%-20%",
      savingsBreakdown: [
        {
          label: "人力时间节省",
          value: 96000,
          detail: "售后查询、重复答复和线索初筛减少的人工时间。",
        },
        {
          label: "响应效率收益",
          value: 48000,
          detail: "首响时间缩短带来的客服吞吐提升。",
        },
        {
          label: "知识复用收益",
          value: 36000,
          detail: "产品手册、FAQ 和历史工单被重复利用。",
        },
        {
          label: "流程自动化收益",
          value: 42000,
          detail: "工单分流、资料匹配和低风险判断自动化。",
        },
        {
          label: "服务质量收益",
          value: 16000,
          detail: "新人处理一致性和一次解决率提升。",
        },
      ],
    },
    risks: {
      technicalRisk: {
        level: "中等",
        detail: "RAG 命中率和 Agent 分流准确率需要用真实工单验证。",
        action: "先限定售后知识库和线索分析两个高频场景。",
      },
      dataReadiness: {
        level: "中等偏高",
        detail: "历史工单和产品文档完整，但格式分散。",
        action: "PoC 前完成资料清洗、标签统一和脱敏样例集。",
      },
      organizationAdoption: {
        level: "中等",
        detail: "售后团队需要接受 AI 辅助分流，而不是完全替代人工判断。",
        action: "保留人工确认节点，先让资深客服参与验收。",
      },
      processComplexity: {
        level: "中等",
        detail: "售后、质量和销售线索流程存在跨部门协作。",
        action: "先围绕单部门闭环验证，再扩展跨部门流程。",
      },
      integrationRisk: {
        level: "中等",
        detail: "ERP、CRM、企微等系统接入需要分阶段确认权限边界。",
        action: "首期使用导入数据和轻量接口，避免重型集成阻塞验证。",
      },
    },
    assumptions: [
      "以首年部门级试点口径估算，不包含大型系统重构成本。",
      "效率收益按人工时间节省、响应效率和知识复用价值折算。",
      "PoC 阶段先验证售后知识库、工单分流和线索初筛三个高频场景。",
    ],
    finalReasoning:
      "该项目具备较明确的高频重复场景、可用知识资料和可量化效率指标，适合以中等投入启动 PoC。建议先验证售后知识库和工单分流，再扩展到销售线索分析。",
  },
  "tj-auto-parts-group": {
    recommendation: "Recommended",
    recommendationZh: "建议推进",
    riskLevel: "中等",
    confidenceScore: 78,
    investment: {
      initialDeploymentCost: 48000,
      platformApiCost: 24000,
      trainingCost: 18000,
      maintenanceCost: 26000,
      implementationCost: 42000,
    },
    benefits: {
      laborCostSavings: 142000,
      annualSavings: 312000,
      responseTimeReduction: "客服知识检索时间预计下降 40%",
      knowledgeReuse: "维保手册和历史工单复用率预计提升 45%",
      processAutomation: "售后问题分类与标准答复覆盖 35%",
      serviceQualityImprovement: "服务标准一致性提升，一次解决率预计提升 18%",
      savingsBreakdown: [
        {
          label: "人力时间节省",
          value: 142000,
          detail: "客服知识检索和重复答复减少的人工时间。",
        },
        {
          label: "响应效率收益",
          value: 62000,
          detail: "跨厂区售后问题处理时长缩短。",
        },
        {
          label: "知识复用收益",
          value: 48000,
          detail: "维保手册、FAQ 和历史工单统一复用。",
        },
        {
          label: "流程自动化收益",
          value: 38000,
          detail: "售后问题分类和标准答复自动化。",
        },
        {
          label: "服务质量收益",
          value: 22000,
          detail: "服务标准一致性和一次解决率提升。",
        },
      ],
    },
    risks: {
      technicalRisk: {
        level: "中等",
        detail: "知识标签不统一会影响检索召回和回答稳定性。",
        action: "先建立核心知识目录和人工校验样例。",
      },
      dataReadiness: {
        level: "中等偏高",
        detail: "资料量较大，但标签体系分散。",
        action: "优先清洗高频问题和标准维保手册。",
      },
      organizationAdoption: {
        level: "中等",
        detail: "客服团队需要适应标准答案与人工判断结合。",
        action: "用双轨试点对比人工和 AI 辅助处理效率。",
      },
      processComplexity: {
        level: "中等",
        detail: "售后问题涉及多产品线。",
        action: "先选择一个产品线进行封闭验证。",
      },
      integrationRisk: {
        level: "中等",
        detail: "知识库和企微接入存在权限配置工作。",
        action: "先用离线知识库验证，再做系统接入。",
      },
    },
    assumptions: [
      "以单产品线售后试点口径估算，暂不覆盖集团全部产品线。",
      "年度收益基于客服查询时间、知识复用和一次解决率提升估算。",
      "上线前需要完成高频知识目录、标签体系和验收样例集。",
    ],
    finalReasoning:
      "集团场景规模更大，收益空间更高，但前置数据治理要求也更高。建议以单产品线售后知识库为首期验证范围，成功后再扩展客服中心。",
  },
  "north-marine-supply": {
    recommendation: "Conditional",
    recommendationZh: "有条件推进",
    riskLevel: "偏高",
    confidenceScore: 68,
    investment: {
      initialDeploymentCost: 42000,
      platformApiCost: 22000,
      trainingCost: 16000,
      maintenanceCost: 24000,
      implementationCost: 36000,
    },
    benefits: {
      laborCostSavings: 118000,
      annualSavings: 226000,
      responseTimeReduction: "审批流平均处理周期预计下降 20%-30%",
      knowledgeReuse: "审批规范和历史流程复用率预计提升 30%",
      processAutomation: "低风险审批提醒和资料校验覆盖 25%-35%",
      serviceQualityImprovement: "流程回退率预计下降 10%-15%",
      savingsBreakdown: [
        {
          label: "人力时间节省",
          value: 118000,
          detail: "审批资料检查和重复沟通减少的人工时间。",
        },
        {
          label: "响应效率收益",
          value: 36000,
          detail: "审批流等待和补充材料时间缩短。",
        },
        {
          label: "知识复用收益",
          value: 26000,
          detail: "审批规范、历史流程和异常案例被复用。",
        },
        {
          label: "流程自动化收益",
          value: 32000,
          detail: "低风险提醒、资料校验和状态跟进自动化。",
        },
        {
          label: "服务质量收益",
          value: 14000,
          detail: "流程回退率和异常补件率下降。",
        },
      ],
    },
    risks: {
      technicalRisk: {
        level: "中等偏高",
        detail: "流程 Agent 需要处理多节点规则和异常路径。",
        action: "只选择一个审批流程作为 PoC 范围。",
      },
      dataReadiness: {
        level: "中等",
        detail: "流程日志较完整，但业务规则需要人工补齐。",
        action: "建立流程样例、异常样例和回退样例。",
      },
      organizationAdoption: {
        level: "中等偏高",
        detail: "审批流程涉及管理责任，完全自动化接受度有限。",
        action: "定位为辅助提醒和资料校验，不替代审批决策。",
      },
      processComplexity: {
        level: "高",
        detail: "审批流程节点多，跨部门协同复杂。",
        action: "先做低风险流程节点自动化。",
      },
      integrationRisk: {
        level: "中等偏高",
        detail: "OA 和 ERP 接入需要权限和审计确认。",
        action: "首期用导出数据模拟流程闭环。",
      },
    },
    assumptions: [
      "以单一审批场景估算，不直接替代管理审批决策。",
      "年度收益主要来自流程等待时间、资料校验和重复沟通减少。",
      "如果 OA / ERP 接入周期拉长，回收期需要重新评估。",
    ],
    finalReasoning:
      "该项目有明确流程效率收益，但流程复杂度和组织接受度风险较高。建议以单一审批场景做条件式 PoC，通过后再进入部署。",
  },
  "north-china-saas-growth": {
    recommendation: "Highly Recommended",
    recommendationZh: "高度建议推进",
    riskLevel: "中低",
    confidenceScore: 88,
    investment: {
      initialDeploymentCost: 28000,
      platformApiCost: 16000,
      trainingCost: 10000,
      maintenanceCost: 16000,
      implementationCost: 24000,
    },
    benefits: {
      laborCostSavings: 88000,
      annualSavings: 268000,
      responseTimeReduction: "线索初筛和跟进建议生成时间预计下降 50%",
      knowledgeReuse: "销售话术和客户问答复用率预计提升 35%",
      processAutomation: "线索评分、跟进提醒和报告生成覆盖 45%",
      serviceQualityImprovement: "高质量线索识别率预计提升 20%-25%",
      savingsBreakdown: [
        {
          label: "人力时间节省",
          value: 88000,
          detail: "销售线索初筛和周报整理减少的人工时间。",
        },
        {
          label: "响应效率收益",
          value: 56000,
          detail: "线索跟进建议和客户问题响应加速。",
        },
        {
          label: "知识复用收益",
          value: 42000,
          detail: "销售话术、客户问答和历史案例复用。",
        },
        {
          label: "流程自动化收益",
          value: 62000,
          detail: "线索评分、提醒和增长报告生成自动化。",
        },
        {
          label: "服务质量收益",
          value: 20000,
          detail: "高质量线索识别率和跟进一致性提升。",
        },
      ],
    },
    risks: {
      technicalRisk: {
        level: "中低",
        detail: "销售数据结构相对清晰，技术验证难度较低。",
        action: "先接入匿名化线索和转化报表。",
      },
      dataReadiness: {
        level: "中低",
        detail: "CRM 与转化数据较完整。",
        action: "统一线索来源、阶段和成交口径。",
      },
      organizationAdoption: {
        level: "中等",
        detail: "销售团队可能担心评分影响个人判断。",
        action: "将 AI 定位为辅助排序和跟进建议。",
      },
      processComplexity: {
        level: "中低",
        detail: "增长流程较短，适合快速试点。",
        action: "先覆盖线索初筛和周报生成。",
      },
      integrationRisk: {
        level: "中等",
        detail: "CRM 接口权限需要确认。",
        action: "首期使用导出数据，验证后再接入接口。",
      },
    },
    assumptions: [
      "以增长团队轻量试点口径估算，暂不包含全量 CRM 深度集成。",
      "收益主要来自线索筛选效率、跟进节奏和销售管理报告提效。",
      "若 CRM 字段口径不统一，需要先完成数据清洗再计算 ROI。",
    ],
    finalReasoning:
      "SaaS 增长场景数据较清晰、验证周期短、业务收益容易量化。建议优先推进线索评分和跟进建议 PoC，并快速形成管理层 ROI 汇报。",
  },
};

export const currentProject = projectCatalog[0];

export function getRoiPlan(projectId: string) {
  return projectRoiPlans[projectId] ?? projectRoiPlans[defaultProjectId];
}

export const customerRecords = projectCatalog.map((project) => ({
  id: project.id,
  projectName: project.projectName,
  name: project.customerName,
  industry: project.industry,
  status: project.projectStatus,
  stage: project.workflowStage,
  owner: project.owner,
  lastUpdated: project.lastUpdated,
  continueHref: project.continueHref,
  projectStatus: project.projectStatus,
}));

export function getProjectById(projectId: string) {
  return projectCatalog.find((project) => project.id === projectId);
}

export function getWorkflowStageIndex(stage: WorkflowStageKey) {
  return workflowStages.findIndex((workflowStage) => workflowStage.key === stage);
}

export function getWorkflowStageLabel(stage: WorkflowStageKey) {
  return (
    workflowStages.find((workflowStage) => workflowStage.key === stage)?.zhLabel ??
    workflowStages[0].zhLabel
  );
}

export function getWorkflowStageRoute(stage: WorkflowStageKey) {
  return (
    workflowStages.find((workflowStage) => workflowStage.key === stage)?.route ??
    workflowStages[0].route
  );
}

export function getWorkflowStageAction(stage: WorkflowStageKey) {
  switch (stage) {
    case "analysis":
      return "继续分析";
    case "solution":
      return "继续方案设计";
    case "poc":
      return "继续PoC验证";
    case "deployment":
      return "继续部署规划";
    case "roi":
      return "查看ROI报告";
    default:
      return "继续工作流";
  }
}
