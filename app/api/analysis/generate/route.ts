import { NextResponse } from "next/server";

import { generateAnalysisDraft } from "@/lib/ai-provider";
import {
  type AnalysisFormInput,
  type AnalysisProjectContext,
} from "@/lib/analysis-draft";

const MAX_REQUEST_BYTES = 50_000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 12;

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasStringFields(value: Record<string, unknown>, fields: readonly string[]) {
  return fields.every((field) => typeof value[field] === "string");
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isAnalysisFormInput(value: unknown): value is AnalysisFormInput {
  return (
    isRecord(value) &&
    hasStringFields(value, [
      "customerName",
      "industry",
      "companySize",
      "department",
      "painPoints",
      "existingSystems",
      "dataSituation",
      "aiGoals",
      "timeline",
      "budgetRange",
    ])
  );
}

function isAnalysisProjectContext(
  value: unknown
): value is AnalysisProjectContext {
  if (!isRecord(value)) return false;

  const recommendedSolution = value.recommendedSolution;
  const pocPlan = value.pocPlan;

  return (
    hasStringFields(value, [
      "projectName",
      "customerName",
      "industry",
      "companySize",
      "department",
      "dataSituation",
      "budgetRange",
      "timeline",
    ]) &&
    isStringArray(value.painPoints) &&
    isStringArray(value.existingSystems) &&
    isStringArray(value.aiGoals) &&
    isStringArray(value.aiOpportunities) &&
    isRecord(recommendedSolution) &&
    hasStringFields(recommendedSolution, [
      "model",
      "agent",
      "rag",
      "workflow",
      "deployment",
    ]) &&
    isRecord(pocPlan) &&
    hasStringFields(pocPlan, ["goal", "expected", "risk", "riskLevel"]) &&
    isStringArray(pocPlan.metrics) &&
    isStringArray(pocPlan.testData)
  );
}

function clientIdentifier(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(request: Request) {
  const now = Date.now();
  const identifier = clientIdentifier(request);
  const current = rateLimitStore.get(identifier);

  if (rateLimitStore.size >= 1_000) {
    for (const [key, entry] of rateLimitStore) {
      if (entry.resetAt <= now) {
        rateLimitStore.delete(key);
      }
    }

    if (rateLimitStore.size >= 1_000) {
      const oldestKey = rateLimitStore.keys().next().value as string | undefined;
      if (oldestKey) rateLimitStore.delete(oldestKey);
    }
  }

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return false;
  }

  current.count += 1;
  return current.count > RATE_LIMIT_MAX_REQUESTS;
}

export async function POST(request: Request) {
  if (isRateLimited(request)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const declaredLength = Number(request.headers.get("content-length") ?? 0);

  if (declaredLength > MAX_REQUEST_BYTES) {
    return NextResponse.json(
      { error: "Request body is too large." },
      { status: 413 }
    );
  }

  const rawBody = await request.text();

  if (new TextEncoder().encode(rawBody).byteLength > MAX_REQUEST_BYTES) {
    return NextResponse.json(
      { error: "Request body is too large." },
      { status: 413 }
    );
  }

  let body: unknown;

  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  if (!isRecord(body)) {
    return NextResponse.json(
      { error: "Request body must be a JSON object." },
      { status: 400 }
    );
  }

  const formState = body.formState;
  const projectContext = body.projectContext;

  if (!isAnalysisFormInput(formState) || !isAnalysisProjectContext(projectContext)) {
    return NextResponse.json(
      { error: "Invalid formState or projectContext." },
      { status: 400 }
    );
  }

  const result = await generateAnalysisDraft({
    formState,
    projectContext,
  });

  return NextResponse.json(result);
}
