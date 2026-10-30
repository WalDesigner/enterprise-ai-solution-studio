# 2026-10-30 投递前维护记录

## 结论

应用代码与本地完整回归健康；当前真实 AI 故障是 ModelScope 403。旧版本会自动创建模拟草案，容易让访问者误以为模型已生成；本轮改为 fail-closed，失败只显示原因，不再生成、保存或覆盖模拟结果。

## 诊断证据

- 此前生产有效请求：ModelScope 403，旧 API 返回 `source=mock-fallback`。
- 2026-10-30 本地只执行一笔真实请求：HTTP 503、`source=unavailable`、`provider=modelscope`、`errorCategory=unauthorized`、`draft=null`，417ms。
- 本地与云端使用同一供应商且错误一致，因此优先检查 ModelScope Token/账户权限，不把问题归因于 CloudBase 资源点或冷启动。
- 未读取、显示、记录或提交 Token；上游错误正文不进入客户端。

## 本轮实现

- Provider 失败统一返回不可用结果，不再构造模拟草案。
- API 失败使用 HTTP 503，并设置 `Cache-Control: no-store`。
- 前端只接受可解析的 `real-ai` 结果；失败时保留先前草案并明确标注其历史来源。
- 客户端请求设 40 秒超时；认证、额度、限流、网络等错误显示安全提示。
- 增加认证失败、错误封装和“失败后历史草案不被覆盖”的回归。
- Next.js 与配套规则升级至 16.4.3；生产依赖审计为 0。

## 验证

- 单元测试：14/14。
- 浏览器回归：29/29，覆盖 1440px、390px、七路由、客户切换、生成失败与持久化。
- lint：通过。
- Webpack production build：通过。
- 默认 Turbopack 在当前受限执行环境因临时端口权限崩溃；Webpack 同源码通过，不归类为产品缺陷。

## 未完成

- 本记录创建时修复尚未发布，生产仍可能运行旧 fallback 行为。
- ModelScope Token/账户权限需要项目负责人在官网确认或轮换，并直接更新 CloudBase；Token 不经过聊天和仓库。
- 发布后只做一次公网真实生成，必须取得 HTTP 200、`real-ai`、`modelscope`、`errorCategory=null` 和六章节完整证据，才能恢复“真实 AI 可用”的结论。
