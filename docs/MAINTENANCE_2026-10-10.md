# 2026-10-10 维护核查

## 结论与实测
- 主分支 `b0b20abdb59d99c9a9965b593d7bee0fa69f2caa`：联网 ls-remote 确认与本地一致，检查开始时工作树干净。
- 首页、customers、analysis、solution、poc、deployment、roi 实际 GET 200，标题为企业 AI 解决方案工作台。
- 抽查 1 CSS、2 JS 均 200，内容类型正确；不是全站资源扫描。
- 页面响应带 `Content-Disposition: attachment`，存在浏览器下载风险；本地 app/components/Next 配置未找到该头的显式设置，尚未确定来自哪一层，不盲目改业务代码。
- 初次 HEAD 20 秒超时，随后 GET 成功；不能单凭此现象断言冷启动。
- 浏览器连接工具失败，本轮没有实际点击/视觉验收。用户已网页登录并发截图确认套餐有效、额度未耗尽；部署记录未回读。当前用量数字见部署交接，截图不上传公开仓库。
- 没有调用真实 AI。最近实测成功为 9 月 23 日，发布基线见部署交接，不能作为今日模型健康保证。

## 安全依赖维护（未修复）
锁文件联网 audit：19 个受影响包，2 critical / 14 high / 3 moderate；包含开发依赖，数量不等于公网可利用漏洞数。
没有安装或自动修复。9 月的零告警是历史结果，不代表未来一直无告警。

- Next 16.3.4 命中新公告版本范围。官方 [ImageResponse 公告](https://github.com/vercel/next.js/security/advisories/GHSA-vcvr-r3jv-pc5j) 要求攻击者可控制 Node ImageResponse 的 SVG 输入；代码定向搜索未发现 next/og / ImageResponse 使用，未证实该路径可利用。
- 官方 [自托管缓存公告](https://github.com/vercel/next.js/security/advisories/GHSA-4jqv-mc3x-m676) 需结合实际运行路径评估，不对生产实施缓存污染测试。
- proxy-addr 告警在 shadcn → MCP SDK → Express 开发依赖链；不将其描述为应用在线 Express 服务。
- sharp、undici 等旧 overrides 也有告警，后续需同步评估；不能只升级一个包就声称全面安全。
- 不执行 audit fix --force：建议中存在 ESLint 配置、shadcn 大幅降级，可能损坏项目兼容性。

下一轮确认安全维护范围后，选兼容补丁、更新锁文件、单元/lint/build/浏览器定向验证；发布需另行明确授权。
没有证据表明网站已经遭攻击，也不能因此忽略告警。

## 本轮变更边界
本地 `maintenance/docs-2026-10-10` 仅文档更新，未改源码或部署配置；未 commit/push/部署，未购买、读取环境变量或切换网络。
源码/依赖未变，因此不重复旧全套测试；本轮检查文档 diff 和格式。

## 下一动作
套餐截图已核验，不重复催用户登录；如需读取服务版本只取白名单字段，不整页读取可能带密钥的服务详情。
恢复浏览器后对实际页面做一次验收，避免反复刷新和 AI 调用。当前优先级是访问可靠性与依赖维护，不是视觉改版。
