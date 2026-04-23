import { useMemo, useState } from 'react';
import { useProjects } from '../projects/ProjectsContext';
import type { ProjectItemType } from '../projects/types';

const GROUP_LABEL: Record<ProjectItemType, string> = {
  talent: 'Saved Talent',
  match: 'Saved Matches',
  lookup: 'Saved Lookups',
  event: 'Saved Events',
  moment: 'Saved Moments',
};

const ORIGIN_LABEL: Record<'moments' | 'calendar' | 'talent' | 'talent-match' | 'talent-intel', string> = {
  moments: 'Moments',
  calendar: 'Calendar',
  talent: 'Talent',
  'talent-match': 'Talent Match',
  'talent-intel': 'Who Is This?',
};

function formatUpdatedAt(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'Unknown';
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
}

export function ProjectsPage() {
  const { projects, createProject, removeItemFromProject, deleteProject } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [campaignGoal, setCampaignGoal] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const sortedProjects = useMemo(
    () => [...projects].sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt)),
    [projects],
  );
  const selectedProject = sortedProjects.find((project) => project.id === selectedProjectId) ?? null;

  const groupedItems = useMemo(() => {
    if (!selectedProject) return null;
    return {
      talent: selectedProject.items.filter((item) => item.type === 'talent'),
      match: selectedProject.items.filter((item) => item.type === 'match'),
      lookup: selectedProject.items.filter((item) => item.type === 'lookup'),
      event: selectedProject.items.filter((item) => item.type === 'event'),
      moment: selectedProject.items.filter((item) => item.type === 'moment'),
    } satisfies Record<ProjectItemType, typeof selectedProject.items>;
  }, [selectedProject]);

  function onCreateProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const projectName = name.trim();
    if (!projectName) {
      setError('Project name is required.');
      return;
    }
    const newId = createProject({
      name: projectName,
      brandName,
      campaignGoal,
      notes,
    });
    setSelectedProjectId(newId);
    setName('');
    setBrandName('');
    setCampaignGoal('');
    setNotes('');
    setError(null);
  }

  return (
    <div className="page-transition section-shell space-y-8 pb-24 pt-8">
      <header className="max-w-3xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#c84c2f]">Projects</p>
        <h1 className="mt-2 font-display text-[2rem] leading-tight text-zinc-50 md:text-[2.35rem]">Campaign workspace</h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          Save talent, matches, lookups, events, and moments into brand-specific project boards for planning.
        </p>
      </header>

      {!selectedProject && (
        <>
          <form onSubmit={onCreateProject} className="saas-panel-soft max-w-3xl space-y-3 rounded-[1.25rem] p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">Create project</p>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Project name"
              className="saas-input w-full rounded-xl px-3 py-2.5 text-sm text-zinc-100"
            />
            <div className="grid gap-3 md:grid-cols-2">
              <input
                value={brandName}
                onChange={(event) => setBrandName(event.target.value)}
                placeholder="Brand name (optional)"
                className="saas-input rounded-xl px-3 py-2.5 text-sm text-zinc-100"
              />
              <input
                value={campaignGoal}
                onChange={(event) => setCampaignGoal(event.target.value)}
                placeholder="Campaign goal (optional)"
                className="saas-input rounded-xl px-3 py-2.5 text-sm text-zinc-100"
              />
            </div>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Notes (optional)"
              rows={3}
              className="saas-input w-full rounded-xl px-3 py-2.5 text-sm text-zinc-100"
            />
            {error && <p className="text-sm text-[#8f3b2a]">{error}</p>}
            <button
              type="submit"
              className="rounded-lg border border-[#c84c2f] bg-[#c84c2f] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Create project
            </button>
          </form>

          <section className="space-y-4">
            <h2 className="font-display text-[1.45rem] text-zinc-50">Your projects</h2>
            {sortedProjects.length === 0 ? (
              <div className="rounded-xl border border-[#eae7e2] bg-white p-6 text-sm text-zinc-400">
                Create a project to start collecting talent, moments, and event ideas.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {sortedProjects.map((project) => (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => setSelectedProjectId(project.id)}
                    className="saas-card rounded-[1.1rem] p-5 text-left"
                  >
                    <p className="font-display text-xl text-zinc-50">{project.name}</p>
                    {project.brandName && <p className="mt-1 text-sm text-zinc-400">Brand: {project.brandName}</p>}
                    {project.campaignGoal && <p className="mt-1 text-sm text-zinc-400">Goal: {project.campaignGoal}</p>}
                    <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">{project.items.length} saved items</p>
                    <p className="mt-1 text-xs text-zinc-500">Updated {formatUpdatedAt(project.updatedAt)}</p>
                  </button>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {selectedProject && groupedItems && (
        <section className="space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-3 rounded-[1.25rem] border border-[#eae7e2] bg-white p-5">
            <div>
              <button type="button" onClick={() => setSelectedProjectId(null)} className="text-xs text-zinc-500 hover:text-zinc-100">
                ← Back to projects
              </button>
              <h2 className="mt-2 font-display text-[1.8rem] text-zinc-50">{selectedProject.name}</h2>
              <p className="mt-1 text-sm text-zinc-400">
                {[selectedProject.brandName, selectedProject.campaignGoal].filter(Boolean).join(' • ') || 'Project workspace'}
              </p>
              {selectedProject.notes && <p className="mt-2 text-sm text-zinc-400">{selectedProject.notes}</p>}
            </div>
            <button
              type="button"
              onClick={() => {
                deleteProject(selectedProject.id);
                setSelectedProjectId(null);
              }}
              className="rounded-lg border border-[#e0ddd8] bg-[#f5f5f5] px-3 py-1.5 text-xs font-medium text-zinc-100 transition hover:border-[#c84c2f]/35"
            >
              Delete project
            </button>
          </div>

          {(Object.keys(GROUP_LABEL) as ProjectItemType[]).map((group) => {
            const items = groupedItems[group];
            return (
              <div key={group} className="space-y-3">
                <h3 className="font-display text-[1.3rem] text-zinc-50">{GROUP_LABEL[group]}</h3>
                {items.length === 0 ? (
                  <div className="rounded-xl border border-[#eae7e2] bg-white p-4 text-sm text-zinc-400">No saved items yet.</div>
                ) : (
                  <div className="grid gap-3 md:grid-cols-2">
                    {items.map((item) => (
                      <article key={item.id} className="rounded-xl border border-[#eae7e2] bg-white p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium text-zinc-100">{item.title}</p>
                            {item.subtitle && <p className="mt-1 text-xs text-zinc-500">{item.subtitle}</p>}
                            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">
                              {GROUP_LABEL[item.type].replace('Saved ', '')} • {ORIGIN_LABEL[item.originPage]}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItemFromProject(selectedProject.id, item.id)}
                            className="text-xs text-zinc-500 hover:text-zinc-100"
                          >
                            Remove
                          </button>
                        </div>
                        {item.description && <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.description}</p>}
                        {item.metadata && Object.keys(item.metadata).length > 0 && (
                          <p className="mt-2 text-xs text-zinc-500">
                            {Object.entries(item.metadata)
                              .slice(0, 2)
                              .map(([key, value]) => `${key.replace(/([A-Z])/g, ' $1')}: ${value}`)
                              .join(' • ')}
                          </p>
                        )}
                        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">Saved {formatUpdatedAt(item.savedAt)}</p>
                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 inline-block text-xs font-medium text-[#c84c2f] hover:underline"
                          >
                            Open source
                          </a>
                        )}
                      </article>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
}
