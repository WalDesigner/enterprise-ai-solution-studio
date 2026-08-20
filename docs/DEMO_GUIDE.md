# Enterprise AI Solution Studio 面试演示指南

> 产品中文名：企业 AI 解决方案工作台
> 最后复核：2026-08-20（Asia/Shanghai）

## 演示前 5 分钟

1. 优先打开国内主站：
   `https://enterprise-ai-studio-282223-9-1444381545.sh.run.tcloudbase.com`。
2. 打开 `/analysis`，只执行一次脱敏案例真实生成，确认显示“真实 AI 生成”和
   “模型服务：ModelScope”。
3. 准备本地演示或录屏作为网络故障兜底，不使用已经漂移的旧 Netlify 站点冒充
   当前版本。
4. 不打开环境变量页面，不展示任何 Key、账号或控制台敏感信息。
5. 如果 Real AI 临时失败，如实讲解 fallback 与免费 Provider 边界，不连续重复点击。

## 5 分钟 Demo Script

### 0:00 - 0:40 项目定位

这是一个面向 AI Solution Consultant / AI Pre-sales Engineer / AI Implementation Consultant 的企业 AI 解决方案工作台。它模拟真实售前与实施前期流程：客户进入后，从需求分析、AI 方案、PoC 验证、部署规划一路走到 ROI 投资回报评估。

核心价值不是展示一个聊天窗口，而是展示我如何把企业模糊需求拆成可验证、可落地、可汇报的 AI 项目方案。

### 0:40 - 1:20 Dashboard 与客户入口

从 Dashboard 开始，先说明当前项目、当前阶段、今日任务和工作流进度。然后进入 Customers 页面，展示客户列表、行业、状态、负责人和最后更新时间。

讲解重点：

- 企业 AI 项目不是从模型开始，而是从客户、场景和业务目标开始。
- 客户选择后会进入项目工作区，后续页面共享同一个当前项目状态。

### 1:20 - 2:00 需求分析 Analysis

进入 Analysis 页面，展示企业需求表单：客户名称、行业、痛点、现有系统、数据情况、AI 目标、周期和预算。点击生成 AI 方案草案。

讲解重点：

- 售前顾问需要把客户语言转化成 AI 机会点。
- 生成期间按钮、阶段提示、耗时与进度状态会持续反馈，避免用户误以为页面卡住。
- 这里是第一条真实 AI vertical slice：配置 provider key 后会通过服务端 AI Provider Adapter 调用 ModelScope / OpenRouter / Gemini / Groq / OpenAI 生成结构化售前方案草案。
- 没有 API key 或调用失败时会自动使用 Mock fallback，保证公开 Demo 稳定可演示。
- 这里展示的是需求结构化能力，而不是承诺真实模型效果。

### 2:00 - 2:45 AI Solution

进入 Solution 页面，展示推荐模型、Agent、RAG、工作流和部署方式。

讲解重点：

- 我会解释为什么该场景适合 RAG、Agent 和人工确认节点。
- 方案设计关注可落地性，不是一开始就追求复杂架构。
- 该页面展示售前方案表达能力和技术选型判断。

### 2:45 - 3:25 PoC

进入 PoC 页面，展示 PoC 目标、验证指标、测试数据、预期结果和风险提示。

讲解重点：

- 企业 AI 项目必须先验证，而不是直接上线。
- PoC 的成功指标要能被业务方理解和验收。
- 页面中的决策门槛用于判断是否进入部署。

### 3:25 - 4:10 Deployment

进入 Deployment 页面，展示部署蓝图、架构层级、安全边界、权限审计和上线阶段。

讲解重点：

- 企业部署要控制数据范围、权限、日志和人工接管。
- 先做轻量试点，再逐步扩展。
- 这体现实施顾问对交付风险的理解。

### 4:10 - 5:00 ROI

进入 ROI 页面，展示投资建议、总投入、年度节省、净收益、ROI、回收期、风险等级和最终咨询建议。

讲解重点：

