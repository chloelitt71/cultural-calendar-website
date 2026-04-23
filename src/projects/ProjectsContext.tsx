import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { CreateProjectInput, ProjectRecord, SaveProjectItemInput } from './types';

const STORAGE_KEY = 'pulse-projects-v1';

interface ProjectsContextValue {
  projects: ProjectRecord[];
  createProject: (input: CreateProjectInput) => string;
  saveItemToProject: (input: SaveProjectItemInput) => void;
  removeItemFromProject: (projectId: string, itemId: string) => void;
  deleteProject: (projectId: string) => void;
}

const ProjectsContext = createContext<ProjectsContextValue | null>(null);

function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeText(value?: string): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function readInitialProjects(): ProjectRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ProjectRecord[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map((project) => ({
      ...project,
      items: Array.isArray(project.items)
        ? project.items.map((item) => ({
            ...item,
            originPage:
              item.originPage ??
              (item.type === 'moment'
                ? 'moments'
                : item.type === 'event'
                  ? 'calendar'
                  : item.type === 'talent'
                    ? 'talent'
                    : item.type === 'match'
                      ? 'talent-match'
                      : 'talent-intel'),
          }))
        : [],
    }));
  } catch {
    return [];
  }
}

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<ProjectRecord[]>(readInitialProjects);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  const value = useMemo<ProjectsContextValue>(
    () => ({
      projects,
      createProject(input) {
        const name = input.name.trim();
        if (!name) {
          throw new Error('Project name is required');
        }
        const now = new Date().toISOString();
        const nextProject: ProjectRecord = {
          id: uid('project'),
          name,
          brandName: normalizeText(input.brandName),
          campaignGoal: normalizeText(input.campaignGoal),
          notes: normalizeText(input.notes),
          createdAt: now,
          updatedAt: now,
          items: [],
        };
        setProjects((current) => [nextProject, ...current]);
        return nextProject.id;
      },
      saveItemToProject({ projectId, item }) {
        const now = new Date().toISOString();
        setProjects((current) =>
          current.map((project) => {
            if (project.id !== projectId) return project;
            const existingIdx = project.items.findIndex((saved) => saved.type === item.type && saved.sourceId === item.sourceId);
            const nextSavedItem = {
              id: existingIdx >= 0 ? project.items[existingIdx].id : uid('saved'),
              savedAt: now,
              ...item,
            };
            const nextItems =
              existingIdx >= 0
                ? project.items.map((saved, idx) => (idx === existingIdx ? nextSavedItem : saved))
                : [nextSavedItem, ...project.items];
            return {
              ...project,
              items: nextItems,
              updatedAt: now,
            };
          }),
        );
      },
      removeItemFromProject(projectId, itemId) {
        setProjects((current) =>
          current.map((project) => {
            if (project.id !== projectId) return project;
            return {
              ...project,
              items: project.items.filter((item) => item.id !== itemId),
              updatedAt: new Date().toISOString(),
            };
          }),
        );
      },
      deleteProject(projectId) {
        setProjects((current) => current.filter((project) => project.id !== projectId));
      },
    }),
    [projects],
  );

  return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>;
}

export function useProjects(): ProjectsContextValue {
  const ctx = useContext(ProjectsContext);
  if (!ctx) {
    throw new Error('useProjects must be used inside ProjectsProvider');
  }
  return ctx;
}
