# 项目接手入口

> 文档类型：新接手人 / 新 Codex 的 5 分钟入口
> 状态：当前有效
> 最后复核：2026-08-20（Asia/Shanghai）

## 1. 先理解这件事

Enterprise AI Solution Studio（中文名：**企业 AI 解决方案工作台**）是一个用于
AI 解决方案、售前与实施岗位面试的企业 SaaS MVP。核心演示链路是：

```text
Dashboard -> Customers -> Analysis -> Solution -> PoC -> Deployment -> ROI
```

Analysis 是当前唯一接入真实大模型的业务纵切面；其他模块主要用于展示咨询、PoC、
部署与 ROI 的交付方法。项目不是生产级多租户 SaaS，也不能把 Mock 内容描述成真实
客户或真实上线项目。

## 2. 新会话按这个顺序恢复

1. 读仓库根目录的 `AGENTS.md`，确认行为边界与授权规则。
2. 读本文件，找到当前任务对应的事实源。
3. 读 `docs/HANDOFF.md`，获得最近一次会话、Git 状态和下一步。
4. 读 `docs/PROJECT_CONTEXT.md`，确认当前产品阶段和优先级。
5. 只读本次任务直接需要的专题文档与代码，不机械加载全部历史。
6. 执行 `git status --short --branch`，先保护已有未提交内容。

恢复过程中绝对不要读取、展开、截图、输出或提交 `.env.local` 和任何 Token。

## 3. 当前事实去哪里找

| 要确认的事情 | 唯一主入口 | 什么时候更新 |
| --- | --- | --- |
| 招聘方看到的项目价值、Demo 和快速运行 | `README.md` | 公开入口或核心能力改变时 |
| 新接手人的最小读取路径 | `docs/START_HERE.md` | 文档架构或恢复流程改变时 |
| 公开安全边界和漏洞报告方式 | `SECURITY.md` | 支持范围或报告方式改变时 |
| 稳定产品使命、用户职业目标、范围边界 | `MASTER_CONTEXT.md` | 方向或边界真正改变时 |
| Agent 默认行为、授权和停止条件 | `AGENTS.md` | 协作规则改变时 |
| 当前产品阶段、能力和最高优先级 | `docs/PROJECT_CONTEXT.md` | 里程碑、能力或优先级改变时 |
| 当前会话、工作树、阻塞和下一步 | `docs/HANDOFF.md` | 暂停、切窗口、切模型或交接前 |
| 线上版本、发布、验收、回滚和成本 | `docs/DEPLOYMENT_HANDOFF.md` | 每次部署、回滚或配置变化后 |
| 稳定系统结构与数据流 | `docs/ARCHITECTURE.md` | 架构、路由或状态边界改变时 |
| 本地开发、验证与 Git 流程 | `docs/ENGINEERING.md` | 工具链或质量门改变时 |
| 决策及其原因 | `docs/DECISIONS.md` | 形成或替代长期决策时 |
| Now / Next / Later 产品路线 | `docs/ROADMAP.md` | 优先级或阶段改变时 |
| 面试演示路径 | `docs/DEMO_GUIDE.md` | 演示流程或能力边界改变时 |
| 简历与项目表达 | `docs/RESUME.md` | 求职定位或可证明能力改变时 |
| 通用云部署学习材料 | `docs/DEPLOYMENT_PLAYBOOK.md` | 形成可复用部署经验时 |
| 故障时间线与历史证据 | `docs/INCIDENT_REPORT_2026-07-15.md` | 事件补充或最终结案时 |
| 已完成 Sprint 历史 | `docs/Sprint_Report.md` | 只有形成有意义里程碑时 |
| 文档索引、检索词与归属关系 | `docs/KNOWLEDGE_BASE.md` | 文档新增、删除或改职责时 |
| Human / Agent 协作协议 | `docs/OPERATING_SYSTEM.md` | 长期协作机制改变时 |

规则：会变化的状态只在对应主入口维护；其他文档只链接，不复制整段快照。

## 4. 按任务选择最小上下文

### 恢复或交接

```text
AGENTS.md
docs/START_HERE.md
docs/HANDOFF.md
docs/PROJECT_CONTEXT.md
```

### 产品或 UI Sprint

```text
AGENTS.md
docs/PROJECT_CONTEXT.md
docs/ROADMAP.md
docs/ENGINEERING.md
目标页面和共享组件
```

### 部署或公网故障

```text
AGENTS.md
docs/HANDOFF.md
docs/DEPLOYMENT_HANDOFF.md
docs/ENGINEERING.md
必要时再读 Incident Report
```

### 架构或跨模块审查

```text
MASTER_CONTEXT.md
AGENTS.md
docs/PROJECT_CONTEXT.md
docs/ARCHITECTURE.md
docs/ENGINEERING.md
docs/DECISIONS.md
```

### 简历或面试材料

```text
MASTER_CONTEXT.md
docs/PROJECT_CONTEXT.md
docs/DEMO_GUIDE.md
docs/RESUME.md
```

## 5. 本地安全检查

推荐 Node.js 22。首次接手：

```bash
git status --short --branch
npm ci
npm run test:unit
npm run lint
npm run build
```

本项目通常使用 `3101`，避免和个人作品集的 `3100` 冲突：

```bash
npm run dev -- --hostname 127.0.0.1 --port 3101
```

应用代码或 UI 发生变化时，再执行：

```bash
npm run qa:browser
```

纯文档任务只要求文档一致性、链接检查、`git diff --check` 和 Git 状态检查。

## 6. 安全与外部动作边界

- `.env.local`、Provider Key、CloudBase 环境变量值永远不读、不抄、不展示、不提交。
- 只允许变量名和占位符出现在公开文档中。
- commit、push、部署、仓库可见性、GitHub About 等远端修改都需要本次 Prompt 明确授权。
- 不自动购买套餐、开启超限按量、最小实例 `1`、付费日志、固定网络或自定义域名。
- CloudBase 控制台必须切国内网络时，由 Human 在普通 Chrome 中完成网络与账号动作；
  Codex 不切换系统 VPN，也不处理验证码、MFA 或密钥。
- 个人作品集是另一个仓库；除非 Sprint 明确包含它，否则不要混入本仓库修改。

## 7. 新 Codex 最小恢复 Prompt

```text
继续 Enterprise AI Solution Studio。
先读取 AGENTS.md、docs/START_HERE.md、docs/HANDOFF.md 和
docs/PROJECT_CONTEXT.md，再检查 Git 状态。不要读取任何 .env.local 或 Token。

Goal: <本次唯一目标>
Target: <页面、模块或文档>
Success: <可验证完成信号>
Boundary / Authority: <特殊限制；如需 commit/push/部署必须明确写>
```

## 8. 文档健康规则

- README 面向招聘方与访客，不承担运维交接。
- Handoff 只写当前增量，不保存长篇历史。
- Incident 和 Sprint Report 可以保留历史，但不进入默认读取链路。
- 文档中的“当前”必须带日期或链接到当前事实源。
- 文档删除前先确认其唯一事实已迁移。公开切换后的旧内容可从当前 Git 历史恢复；
  更早材料只在 Private archive 保留，不能导回公开仓库。
