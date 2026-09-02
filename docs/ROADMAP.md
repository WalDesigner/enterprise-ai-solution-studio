# 产品路线图

> 文档类型：当前优先级与范围边界
> 状态：当前有效
> 最后复核：2026-09-02（Asia/Shanghai）

## 决策

企业 AI 解决方案工作台已经达到可投递、可演示、可讲解的面试作品标准。路线图从
“继续建设”切换为“稳定封存、反馈驱动”：没有真实招聘反馈或明确产品目标时，不再
自动扩功能。

## Now — 面试阶段维护

1. 保持公开仓库、CloudBase `010` 和文档边界一致。
2. 只处理安全更新、明确 Bug、链接失效和面试演示阻塞。
3. 面试前短时预热，不持续探活或反复调用免费 ModelScope。
4. 使用 `DEMO_GUIDE.md` 练习 5 分钟演示和真实能力边界。
5. 把主要时间投入岗位理解、AI / Agent 知识、项目深挖和模拟面试。

## Next — 只由证据触发

以下事项只有在多次面试反馈、真实用户反馈或明确商业需求指向时才启动独立 Sprint：

1. Dashboard 与导航信息架构优化。
2. 刷新 README 截图或增加最小 CI。
3. ROI AI Narrative 与管理层汇报生成。
4. 最小真实 RAG 检索示例。
5. 可解释、可评估的 Agent workflow。

每次只选择一个目标，必须先回答它如何提高面试转化或真实产品价值。

## Later — 商业化后再评估

- 登录、权限、数据库和多租户。
- 企业数据接入、审计、监控、告警和生产 Secret 管理。
- 报告导出、正式 SLA、付费和规模化基础设施。
- 自定义域名、备案与长期品牌运营。

## 当前明确不做

- 为展示而引入 Dify、n8n、MCP、复杂 Agent 或 Kubernetes。
- 把静态 PoC、部署和 ROI 内容描述为真实客户结果。
- 为退役 Netlify 站点维护第二套仓库或同步流程。
- 未经授权购买云套餐、开启超限按量、付费日志或常驻实例。

## 已完成里程碑

- Dashboard、Customers、Analysis、Solution、PoC、Deployment、ROI 七条核心路由。
- 脱敏案例、统一工作区、项目切换和浏览器本地持久化。
- ModelScope 真实 AI vertical slice、结构化解析、错误分类、受限重试和 Mock fallback。
- 移动端适配、加载反馈、unit、lint、build 和 Browser QA。
- CloudBase 国内版本 `010`、0-1 实例策略、免费额度复盘和真实 AI 公网验收。
- 公开 clean-history GitHub 仓库、Private archive 隔离和安全报告机制。
- README、长期记忆、架构、工程、部署、演示、简历与故障复盘文档。
- 2026-09 依赖安全归零、文档最终收口和 `interview-ready-2026-09` 稳定标记。

历史时间线只读 `Sprint_Report.md` 和 Incident；当前状态只读 `PROJECT_CONTEXT.md` 与
`HANDOFF.md`。
