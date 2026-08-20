# 产品路线图

> 文档类型：当前优先级与范围边界
> 状态：当前有效
> 最后复核：2026-08-20（Asia/Shanghai）

## 目标

保持企业 AI 解决方案工作台成为一个稳定、可信、容易讲清楚的面试作品。路线图按
面试价值排序，不以功能数量或工程复杂度排序。

## Now

### 1. 文档与交接体系收口

成功标准：

- 新接手人或新 Codex 能在 5 分钟内找到当前状态、线上版本、运行方法和下一步。
- 当前事实、稳定规则和历史档案职责清楚，没有互相矛盾的“唯一事实源”。
- 过时流程被删除或转为历史，命令和架构与代码一致。
- 不读取、不复制、不提交任何 Token。

### 2. 面试演示稳定性维护

- 保持 CloudBase 主站与 `/analysis` 可访问。
- 面试前短时预热并执行一次真实生成。
- 保持自动启停、最小实例 `0`、最大实例 `1`。
- 准备本地演示或录屏作为临时网络故障兜底。

### 3. GitHub 安全公开边界

- 旧工程仓库改名并作为 Private archive 只读保留。
- 公开规范仓库从经过审查的单一 root snapshot 开始。
- 不导入旧 PR、commit、branch、tag、SCF 直达地址、本机路径或本地作者元数据。
- 公开 `main` 禁止 force push 和删除；安全问题使用私密报告入口。
- 当前不添加开源 License；公开展示不等于默认授予复用许可。

## Next

### 1. Dashboard 与导航信息架构优化

目标是让第一次使用 SaaS 的人快速理解：

- 这个工作台解决什么问题。
- 每个模块的输入、动作和产出。
- 当前客户、项目、阶段和当前查看页面的关系。
- 当前任务与下一步行动。

范围应聚焦 Dashboard、左侧导航、关键说明和 CTA，不顺手扩展底层能力。

### 2. 公开呈现工程化

- Dashboard 优化完成后刷新 README 首屏和产品截图。
- 按维护收益决定是否增加最小 GitHub Actions；当前本地质量门继续有效。
- 只有 Product Owner 希望授予复用权时再选择开源 License。
- 定期复核 Live Demo、About homepage、源码链接和安全报告入口。

### 3. 企业项目整体审查

只输出报告：已完成、未完成、Bug、风险、上线准备度、面试价值和最高收益改进。

## Later

按面试收益重新评估后再选择：

1. ROI AI Narrative 与管理层汇报生成。
2. 最小真实 RAG 检索示例。
3. 可解释的 Agent workflow 演示。
4. 方案 / PoC / ROI 导出。
5. 更成熟的监控、日志和成本告警。

## Out of Scope for Current MVP

- 完整登录、权限与多租户。
- 生产数据库和真实企业数据接入。
- 支付、商业计费和正式 SLA。
- 大规模微服务、Kubernetes 或复杂 IaC。
- 没有明确用户价值的模型、Agent 或工具堆叠。
- 为已经漂移的历史站点维护第二套仓库和发布流程。

## 已完成里程碑

- 项目基础、工作区和 7 条核心路由。
- 脱敏客户与项目数据、统一工作流导航。
- Analysis 真实 AI vertical slice 与诚实 Mock fallback。
- ModelScope 30B、结构化解析和瞬时失败受限重试。
- 浏览器本地持久化与 Solution 同步。
- 移动端体验、生成等待状态、单元测试和 Browser QA。
- CloudBase 国内 Real AI 主站；Netlify 早期实验站完成评估后退役。
- CloudBase 免费额度根因分析、0-1 实例控制和发布后验收。
- README、架构、演示、简历、部署和故障复盘材料。
- GitHub clean-history 公开仓库、Private archive 隔离边界和公开安全说明。

公开切换后的变更由当前 Git 历史维护；更早的工程事实只在 `Sprint_Report.md`、
Incident Report 和 Private archive 中保留。
