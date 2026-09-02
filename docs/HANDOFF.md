# 当前交接

> 文档类型：当前会话 / 当前 Sprint 的滚动交接
> 状态：当前有效
> 最后更新：2026-09-02（Asia/Shanghai）

## 1. 当前结论

企业 AI 解决方案工作台已经完成产品、公开仓库、国内部署和文档收口，进入
**interview-ready frozen baseline**：后续默认只做安全维护、可用性维护和由真实面试
反馈触发的高价值修改，不再为了“看起来更完整”继续扩功能。

本轮收口不修改 UI、业务流程或线上运行配置，不调用真实 AI，也不重新部署 CloudBase。

## 2. 产品与公开边界

- 产品中文名：企业 AI 解决方案工作台。
- 核心链路：Dashboard -> Customers -> Analysis -> Solution -> PoC -> Deployment -> ROI。
- 真实 AI：Analysis -> `/api/analysis/generate` -> Provider Adapter -> ModelScope。
- 本地状态：当前项目、Analysis 表单和草案按项目保存在 `localStorage`。
- 明确未实现：认证、数据库、多租户、真实 RAG、Agent 后台执行、企业系统集成和生产 SLA。
- 对外定位：面试级公开 MVP，不是已经服务真实客户的生产 SaaS。

稳定使命与能力边界见 [MASTER_CONTEXT.md](../MASTER_CONTEXT.md)，当前产品事实见
[PROJECT_CONTEXT.md](PROJECT_CONTEXT.md)。

## 3. Git 与 GitHub

| 项目 | 当前事实 |
| --- | --- |
| 公开仓库 | `https://github.com/WalDesigner/enterprise-ai-solution-studio` |
| 可见性 / 默认分支 | Public / `main` |
| 稳定标记 | `interview-ready-2026-09` |
| 旧工程历史 | 独立 Private archive，只读保留，不向公开仓库导入旧 refs |
| 公开安全边界 | 不含 `.env.local`、Token、私钥、旧 SCF 直达地址或本机绝对路径 |

2026-09-02 收口增加了传递依赖安全覆盖，`npm audit` 归零；应用代码和线上部署逻辑
没有变化。日常修改继续走 feature branch + PR，不 force push、rebase 或删除 `main`。

## 4. 公网与部署基线

```text
https://enterprise-ai-studio-282223-9-1444381545.sh.run.tcloudbase.com
https://enterprise-ai-studio-282223-9-1444381545.sh.run.tcloudbase.com/analysis
```

- CloudBase 服务：`enterprise-ai-studio`。
- 当前线上版本：`010`，体验版发布后自动承载 100% 流量。
- 最后完整 Real AI 验收：2026-08-19，`real-ai / modelscope / null`，并通过真实浏览器点击。
- 最后路由复查：2026-08-20，首页与 `/analysis` 均为 HTTP 200。
- 运行策略：自动启停，最小实例 `0`、最大实例 `1`，无定时扩缩容。
- 旧 Netlify 站点已经退役，不作为简历、回滚或备用入口。

线上版本、资源点、发布、回滚和面试前预热统一以
[DEPLOYMENT_HANDOFF.md](DEPLOYMENT_HANDOFF.md) 为准。

## 5. 文档恢复路径

新会话或新接手人按以下顺序恢复：

```text
AGENTS.md -> docs/START_HERE.md -> docs/HANDOFF.md
-> docs/PROJECT_CONTEXT.md -> 本次任务对应专题文档
```

- `MASTER_CONTEXT.md`：长期使命、定位、范围和公开表达。
- `PROJECT_CONTEXT.md`：最终产品能力、阶段和剩余风险。
- `ARCHITECTURE.md`：系统、数据流、运行时和信任边界。
- `DEPLOYMENT_HANDOFF.md`：线上事实和操作手册。
- `DEMO_GUIDE.md`：面试演示与追问。
- `Sprint_Report.md`、Incident：历史证据，不作为当前指令。

## 6. 已知但不阻塞的问题

1. Dashboard 与导航仍可进一步降低首次 SaaS 用户的理解成本，但当前版本已经能够演示；
   只有真实面试反馈反复指向该问题时再重启产品 Sprint。
2. CloudBase 免费体验版存在冷启动、默认域名和资源额度边界；面试前短时预热，不持续探活。
3. PoC、Deployment、ROI 主要是咨询表达，不应描述为真实生产执行结果。
4. 当前没有最小 CI；本地 unit、lint、build 和 Browser QA 是质量门。

## 7. 下一步

产品仓库当前没有阻塞投递的工程待办。最高价值下一步已经转移到仓库外的面试准备：

- 60 秒自我介绍与职业转型逻辑；
- 两个作品的 5 分钟 / 10 分钟讲解；
- FDE、AI 解决方案、RAG、Agent、PoC、部署与评估问题体系；
- 模拟面试和真实投递反馈闭环。

若未来恢复产品开发，先从真实面试反馈选择一个独立 Sprint，不自动继续旧 Roadmap。
