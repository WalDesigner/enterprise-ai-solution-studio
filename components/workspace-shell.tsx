"use client";

import {
  ArrowLeft,
  Bot,
  Boxes,
  ClipboardCheck,
  FileChartColumn,
  LayoutDashboard,
  SearchCheck,
  ServerCog,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Fragment, useEffect, useRef, type ReactNode } from "react";

import { WorkflowStepper } from "@/components/workflow-stepper";
import { useWorkspaceProject } from "@/components/workspace-provider";
import {
  getWorkflowStageLabel,
  PRODUCT_NAME_ZH,
  PRODUCT_TAGLINE_ZH,
  type WorkflowStageKey,
} from "@/lib/current-project";
import { cn } from "@/lib/utils";

type WorkspaceNavKey =
  | "dashboard"
  | "customers"
  | "analysis"
  | "solution"
  | "poc"
  | "deployment"
  | "roi";

const navigationItems: Array<{
  key: WorkspaceNavKey;
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  description: string;
  soon?: boolean;
}> = [
  { key: "dashboard", label: "使用指引", description: "了解用途与体验路径", href: "/", icon: LayoutDashboard },
  { key: "customers", label: "客户管理", description: "选择业务案例", href: "/customers", icon: Users },
  { key: "analysis", label: "需求分析", description: "01 填写问题 · 生成草案", href: "/analysis", icon: SearchCheck },
  { key: "solution", label: "AI方案", description: "02 查看建议与方案设计", href: "/solution", icon: Sparkles },
  { key: "poc", label: "PoC验证", description: "03 设计小范围试验", href: "/poc", icon: ClipboardCheck },
  {
    key: "deployment",
    label: "部署规划",
    href: "/deployment",
    icon: ServerCog,
    description: "04 规划如何上线",
  },
  {
    key: "roi",
    label: "ROI报告",
    href: "/roi",
    icon: FileChartColumn,
    description: "05 估算成本与收益",
  },
];

const workflowNavKeys: readonly WorkflowStageKey[] = [
  "analysis",
  "solution",
  "poc",
  "deployment",
  "roi",
];

function isWorkflowNavKey(key: WorkspaceNavKey): key is WorkflowStageKey {
  return workflowNavKeys.includes(key as WorkflowStageKey);
}

function getWorkspaceStageKey(
  activeNav: WorkspaceNavKey,
  fallbackStage: WorkflowStageKey
) {
  return isWorkflowNavKey(activeNav) ? activeNav : fallbackStage;
}

type WorkspaceShellProps = {
  activeNav: WorkspaceNavKey;
  breadcrumb: string;
  title: string;
  subtitle: string;
  badge?: string;
  backHref?: string;
  backLabel?: string;
  children: ReactNode;
};

