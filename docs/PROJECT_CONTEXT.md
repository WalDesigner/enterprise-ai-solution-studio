# 项目上下文

> 文档类型：当前产品事实源
> 状态：当前有效
> 最后复核：2026-08-20（Asia/Shanghai）
> 说明：部署细节归 `DEPLOYMENT_HANDOFF.md`，会话增量归 `HANDOFF.md`。

## 1. 当前阶段

Enterprise AI Solution Studio 已完成 interview-ready public demo MVP，当前进入：

```text
面试演示维护 + 首次用户理解优化
```

产品中文名统一为**企业 AI 解决方案工作台**。核心咨询链路是：

```text
Dashboard -> Customers -> Analysis -> Solution -> PoC -> Deployment -> ROI
```

这是一套面向 AI 解决方案顾问、AI 售前和 AI 实施岗位的可交互案例，不是生产级
商业 SaaS，也不是普通 Chatbot。

## 2. 当前可证明能力

### 产品与业务

- 以客户和项目为中心组织企业 AI 售前工作流。
- 将需求分析、AI 方案、PoC、部署和 ROI 串成完整咨询交付路径。
- Dashboard、客户切换、工作流阶段、当前能力和下一步入口保持共享语义。
- PoC、Deployment 和 ROI 已具备面试级咨询内容与可视化表达。

### 真实 AI

- Analysis 表单通过 `/api/analysis/generate` 调用服务端 Provider Adapter。
- 国内主路径使用 ModelScope；代码也支持 OpenRouter、Gemini、Groq 和 OpenAI。
- 输出经过结构化解析与校验；ModelScope 瞬时错误最多受限重试一次。
- 无 Key、Provider 异常、超时或解析失败时诚实进入 Mock fallback。
- API Key 只在服务端环境变量读取，浏览器端不接触密钥。

### 状态与体验

- `lib/current-project.ts` 是演示客户与项目目录的代码事实源。
- 当前项目、Analysis 表单、草案来源和生成结果按项目保存到浏览器 `localStorage`。
- 刷新或切换路由后可恢复；损坏或旧格式存储会被安全丢弃。
- 桌面和 390 x 844 移动视口已纳入 Browser QA。

### 工程与上线

- Next.js 16.2.12、React 19、TypeScript、Tailwind CSS 4、App Router。
- Node.js 22 standalone Docker 容器可部署到 CloudBase Run。
- 单元测试覆盖 Provider 重试与结构化解析；Playwright 覆盖核心路由和持久化流程。
- CloudBase 国内主站是唯一推荐的公网演示入口。

## 3. 当前仓库与线上基线

| 维度 | 当前事实 |
| --- | --- |
| 公开规范仓库 | `https://github.com/WalDesigner/enterprise-ai-solution-studio` |
| 可见性与分支 | Public / `main` |
| 公开历史边界 | 经过审查的单一 root snapshot；旧工程历史只在 Private archive 保留 |
| 国内线上版本 | CloudBase `010` |
| 国内线上应用代码 | 与公开 `main` 的应用文件一致；公开化只调整文档和 Git 历史 |
| 国内路由最近复查 | 2026-08-20：首页与 `/analysis` HTTP 200 |
| 国内 Real AI 最近完整验收 | 2026-08-19：`real-ai / modelscope / null` + 真实浏览器点击 |

CloudBase `010` 的应用文件与公开快照一致；公开化新增或更新的只是文档和 Git 边界，
因此无需为了公开仓库重新部署容器。旧 Netlify 部署已因代码漂移退役，不属于当前
运行基线。

完整 URL、配置、资源点、发布、验收和回滚说明见
[DEPLOYMENT_HANDOFF.md](DEPLOYMENT_HANDOFF.md)。

## 4. 当前产品问题

Dashboard 与左侧导航已经具备完整内容，但首次接触 SaaS 的用户仍可能不能迅速回答：

- 这个页面的用途是什么？
- 每个模块分别接收什么输入、产出什么结果？
- 当前客户、当前项目和当前阶段之间是什么关系？
- 我现在应该做什么，下一步去哪里？
- RAG、Agent、PoC、Deployment 和 ROI 在整条链路中的角色是什么？

这不是功能缺失，而是信息架构、内容层级和引导设计的问题。应作为独立产品化 Sprint
处理，不在文档整理中顺手修改 UI。

## 5. Now / Next

### Now

- 维护公开规范仓库和 CloudBase `010` 的可验证一致性。
- 保持 CloudBase `010` 可访问，最小实例 `0`、最大实例 `1`。
- 面试前预热首页和 `/analysis`，只执行一次真实生成，避免无意义资源消耗。

### Next

1. Dashboard 与导航信息架构优化。
2. 产品 UI 优化后刷新 README 截图；按收益决定是否增加最小 CI。
3. 企业项目整体代码与上线审查，只输出报告。

### Later

- ROI AI Narrative 与管理层汇报生成。
- 最小真实 RAG 检索或 Agent workflow 示例。
- 报告导出。

## 6. 明确不做

- 完整认证与权限系统。
- 数据库和多租户 SaaS。
- 支付、商业计费和生产 SLA。
- 重型微服务、Kubernetes 或为展示而增加的复杂基础设施。
- 未经授权的云套餐、超限按量、常驻实例或付费网络能力。

## 7. 公网入口

```text
Recommended public demo:
https://enterprise-ai-studio-282223-9-1444381545.sh.run.tcloudbase.com

Public source:
https://github.com/WalDesigner/enterprise-ai-solution-studio
```

国内主站是最新、通过 Real AI 验收的面试入口。旧 Netlify 站点已退出当前交付范围。
