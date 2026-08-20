# 工程协作规范

> 文档类型：稳定工程流程事实源
> Agent Operating System Version：2.2
> 最后复核：2026-08-20（Asia/Shanghai）

## 1. 文件职责

本文件只维护可重复执行的本地开发、验证、Git、GitHub、发布包和安全规则。

- 角色、决策边界与停止条件：`AGENTS.md`、`OPERATING_SYSTEM.md`
- 当前产品状态：`PROJECT_CONTEXT.md`
- 当前会话和工作树：`HANDOFF.md`
- 当前线上操作：`DEPLOYMENT_HANDOFF.md`

## 2. 基础环境

- Node.js 22
- npm（使用仓库 `package-lock.json`）
- Git
- Chrome（Playwright 使用 Chrome channel）

首次接手：

```bash
git status --short --branch
npm ci
npm run test:unit
npm run lint
npm run build
```

禁止为“确认环境”读取 `.env.local`。需要判断配置时，只检查变量名是否由代码使用，
或由 Human 在平台界面确认是否已配置。

## 3. 本地运行与端口

企业工作台交互开发默认使用 `3101`：

```bash
npm run dev -- --hostname 127.0.0.1 --port 3101
```

```text
http://127.0.0.1:3101
http://127.0.0.1:3101/analysis
```

Playwright 默认使用 `3100` 启动 standalone server。执行 `npm run qa:browser` 前，应
停止占用 `3100` 的个人作品集或其他服务。若企业工作台已经运行，可以显式指定：

```bash
QA_BASE_URL=http://127.0.0.1:3101 npm run qa:browser
```

注意：即使指定外部地址，当前 `qa:browser` script 仍会先执行一次 `next build`。

## 4. 标准执行循环

1. 从 Prompt 和事实源确认唯一 Goal、Target、Success 和外部授权。
2. 检查 Git 状态，保护已有未提交内容。
3. 读取最小必要上下文和目标代码。
4. 实现本次范围内的 Level 1 / Level 2 改动。
5. 按风险矩阵验证。
6. 检查共享调用方、导航、状态与明显回归。
7. 只在形成长期事实时更新对应主文档。
8. 输出结果、剩余风险和一个最高价值下一步。
9. 只有 Prompt 明确授权时才 commit；push 需要单独明确授权。

## 5. Verification Matrix

| 变更类型 | 最小验证 |
| --- | --- |
| Docs-only | 文档事实与链接检查、`git diff --check`、`git status` |
| Git / repository-only | status、diff、log、remote，以及动作后的同步检查 |
| Non-UI code | `npm run test:unit`、`npm run lint`、`npm run build`；按影响决定 Browser QA |
| UI / route / workflow | `npm run lint`、`npm run qa:browser`、真实浏览器与视觉检查 |
| Shared state / component | 上述检查 + 所有调用方、刷新、路由和状态一致性 |
| QA / build config | 运行被修改的质量链路；影响应用构建时再跑 lint / build |
| Milestone / pre-deploy | unit、lint、Browser QA、diff check、发布包和仓库卫生 |

`npm run qa:browser` 自带 production build，不需要在它之前机械重复 `npm run build`。
单独 build 适用于不运行 Browser QA 的代码任务，或需要先隔离构建故障的场景。

当前套件：

- Unit：10 tests。
- Browser：19 tests。

测试数量是代码事实，不应在多个历史文档长期复制；变化后更新本文件和 README 即可。

## 6. Sprint Finish Review

完成声明前确认：

- 目标是否真实可用，而不只是文件已修改。
- 验证是否与风险匹配。
- 共享组件、状态和调用方是否一致。
- UI 改动是否经过浏览器和视觉判断。
- 当前事实是否只更新到正确的权威文档。
- 是否混入无关产品、未授权外部动作或低价值扩张。

完整协作门禁见 `OPERATING_SYSTEM.md`。

## 7. Git 规则

### 默认安全检查

```bash
git status --short --branch
git diff --check
git diff --stat
```