- 管理层最终关心的是投入是否值得。
- ROI 页面把技术方案转成业务价值语言。
- 这里可以总结：我能同时理解业务、AI 应用、交付风险和价值评估。

## Interview Talking Points

- 这个项目围绕 AI 售前完整工作流设计，而不是单点 AI 功能。
- Dashboard 到 ROI 的链路体现了从客户问题到管理层决策的闭环。
- `lib/current-project.ts` 是当前共享项目数据源，避免页面间重复写 mock data。
- `WorkspaceShell` 和 `WorkflowStepper` 统一了全站导航、项目上下文和流程状态。
- Playwright Browser QA 用于验证核心路由、console error 和 horizontal overflow。
- 移动端导航、44px 触控目标、表单防自动缩放和 AI 等待状态均纳入回归。
- Analysis 页已经具备真实 AI 生成路径，其他模块仍以 Mock / 静态咨询交付物为主。

## Mock Boundary Explanation

当前版本是真实可运行的前端 MVP。Analysis 页已接入真实 AI 生成路径，但企业客户数据、PoC、部署和 ROI 仍以 Mock / 静态咨询交付物为主。

真实部分：

- Next.js 应用结构
- 页面路由与工作流导航
- 交互式需求分析表单
- 服务端 `/api/analysis/generate` AI 生成接口
- ModelScope / OpenRouter / Gemini / Groq / OpenAI API key 服务端读取与 Mock fallback
- 共享项目状态
- Dashboard / Customers / Analysis / Solution / PoC / Deployment / ROI 页面
- Browser QA 验证
- 面试演示材料

Mock / static 部分：

- 企业客户数据
- PoC 指标和测试数据
- 部署成本与 ROI 假设
- RAG、Agent 和模型执行效果

为什么这样设计：

- 面试阶段优先展示 AI 解决方案思维和交付闭环。
- 真实 LLM、RAG、数据库和认证会显著增加工程成本，但不一定立即提升面试讲解清晰度。
- 当前已具备真实模型生成链路和浏览器本地状态持久化；下一阶段可扩展 ROI 管理层叙述。

## What This Project Proves

- 能从企业客户视角拆解 AI 项目。
- 能设计售前需求分析、方案生成、PoC、部署和 ROI 流程。
- 能把 RAG、Agent、工作流、部署和风险控制讲成企业能理解的方案。
- 能使用现代前端技术快速构建可演示 SaaS MVP。
- 能用 AI Native 工作方式推进开发、验证、文档和包装。
- 能清楚管理真实能力与 Mock 边界。

## What This Project Does Not Yet Prove

- 已证明 Analysis 场景的真实 LLM 调用效果；尚未覆盖 ROI、PoC 等全部模块。
- 尚未证明真实 RAG 检索质量。
- 尚未证明生产级数据库、权限和多租户能力。
- 尚未证明真实企业系统集成能力。
- 已证明免费额度根因分析、0-1 实例控制和避免持续探活；尚未证明生产级监控、告警、
  分布式成本治理和 SLA。

## 常见追问回答

### 为什么不先做后端？

当前目标是面试价值最大化。对 AI 售前 / 解决方案岗位来说，先证明完整咨询流程、业务理解和演示能力，比过早做数据库 CRUD 更有价值。后端会在项目进入真实使用或多客户状态保存时补齐。

### 真实 AI 接到哪里了？

当前接入 Analysis -> AI 方案草案这一条窄链路。国内 CloudBase 版本已通过 ModelScope 真实生成验证，provider adapter 同时支持 OpenRouter、Gemini、Groq 和 OpenAI；Mock fallback 仍用于 API key、额度或模型异常时保证演示不中断。

### 如果继续做，你下一步做什么？

下一步先优化 Dashboard 与导航的信息架构，让首次接触 SaaS 的面试官能快速理解页面
用途、模块输入 / 产出、当前项目和下一步。随后再评估 ROI AI Narrative 与管理层汇报。
轻量状态持久化和国内 Real AI 已完成，不需要为当前 Demo 提前引入数据库。
