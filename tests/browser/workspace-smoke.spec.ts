import { expect, test } from "@playwright/test";

const routes = [
  { path: "/", label: "Dashboard" },
  { path: "/customers", label: "Customer Management" },
  { path: "/analysis", label: "Analysis" },
  { path: "/solution", label: "Solution" },
  { path: "/poc", label: "PoC" },
  { path: "/deployment", label: "Deployment" },
  { path: "/roi", label: "ROI" },
] as const;

test.describe("Enterprise AI Solution Studio browser smoke", () => {
  for (const route of routes) {
    test(`${route.label} route loads without obvious browser errors`, async ({
      page,
    }) => {
      const consoleErrors: string[] = [];
      const pageErrors: string[] = [];

      page.on("console", (message) => {
        if (message.type() === "error") {
          consoleErrors.push(message.text());
        }
      });

      page.on("pageerror", (error) => {
        pageErrors.push(error.message);
      });

      const response = await page.goto(route.path, {
        waitUntil: "networkidle",
      });

      expect(response?.ok(), `${route.path} should return a successful response`).toBe(
        true
      );
      await expect(page).toHaveTitle("企业 AI 解决方案工作台");
      await expect(page.locator("body")).toBeVisible();

      const bodyText = (await page.locator("body").innerText()).trim();
      expect(bodyText.length, `${route.path} should render meaningful content`).toBeGreaterThan(
        20
      );

      const horizontalOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );

      expect(
        horizontalOverflow,
        `${route.path} should not create desktop horizontal overflow`
      ).toBeLessThanOrEqual(1);
      expect(pageErrors, `${route.path} should not throw page errors`).toEqual([]);
      expect(consoleErrors, `${route.path} should not log console errors`).toEqual([]);
    });
  }
});

test("dashboard presents the project as an honest interactive case study", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "networkidle" });

  await expect(page.getByText("交互式案例演示", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "把企业需求，整理成可讨论的 AI 方案" })).toBeVisible();
  await expect(page.getByRole("link", { name: "从需求开始体验" })).toHaveAttribute("href", "/analysis#analysis-form");
  await expect(
    page.getByText("脱敏案例数据", { exact: true }).first()
  ).toBeVisible();
  await page.getByText("更多案例与项目动态", { exact: true }).click();
  await expect(page.getByText("案例步骤 01", { exact: true })).toBeVisible();
  await expect(page.getByText("本地 MVP 已就绪", { exact: true })).toHaveCount(0);
});

test("first-time visitor can reach the example form without calling AI", async ({ page }) => {
  let generationRequests = 0;
  await page.route("**/api/analysis/generate", async (route) => {
    generationRequests += 1;
    await route.abort();
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "networkidle" });
  expect(await page.evaluate(() => window.scrollY)).toBeLessThan(10);
  await page.getByRole("link", { name: "从需求开始体验" }).click();
  await expect(page.getByLabel("客户名称")).toBeVisible();
  await expect(page.getByLabel("客户名称")).not.toHaveValue("");
  await expect.poll(async () => page.getByLabel("客户名称").evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return rect.top >= 140 && rect.bottom <= window.innerHeight;
  })).toBe(true);
  expect(generationRequests).toBe(0);
});

test("dashboard case switch keeps the continuation and saved project consistent", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.getByText("更多案例与项目动态", { exact: true }).click();
  await page.getByRole("button", { name: "北方海工供应链公司PoC验证", exact: true }).click();
  const currentProject = page.getByRole("region", { name: "北方海工供应链公司PoC验证" });
  await expect(currentProject.getByRole("link", { name: "继续PoC验证" })).toHaveAttribute("href", "/poc");
  await page.reload({ waitUntil: "networkidle" });
  await expect(currentProject).toBeVisible();
  await expect(currentProject.getByRole("link", { name: "继续PoC验证" })).toHaveAttribute("href", "/poc");
});

test("customers preview a case before switching and preserve the selection on reload", async ({ page }) => {
  await page.goto("/customers", { waitUntil: "networkidle" });
  await expect(page.getByText("企业 AI 咨询交付流程", { exact: true })).toHaveCount(0);
  const card = page.getByRole("button", { name: /审批流程协同/ });
  await card.click();
  await expect(card).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("当前工作区：天津汽车零部件企业", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "北方海工供应链公司PoC验证", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "进入PoC 验证", exact: true }).click();
  await expect(page).toHaveURL(/\/poc$/);
  await page.goto("/customers", { waitUntil: "networkidle" });
  await page.reload({ waitUntil: "networkidle" });
  await expect(card).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("当前工作区：北方海工供应链公司", { exact: true })).toBeVisible();
});

test("customers mobile comparison and filters remain usable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/customers", { waitUntil: "networkidle" });
  const first = await page.getByRole("button", { name: /售后服务提效/ }).boundingBox();
  // The business description is visually hidden on mobile; locate by title instead.
  const knowledge = await page.getByRole("button", { name: /售后知识库/ }).boundingBox();
  expect(first?.y).toBe(knowledge?.y);
  expect(knowledge!.x).toBeGreaterThan(first!.x);
  await page.getByText(/搜索与筛选/).click();
  await page.getByLabel("搜索客户或业务问题").fill("不存在的客户");
  await expect(page.getByRole("status")).toContainText("没有匹配的案例");
  await page.getByRole("button", { name: "清除筛选" }).click();
  await page.getByLabel("行业", { exact: true }).selectOption("制造业 / 海工");
  await expect(page.getByRole("button", { name: /审批流程协同/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /售后服务提效/ })).toHaveCount(0);
  await page.getByLabel("项目阶段", { exact: true }).selectOption("solution");
  await expect(page.getByRole("status")).toBeVisible();
});

