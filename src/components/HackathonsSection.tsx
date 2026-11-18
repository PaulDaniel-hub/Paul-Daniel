import { ArrowUpRight, FileText } from 'lucide-react';
import type { StudentProfile } from '../utils/promptBuilder';

interface HackathonsSectionProps {
  profile: StudentProfile;
  onOpenPromptModal: () => void;
}

const EXPERIENCE_ITEMS = [
  {
    index: '01',
    type: 'Hackathon Sprint',
    title: 'Rapid Prototype Collaboration',
    period: 'First-Year Engineering',
    description:
      'Participated in time-boxed team hackathons, translating problem statements into structured logic flows, simple web interfaces, and early AI-assisted prototypes.',
  },
  {
    index: '02',
    type: 'Ideathon Pitching',
    title: 'Applied AI Solution Framing',
    period: 'Campus Innovation Tracks',
    description:
      'Worked on defining real-world student and civic pain points, scoping feasible MVPs using Python and beginner Generative AI workflows, and presenting clear architecture pitches.',
  },
];

export function HackathonsSection({
  profile,
  onOpenPromptModal,
}: HackathonsSectionProps) {
  return (
    <section
      id="hackathons"
      className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8"
    >
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <p className="text-xs font-medium text-blue-700 tracking-wide">
            Hackathons & Ideathons
          </p>
          <h2 className="mt-1.5 font-display text-2xl sm:text-3xl font-semibold tracking-[-0.01em] text-slate-900">
            Learning by building under constraints
          </h2>
          <p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-600">
            Beyond classroom C assignments, hackathons and ideathons have taught me how to break down ambiguous problems, collaborate across roles, and ship working proof-of-concepts quickly.
          </p>

          <div className="mt-8 divide-y divide-slate-200 border-t border-b border-slate-200">
            {EXPERIENCE_ITEMS.map((item) => (
              <div key={item.index} className="py-6">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-slate-500">
                  <span>
                    <span className="font-mono tabular-nums text-slate-700">
                      {item.index}
                    </span>
                    <span aria-hidden="true" className="mx-2">·</span>
                    <span>{item.type}</span>
                  </span>
                  <span>{item.period}</span>
                </div>
                <h3 className="mt-2 font-display text-lg font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
            <p className="text-xs font-medium text-blue-700 tracking-wide">
              Connect & Portfolio Prompt
            </p>
            <h3 className="mt-2 font-display text-xl font-semibold text-slate-900">
              Let&apos;s connect on engineering & AI
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
              Open to first-year student collaborations, hackathon teams, and peer learning in C, Python, Web Development, and Generative AI.
            </p>

            <div className="mt-6 divide-y divide-slate-200 border-t border-b border-slate-200 text-sm">
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between py-3.5 font-medium text-slate-800 transition-colors hover:text-blue-700"
              >
                <span>LinkedIn Profile</span>
                <ArrowUpRight className="h-4 w-4 text-slate-500" aria-hidden="true" />
              </a>
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between py-3.5 font-medium text-slate-800 transition-colors hover:text-blue-700"
              >
                <span>GitHub Repositories</span>
                <ArrowUpRight className="h-4 w-4 text-slate-500" aria-hidden="true" />
              </a>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={onOpenPromptModal}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-800 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              >
                <FileText className="h-4 w-4" aria-hidden="true" />
                Customize & Copy AI Studio Prompt
              </button>
              <p className="mt-2.5 text-xs text-slate-500">
                Includes the structured, non-neon prompt tailored for Google AI Studio.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
