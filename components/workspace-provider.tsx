"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  AiErrorCategory,
  AiGenerationSource,
  AiProvider,
  AiSolutionDraft,
  AnalysisFormInput,
} from "@/lib/analysis-draft";
import {
  defaultProjectId,
  projectCatalog,
  type ProjectRecord,
} from "@/lib/current-project";

const workspaceStorageKey = "enterprise-ai-solution-studio.workspace.v1";

export type StoredAnalysisSession = {
  formState: AnalysisFormInput;
  draft: AiSolutionDraft | null;
  draftSource: AiGenerationSource | null;
  draftProvider: AiProvider | null;
  draftErrorCategory: AiErrorCategory;
  draftNote: string;
  updatedAt: string;
};

type StoredWorkspaceState = {
  activeProjectId: string;
  analysisSessions: Record<string, StoredAnalysisSession>;
};

const analysisFormKeys: Array<keyof AnalysisFormInput> = [
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
];

function isStoredAnalysisSession(value: unknown): value is StoredAnalysisSession {
  if (!value || typeof value !== "object") {
    return false;
  }

  const session = value as Partial<StoredAnalysisSession>;
  const hasValidForm =
    session.formState &&
    analysisFormKeys.every(
      (key) => typeof session.formState?.[key] === "string"
    );
  const hasValidDraft =
    session.draft === null ||
    (Boolean(session.draft) &&
      typeof session.draft?.title === "string" &&
      typeof session.draft?.summary === "string" &&
      Array.isArray(session.draft?.sections) &&
      Array.isArray(session.draft?.assumptions));

  return Boolean(
    hasValidForm &&
      hasValidDraft &&
      typeof session.draftNote === "string" &&
      typeof session.updatedAt === "string"
  );
}

type WorkspaceContextValue = {
  activeProjectId: string;
  activeProject: ProjectRecord;
  isHydrated: boolean;
  switchProject: (projectId: string) => void;
  getAnalysisSession: (projectId: string) => StoredAnalysisSession | null;
  saveAnalysisSession: (
    projectId: string,
    session: Omit<StoredAnalysisSession, "updatedAt">
  ) => void;
  clearAnalysisSession: (projectId: string) => void;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [activeProjectId, setActiveProjectId] = useState<string>(defaultProjectId);
  const [analysisSessions, setAnalysisSessions] = useState<
    Record<string, StoredAnalysisSession>
  >({});
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let nextActiveProjectId: string = defaultProjectId;
    let nextAnalysisSessions: Record<string, StoredAnalysisSession> = {};

    try {
      const rawState = window.localStorage.getItem(workspaceStorageKey);

      if (rawState) {
        const storedState = JSON.parse(rawState) as Partial<StoredWorkspaceState>;

        if (
          storedState.activeProjectId &&
          projectCatalog.some(
            (project) => project.id === storedState.activeProjectId
          )
        ) {
          nextActiveProjectId = storedState.activeProjectId;
        }

        if (
          storedState.analysisSessions &&
          typeof storedState.analysisSessions === "object"
        ) {
          nextAnalysisSessions = Object.fromEntries(
            Object.entries(storedState.analysisSessions).filter(([, session]) =>
              isStoredAnalysisSession(session)
            )
          );
        }
      }
    } catch {
      window.localStorage.removeItem(workspaceStorageKey);
    }

    window.queueMicrotask(() => {
      setActiveProjectId(nextActiveProjectId);
      setAnalysisSessions(nextAnalysisSessions);
      setIsHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const state: StoredWorkspaceState = {
      activeProjectId,
      analysisSessions,
    };

    try {
      window.localStorage.setItem(workspaceStorageKey, JSON.stringify(state));
    } catch {
      // The current in-memory session remains usable if browser storage is full.
    }
  }, [activeProjectId, analysisSessions, isHydrated]);

  const activeProject = useMemo(
    () =>
      projectCatalog.find((project) => project.id === activeProjectId) ??
      projectCatalog[0],
    [activeProjectId]
  );

  const switchProject = useCallback((projectId: string) => {
    if (projectCatalog.some((project) => project.id === projectId)) {
      setActiveProjectId(projectId);
    }
  }, []);

  const getAnalysisSession = useCallback(
    (projectId: string) => analysisSessions[projectId] ?? null,
    [analysisSessions]
  );

  const saveAnalysisSession = useCallback(
    (
      projectId: string,
      session: Omit<StoredAnalysisSession, "updatedAt">
    ) => {
      setAnalysisSessions((current) => ({
        ...current,
        [projectId]: {
          ...session,
          updatedAt: new Date().toISOString(),
        },
      }));
    },
    []
  );

  const clearAnalysisSession = useCallback((projectId: string) => {
    setAnalysisSessions((current) => {
      const next = { ...current };
      delete next[projectId];
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      activeProjectId,
      activeProject,
      isHydrated,
      switchProject,
      getAnalysisSession,
      saveAnalysisSession,
      clearAnalysisSession,
    }),
    [
      activeProject,
      activeProjectId,
      clearAnalysisSession,
      getAnalysisSession,
      isHydrated,
      saveAnalysisSession,
      switchProject,
    ]
  );

  return (
    <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
  );
}

export function useWorkspaceProject() {
  const context = useContext(WorkspaceContext);

  if (!context) {
    throw new Error("useWorkspaceProject must be used within WorkspaceProvider");
  }

  return context;
}
