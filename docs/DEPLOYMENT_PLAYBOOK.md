# AI Web 项目部署选型与实战手册

> 文档类型：可复用部署学习材料
> 状态：当前有效
> 最后复核：2026-08-20（Asia/Shanghai）
> 当前线上版本和按钮级操作请读 `DEPLOYMENT_HANDOFF.md`；历史事故请读 Incident Report。

## 1. 先建立四层心智模型

一个公开 AI Web 产品通常包含：

```text
用户与网络
  -> Web 运行平台（页面 + 服务端 API）
  -> Provider Adapter（统一调用、超时、错误与解析）
  -> 模型服务（ModelScope / OpenRouter / Gemini / Groq / OpenAI）
```

| 层级 | 核心问题 | 常见故障 |
| --- | --- | --- |
| 用户与网络 | 目标用户能否直接打开 | 国内网络、DNS、域名、浏览器策略 |
| Web 平台 | 页面和 API 能否运行 | 构建、端口、容器、冷启动、流量版本 |
| Adapter | 如何统一模型差异 | Header、超时、重试、JSON 解析、错误映射 |
| 模型服务 | 账号和模型是否可用 | 401、404、429、额度、实名、区域限制 |

排障从外到内，一次只验证一个假设。控制台显示“正常”只能证明资源对象或容器状态，
不能证明公网、AI Provider 和用户路径都成功。

## 2. 如何选择部署平台

按顺序回答：

1. 主要用户在中国大陆还是海外？
2. 只需要静态页面，还是需要隐藏 Key 的服务端 API？
3. Next.js SSR、Route Handler、Streaming 或长连接是否必需？
4. 是否需要容器、自定义运行时或系统依赖？
5. 能否接受冷启动？
6. 是否有版本、灰度、回滚和日志能力？
7. 默认域名是否只用于 Demo，长期是否需要备案域名？
8. 免费额度如何计算，是否会自动转按量？

### 简化决策表

| 场景 | 优先方向 | 原因 |
| --- | --- | --- |
| 纯静态作品集 | 静态托管 / CDN | 成本低、维护简单 |
| 国际 Next.js Demo | Netlify / Vercel 类平台 | Git 集成和框架适配快 |
| 国内 Next.js + API Demo | 国内容器 / Serverless 平台 | 国内可达和服务端运行能力 |
| 长连接或复杂 Agent | 容器平台 | 对运行时和连接控制更完整 |
| 企业已有云体系 | 企业指定云 | 网络、审计、采购和权限优先 |

本项目曾采用 CloudBase 国内主站 + Netlify 国际备用。随着目标面试场景集中在中国
大陆且镜像产生版本漂移，当前只维护 CloudBase 主站。平台选择应随用户和维护成本
变化，而不是为了形式对称长期保留双站。

## 3. 静态托管、云函数和容器是什么关系

### 静态托管 / CDN

分发 HTML、CSS、JavaScript、图片等已构建资产。没有常驻应用进程，适合作品集和
无服务端逻辑的网站。主要消耗通常是存储、请求和 CDN 流量。

### 云函数 / Web Function

按请求启动受控运行时，适合 API 或可适配的 Web 服务。成本与调用、执行时长、内存
和流量有关，平台对端口、包体、超时和并发有自己的规则。

### 容器云托管

把 Docker 镜像交给平台运行。Docker 定义应用依赖和启动方式；云托管负责实例、网关、
扩缩容、版本和流量。EKS 是平台底层容器编排 / 计算能力，不等于普通“云函数调用”。

容器费用或资源点通常与 CPU、内存、实例运行时间和出流量有关。即使访问量不高，
错误的最小实例或定时扩容也可能持续消耗计算资源。

## 4. Key 为什么必须留在服务端

错误路径：

```text
Browser -> Provider with public API key
```

任何用户都能从网络面板或前端 bundle 取得 Key。

正确路径：

```text
Browser -> POST /api/analysis/generate
Server -> read secret environment variable -> Provider
```

规则：

- 本地 Key 只进被 Git 忽略的 `.env.local`。
- 线上 Key 只进部署平台 Secret / Environment Variables。
- Provider Key 不使用 `NEXT_PUBLIC_*`。
- 不打印 Header、Key、完整 Provider 错误体或敏感客户数据。
- 怀疑暴露后创建新 Key、更新服务、验证，再吊销旧 Key。
- Human 直接录入真实值；Agent 只处理变量名和状态。

## 5. Provider 选型不是“选最强模型”

至少比较：

| 维度 | 问题 |
| --- | --- |
| 网络 | 目标部署区域能稳定访问 API 吗？ |
| 账户 | 实名、支付、云账号关联和权限完成了吗？ |
| 接口 | OpenAI-compatible 还是专有协议？ |
| 模型 | 模型 ID 是否仍有效，是否支持目标输出？ |
| 额度 | 并发、速率、动态额度和 429 策略是什么？ |
| SLA | 免费体验还是可承诺的商业服务？ |

页面只调用统一的 `generateAnalysisDraft(input)`；Adapter 负责 Provider、模型、Prompt、
超时、受限重试、结构化解析、错误分类和 fallback。这样更换模型不需要重写产品页面。

## 6. Next.js standalone 与 Docker

本项目使用 `output: "standalone"`，Docker 链路是：

```text
npm ci
  -> next build
  -> .next/standalone/server.js
  -> Docker image
  -> CloudBase Run
  -> 0.0.0.0:3000
```

读 Dockerfile 时看四件事：

