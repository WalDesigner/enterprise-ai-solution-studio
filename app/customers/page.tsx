"use client";

import {
  ArrowRight,
  Building2,
  Clock3,
  Search,
  User2,
  Workflow,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { WorkspaceShell } from "@/components/workspace-shell";
import { customerRecords, getWorkflowStageLabel } from "@/lib/current-project";
import { useWorkspaceProject } from "@/components/workspace-provider";

const industryOptions = ["全部", "制造业 / 汽配", "制造业 / 海工", "软件 / SaaS"] as const;
const statusOptions = ["全部", "需求分析进行中", "AI方案设计中", "PoC验证中", "部署规划中"] as const;

export default function CustomersPage() {
  const router = useRouter();
  const { activeProject, switchProject } = useWorkspaceProject();
  const [query, setQuery] = useState("");
  const [industryFilter, setIndustryFilter] =
    useState<(typeof industryOptions)[number]>("全部");
  const [statusFilter, setStatusFilter] =
    useState<(typeof statusOptions)[number]>("全部");

  const filteredCustomers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return customerRecords.filter((customer) => {
      const matchesQuery =
        !normalizedQuery ||
        [
          customer.name,
          customer.projectName,
          customer.industry,
          customer.status,
          customer.owner,
          customer.lastUpdated,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      const matchesIndustry =
        industryFilter === "全部" || customer.industry === industryFilter;
      const matchesStatus = statusFilter === "全部" || customer.status === statusFilter;

      return matchesQuery && matchesIndustry && matchesStatus;
    });
  }, [industryFilter, query, statusFilter]);

  const openProject = (projectId: string, continueHref: string) => {
    switchProject(projectId);
    router.push(continueHref);
  };

  return (
    <WorkspaceShell
      activeNav="customers"
      breadcrumb="客户管理 / 客户列表"
      title="客户管理"
      subtitle="从客户开始选择项目，再继续进入需求分析、AI 方案设计和 PoC 验证。"
      badge={`共 ${customerRecords.length} 个演示客户`}
      backHref="/"
      backLabel="返回仪表盘"
    >
      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-base font-semibold text-slate-950">客户入口</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                搜索客户名称、行业、状态或负责人。选择一个客户后，工作区会切换到对应项目并继续当前流程。
              </p>
            </div>

            <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-3 lg:w-[560px]">
              <label className="flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                <Search className="size-4 text-slate-400" aria-hidden="true" />
                <input
                  className="w-full bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400 sm:text-sm"
                  placeholder="搜索客户、行业、状态、负责人"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </label>

              <label className="flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                <Building2 className="size-4 text-slate-400" aria-hidden="true" />
                <select
                  className="w-full bg-transparent text-base text-slate-900 outline-none sm:text-sm"
                  value={industryFilter}
                  onChange={(event) =>
                    setIndustryFilter(event.target.value as (typeof industryOptions)[number])
                  }
                >
                  {industryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                <Workflow className="size-4 text-slate-400" aria-hidden="true" />
                <select
                  className="w-full bg-transparent text-base text-slate-900 outline-none sm:text-sm"
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value as (typeof statusOptions)[number])
                  }
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs text-slate-500">客户数量</p>
              <p className="mt-1 text-2xl font-semibold text-slate-950">
                {customerRecords.length}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs text-slate-500">当前项目</p>
              <p className="mt-1 text-sm font-medium text-slate-950">
                {activeProject.projectName}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs text-slate-500">当前阶段</p>
              <p className="mt-1 text-sm font-medium text-slate-950">
                {getWorkflowStageLabel(activeProject.workflowStage)}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs text-slate-500">下一步入口</p>
              <p className="mt-1 text-sm font-medium text-slate-950">
                {getWorkflowStageLabel(activeProject.workflowStage)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {filteredCustomers.length ? (
          filteredCustomers.map((customer) => {
            const isActive = customer.id === activeProject.id;

            return (
              <article
                key={customer.id}
                className={`rounded-2xl border p-5 shadow-sm transition-colors ${
                  isActive
                    ? "border-slate-900 bg-slate-950 text-white"
                    : "border-slate-200/80 bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div
                      className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium ${
                        isActive
                          ? "border-white/10 bg-white/10 text-white"
                          : "border-slate-200 bg-slate-50 text-slate-600"
                      }`}
                    >
                      <Building2 className="size-3.5" aria-hidden="true" />
                      {customer.industry}
                    </div>
                    <h3
                      className={`mt-4 text-lg font-semibold ${
                        isActive ? "text-white" : "text-slate-950"
                      }`}
                    >
                      {customer.name}
                    </h3>
                    <p
                      className={`mt-2 text-sm ${
                        isActive ? "text-slate-300" : "text-slate-600"
                      }`}
                    >
                      {customer.projectName}
                    </p>
                    <p
                      className={`mt-2 text-sm ${
                        isActive ? "text-slate-300" : "text-slate-600"
                      }`}
                    >
                      负责人：{customer.owner}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      isActive
                        ? "bg-white/10 text-white"
                        : "border border-slate-200 bg-slate-50 text-slate-600"
                    }`}
                  >
                    {customer.status}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div
                    className={`rounded-xl border p-4 ${
                      isActive
                        ? "border-white/10 bg-white/5"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <p className={`text-xs ${isActive ? "text-slate-300" : "text-slate-500"}`}>
                      数据属性
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <Clock3 className="size-4 text-slate-400" aria-hidden="true" />
                      <p
                        className={`text-sm font-medium ${
                          isActive ? "text-white" : "text-slate-950"
                        }`}
                      >
                        {customer.lastUpdated}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`rounded-xl border p-4 ${
                      isActive
                        ? "border-white/10 bg-white/5"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <p className={`text-xs ${isActive ? "text-slate-300" : "text-slate-500"}`}>
                      继续阶段
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <User2 className="size-4 text-slate-400" aria-hidden="true" />
                      <p
                        className={`text-sm font-medium ${
                          isActive ? "text-white" : "text-slate-950"
                        }`}
                      >
                        {getWorkflowStageLabel(customer.stage)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p
                    className={`text-sm ${
                      isActive ? "text-slate-300" : "text-slate-500"
                    }`}
                  >
                    {isActive
                      ? "当前正在使用此项目。"
                      : "选择该客户后即可切换项目并继续工作流。"}
                  </p>
                  <button
                    className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium shadow-sm transition-colors ${
                      isActive
                        ? "bg-white text-slate-950 hover:bg-slate-200"
                        : "border border-slate-200 bg-slate-950 text-white hover:bg-slate-800"
                    }`}
                    type="button"
                    onClick={() => openProject(customer.id, customer.continueHref)}
                  >
                    {isActive ? "继续当前项目" : "切换并打开"}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </button>
                </div>
              </article>
            );
          })
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
            没有找到匹配的客户。
          </div>
        )}
      </section>
    </WorkspaceShell>
  );
}