test("analysis header remains usable at a narrow desktop width", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto("/analysis", { waitUntil: "networkidle" });

  const backButton = page.getByRole("link", { name: "返回仪表盘" });
  await expect(backButton).toBeVisible();

  const buttonLayout = await backButton.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return {
      height: rect.height,
      whiteSpace: window.getComputedStyle(element).whiteSpace,
      width: rect.width,
    };
  });
  const horizontalOverflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth
  );

  expect(buttonLayout.height).toBe(40);
  expect(buttonLayout.whiteSpace).toBe("nowrap");
  expect(buttonLayout.width).toBeGreaterThanOrEqual(128);
  expect(horizontalOverflow).toBeLessThanOrEqual(1);
});

test("analysis input and generated draft persist into the solution workflow", async ({
  page,
}) => {
  await page.route("**/api/analysis/generate", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      status: 200,
      body: JSON.stringify({
        source: "real-ai",
        provider: "modelscope",
        errorCategory: null,
        note: "工作流持久化测试。",
        draft: {
          title: "工作流同步验证方案",
          summary: "用于验证需求分析草案可以保存并同步到方案设计页。",
          sections: [
            { title: "客户痛点总结", content: "知识分散。" },
            { title: "AI机会点分析", content: "知识增强。" },
            { title: "推荐AI方案", content: "ModelScope。" },
            { title: "PoC验证范围", content: "两周验证。" },
            { title: "风险提示", content: "保留人工确认。" },
            { title: "ROI假设", content: "PoC 后校准。" },
          ],
          assumptions: ["数据已脱敏。", "指标需要 PoC 校准。"],
          confidence: "中等。",
          nextStep: "进入方案设计。",
        },
      }),
    });
  });

  await page.goto("/analysis", { waitUntil: "networkidle" });

  const customerName = page.getByLabel("客户名称");
  await customerName.fill("天津面试演示客户");

  await expect(page.getByText(/已保存于/)).toBeVisible();
  await page.reload({ waitUntil: "networkidle" });
  await expect(page.getByLabel("客户名称")).toHaveValue("天津面试演示客户");

  await page
    .locator("#analysis-form")
    .getByRole("button", { name: "生成AI方案草案" })
    .click();
  await expect(page.getByText("AI方案草案已生成")).toBeVisible();
  await expect(page.getByText(/已保存于/)).toBeVisible();

  await page.goto("/solution", { waitUntil: "networkidle" });
  await expect(page.getByTestId("synced-analysis-draft")).toBeVisible();
  await expect(page.getByText("已同步需求分析草案")).toBeVisible();
});

test("invalid local workspace data is discarded safely", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "enterprise-ai-solution-studio.workspace.v1",
      "{invalid-json"
    );
  });

  await page.goto("/analysis", { waitUntil: "networkidle" });
  await expect(page.getByLabel("客户名称")).toBeVisible();
  await expect(page.getByText("当前项目自动保存")).toBeVisible();
});

test.describe("mobile interview-link experience", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  for (const route of routes) {
    test(`${route.label} fits a phone viewport`, async ({ page }) => {
      const pageErrors: string[] = [];
      page.on("pageerror", (error) => pageErrors.push(error.message));

      const response = await page.goto(route.path, { waitUntil: "networkidle" });

      expect(response?.ok()).toBe(true);
      await expect(
        page.getByRole("navigation", { name: "主要功能" })
      ).toBeVisible();

      const horizontalOverflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth
      );
      const firstNavLink = await page
        .getByRole("navigation", { name: "主要功能" })
        .getByRole("link")
        .first()
        .boundingBox();

      expect(horizontalOverflow).toBeLessThanOrEqual(1);
      expect(firstNavLink?.height ?? 0).toBeGreaterThanOrEqual(44);
      expect(pageErrors).toEqual([]);
    });
  }

  test("AI generation shows visible progress before the result", async ({
    page,
  }) => {
    await page.route("**/api/analysis/generate", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1_500));
      await route.fulfill({
        contentType: "application/json",
        status: 200,
        body: JSON.stringify({
          source: "real-ai",
          provider: "modelscope",
          errorCategory: null,
          note: "移动端等待体验测试。",
          draft: {
            title: "移动端 AI 方案草案",
            summary: "用于验证等待反馈和结果展示。",
            sections: [
              { title: "客户痛点总结", content: "知识分散。" },
              { title: "AI机会点分析", content: "知识增强。" },
              { title: "推荐AI方案", content: "ModelScope。" },
              { title: "PoC验证范围", content: "两周验证。" },
              { title: "风险提示", content: "保留人工确认。" },
              { title: "ROI假设", content: "PoC 后校准。" },
            ],
            assumptions: ["数据已脱敏。", "指标需要 PoC 校准。"],
            confidence: "中等。",
            nextStep: "进入方案设计。",
          },
        }),
      });
    });

    await page.goto("/analysis", { waitUntil: "networkidle" });
    await page
      .getByRole("button", { name: "生成AI方案草案" })
      .first()
      .click();

    await expect(page.getByTestId("generation-status")).toBeVisible();
    await expect(
      page.getByRole("progressbar", { name: "AI 方案生成进度" })
    ).toBeVisible();
    await expect(page.getByText(/AI 生成中/).first()).toBeVisible();

    await expect(page.getByText("AI方案草案已生成")).toBeVisible();
    await expect(page.getByTestId("generation-status")).toBeHidden();
    await expect(page.getByText("真实 AI 生成", { exact: true })).toBeVisible();
  });
});
