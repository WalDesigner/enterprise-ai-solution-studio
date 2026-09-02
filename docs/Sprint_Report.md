# Sprint 里程碑日志

> 文档类型：历史里程碑索引
> 状态：历史资料，不作为当前状态或下一步依据
> 最后整理：2026-09-02（Asia/Shanghai）

当前产品状态读 `PROJECT_CONTEXT.md`，当前会话读 `HANDOFF.md`，当前线上操作读
`DEPLOYMENT_HANDOFF.md`。本文件只回答“哪些有意义里程碑已经发生”。

## 2026-09-02 — 面试版本最终收口

- Product Owner 确认企业工作台和个人网站产品层面可以收口，下一阶段转向投递和面试。
- 重新审查公开仓库、远端、长期记忆、当前状态、部署、演示、简历和历史文档职责。
- 清理“继续优化 Dashboard 是自动下一步”等过时状态，改为真实反馈触发的候选事项。
- 修复公开仓库新出现的传递依赖安全公告，`npm audit` 归零，不改变应用产品行为。
- 通过 unit、lint、production build、Browser QA、文档链接和仓库安全检查。
- 建立 `interview-ready-2026-09` 稳定标记；后续默认只做安全、可用性和演示阻塞维护。

## 2026-08-20 — GitHub 安全公开边界

- Product Owner 授权把企业工作台源码作为面试作品公开，但不授权默认复用。
- 原工程仓库改名后保持 Private 并归档；旧 PR、commit、branch 和 tag 不进入公开网络。
- 从审查后的当前产品树创建全新公开仓库和单一 root commit，使用 GitHub noreply
  作者身份。
- 公开快照不包含真实 `.env`、Token、私钥、历史 SCF 直达地址、本机绝对路径或旧
  作者元数据；只保留 `.env.example`。
- GitHub About、topics、CloudBase homepage、`main` 防删除 / 防 force push 和私密漏洞
  报告入口完成配置。
- 当前不添加开源 License；源码可公开查看和评估，但不默认授予复制、修改或分发许可。

## 2026-08-20 — 文档治理与迁移体系

- 新增 `START_HERE.md`，建立新接手人 / 新 Codex 的 5 分钟入口。
- 将 `HANDOFF.md` 从 432 行历史堆积重建为当前滚动交接。
- 按主题划分稳定使命、当前产品、当前会话、当前部署、架构、工程和决策事实源。
- 修正浏览器本地持久化、测试数量、端口、CloudBase / Netlify 版本关系等文档事实。
- README 收敛为招聘方入口；Playbook 收敛为通用部署学习材料。
- GitHub 只读审计发现规范仓库为 Private，About 信息为空；Netlify 部署仓库落后
  规范仓库 6 个提交。后续收口 Sprint 已补齐 About，并决定不再维护旧部署绑定。
- 验证：unit 10/10、lint、production build、Browser QA 19/19、18 份 Markdown 本地
  链接检查和 `git diff --check` 全部通过。
- Product Owner 已授权 commit 和 push；本里程碑通过
  `docs/documentation-governance-20260820` feature branch 记录并同步。随后又明确启动
  GitHub 收口 Sprint，授权创建 PR、合并到 `main` 和补齐 About。
- 随后的 GitHub 发布准备审查覆盖 27 个可达提交：没有发现强凭据形态、真实 `.env`、
  私钥或超大资产；旧历史中的基础设施和本机元数据随后通过“Private archive + 全新
  公开 root snapshot”边界隔离。
- Product Owner 决定以 CloudBase 作为唯一推荐公网入口，退役已漂移的 Netlify 镜像，
  不再维护双仓库同步。

## 2026-08-19 — CloudBase `010` 国内主站恢复

- 新账期资源隔离解除，发布前用量为 2.31 / 3000 点。
- 从当时已验收的应用快照制作干净包，发布 CloudBase `010`。
- 公网出站开启、私有网络关闭、端口 `3000`。
- 自动启停、实例范围 `0-1`，删除历史定时扩缩容。
- 体验版采用免费自动切流，没有购买标准版或其他付费能力。
- 首页和 `/analysis` 为 HTTP 200。
- API 返回 `real-ai / modelscope / null`，真实浏览器点击通过。
- 详细操作和当前状态：`DEPLOYMENT_HANDOFF.md`。

## 2026-08-04 — SCF 国内临时 Real AI 入口

- 北京 SCF Web Function 首页、`/analysis` 和有效 API POST 通过。
- Human 直接在控制台配置服务端 Key；Codex 未读取或复制其值。
- API 在 8.40 秒返回 `real-ai / modelscope / null`。
- SCF 后来降级为历史应急入口，CloudBase `010` 是当前国内主站。

## 2026-07-31 — CloudBase 免费额度根因确认

- 确认 2026-07-11 至 2026-08-11 账期 3000 点耗尽，总计量 3049.31。
- 云托管 CPU 与内存是主要消耗，公网流量不是主因。
- 灰度部署因资源隔离被拒绝，没有产生新版本或流量切换。
- 建立最小实例 0、避免持续探活、按真实账期复查的成本策略。
- 完整时间线：`INCIDENT_REPORT_2026-07-15.md`。

## 2026-07-30 / 2026-07-31 — 解析、依赖与瞬时失败加固

- 产品界面统一中文并修复窄屏返回按钮。
- ModelScope 使用 30B 模型和 1600 token 上限。
- 结构化解析兼容 JSON 变体、中文字段、thinking block、代码围栏和六段 Markdown。
- Next.js 升级至 `16.2.12`。
- ModelScope 瞬时错误增加一次受限重试；单元测试 10 个。
- 这些能力属于公开快照的当前应用代码；切换前提交标识只在 Private archive 保留。

## 2026-07-15 — Real AI、持久化与 Demo 体验

### Real AI vertical slice

- Analysis 增加服务端 `/api/analysis/generate`。
- Provider Adapter 支持 ModelScope、OpenRouter、Gemini、Groq、OpenAI 和 Mock。
- Key 只在服务端读取；加入超时、请求体限制、轻量限流和错误分类。
- CloudBase 历史版本完成首轮 ModelScope 真实生成。

### Lightweight persistence

- 当前项目、Analysis 表单、草案和生成来源按项目保存到 `localStorage`。
- 刷新和路由切换后恢复，Solution 自动读取最近草案。
- 异常存储安全丢弃。

### Demo experience hardening

- 生成等待状态、阶段提示、耗时、进度和防重复点击。
- 移动端横向导航、44px 触控目标和 16px 表单输入。
- Browser QA 覆盖桌面、移动端、持久化和等待状态。
- Netlify 国际公开 Demo 建立。

## 2026-07 上旬 — MVP 基础

- Next.js、TypeScript、Tailwind CSS 和 App Router 初始化。
- Dashboard、Customers、Analysis、Solution、PoC、Deployment、ROI 路由完成。
- `WorkspaceShell`、`WorkflowStepper` 和 `lib/current-project.ts` 形成共享工作区。
- README、架构、演示、简历和 AI Native 协作基础文档建立。

## 历史资料规则

- 这里只保留可追踪的里程碑摘要，不复制完整部署日志。
- 故障根因与证据保留在 Incident Report。
- 被精简的公开切换前报告只从 Private archive 恢复，不导回公开仓库。
- 新增条目必须是有意义交付；纯状态查询和无变化检查不写入。