- 工作树里的既有改动默认属于用户，不能覆盖、丢弃或顺手格式化。
- 只暂存本次确认的路径，不使用 `git add .` 或 `git add -A`。
- 不使用 force push、amend、rebase、hard reset 或 destructive checkout，除非明确授权。
- 文档或小改动可以本地累积；“适合提交”不等于“已授权提交”。

### Branch 与 review

- 有意义、可独立 Review 的变更默认使用 feature branch。
- 只有 Product Owner 明确要求在 `main` 直接提交时，才沿用 direct-to-main。
- 协作仓库优先通过 PR Review；个人紧急 Demo 可以采用经明确授权的简化流程。

### Commit / push 授权

- commit 是本地历史写入，需要当前 Prompt 明确授权。
- push 是远端写入，需要当前 Prompt 明确授权。
- 修改 GitHub visibility、About、topics、homepage、Issue、PR、Actions 或部署源同样属于
  外部写操作，不能由“整理文档”自动推断授权。

## 8. GitHub 与远端

公开规范仓库：

```text
https://github.com/WalDesigner/enterprise-ai-solution-studio.git
```

公开仓库从经过审查的 clean-history snapshot 开始；旧 PR、历史基础设施标识和本地作者
元数据只保留在 Private archive。`main` 禁止 force push 和删除，日常改动使用 feature
branch + PR。不要把 archive remote、旧 branch 或 tag 推入公开仓库。

认证优先使用 GitHub CLI + HTTPS：

```bash
gh auth login
gh auth setup-git
```

Human 只完成浏览器 OAuth、MFA 和安全确认。Codex 不能展示认证 Token。

远端核对顺序：

1. 本地 `status`、`log` 和 `remote`。
2. GitHub 仓库默认分支、可见性和 About 信息。
3. PR、Issue、Actions 和分支状态。
4. 部署平台实际绑定的仓库与提交。

不能因为站点返回 200，就假设部署仓库与规范仓库同步。

## 9. Secret 与环境变量

- `.env.local` 必须被 Git 忽略且永远不读取、输出或提交。
- `.env.example` 只能包含变量名和无效占位符。
- Provider Key 不使用 `NEXT_PUBLIC_*`。
- 不记录请求 Header、Provider 原始敏感错误体或真实客户数据。
- CloudBase 更新服务时继承已有变量，不展开或抄录其值。
- Key 轮换由 Human 直接在 Provider 和云平台完成；聊天只讨论变量名和状态。

## 10. 发布包卫生

发布必须来自已确认提交，而不是含未提交内容的工作目录：

```bash
release_commit="<verified-commit>"
release_dir="$(mktemp -d /tmp/enterprise-ai-release.XXXXXX)"
git archive --format=tar "$release_commit" | tar -xf - -C "$release_dir"
test ! -e "$release_dir/.env.local"
test ! -d "$release_dir/.git"
```

发布前确认不包含：

- `.env.local` 或真实 Key。
- `.git`。
- `node_modules`、`.next`。
- `test-results`、`playwright-report`。
- 未提交文档草稿或另一个项目的文件。

## 11. 网络与浏览器协作

- GitHub、Codex 和部分国际服务需要稳定国际网络。
- 腾讯云控制台在嵌入浏览器或国际节点失败时，优先用普通 Chrome 和国内网络。
- Codex 不自行切系统 VPN；切到国内网络会中断自身连接，恢复不可靠。
- Human 负责切网络、登录、验证码、MFA 和 Key 录入；Codex提供精确页面和最小操作。
- 网络恢复后重新确认页面和账号上下文，不能假设旧操作已经保存。

## 12. 文档质量检查

Docs-only Sprint 至少检查：

- Markdown 本地链接目标存在。
- 当前状态是否只维护在正确事实源。
- 命令、端口、测试数量和文件路径与代码一致。
- 历史文档有清楚的“历史”标识。
- 没有 Token、绝对工作站缓存路径或不必要的个人隐私。
- `git diff --check` 通过，工作树只包含本次范围。
