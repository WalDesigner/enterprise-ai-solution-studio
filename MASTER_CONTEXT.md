# Enterprise AI Solution Studio 长期上下文

> 文档类型：稳定战略事实源
> 状态：当前有效
> 最后复核：2026-08-20（Asia/Shanghai）
> 当前状态不在本文件维护；新接手人从 `docs/START_HERE.md` 开始。

## 1. 项目使命

Enterprise AI Solution Studio（中文名：**企业 AI 解决方案工作台**）用于证明项目
负责人具备从企业模糊需求到 AI PoC、部署方案和价值评估的完整解决方案能力。

它服务于 AI 解决方案顾问、AI 售前、AI 实施和相关产品岗位求职。第一目标是向招聘方
清晰展示可验证的解决方案与交付能力，而不是追求算法研究、代码量或完整商业 SaaS。

决策优先级：

```text
Interview value > product capability > engineering elegance > code volume
```

## 2. 职业定位

目标方向：

- AI 解决方案顾问 / 工程师
- AI 产品售前 / Solutions Engineer
- AI 实施顾问
- 企业 AI 项目交付与产品方向

可证明的组合优势：

- 前端开发与现代 Web 产品实现经验。
- ToB 项目沟通、测试、验收和交付理解。
- SaaS 销售与企业客户场景理解。
- 能把业务目标、AI 能力、产品体验和实施风险放在同一套方案中讨论。
- 能用 AI Native 协作方式快速完成原型、验证、部署和交接。

不应把项目负责人包装为算法、模型训练或底层基础设施专家，也不应虚构真实客户项目。

## 3. 产品定位

产品面向 AI 售前顾问、实施工程师、解决方案顾问和企业数字化负责人，覆盖：

```text
客户进入
  -> 需求分析
  -> AI 方案设计
  -> PoC 验证
  -> 部署规划
  -> ROI 评估
```

这个产品不是：

- 普通聊天机器人。
- 单点 RAG Demo。
- 已经商业化的多租户 SaaS。
- 真实企业生产系统。

## 4. MVP 能力边界

面试 MVP 应持续保留：

- 企业级 Dashboard 和项目工作区。
- 客户 / 项目管理入口。
- AI 需求分析与结构化方案草案。
- AI 方案、RAG / Agent 设计表达。
- PoC 验证计划。
- 部署、安全和交付规划。
- ROI 投资回报评估。
- 真实 AI 与 Mock fallback 的清晰边界。
- 可公开访问并经过真实 AI 验收的国内主站。
- 不为形式上的“双站”长期维护已经漂移的镜像部署。
- README、架构、部署、演示、简历和交接材料。

当前阶段不主动建设：

- 完整认证、权限和多租户。
- 真实付费系统。
- 复杂数据库与企业系统集成。
- 重型微服务、Kubernetes 或大规模可观测性。
- 为炫技而引入的 Dify、n8n、MCP、RAG 或 Agent 依赖。

只有明确提升面试价值或真实产品需求时，才扩展这些能力。

## 5. 技术策略

基础技术方向：

- Next.js App Router + TypeScript + React。
- Tailwind CSS 与轻量组件体系。
- 服务端 Route Handler 保护 AI Provider Key。
- Provider Adapter 隔离模型服务差异。
- ModelScope 作为国内 Real AI 主路径，其他 Provider 作为代码级备选。
- Mock fallback 保证演示可继续，但必须诚实标识。
- 浏览器本地持久化满足单用户 Demo，不提前引入数据库。
- Docker standalone 容器用于国内服务端部署。
- Playwright 与单元测试按风险验证。

技术选择必须同时回答：目标用户能否访问、能否可靠演示、能否清楚解释、维护成本
是否适合当前求职阶段。

## 6. AI Native 协作原则

### Human / Product Owner

负责目标、产品判断、职业偏好、最终批准，以及 OAuth、MFA、支付、密钥录入等不可
替代动作。

### ChatGPT / Chief AI Architect

负责产品策略、Sprint 目标、架构评审、风险控制、面试价值和叙事校准。

### Codex / AI Technical Partner

负责仓库内端到端实现、诊断、验证、文档和工程判断。在明确边界内自主推进，不静默
改变产品方向、商业决策、重大架构、外部权限或 Git 策略。

详细协作规则以 `AGENTS.md` 和 `docs/OPERATING_SYSTEM.md` 为准。

## 7. 公开表达原则

- 文档和面试表达以简体中文为主，保留必要行业 English terms。
- 代码、变量名、文件名和 commit message 使用英文。
- 不虚构客户、数据、生产用户、收入或 SLA。
- 如实区分真实 AI、脱敏案例数据、静态咨询内容和 Mock fallback。
- 项目描述重点放在需求拆解、方案设计、PoC、部署、风险和 ROI，不只列技术栈。
- 任何 Token、账户信息和本地环境值都不能进入代码、文档、日志、截图或聊天。

## 8. 面试核心叙事

推荐主线：

> 这个项目不是普通 AI Chatbot，而是围绕 AI 解决方案顾问工作流程设计的企业 AI
> 工作台。我从客户和业务目标出发，把需求分析、AI 方案、PoC、部署和 ROI 连接成
> 一条可演示流程，并完成真实模型接入、失败降级、国内外部署和质量验证。它证明的
> 是我能把业务、AI 能力和交付风险组织成可落地方案。

## 9. 文档事实边界

为避免长期记忆互相冲突：

- 本文件只保存稳定使命、定位和范围。
- 当前阶段与优先级只写入 `docs/PROJECT_CONTEXT.md`。
- 当前会话与 Git 状态只写入 `docs/HANDOFF.md`。
- 线上版本与运维只写入 `docs/DEPLOYMENT_HANDOFF.md`。
- 工程验证与 Git 规则只写入 `docs/ENGINEERING.md`。
- 重要原因只写入 `docs/DECISIONS.md`。
- 历史事件只写入 Incident 和 Sprint Report。

入口与完整文档登记表见 `docs/START_HERE.md`。
