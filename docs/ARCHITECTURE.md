# 项目架构说明

> 文档类型：稳定技术架构事实源
> 状态：当前有效
> 最后复核：2026-09-02（基于公开仓库当前 `main` 的应用代码）

## 1. 架构定位

Enterprise AI Solution Studio 是一个 Next.js 全栈面试 Demo：同一个应用同时提供
企业 SaaS 页面和轻量服务端 AI Route Handler。

它使用脱敏案例数据和浏览器本地持久化，不包含数据库、认证或多租户；这是一项有意
的 MVP 边界，而不是遗漏的生产声明。

```text
Browser
  -> Next.js App Router pages
  -> WorkspaceProvider + localStorage
  -> POST /api/analysis/generate
  -> AI Provider Adapter
  -> ModelScope / OpenRouter / Gemini / Groq / OpenAI
  -> structured draft or honest Mock fallback
```

## 2. 运行时与部署拓扑

### 国内主站

```text
面试官浏览器
  -> CloudBase public gateway
  -> CloudBase Run container
  -> Node.js 22 + Next.js standalone, port 3000
  -> ModelScope API-Inference
```

### 已退役的部署实验

```text
Browser -> Netlify -> Next.js application
```

Netlify 是早期跨区域部署实验，其代码基线已经漂移。2026-08-20 起不再把它作为活跃
镜像、回滚目标或面试入口，也不再投入双仓库同步成本。当前运行版本与运维操作见
`DEPLOYMENT_HANDOFF.md`。

## 3. App Routes

| Route | 责任 |
| --- | --- |
| `/` | Dashboard：项目、阶段、任务、活动和下一步 |
| `/customers` | 客户与项目选择 |
| `/analysis` | 需求结构化与 AI 方案草案生成 |
| `/solution` | 模型、RAG、Agent、工作流和部署方案 |
| `/poc` | 验证目标、数据、指标、风险和决策门槛 |
| `/deployment` | 架构、安全、阶段和交付控制 |
| `/roi` | 投入、收益、回收期、风险和咨询建议 |
| `POST /api/analysis/generate` | 校验输入、限流并调用服务端 Provider Adapter |

## 4. 工作区组件

### `components/workspace-shell.tsx`

统一承担：

- 左侧 / 移动端导航。
- 产品、页面标题和 breadcrumb。
- 当前项目上下文。
- 当前能力与下一步入口。
- 核心页面视觉框架。

### `components/workflow-stepper.tsx`

统一展示：

```text
Analysis -> Solution -> PoC -> Deployment -> ROI
```

它区分“项目真实当前阶段”和“用户当前查看页面”。打开 ROI 并不会自动把项目真实
阶段改为 ROI。

### `components/workspace-provider.tsx`

负责当前项目和 Analysis session：

- active project id。
- 每个项目的 Analysis 表单。
- 草案、生成来源、Provider、错误分类和更新时间。
- 页面水合和损坏存储恢复。

## 5. 数据与持久化

`lib/current-project.ts` 是脱敏项目目录和静态咨询基线的代码事实源，当前包含 4 个
演示项目。

浏览器持久化键：

```text
enterprise-ai-solution-studio.workspace.v1
```

持久化范围：

- 当前项目选择。
- 每个项目的 Analysis 表单输入。
- 最近生成的方案草案。
- Real AI / Mock 来源、Provider 和错误分类。

刷新和路由切换后可以恢复。若 JSON 损坏、项目 ID 无效或 session 结构不符合预期，
应用会丢弃无效数据并继续使用默认案例。没有跨浏览器、跨设备或服务端同步。

## 6. Real AI 数据流

```text
Analysis form + active project context
  -> POST /api/analysis/generate
  -> request schema and size validation
  -> per-IP in-memory limiter
  -> lib/ai-provider.ts
  -> lib/provider-fetch.ts
  -> provider response
  -> lib/ai-draft-parser.ts
  -> AiSolutionDraft
  -> save to WorkspaceProvider
  -> Solution consumes latest draft
```

关键文件：

| 文件 | 责任 |
| --- | --- |
| `lib/analysis-draft.ts` | 输入、草案、Provider、来源和错误类型 |
| `lib/ai-provider.ts` | Provider 选择、模型、Prompt、错误映射和 fallback |
| `lib/provider-fetch.ts` | 总超时内的受限重试 |
| `lib/ai-draft-parser.ts` | 结构化输出提取、归一化与六章节校验 |
| `app/api/analysis/generate/route.ts` | 公网请求校验、大小限制和轻量限流 |

### Provider 策略

- `AI_PROVIDER` 必须显式选择；未配置时使用 Mock。
- ModelScope 是国内主路径，默认 30B 模型。
- 已知旧 235B 配置会在运行时迁移到当前 30B 默认值。
- OpenRouter、Gemini、Groq、OpenAI 是代码级备选。
- Provider 总调用窗口是 30 秒。
- 只有 ModelScope 使用最多 2 次总尝试、350ms 间隔的瞬时失败重试。
- 408、425、429、5xx 和非超时网络错误可重试；超时和认证错误不盲目重试。

### 结构化输出

草案必须包含 6 个业务章节，并通过类型与内容校验。解析器兼容：

- 严格 JSON 与嵌套响应。
- 中英文字段变体。
- content string / array / object。
- thinking block、代码围栏和解释性前后缀。
- 六段 Markdown fallback parsing。

最终仍不能形成完整草案时，返回清楚标识的 Mock fallback。

## 7. API 防护与信任边界

当前 Demo 防护：

- 请求体最大 50,000 bytes。
- 每 IP、每单实例 10 分钟最多 12 次生成请求。
- 内存 limiter 最多保留约 1,000 个条目。
- API Key 只从服务端环境变量读取。
- Provider 原始错误体和 Key 不返回浏览器。
- Real AI 与 Mock fallback 使用诊断字段区分。

这些是低流量演示级防护，不是分布式生产限流。容器扩容或重启会重置内存计数。

## 8. Build 与容器

`next.config.ts` 使用：

```ts
output: "standalone"
```

Dockerfile 使用 Node.js 22 Alpine 三阶段构建：

```text
dependencies: npm ci
  -> builder: npm run build
  -> runner: copy standalone + public + static
  -> non-root nextjs user
  -> node server.js on 0.0.0.0:3000
```

`.dockerignore` 和 `.cloudbaseignore` 排除 `.env*`，只允许安全的 `.env.example`。
`cloudbaserc.json` 只记录 CloudBase 环境和服务目标，不保存密钥。

## 9. 测试架构

### Unit tests

```bash
npm run test:unit
```

当前 10 个用例覆盖结构化解析、瞬时状态识别、网络失败重试和非重试认证错误。

### Browser QA

```bash
npm run qa:browser
```

当前收集 19 个用例，覆盖：

- 7 条核心路由加载、console / page error 和横向溢出。
- Dashboard 诚实案例表达。
- 窄桌面 Analysis header。
- 表单与草案持久化、Solution 同步。
- 非法 localStorage 恢复。
- 7 条路由的 390 x 844 移动视口。
- 延迟响应下的生成等待状态。

Playwright 默认使用 Chrome channel 和 `127.0.0.1:3100`。`qa:browser` 会先执行
production build，再启动 standalone server。

## 10. 当前非目标

- 数据库、认证与多租户。
- 真实 RAG 检索质量。
- Agent 后台执行。
- 生产级分布式限流、日志、监控、告警与 SLA。
- 企业系统真实集成和报告导出。

这些能力可以后续逐步增加，但不能在面试中描述为已经实现。
