# 企业 AI 解决方案工作台：部署与运维交接

> 文档状态：当前有效（2026-09-02，Asia/Shanghai；本轮未重新触发线上 Real AI）
>
> 适用对象：项目接手人、发布负责人、面试演示维护者
>
> 原则：先读本页执行当前操作；历史事件只用于排障，不作为当前状态依据。

## 1. 接手人先看这张表

| 项目 | 当前值 |
| --- | --- |
| 公开规范仓库 | `https://github.com/WalDesigner/enterprise-ai-solution-studio` |
| 发布分支 | `main`；发布前必须读取当前 HEAD，不依赖文档中的旧快照 |
| 公开历史边界 | 经过审查的单一 root snapshot；旧工程历史只在 Private archive 保留 |
| 当前线上应用代码 | 与公开 `main` 的应用文件一致；公开化只调整文档和 Git 历史 |
| 国内主站 | `https://enterprise-ai-studio-282223-9-1444381545.sh.run.tcloudbase.com` |
| 国内主站核心页 | `https://enterprise-ai-studio-282223-9-1444381545.sh.run.tcloudbase.com/analysis` |
| CloudBase 环境 | `enterprise-ai-studi-d1bhe40a167e` |
| CloudBase 服务 | `enterprise-ai-studio` |
| 当前线上版本 | `010`，状态正常，已自动切换 100% 流量 |
| 容器运行端口 | `3000`（公网访问端口 `80` 映射到服务端口 `3000`） |
| 国内 AI Provider | ModelScope API-Inference |
| 本地开发地址 | `http://127.0.0.1:3101/analysis`（避免与个人作品集的 `3100` 冲突） |

截至 2026-08-20，CloudBase `010` 的首页和 `/analysis` 已再次返回 HTTP 200；最近
一次完整 Real AI 验收仍是 2026-08-19：

- 首页：HTTP 200。
- `/analysis`：HTTP 200。
- 有效 API POST：`source=real-ai`、`provider=modelscope`、`errorCategory=null`。
- 真实浏览器点击：页面显示“真实 AI 生成”和“模型服务：ModelScope”，未触发 Mock fallback。

旧 Netlify 和北京 SCF 入口已经退出当前交付范围：不再同步、不再作为回滚目标，也不在
公开文档中保留直达地址。重新启用任何历史入口都必须作为新部署重新完成安全和公网
验收。

## 2. 系统如何运行

```text
面试官浏览器
  -> CloudBase 公网网关
  -> CloudBase Run 容器（Next.js，端口 3000）
  -> /api/analysis/generate
  -> AI Provider Adapter
  -> ModelScope API-Inference
  -> 结构化方案草案
```

失败边界：

- 页面和 API 由同一个 Next.js 容器提供。
- Provider Key 只在服务端环境变量中读取，浏览器不能取得。
- ModelScope 缺少授权、超时、不可达或输出不合规时，服务返回明确的 Mock fallback；不能把 fallback 描述成真实 AI。
- 当前是低流量面试 Demo，不具备认证、多租户、数据库持久化和生产级 SLA。

## 3. 仓库与关键文件

| 文件 | 作用 |
| --- | --- |
| `Dockerfile` | 三阶段构建 Next.js standalone 容器，运行 `server.js` |
| `next.config.ts` | 生成 standalone 生产产物 |
| `cloudbaserc.json` | CloudBase 环境和服务目标；不保存密钥 |
| `.cloudbaseignore` | 排除依赖、构建产物、测试结果和本地环境文件 |
| `.dockerignore` | 缩小 Docker 构建上下文并排除 `.env*` |
| `app/api/analysis/generate/route.ts` | 公网 AI 生成 API、请求体限制和轻量限流 |
| `lib/ai-provider.ts` | Provider 选择、模型、Prompt、超时窗口、错误分类和 fallback |
| `lib/provider-fetch.ts` | 30 秒总窗口内的 ModelScope 瞬时失败受限重试 |
| `lib/ai-draft-parser.ts` | ModelScope 结构化输出容错解析 |
| `tests/unit` | Provider 与解析器单元测试 |
| `tests/browser` | 核心 SaaS 工作流浏览器回归 |

