# 项目知识库索引

> 文档类型：知识检索与写入路由
> 状态：当前有效
> 最后复核：2026-08-20（Asia/Shanghai）

## 1. 本文件负责什么

本文件帮助 Agent 根据问题找到正确知识域，不复制当前状态、工程规则或部署快照。

新接手流程、完整文档登记表和 5 分钟恢复步骤见
[START_HERE.md](START_HERE.md)。

## 2. 知识域

### Product / Career

- 稳定使命、职业定位与产品边界：`MASTER_CONTEXT.md`
- 当前产品能力和优先级：`PROJECT_CONTEXT.md`
- Now / Next / Later：`ROADMAP.md`
- 简历表达：`RESUME.md`
- 面试演示：`DEMO_GUIDE.md`

检索词：岗位定位、面试价值、产品边界、Mock 边界、演示路径、简历项目描述。

### Architecture / Engineering

- 系统、路由、状态、AI 和运行时：`ARCHITECTURE.md`
- 本地开发、验证、Git 和安全：`ENGINEERING.md`
- 长期决策与原因：`DECISIONS.md`

检索词：WorkspaceProvider、localStorage、Provider Adapter、parser、retry、rate limit、
standalone、Docker、Playwright、Git policy。

### Operations / Deployment

- 当前线上版本和操作：`DEPLOYMENT_HANDOFF.md`
- 通用部署学习方法：`DEPLOYMENT_PLAYBOOK.md`
- CloudBase / ModelScope 历史事件：`INCIDENT_REPORT_2026-07-15.md`
- 当前会话阻塞和下一步：`HANDOFF.md`

检索词：CloudBase、EKS、ModelScope、Netlify、SCF、资源点、冷启动、灰度、自动切流、
回滚、503、timeout、provider_error。

### Collaboration / Memory

- Agent 最小规则：`../AGENTS.md`
- 团队协作协议：`OPERATING_SYSTEM.md`
- 当前滚动交接：`HANDOFF.md`
- Sprint 历史：`Sprint_Report.md`

检索词：授权、Level 1/2/3、Prompt Economy、Finish Review、handoff、commit、push。

## 3. 任务读取路由

| 任务 | 先读 | 必要时再读 |
| --- | --- | --- |
| 会话恢复 | `AGENTS`、`START_HERE`、`HANDOFF` | `PROJECT_CONTEXT` |
| 页面 / UI | `PROJECT_CONTEXT`、`ENGINEERING` | `ROADMAP`、目标代码 |
| AI Provider | `ARCHITECTURE`、`ENGINEERING` | `DEPLOYMENT_PLAYBOOK`、Provider 代码 |
| CloudBase 发布 | `DEPLOYMENT_HANDOFF`、`ENGINEERING` | `INCIDENT_REPORT` |
| 架构审查 | `MASTER_CONTEXT`、`ARCHITECTURE`、`DECISIONS` | `PROJECT_CONTEXT` |
| 路线图 | `MASTER_CONTEXT`、`PROJECT_CONTEXT`、`ROADMAP` | `DECISIONS` |
| 面试 / 简历 | `MASTER_CONTEXT`、`DEMO_GUIDE`、`RESUME` | `PROJECT_CONTEXT` |
| 故障复盘 | `DEPLOYMENT_HANDOFF`、`INCIDENT_REPORT` | `Sprint_Report`、当前 Git 历史、Private archive |

## 4. 写入路由

新增事实前先问：“以后谁会来这里找它？”

- 使命、目标岗位、长期边界 -> `MASTER_CONTEXT.md`
- 当前已完成、正在做、最高优先级 -> `PROJECT_CONTEXT.md`
- 本次工作树、阻塞、精确下一步 -> `HANDOFF.md`
- 当前线上版本、URL、配置、验收、回滚 -> `DEPLOYMENT_HANDOFF.md`
- 代码结构、数据流、信任边界 -> `ARCHITECTURE.md`
- 命令、工具链、验证、Git、安全 -> `ENGINEERING.md`
- 选择某方案的原因 -> `DECISIONS.md`
- 产品优先级 -> `ROADMAP.md`
- 可复用部署方法 -> `DEPLOYMENT_PLAYBOOK.md`
- 故障证据和根因 -> Incident Report
- 已完成里程碑摘要 -> `Sprint_Report.md`

不要为了“同步完整”把同一段内容复制到多份文件。非权威文档只写一句结论和链接。

## 5. 历史材料规则

`Sprint_Report.md` 与 Incident Report 是历史证据，不进入默认上下文链路。

- 历史状态使用过去时和日期。
- 已恢复的故障不能继续写成“当前阻塞”。
- 旧发布版本不应覆盖当前部署事实。
- 公开切换后的旧文档可从当前 Git 历史恢复；更早材料只从 Private archive 取证，
  不需要在当前 Handoff 重复保存全文，也不能导回公开仓库。

## 6. 知识健康检查

每次系统级文档审查检查：

1. `HANDOFF` 是否仍是当前交接，而不是历史堆积。
2. `PROJECT_CONTEXT` 是否能在 3 分钟内读完。
3. `DEPLOYMENT_HANDOFF` 的版本、提交和验证日期是否匹配线上。
4. `ARCHITECTURE` 是否与代码状态、端口和测试一致。
5. `ROADMAP` 是否仍反映当前优先级。
6. README 是否只承担公开介绍，不复制运维细节。
7. 所有本地链接是否有效，是否存在敏感值或不可迁移绝对路径。