1. 依赖是否从 lockfile 可复现安装。
2. 构建阶段是否生成生产产物。
3. 运行镜像是否只复制必要文件并使用非 root 用户。
4. 平台服务端口是否与应用监听端口一致。

## 7. 一次发布发生了什么

```text
明确提交
  -> 本地质量门
  -> 干净发布包 / 镜像
  -> 云端构建版本
  -> 健康检查
  -> 灰度或自动切流
  -> 公网页面验证
  -> API 结构验证
  -> 浏览器真实用户路径
  -> 记录证据或回滚
```

### 灰度与流量

新版本可以先创建但不承载用户流量，再分配少量请求，验证后逐步增加到 100%。这里的
流量是“公网请求被路由到哪个版本”的比例，不是单独一类网络。

如果免费套餐只支持发布后自动切到 100%，就失去了预流量验证窗口。低流量 Demo
可以在 Product Owner 接受风险后使用，但必须提高本地门槛并在切流后立即验收。

## 8. 干净发布包

发布目录应来自已验证 Git 提交：

```bash
release_commit="<verified-commit>"
release_dir="$(mktemp -d /tmp/enterprise-ai-release.XXXXXX)"
git archive --format=tar "$release_commit" | tar -xf - -C "$release_dir"
test ! -e "$release_dir/.env.local"
test ! -d "$release_dir/.git"
```

不能包含 `.env.local`、真实 Token、`.git`、`node_modules`、`.next`、测试报告、临时
截图或另一个项目的文档。

## 9. 四层验收证据

1. **Build**：相关 unit、lint、production build / Browser QA 通过。
2. **Routes**：首页和核心页面返回 HTTP 200。
3. **API**：有效 POST 的结构、`source`、`provider`、`errorCategory` 正确。
4. **User path**：浏览器真实点击，看见 Real AI 或明确 fallback，且无页面错误。

不能用以下证据代替完整验收：

- “版本状态正常”。
- “环境变量已保存”。
- “curl 首页是 200”。
- “一次 Provider 请求偶然成功”。

当前项目的具体验收字段和最近证据见 `DEPLOYMENT_HANDOFF.md`。

## 10. 分层排障

| 现象 | 先检查 | 不要先做 |
| --- | --- | --- |
| 首页 503 | 额度隔离、版本、实例、流量、端口 | 立即改业务代码 |
| 页面 200、API 404/405 | route 是否部署、方法是否正确 | 轮换 Key |
| `missing_key` | 环境变量是否继承并进入新版本 | 把 Key 发到聊天 |
| 401 / `unauthorized` | Token、账号关联、实名、权限 | 高频重试 |
| 404 / `model_unavailable` | 模型 ID 与账号可用模型 | 加长超时 |
| 429 | 额度、速率、并发、重试策略 | 无限重试 |
| `timeout` | 模型大小、排队、输出长度、总窗口 | 误报网络错误 |
| `provider_error` | 输出形态、解析器、Provider 5xx | 把原始响应公开 |
| `network_error` | 出站、DNS、TLS、网络节点 | 先改 Prompt |

控制台嵌入页异常时，可用普通 Chrome。腾讯云需要国内网络而 Codex 需要国际网络时，
Human 负责切网络、打开精确页面和完成登录；Codex 不自行切 VPN，也不处理验证码或 Key。

## 11. 免费 Demo 成本控制

- 最小实例保持 0，只有真实商业需要和明确费用授权才考虑常驻。
- 最大实例与并发匹配低流量面试，不为“看起来生产”而扩容。
- 不设置定时扩容、预置并发或持续探活。
- 面试前短时预热；不要全天健康检查。
- 限制请求体、生成按钮重复点击和 Provider 重试。
- 按平台真实账期检查额度，不假设自然月 1 日重置。
- 保留跨平台备用入口。
- 免费服务不能描述为生产 SLA。

## 12. 域名与生产边界

平台默认域名适合开发、面试 Demo 和小范围体验。中国大陆长期商业使用通常还要评估：

- 自定义域名和 ICP 备案。
- HTTPS、CDN 和安全策略。
- 企业主体、隐私政策和数据合规。
- 监控、告警、日志、灾备和 SLA。

“国内能打开”不等于“已经正式生产上线”。

## 13. 面试表达

> 我先用国际平台完成公开 Demo，再根据北京、天津等国内面试场景，把同一套 Next.js
> 应用容器化部署到 CloudBase，并通过 Provider Adapter 接入 ModelScope。排障时我把
> 资源、容器网络、模型账号、接口结构和浏览器路径分层验证，同时保留诚实 fallback。
> 当旧镜像发生版本漂移后，我基于目标用户和维护成本将它退役。这个方案适合低流量
> 面试，但我不会把免费额度描述成生产 SLA。

这段经历能证明平台选型、服务端安全、容器部署、故障定位、成本意识和上线验收能力。

## 14. 官方参考

- [CloudBase Run 介绍](https://docs.cloudbase.net/run/introduction)
- [CloudBase Run 部署方式](https://docs.cloudbase.net/run/deploy/deploy/introduce)
- [Next.js standalone output](https://nextjs.org/docs/app/api-reference/config/next-config-js/output)
- [Next.js on Netlify](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/)
- [ModelScope API-Inference](https://www.modelscope.cn/docs/model-service/API-Inference/intro)

平台计费和套餐能力会变化。真正执行发布前，以当前官方控制台和
`DEPLOYMENT_HANDOFF.md` 的最近核对结果为准。