## 4. 本地接手与发布前检查

要求：Node.js 22、npm、Git。首次接手执行：

```bash
git status --short --branch
npm ci
npm run test:unit
npm run lint
npm run build
npm run qa:browser
```

`qa:browser` 默认占用 `127.0.0.1:3100` 并会自行执行 production build；运行前停止
占用该端口的个人作品集，或使用 `QA_BASE_URL` 指向已经启动的企业工作台。

发布门槛：

- 工作树中的代码改动已经明确归属，不能覆盖其他人的未提交内容。
- 单元测试、lint、production build 和 Browser QA 全部通过。
- 本地真实 AI 只使用被 Git 忽略的 `.env.local`；禁止输出该文件。
- 发布提交已经推送到规范仓库的 `main`。
- 明确记录将要发布的提交号，不能用“本地最新代码”代替可追溯版本。

## 5. 制作干净发布包

用 Git 提交生成发布目录，可以天然排除 `.env.local`、未提交文档和本地构建产物：

```bash
release_commit="$(git rev-parse --verify main)"
release_dir="$(mktemp -d /tmp/enterprise-ai-cloudbase-release.XXXXXX)"
git archive --format=tar "$release_commit" | tar -xf - -C "$release_dir"
test ! -e "$release_dir/.env.local"
test ! -d "$release_dir/.git"
```

命令会读取本地 `main` 的明确提交；发布前仍要把实际提交号写入验收记录。发布包中允许
有 `.env.example`，但绝不能包含 `.env.local`、真实 Token、`.git`、`node_modules`、
`.next`、测试报告或本地文档草稿。

如果改用 CLI，先用 `tcb --version` 和只读命令确认当前工作站已有可用 CLI 与登录态。
不要把某台电脑的 `npx` 缓存绝对路径写入交接。CLI 网络上传曾出现连接重置；若发生
一次可复现失败，优先使用网页上传干净目录，不要连续盲目重试。

## 6. CloudBase 网页发布步骤

控制台路径：

```text
CloudBase -> 云函数 / 托管 -> 云托管 -> 服务管理
-> enterprise-ai-studio -> 更新服务
```

配置要求：

| 配置项 | 当前标准值 | 原因 |
| --- | --- | --- |
| 部署方式 | 使用本地代码上传部署 | 当前最稳定的发布路径 |
| 代码包类型 | 文件夹 | 直接上传 Git 导出的干净目录 |
| 服务端口 | `3000` | 与 Dockerfile 和 Next.js 监听端口一致 |
| 公网访问 | 开启 | 容器需要访问外部 ModelScope API |
| 私有网络 | 关闭 | 当前不使用 VPC / NAT，避免额外资源 |
| 实例控制模式 | 自动启停实例 | 允许无请求时释放实例 |
| 运行模式 | 自定义 | 明确限制实例范围并取消定时规则 |
| 最小实例 | `0` | 空闲时缩容，控制体验版资源点 |
| 最大实例 | `1` | 面试 Demo 无需横向扩容 |
| 扩缩容阈值 | CPU `60`、内存 `60` | 保留平台默认安全阈值 |
| 定时扩缩容 | 不配置 | 避免强制常驻实例 |
| 预置并发 / 常驻实例 | 不配置 | 避免持续计费和额度消耗 |

环境变量处理规则：

- 更新现有服务时必须继承现有环境变量，不展开、不抄录、不输出任何值。
- 必须存在的变量名是 `AI_PROVIDER`、`MODELSCOPE_MODEL`、`MODELSCOPE_API_KEY`。
- 非敏感模型名应为账号当前可用的 30B 模型；真实 Key 只能由项目负责人直接在腾讯云控制台填写。
- 若需要轮换 Key，先创建新值并直接写入控制台，发布和验证成功后再吊销旧值；不得经过聊天、截图、日志或仓库。

