import { expect, test } from "@playwright/test";

for (const width of [1440, 390]) {
  test(`HTTP rate limit remains visibly unsuccessful after refresh at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    // Never contact the real provider from regression tests.
    await page.route("**/api/analysis/generate", route => route.fulfill({
      status: 429, contentType: "application/json", body: '{"error":"Too many requests"}',
    }));
    await page.goto("/analysis", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "生成AI方案草案", exact: true }).click();
    await expect(page.getByText("真实 AI 生成未成功 · 以下为模拟示例", { exact: true })).toBeVisible();
    await expect(page.getByText("请求频率受限", { exact: true })).toBeVisible();
    await expect(page.getByText("AI方案草案已生成", { exact: true })).toHaveCount(0);
    await page.reload({ waitUntil: "networkidle" });
    await expect(page.getByText("真实 AI 生成未成功 · 以下为模拟示例", { exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    const failureHeading = page.getByText("真实 AI 生成未成功 · 以下为模拟示例", { exact: true });
    await expect.poll(async () => {
      const box = await failureHeading.boundingBox();
      return Boolean(box && box.y >= (width < 1024 ? 144 : 0) && box.y + box.height < 1000);
    }).toBe(true);
    await page.screenshot({ path: `test-results/analysis-failure-${width}.png` });
  });
}

test("upstream quota fallback cannot be presented as real AI success", async ({ page }) => {
  await page.route("**/api/analysis/generate", route => route.fulfill({
    status: 200, contentType: "application/json", body: JSON.stringify({
      source: "mock-fallback", provider: "modelscope", errorCategory: "quota_exhausted",
      note: "模型服务额度不足。本次为模拟示例，不是真实 AI 结果。",
      draft: { title: "模拟方案", summary: "模拟内容", sections: [], assumptions: [], confidence: "示例", nextStep: "检查额度" },
    }),
  }));
  await page.goto("/analysis", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "生成AI方案草案", exact: true }).click();
  await expect(page.getByText("真实 AI 生成未成功 · 以下为模拟示例", { exact: true })).toBeVisible();
  await expect(page.getByText("模型额度不足", { exact: true })).toBeVisible();
  await expect(page.getByText("真实 AI 生成", { exact: true })).toHaveCount(0);
});
