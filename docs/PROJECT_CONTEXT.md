# 项目上下文

> 文档类型：当前产品事实源
> 状态：当前有效
> 最后复核：2026-09-02（Asia/Shanghai）
> 说明：部署细节归 `DEPLOYMENT_HANDOFF.md`，会话增量归 `HANDOFF.md`。

## 1. 当前阶段

Enterprise AI Solution Studio 已完成 interview-ready public demo MVP，当前阶段为：

```text
稳定基线封存 + 面试演示维护
```

产品中文名为**企业 AI 解决方案工作台**。它服务于 AI 解决方案顾问、AI 售前、AI
实施与部署方向的求职展示，不是普通 Chatbot，也不是生产级多租户 SaaS。

核心链路：

```text
Dashboard -> Customers -> Analysis -> Solution -> PoC -> Deployment -> ROI
```

## 2. 当前作品可展示的能力

2026-09-09 复核说明：下列是产品设计/代码证据，不等于本人已通过独立实现、客户现场
交付或面试表达的能力测评。测试通过也不证明模型输出的业务准确率。

### 产品与解决方案

- 以客户、项目、业务目标和当前阶段组织企业 AI 售前工作流。
- 把需求分析、方案设计、PoC、部署规划和 ROI 串成完整咨询路径。
- 能在业务价值、技术选型、验证门槛、安全边界和交付风险之间做取舍。
- Dashboard、客户切换、当前项目和工作流阶段共享同一套语义。

### 真实 AI vertical slice

- Analysis 通过 `/api/analysis/generate` 调用服务端 Provider Adapter。
- 国内主路径使用 ModelScope；代码级备选包括 OpenRouter、Gemini、Groq 和 OpenAI。
- Provider Key 仅在服务端读取；请求包含大小限制、轻量限流和总超时。
- 输出经过结构化解析与校验；ModelScope 瞬时错误最多两次总尝试。
- 无 Key、超时、Provider 异常或解析失败时明确进入 Mock fallback。

### 状态、工程与部署

- `lib/current-project.ts` 提供脱敏演示项目；当前项目和 Analysis 草案按项目保存到
  `localStorage`。
- 当前本地分支：Next.js 16.3.4、React 19、TypeScript、Tailwind CSS 4、App Router；未据此更新线上镜像。
- Node.js 22 standalone Docker 容器运行于 CloudBase Run。
- 单元测试、lint、production build 和 Playwright Browser QA 构成当前质量门。
- 国内 CloudBase 主站是唯一推荐的公网演示入口。

## 3. 诚实边界

2026-09-09 本地 UI 增量：Dashboard 导航改为“使用指引”，首屏解释用途、示例和三步体验，
保留项目流程与切换，折叠次要动态和术语；没有改变服务端 AI 或案例数据模型。

2026-09-10 客户页：以业务问题区分四个案例，先预览再进入项目；手机双列。
交付流程条与右侧阶段上下文仅在需求分析至 ROI 等流程页显示，不放在客户选择页。

已经实现并可验证：

- Web 页面、路由、交互、共享工作区和浏览器持久化。
- Analysis 服务端真实模型调用、错误分类、结构化解析、重试和 fallback。
- CloudBase 容器发布、国内访问与一次完整 Real AI 公网验收。

用于演示或静态表达：

- 客户、项目、PoC 结果和 ROI 数字。
- Solution 中的 RAG、Agent 和企业系统集成设计。
- Deployment 中的企业级安全、权限、审计和上线阶段。

没有实现：

- 登录、权限、数据库、多租户和跨设备同步。
- 真实 RAG 检索、Agent 后台执行和企业数据接入。
- 生产级监控、告警、审计、Secret 管理和 SLA。

## 4. 仓库与线上基线

| 维度 | 当前事实 |
| --- | --- |
| 公开仓库 | `https://github.com/WalDesigner/enterprise-ai-solution-studio` |
| 可见性 / 分支 | Public / `main` |
| 稳定标记 | `interview-ready-2026-09` |
| 国内线上版本 | CloudBase `010` |
| 国内路由最近复查 | 2026-08-20：首页与 `/analysis` HTTP 200 |
| Real AI 最近完整验收 | 2026-08-19：`real-ai / modelscope / null` + 真实浏览器点击 |

2026-09-02 收口仅更新依赖安全覆盖和文档，没有修改应用行为或重新部署。线上 `010`
未因此包含新的依赖覆盖；应用业务源码未变不能推导线上依赖同样已修复。
旧 Netlify 实验站已经退役。2026-09-09 未重新核验线上镜像与依赖。

## 5. 当前维护策略

### Now

- 保持稳定版本、公开仓库安全和文档事实一致。
- 面试前 5 分钟短时预热首页与 `/analysis`，只执行一次真实生成。
- 外部 Provider 波动时如实说明 fallback，不连续重试消耗免费额度。
- 把主要精力转向项目讲解、AI 基础、系统设计和模拟面试。

### 只有反馈触发才做

- Dashboard / 导航信息架构优化。
- README 截图刷新或最小 GitHub Actions。
- ROI AI Narrative、真实 RAG 或可解释 Agent workflow。

### 明确不做

- 为作品完整度继续堆叠数据库、认证、支付、多租户或 Kubernetes。
- 维护已经漂移的第二套部署源。
- 未经明确授权开启付费能力、常驻实例或持续探活。

## 6. 入口

```text
Public demo:
https://enterprise-ai-studio-282223-9-1444381545.sh.run.tcloudbase.com

Public source:
https://github.com/WalDesigner/enterprise-ai-solution-studio
```

恢复入口见 `START_HERE.md`，当前交接见 `HANDOFF.md`，部署操作见
`DEPLOYMENT_HANDOFF.md`。