### 免费体验版的发布限制

体验版允许“发布版本并自动切换流量至新版本”。“发布后手动切换流量”属于付费标准版
能力，具体价格以控制台当前报价为准；当前项目没有购买。

因此当前免费发布流程是：

```text
本地完整验证
  -> 上传代码包
  -> 选择“发布版本并自动切换流量至新版本”
  -> 新版本构建并自动接管公网流量
  -> 立即执行公网验收
```

这不是标准生产灰度流程。正式项目应先让新版本承载 0% 或少量流量，验证后再逐步切到 100%。本项目因是低流量面试 Demo，产品负责人接受自动切流风险。

## 7. 发布后验收

先确认控制台新版本状态为“正常”，再完成四层证据：

### 7.1 页面路由

```bash
curl -I https://enterprise-ai-studio-282223-9-1444381545.sh.run.tcloudbase.com/
curl -I https://enterprise-ai-studio-282223-9-1444381545.sh.run.tcloudbase.com/analysis
```

两条都必须返回 HTTP 200。

### 7.2 API 结构

使用脱敏测试数据向 `/api/analysis/generate` 发送有效 POST，必须满足：

```text
HTTP 200
source=real-ai
provider=modelscope
errorCategory=null
draft 存在且包含结构化章节
```

不要把完整客户数据、请求 Header、Provider 原始响应或任何环境变量写入验证日志。

### 7.3 真实浏览器路径

1. 打开 `/analysis`。
2. 使用脱敏案例数据点击“生成 AI 方案草案”。
3. 等待结果完成，不要重复点击。
4. 确认页面显示“真实 AI 生成”和“模型服务：ModelScope”。
5. 确认没有 `Mock fallback`、错误分类或页面异常。

### 7.4 验收记录

每次发布至少记录：发布日期、代码提交、CloudBase 版本、流量结果、两个页面状态、API 三个诊断字段、浏览器结果、是否回滚。只记录证据，不记录密钥或敏感响应正文。

## 8. 回滚与演示兜底

自动切流版本出现问题时，按影响层级处理：

1. **页面或容器完全不可用**：停止连续修改，优先恢复上一已知稳定 CloudBase 版本。
2. **CloudBase 控制台允许回滚**：选择上一已知可运行版本并执行平台回滚，再重复第 7 节验收。
3. **体验版阻止手动流量操作**：从上一已知稳定提交重新制作干净发布包，作为一个新版本自动发布。
4. **只有 ModelScope 失败**：先确认页面是否诚实进入 Mock fallback；检查 Provider 状态、账号额度和公网出站，不必立即回滚整个前端。
5. **CloudBase 额度隔离或区域故障**：面试现场使用已准备的本地演示或录屏，并如实说明平台故障；不要自动恢复已经退役、未重新验收的公网入口。

已知版本：

- `010`：当前版本，公网 Real AI 验收通过；应用文件与公开 `main` 一致。
- `009`：历史 30B 超时修复版本；不包含后续解析和瞬时失败重试增强，不能作为长期目标版本。

## 9. 成本与容量控制

CloudBase 体验版每个账期提供 3000 资源点。2026-07-11 至 2026-08-11 曾因云托管 CPU / 内存持续消耗而用尽，并导致公网 503；主要成本不是 CDN 流量。

2026-08-19 新账期只读检查显示：

```text
账期：2026-08-12 至 2026-09-11
已用：2.31 / 3000 资源点
来源：Cloud Hosting / EKS
静态托管、SCF、AI、COS：0
```

控制规则：

- 最小实例保持 `0`，最大实例保持 `1`。
- 不设置定时扩缩容、最小实例 `1`、预置并发、持续探活或高频自动回归。
- 面试前 5 分钟可以访问一次首页和 `/analysis` 完成冷启动预热。
- 每次面试或发布后查看资源点趋势；异常增长先停止探活和重复请求。
- 免费 Provider 和 CloudBase 默认域名都不承诺生产 SLA。
- 不经产品负责人明确授权，不升级套餐、不开启超限按量、付费日志、固定 EIP、VPC/NAT 或自定义域名。

