import { useState } from 'react';
import { ArrowUpRight, BookOpen, Code2, FileText } from 'lucide-react';
import type { StudentProfile } from '../utils/promptBuilder';

interface HeroSectionProps {
  profile: StudentProfile;
  onOpenPromptModal: () => void;
}

const SUMMARY_METRICS = [
  { figure: '01', label: 'Academic Standing', detail: 'First-Year B.Tech AI' },
  { figure: '03', label: 'Core Projects', detail: 'Voter, ATM & Grade Systems' },
  { figure: '04', label: 'Technical Domains', detail: 'C, Python, Web & GenAI' },
  { figure: '02+', label: 'Events Participated', detail: 'Hackathons & Ideathons' },
];

export function HeroSection({ profile, onOpenPromptModal }: HeroSectionProps) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <section id="about" className="bg-white border-b border-slate-200">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-blue-700 tracking-wide">
                {profile.degree} · {profile.year} · Aspiring AI Engineer
              </p>

              <h1
                className="mt-4 font-display text-3xl sm:text-4xl lg:text-[2.85rem] font-semibold tracking-[-0.01em] text-slate-900 leading-[1.15]"
                style={{ textWrap: 'balance' }}
              >
                {profile.headline}
              </h1>

              <p className="mt-5 max-w-[65ch] text-base leading-relaxed text-slate-600">
                {profile.bio}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#projects"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-slate-800 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
              >
                Explore Projects
              </a>

              <button
                type="button"
                onClick={onOpenPromptModal}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-800 transition-colors duration-150 hover:bg-slate-50 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 cursor-pointer"
              >
                <FileText className="h-4 w-4 text-blue-700" aria-hidden="true" />
                Copy AI Studio Prompt
              </button>

              <div
                className="flex items-center gap-4 pl-1 sm:border-l sm:border-slate-200 sm:pl-4 text-sm font-medium text-slate-700"
                aria-label="Social Links"
              >
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-slate-700 hover:text-blue-700 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                >
                  LinkedIn
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-slate-700 hover:text-blue-700 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                >
                  GitHub
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative h-full min-h-[280px] overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
              {!imageFailed ? (
                <img
                  src="/src/assets/images/student_desk_workspace_1794980048335.jpg"
                  alt="Minimalist engineering student study desk with laptop displaying code and a paper flowchart notebook in natural daylight"
                  referrerPolicy="no-referrer"
                  onError={() => setImageFailed(true)}
                  className="h-full w-full object-cover lg:h-full"
                />
              ) : (
                <div className="flex h-full min-h-[280px] flex-col items-center justify-center bg-slate-100 p-8 text-center">
                  <div className="flex items-center gap-3 text-slate-500">
                    <Code2 className="h-6 w-6" aria-hidden="true" />
                    <BookOpen className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="mt-3 font-display text-base font-semibold text-slate-800">
                    {profile.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {profile.degree} · {profile.university}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 border border-slate-200 rounded-xl bg-slate-50/70 lg:grid-cols-4">
          {SUMMARY_METRICS.map((item) => (
            <div key={item.label} className="p-5 sm:p-6">
              <div className="font-mono text-2xl font-semibold tracking-tight text-slate-900 tabular-nums">
                {item.figure}
              </div>
              <div className="mt-1 text-sm font-medium text-slate-800">
                {item.label}
              </div>
              <div className="mt-0.5 text-xs text-slate-500">{item.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