export function WorkspaceShell({
  activeNav,
  breadcrumb,
  title,
  subtitle,
  badge,
  backHref,
  backLabel = "返回",
  children,
}: WorkspaceShellProps) {
  const { activeProject } = useWorkspaceProject();
  const navRef = useRef<HTMLElement | null>(null);
  const activeLinkRef = useRef<HTMLAnchorElement | null>(null);
  useEffect(() => {
    if (window.matchMedia("(min-width: 1024px)").matches) return;
    const frame = window.requestAnimationFrame(() => {
      const nav = navRef.current;
      const link = activeLinkRef.current;
      if (!nav || !link) return;
      // Scroll only the navigation strip; preserve page and form-anchor position.
      nav.scrollTo({ left: nav.scrollLeft + link.getBoundingClientRect().left - nav.getBoundingClientRect().left - (nav.clientWidth - link.clientWidth) / 2 });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [activeNav]);
  const currentStageKey = getWorkspaceStageKey(
    activeNav,
    activeProject.workflowStage
  );


  return (
    <main className="min-h-screen bg-[#f7f8fb] text-slate-950">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur lg:h-screen lg:w-[268px] lg:shrink-0 lg:border-b-0 lg:border-r">
          <div className="flex h-full flex-col px-3 py-3 sm:px-4 lg:py-4">
            <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/70 bg-slate-50/70 p-2.5 lg:justify-start lg:p-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm">
                  <Bot className="size-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold leading-5 text-slate-950">
                    {PRODUCT_NAME_ZH}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {PRODUCT_TAGLINE_ZH}
                  </p>
                </div>
              </div>
              <span className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-medium text-emerald-700 lg:hidden">
                {isWorkflowNavKey(activeNav) ? getWorkflowStageLabel(activeNav) : "选择与体验"}
              </span>
            </div>

            <nav
              ref={navRef}
              aria-label="主要功能"
              className="-mx-1 mt-2 flex snap-x gap-2 overflow-x-auto px-1 pb-1 lg:mx-0 lg:mt-4 lg:grid lg:grid-cols-1 lg:gap-1.5 lg:overflow-visible lg:px-0 lg:pb-0"
            >
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.key === activeNav;

                return (
                  <Fragment key={item.key}>
                  {item.key === "analysis" ? <p className="mb-1 mt-4 hidden px-3 text-[11px] font-semibold tracking-wide text-slate-400 lg:block">方案流程 · 按需查看</p> : null}
                  <Link
                    ref={isActive ? activeLinkRef : undefined}
                    className={cn(
                      "flex min-h-11 shrink-0 snap-start items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors",
                      isActive
                        ? "bg-slate-950 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-950"
                    )}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    <span>
                    <span className="flex items-center gap-2 whitespace-nowrap">
                      {item.label}
                      {item.soon ? (
                        <span
                          className={cn(
                            "rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                            isActive
                              ? "bg-white/15 text-white"
                              : "border border-slate-200 bg-slate-50 text-slate-400"
                          )}
                        >
                          即将开放
                        </span>
                      ) : null}
                      {isActive ? (
                        <span className="rounded-full bg-white/15 px-1.5 py-0.5 text-[10px] font-medium text-white">
                          当前
                        </span>
                      ) : null}
                    </span>
                    <span className={cn("mt-1 hidden text-[11px] font-normal lg:block", isActive ? "text-slate-300" : "text-slate-500")}>{item.description}</span>
                    </span>
                  </Link>
                  </Fragment>
                );
              })}
            </nav>

            <div className="mt-auto hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:block">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-500" />
                <p className="text-sm font-medium text-slate-900">当前项目</p>
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-950">
                {activeProject.projectName}
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                {activeProject.customerName}
              </p>
              <p className="mt-3 text-xs text-slate-500">负责人：{activeProject.owner}</p>
            </div>
          </div>
        </aside>

        <section className="min-w-0 flex-1 px-3 py-4 sm:px-6 sm:py-5 lg:px-6 lg:py-7 2xl:px-8">
          <div className="mx-auto flex max-w-[1320px] flex-col gap-5">
            <header className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
              <div className="border-b border-slate-100 bg-slate-50/70 px-4 py-4 sm:px-6">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-3xl">
                      <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
                        <Boxes className="size-3.5" aria-hidden="true" />
                        工作台 / {breadcrumb}
                      </div>
                      <h1 className="mt-4 text-2xl font-semibold tracking-normal text-slate-950 sm:text-3xl">
                        {title}
                      </h1>
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                        {subtitle}
                      </p>
                    </div>

                    <div className="flex w-full min-w-0 flex-wrap items-center gap-2 lg:w-auto lg:max-w-[520px] lg:justify-end">
                      {badge ? (
                        <span className="inline-flex max-w-full min-w-0 items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
                          <span className="truncate">{badge}</span>
                        </span>
                      ) : null}
                      {backHref ? (
                        <Link
                          className="inline-flex h-10 min-w-32 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-950"
                          href={backHref}
                        >
                          <ArrowLeft className="size-4" aria-hidden="true" />
                          {backLabel}
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              {isWorkflowNavKey(activeNav) ? <div className="border-t border-slate-100 bg-white px-4 py-3 sm:px-6">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <p className="text-slate-600">当前客户 <strong className="ml-2 font-semibold text-slate-900">{activeProject.customerName}</strong></p>
                  <Link href="/customers" className="rounded-md px-2 py-1 font-medium text-teal-700 hover:bg-teal-50">切换客户 →</Link>
                </div>
                <WorkflowStepper compact
                  projectStage={activeProject.workflowStage}
                  viewedStage={currentStageKey}
                />
              </div> : null}
            </header>

            <div className="min-w-0" data-testid="workflow-content">{children}</div>
          </div>
        </section>
      </div>
    </main>
  );
}
