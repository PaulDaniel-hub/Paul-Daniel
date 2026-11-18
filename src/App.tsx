import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TechStackSection } from './components/TechStackSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ProjectRunnerModal } from './components/ProjectRunnerModal';
import { HackathonsSection } from './components/HackathonsSection';
import { PromptBlueprintModal } from './components/PromptBlueprintModal';
import { DEFAULT_PROFILE, type StudentProfile } from './utils/promptBuilder';
import type { ProjectId } from './utils/studentProjects';

export default function App() {
  const [profile, setProfile] = useState<StudentProfile>(DEFAULT_PROFILE);
  const [activeProjectId, setActiveProjectId] = useState<ProjectId | null>(null);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);

  return (
    <div id="top" className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar
        studentName={profile.name}
        onOpenPromptModal={() => setIsPromptModalOpen(true)}
      />

      <main>
        <HeroSection
          profile={profile}
          onOpenPromptModal={() => setIsPromptModalOpen(true)}
        />
        <TechStackSection />
        <ProjectsSection onSelectProject={(id) => setActiveProjectId(id)} />
        <HackathonsSection
          profile={profile}
          onOpenPromptModal={() => setIsPromptModalOpen(true)}
        />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            {profile.name} · {profile.degree} ({profile.year})
          </p>
          <div className="flex items-center gap-5">
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 transition-colors"
            >
              LinkedIn
            </a>
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 transition-colors"
            >
              GitHub
            </a>
            <button
              type="button"
              onClick={() => setIsPromptModalOpen(true)}
              className="text-blue-700 hover:text-blue-800 font-medium cursor-pointer"
            >
              Prompt Blueprint
            </button>
          </div>
        </div>
      </footer>

      <ProjectRunnerModal
        projectId={activeProjectId}
        onClose={() => setActiveProjectId(null)}
      />

      <PromptBlueprintModal
        isOpen={isPromptModalOpen}
        profile={profile}
        onUpdateProfile={setProfile}
        onClose={() => setIsPromptModalOpen(false)}
      />
    </div>
  );
}
