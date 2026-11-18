import { useState } from 'react';
import { ArrowRight, Terminal } from 'lucide-react';
import {
  PROJECTS_DATA,
  type ProjectCategory,
  type ProjectId,
} from '../utils/studentProjects';

interface ProjectsSectionProps {
  onSelectProject: (id: ProjectId) => void;
}

const FILTERS: { id: ProjectCategory; label: string }[] = [
  { id: 'all', label: 'All Projects' },
  { id: 'c', label: 'C Language' },
  { id: 'python', label: 'Python & Logic' },
];

export function ProjectsSection({ onSelectProject }: ProjectsSectionProps) {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory>('all');

  const visibleProjects =
    activeFilter === 'all'
      ? PROJECTS_DATA
      : PROJECTS_DATA.filter((project) => project.category === activeFilter);

  return (
    <section
      id="projects"
      className="border-t border-b border-slate-200 bg-white"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between border-b border-slate-200 pb-6">
          <div>
            <p className="text-xs font-medium text-blue-700 tracking-wide">
              Selected Engineering Work
            </p>
            <h2 className="mt-1.5 font-display text-2xl sm:text-3xl font-semibold tracking-[-0.01em] text-slate-900">
              Interactive foundational projects
            </h2>
          </div>

          <div
            role="group"
            aria-label="Filter projects by language"
            className="inline-flex items-center gap-1 self-start rounded-lg bg-slate-100 p-1 sm:self-auto"
          >
            {FILTERS.map((filter) => {
              const isSelected = activeFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveFilter(filter.id)}
                  aria-pressed={isSelected}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-700 ${
                    isSelected
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {visibleProjects.map((project) => (
            <article
              key={project.id}
              data-testid={`project-card-${project.id}`}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-6 transition-colors duration-150 hover:border-slate-300 hover:bg-white"
            >
              <div>
                <p className="text-xs font-medium text-slate-500">
                  <span className="font-mono tabular-nums text-slate-700">
                    {project.index}
                  </span>
                  <span aria-hidden="true" className="mx-2">·</span>
                  <span>{project.languageLabel}</span>
                </p>

                <h3 className="mt-3 font-display text-xl font-semibold tracking-tight text-slate-900">
                  {project.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {project.summary}
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-200/80">
                <p className="text-xs text-slate-500">
                  {project.concepts.join(' · ')}
                </p>

                <button
                  type="button"
                  onClick={() => onSelectProject(project.id)}
                  className="mt-4 inline-flex w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 transition-colors duration-150 hover:border-blue-700 hover:text-blue-700 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                >
                  <span className="inline-flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-blue-700" aria-hidden="true" />
                    Run Live Demo
                  </span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
