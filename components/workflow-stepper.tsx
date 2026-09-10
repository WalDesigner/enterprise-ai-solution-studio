"use client";

import { Check, CircleDot } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

import {
  getWorkflowStageIndex,
  getWorkflowStageLabel,
  type WorkflowStageKey,
  workflowStages,
} from "@/lib/current-project";
import { cn } from "@/lib/utils";

type WorkflowStepperProps = {
  projectStage: WorkflowStageKey;
  viewedStage: WorkflowStageKey;
  autoScroll?: boolean;
  compact?: boolean;
};

function getStageStateLabel({
  isComplete,
  isProjectStage,
  isViewedStage,
}: {
  isComplete: boolean;
  isProjectStage: boolean;
  isViewedStage: boolean;
}) {
  if (isProjectStage && isViewedStage) {
    return "当前阶段";
  }

  if (isViewedStage) {
    return isComplete ? "当前页面 · 已完成" : "当前页面 · 待推进";
  }

  if (isProjectStage) {
    return "项目当前";
  }

  return isComplete ? "已完成" : "待推进";
}

export function WorkflowStepper({
  projectStage,
  viewedStage,
  autoScroll = true,
  compact = false,
}: WorkflowStepperProps) {
  const projectStageIndex = getWorkflowStageIndex(projectStage);
  const viewedStageLabel = getWorkflowStageLabel(viewedStage);
  const projectStageLabel = getWorkflowStageLabel(projectStage);
  const viewedStageRef = useRef<HTMLLIElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const activeStage = viewedStageRef.current;
    const container = scrollContainerRef.current;

    if (!autoScroll || !activeStage || !container || window.matchMedia("(min-width: 640px)").matches) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      // Center only this horizontal strip; never steal the document's hash scroll.
      container.scrollTo({
        left: container.scrollLeft + activeStage.getBoundingClientRect().left - container.getBoundingClientRect().left - (container.clientWidth - activeStage.clientWidth) / 2,
        behavior: "smooth",
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [viewedStage, autoScroll]);

  if (compact) {
    return (
      <nav aria-label="方案流程" className="min-w-0">
        <div ref={scrollContainerRef} className="overflow-x-auto pb-1">
          <ol className="grid min-w-[580px] grid-cols-5 gap-1.5">
            {workflowStages.map((stage, index) => (
              <li key={stage.key} ref={stage.key === viewedStage ? viewedStageRef : undefined}>
                <Link href={stage.route} aria-current={stage.key === viewedStage ? "step" : undefined}
                  className={cn("flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors", stage.key === viewedStage ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100")}>
                  <span className={cn("text-xs tabular-nums", stage.key === viewedStage ? "text-teal-300" : "text-slate-400")}>0{index + 1}</span>
                  {stage.zhLabel}
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </nav>
    );
  }

  return (
    <section aria-label="企业 AI 咨询交付流程">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            咨询交付流程
          </p>
          <h2 className="mt-1 text-sm font-semibold text-slate-950">
            企业 AI 咨询交付流程
          </h2>
        </div>
        <p className="text-xs leading-5 text-slate-500">
          项目当前：
          <span className="font-medium text-emerald-700">{projectStageLabel}</span>
          {viewedStage !== projectStage ? (
            <>
              <span className="px-1.5 text-slate-300">/</span>
              正在查看：
              <span className="font-medium text-sky-700">{viewedStageLabel}</span>
            </>
          ) : null}
        </p>
      </div>

      <div ref={scrollContainerRef} className="mt-4 overflow-x-auto pb-1">
        <ol className="grid min-w-[760px] snap-x grid-cols-5 gap-2">
          {workflowStages.map((stage, index) => {
            const isComplete = index < projectStageIndex;
            const isProjectStage = stage.key === projectStage;
            const isViewedStage = stage.key === viewedStage;
            const stateLabel = getStageStateLabel({
              isComplete,
              isProjectStage,
              isViewedStage,
            });

            return (
              <li
                key={stage.key}
                className="min-w-0 snap-center"
                ref={isViewedStage ? viewedStageRef : undefined}
              >
                <Link
                  href={stage.route}
                  className={cn(
                    "block min-h-24 rounded-xl border p-3 transition-colors",
                    isProjectStage && isViewedStage
                      ? "border-slate-950 bg-slate-950 text-white shadow-sm"
                      : isViewedStage
                        ? "border-sky-300 bg-sky-50 text-sky-950 ring-2 ring-sky-100"
                        : isProjectStage
                          ? "border-emerald-300 bg-emerald-50 text-emerald-950"
                          : isComplete
                            ? "border-emerald-200 bg-white text-slate-800 hover:bg-emerald-50"
                            : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white"
                  )}
                  aria-current={isViewedStage ? "step" : undefined}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        "flex size-7 items-center justify-center rounded-full border text-xs font-semibold",
                        isProjectStage && isViewedStage
                          ? "border-white/20 bg-white text-slate-950"
                          : isViewedStage
                            ? "border-sky-300 bg-white text-sky-700"
                            : isProjectStage || isComplete
                              ? "border-emerald-200 bg-emerald-100 text-emerald-700"
                              : "border-slate-200 bg-white text-slate-500"
                      )}
                    >
                      {isComplete && !isViewedStage ? (
                        <Check className="size-3.5" aria-hidden="true" />
                      ) : isProjectStage ? (
                        <CircleDot className="size-3.5" aria-hidden="true" />
                      ) : (
                        index + 1
                      )}
                    </span>
                    <span
                      className={cn(
                        "text-[10px] font-medium",
                        isProjectStage && isViewedStage
                          ? "text-slate-300"
                          : isViewedStage
                            ? "text-sky-700"
                            : isProjectStage || isComplete
                              ? "text-emerald-700"
                              : "text-slate-400"
                      )}
                    >
                      {stateLabel}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-semibold">{stage.zhLabel}</p>
                  <p
                    className={cn(
                      "mt-1 text-[11px]",
                      isProjectStage && isViewedStage
                        ? "text-slate-400"
                        : "text-slate-400"
                    )}
                  >
                    {stage.label}
                  </p>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
