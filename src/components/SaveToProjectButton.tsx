import { useEffect, useMemo, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { useProjects } from '../projects/ProjectsContext';
import type { ProjectItemType } from '../projects/types';

interface SaveItemPayload {
  sourceId: string;
  type: ProjectItemType;
  originPage: 'moments' | 'calendar' | 'talent' | 'talent-match' | 'talent-intel';
  title: string;
  subtitle?: string;
  description?: string;
  url?: string;
  metadata?: Record<string, string>;
}

interface SaveToProjectButtonProps {
  item: SaveItemPayload;
  className?: string;
}

export function SaveToProjectButton({ item, className }: SaveToProjectButtonProps) {
  const { projects, createProject, saveItemToProject } = useProjects();
  const [isOpen, setIsOpen] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [campaignGoal, setCampaignGoal] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const statusTimerRef = useRef<number | null>(null);

  const sortedProjects = useMemo(
    () => [...projects].sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt)),
    [projects],
  );

  useEffect(
    () => () => {
      if (statusTimerRef.current !== null) {
        window.clearTimeout(statusTimerRef.current);
      }
    },
    [],
  );

  function preventAndStop(event: MouseEvent<HTMLElement>) {
    event.preventDefault();
    event.stopPropagation();
  }

  function stopOnly(event: MouseEvent<HTMLElement>) {
    event.stopPropagation();
  }

  function showSavedStatus(projectName: string) {
    setStatus(`Saved to ${projectName}`);
    if (statusTimerRef.current !== null) {
      window.clearTimeout(statusTimerRef.current);
    }
    statusTimerRef.current = window.setTimeout(() => {
      setStatus(null);
      statusTimerRef.current = null;
    }, 1800);
  }

  function toggleOpen(event: MouseEvent<HTMLButtonElement>) {
    preventAndStop(event);
    setIsOpen((open) => !open);
  }

  function onSaveToExisting(event: MouseEvent<HTMLButtonElement>, projectId: string) {
    preventAndStop(event);
    const selectedProject = sortedProjects.find((project) => project.id === projectId);
    if (!selectedProject) return;
    saveItemToProject({ projectId, item });
    setIsOpen(false);
    setIsCreatingProject(false);
    showSavedStatus(selectedProject.name);
  }

  function onCreateAndSave(event: MouseEvent<HTMLButtonElement>) {
    preventAndStop(event);
    const name = newProjectName.trim();
    if (!name) {
      setStatus('Add a project name.');
      return;
    }
    const projectId = createProject({
      name,
      brandName,
      campaignGoal,
      notes,
    });
    saveItemToProject({ projectId, item });
    setIsOpen(false);
    setIsCreatingProject(false);
    setNewProjectName('');
    setBrandName('');
    setCampaignGoal('');
    setNotes('');
    showSavedStatus(name);
  }

  const overlayContent = isOpen ? (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/10 p-4" onMouseDown={() => setIsOpen(false)}>
      <div
        className="w-full max-w-sm rounded-xl border border-[#e0ddd8] bg-white p-3 shadow-[0_18px_42px_-28px_rgba(0,0,0,0.45)]"
        onMouseDown={stopOnly}
        onClick={stopOnly}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">Save item</p>
          <button type="button" onClick={() => setIsOpen(false)} className="text-xs text-zinc-500 hover:text-zinc-100">
            Close
          </button>
        </div>

        {sortedProjects.length > 0 && (
          <div className="mt-2 max-h-56 space-y-1 overflow-y-auto">
            {sortedProjects.map((project) => (
              <button
                key={project.id}
                type="button"
                onClick={(event) => onSaveToExisting(event, project.id)}
                className="w-full rounded-lg border border-transparent px-2.5 py-2 text-left text-xs transition hover:border-[#e0ddd8] hover:bg-[#f7f5f2]"
              >
                <span className="block font-medium text-zinc-100">{project.name}</span>
                <span className="mt-0.5 block text-[11px] text-zinc-500">
                  {project.brandName ? `${project.brandName} • ` : ''}
                  {project.items.length} item{project.items.length === 1 ? '' : 's'}
                </span>
              </button>
            ))}
          </div>
        )}

        <div className="mt-3 border-t border-[#ece8e3] pt-3">
          <button
            type="button"
            onClick={(event) => {
              preventAndStop(event);
              setIsCreatingProject((open) => !open);
            }}
            className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500 transition hover:text-[#c84c2f]"
          >
            {isCreatingProject ? 'Cancel new project' : '+ Create new project'}
          </button>
          {isCreatingProject && (
            <div className="mt-2 space-y-2">
              <input
                value={newProjectName}
                onChange={(event) => setNewProjectName(event.target.value)}
                placeholder="Project name"
                className="saas-input w-full rounded-lg px-2.5 py-2 text-xs text-zinc-100"
              />
              <input
                value={brandName}
                onChange={(event) => setBrandName(event.target.value)}
                placeholder="Brand (optional)"
                className="saas-input w-full rounded-lg px-2.5 py-2 text-xs text-zinc-100"
              />
              <input
                value={campaignGoal}
                onChange={(event) => setCampaignGoal(event.target.value)}
                placeholder="Campaign goal (optional)"
                className="saas-input w-full rounded-lg px-2.5 py-2 text-xs text-zinc-100"
              />
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Notes (optional)"
                rows={2}
                className="saas-input w-full rounded-lg px-2.5 py-2 text-xs text-zinc-100"
              />
              <button
                type="button"
                onClick={onCreateAndSave}
                className="w-full rounded-lg border border-[#e8b8ac] bg-[#fff1ee] px-3 py-2 text-xs font-medium text-[#c84c2f] transition hover:bg-[#ffe9e4]"
              >
                Create and save
              </button>
            </div>
          )}
        </div>

        {sortedProjects.length === 0 && !isCreatingProject && (
          <p className="mt-2 text-xs text-zinc-500">No projects yet. Create your first one below.</p>
        )}
        {status && <p className="mt-2 text-xs text-zinc-500">{status}</p>}
      </div>
    </div>
  ) : null;

  return (
    <div className={`inline-flex flex-col items-start ${className ?? ''}`}>
      <button
        type="button"
        onMouseDown={preventAndStop}
        onClick={toggleOpen}
        className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500 transition hover:text-[#c84c2f]"
      >
        <span aria-hidden>+</span>
        <span>Save</span>
      </button>

      {overlayContent && typeof document !== 'undefined' ? createPortal(overlayContent, document.body) : null}

      {status && !isOpen && <p className="mt-1 text-[11px] font-medium text-[#c84c2f]">{status}</p>}
    </div>
  );
}
