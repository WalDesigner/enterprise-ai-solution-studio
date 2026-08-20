# 当前交接

> 文档类型：当前会话 / 当前 Sprint 的滚动交接
> 状态：当前有效
> 最后更新：2026-08-20（Asia/Shanghai）
> 历史说明：公开仓库只保留公开切换后的历史；切换前工程记录由 Private archive、
> Incident Report 和 Sprint Report 承载。

## 1. 当前目标

将企业 AI 工作台建立为可安全分享的 GitHub 作品：旧仓库作为只读 Private archive
保留；公开规范仓库使用相同项目名，但从经过审查的产品快照和单一 root commit 开始。

本 Sprint 只处理企业 AI 工作台仓库。个人作品集属于独立仓库和下一独立 Sprint。

## 2. 当前产品状态

- 产品中文名：企业 AI 解决方案工作台。
- 阶段：interview-ready public demo MVP，进入面试演示维护和信息架构优化阶段。
- 核心链路：Dashboard -> Customers -> Analysis -> Solution -> PoC -> Deployment -> ROI。
- 真实 AI：Analysis -> `/api/analysis/generate` -> Provider Adapter -> ModelScope。
- 浏览器状态：当前项目、Analysis 表单和生成草案按项目保存到 `localStorage`。
- 明确边界：没有认证、数据库、多租户、真实 RAG、Agent 后台执行或生产级 SLA。

详细能力与优先级以 [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) 为准。

## 3. Git 与 GitHub 状态

| 项目 | 当前事实 |
| --- | --- |
| 公开规范仓库 | `https://github.com/WalDesigner/enterprise-ai-solution-studio` |
| 可见性 | Public |
| 默认分支 | `main` |
| 公开历史 | 一份经审查的 root snapshot；不含旧 commit、PR、branch 或 tag |
| 旧工程历史 | 改名后的 Private archive，只读保留，不与公开仓库互推 |
| GitHub About | description、CloudBase homepage 和 6 个 topics 已配置 |
| 主分支规则 | 禁止 force push 和删除；日常改动走 feature branch + PR |
| 安全报告 | 使用 GitHub Private vulnerability reporting；说明见根目录 `SECURITY.md` |
| License | 未设置；公开可查看和评估，但不默认授予复制、修改或分发许可 |

Product Owner 已明确授权本轮历史隔离、旧仓库私有归档、创建新公开仓库和推送干净
快照。公开仓库不得添加 archive remote，不得导入旧 refs。

## 4. 公网状态

### 国内主站

```text
https://enterprise-ai-studio-282223-9-1444381545.sh.run.tcloudbase.com
https://enterprise-ai-studio-282223-9-1444381545.sh.run.tcloudbase.com/analysis
```

- CloudBase 服务：`enterprise-ai-studio`
- 版本：`010`，体验版自动切换 100% 流量
- 2026-08-20 路由复查：首页与 `/analysis` 均为 HTTP 200
- 最近一次完整 Real AI 验收：2026-08-19，`real-ai / modelscope / null`，并通过真实浏览器点击

CloudBase 是唯一推荐的在线 Demo。旧 Netlify 站点已经因代码漂移退役，不再同步、
不再作为回滚目标，也不在公开材料中宣传为备用站。

当前发布、成本、回滚和安全操作统一以
[DEPLOYMENT_HANDOFF.md](DEPLOYMENT_HANDOFF.md) 为准。

## 5. 公开边界验证

- 公开仓库从单一 root commit 开始，只包含审查后的当前产品文件。
- 公开分支不包含 `.env.local`、真实 Token、私钥、历史 SCF 直达地址或本机绝对路径。
- Git 仅跟踪 `.env.example`；`.env.local` 仍保留在本机且继续被忽略。
- root commit 使用 GitHub noreply 作者身份，不暴露本机或私网风格邮箱。
- 公开远端只有 `main`，不包含旧 branch、tag、PR 或 release。
- 无超过 1 MB 的 Git 文件；演示截图无文本或 EXIF 元数据。
- 未读取 `.env.local`，未读取、输出、修改或提交任何 Token。

应用质量门和公开远端复核结果以本 Sprint 最终报告为准。

## 6. 已知待办

以下不阻塞公开与面试使用：

1. **产品 UX**：Dashboard 与导航需要独立 Sprint，降低首次 SaaS 用户的理解成本。
2. **展示资产**：产品 UI 优化后再刷新 README 截图，避免重复劳动。
3. **CI**：当前依赖本地 unit、lint、build 和 Browser QA；可在后续独立工程 Sprint
   增加最小 GitHub Actions。
4. **License**：只有 Product Owner 希望授予他人复用权时再选择；不影响公开展示。

## 7. 下一会话恢复清单

1. 读 `AGENTS.md`、`docs/START_HERE.md`、本文件和 `docs/PROJECT_CONTEXT.md`。
2. 执行 `git status --short --branch`，确认位于公开仓库 `main` 且工作树干净。
3. 执行 `git remote -v`，确认只指向公开规范仓库；不要添加 Private archive remote。
4. 确认公开远端只有 `main`，没有旧 branch 或 tag。
5. 不读取 `.env.local`，不展开 CloudBase 环境变量值。
6. 日常改动使用 feature branch + PR，不 force push 或删除 `main`。

## 8. 当前最高价值下一步

本 Sprint 完成公开边界与 GitHub 发布后停止。下一独立 Sprint 切换到个人作品集仓库，
先做状态、内容、部署与公开安全审查；企业工作台随后再进入 Dashboard / 导航信息架构
优化。