个人作品集静态站与本服务使用同一个 CloudBase 环境资源池，但走静态托管/CDN，不
运行 EKS 容器。它属于另一个仓库；本项目的发布包、文档和运维操作不得混入个人站。

## 10. 常见故障判断

| 现象 | 首要判断 | 处理 |
| --- | --- | --- |
| 首页和 `/analysis` 都是 503 | 额度隔离、容器或流量问题 | 查版本状态与资源点；回滚稳定版本 |
| 页面 200，但 AI 是 `missing_key` | 服务端变量缺失或未继承 | 由负责人在控制台处理；禁止传递 Key |
| `unauthorized` | Key、账户关联或权限失效 | 检查 ModelScope 账号状态并轮换 |
| `model_unavailable` | 模型 ID 失效或账号无权使用 | 在 Provider 控制台确认可用模型 |
| `timeout` | 免费模型排队或输出过长 | 等待后单次复测；不要高频重试 |
| `provider_error` | 输出结构波动或 Provider 5xx | 对照解析器与 Provider 状态 |
| `network_error` | 公网出站、DNS、TLS 或网络节点 | 先确认 CloudBase 公网访问开关 |
| 网页控制台空白或一直重连 | 腾讯云嵌入页或网络路径异常 | 用普通 Chrome 和国内网络打开指定页 |

网络协作规则：Codex 连接依赖国际网络，不能自行把系统 VPN 切到国内后再保证恢复。涉及腾讯云控制台时，由项目负责人在普通 Chrome 中切换网络、打开目标页面并完成登录；自动化只接手已打开的页面，不处理验证码、MFA 或密钥。

## 11. 安全边界

- 禁止读取、显示、记录、提交或截图任何真实 Token。
- `.env.local` 必须保持 Git 忽略；发布包不得包含它。
- 不能把 `NEXT_PUBLIC_*` 用于 Provider Key。
- 不记录请求 Header、原始 Provider 错误体或完整敏感客户数据。
- CloudBase 当前环境变量界面可能明文展示值；非必要不要展开该区域。
- 如果控制台曾意外展示过敏感值，应安排轮换，但不在文档中描述具体值。
- Mock fallback 必须清晰标识，不能伪装成真实 AI。

## 12. 日常维护节奏

### 面试前

- 打开国内主站，并准备独立维护的个人作品集入口。
- 预热 `/analysis`，执行一次真实生成。
- 确认 `real-ai / modelscope / null`。
- 检查 CloudBase 资源点没有异常增长。
- 准备本地演示或录屏作为临时网络故障兜底。

### 每次代码发布

- 执行完整本地门槛。
- 从明确提交制作干净包。
- 记录版本和验收证据。
- 失败时先恢复可访问性，再排查根因。

### 每月或账期切换后

- 只读检查资源点和账期。
- 复核 ModelScope 免费额度、模型可用性与账户授权。
- 清理过时部署记录，但保留故障复盘。

## 13. 当前后续待办

- 对 Dashboard 与导航信息架构做独立产品化 Sprint：明确页面用途、功能分组、当前任务和交付结果，让首次使用 SaaS 的用户也能一眼理解。
- 完成企业项目整体代码与上线审查，只输出报告。
- 若未来转为正式生产服务，再评估备案域名、认证、多租户、数据库、分布式限流、可观测性和商业 SLA。

## 14. 历史资料入口

- `docs/INCIDENT_REPORT_2026-07-15.md`：冷启动、ModelScope 超时、解析回归和额度隔离复盘。
- `docs/DEPLOYMENT_PLAYBOOK.md`：平台选型、Provider 选型和通用部署方法。
- `docs/HANDOFF.md`：当前会话、工作树、阻塞和下一步。
- `docs/Sprint_Report.md`：已完成里程碑的历史索引。
