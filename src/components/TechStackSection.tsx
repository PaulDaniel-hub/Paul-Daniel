interface SkillTrack {
  index: string;
  name: string;
  level: string;
  summary: string;
  topics: string[];
}

const SKILL_TRACKS: SkillTrack[] = [
  {
    index: '01',
    name: 'C Language',
    level: 'Foundational Core',
    summary:
      'Primary academic language for structured problem solving, memory concepts, and deterministic CLI programs.',
    topics: ['Control Flow & Loops', 'Functions & Arrays', 'Input Validation'],
  },
  {
    index: '02',
    name: 'Python',
    level: 'Core Scripting',
    summary:
      'Clean syntax for data handling, algorithmic practice, utility scripts, and rapid hackathon prototyping.',
    topics: ['Data Structures', 'Modular Functions', 'File & Logic Scripting'],
  },
  {
    index: '03',
    name: 'Web Development',
    level: 'Frontend Systems',
    summary:
      'Building accessible, responsive interfaces with clear typography, semantic markup, and clean layout structure.',
    topics: ['HTML5 & Semantic UI', 'Tailwind CSS', 'JavaScript & React'],
  },
  {
    index: '04',
    name: 'Generative AI',
    level: 'Beginner Track',
    summary:
      'Exploring foundational prompt engineering, LLM capabilities, and practical AI-assisted workflows.',
    topics: ['Prompt Structuring', 'Workflow Ideation', 'API Basics'],
  },
];

export function TechStackSection() {
  return (
    <section id="skills" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b border-slate-200 pb-6">
        <div>
          <p className="text-xs font-medium text-blue-700 tracking-wide">
            Technical Stack & Learning Focus
          </p>
          <h2 className="mt-1.5 font-display text-2xl sm:text-3xl font-semibold tracking-[-0.01em] text-slate-900">
            Core capabilities by domain
          </h2>
        </div>
        <p className="max-w-md text-sm text-slate-600">
          Focused on building solid programming fundamentals in first-year engineering before scaling into applied AI systems.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {SKILL_TRACKS.map((track) => (
          <article
            key={track.name}
            className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6"
          >
            <div>
              <div className="text-xs font-medium text-slate-500">
                <span className="font-mono tabular-nums text-slate-700">{track.index}</span>
                <span aria-hidden="true" className="mx-2">·</span>
                <span>{track.level}</span>
              </div>
              <h3 className="mt-3 font-display text-lg font-semibold text-slate-900">
                {track.name}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                {track.summary}
              </p>
            </div>

            <ul className="mt-6 space-y-2 border-t border-slate-100 pt-4 text-xs font-medium text-slate-700">
              {track.topics.map((topic) => (
                <li key={topic} className="flex items-center justify-between">
                  <span>{topic}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
