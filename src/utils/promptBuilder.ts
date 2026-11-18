export interface StudentProfile {
  name: string;
  degree: string;
  year: string;
  university: string;
  headline: string;
  bio: string;
  linkedinUrl: string;
  githubUrl: string;
  email: string;
}

export const DEFAULT_PROFILE: StudentProfile = {
  name: 'Paul Daniel',
  degree: 'B.Tech in Artificial Intelligence',
  year: 'First Year Undergraduate',
  university: 'Department of AI & Engineering',
  headline: 'Building strong foundations in C, Python, and practical web systems.',
  bio: 'First-year B.Tech AI student focused on algorithmic thinking in C, problem solving in Python, clean frontend web development, and beginner-level Generative AI experimentation through hackathons and ideathons.',
  linkedinUrl: 'https://www.linkedin.com/in/paul-daniel-410b24440',
  githubUrl: 'https://github.com/PaulDaniel-hub',
  email: 'paul.daniel@example.edu',
};

export function buildPortfolioPrompt(profile: StudentProfile): string {
  const cleanName = profile.name.trim() || '[Your Full Name]';
  const cleanUniversity = profile.university.trim() || '[Your College / University Name]';
  const cleanLinkedIn = profile.linkedinUrl.trim() || 'https://linkedin.com/in/your-handle';
  const cleanGitHub = profile.githubUrl.trim() || 'https://github.com/your-handle';

  return `Act as a senior frontend developer and UI designer with 5+ years of experience. Build a neat, professional, minimalist personal portfolio web application for a first-year B.Tech Artificial Intelligence student.

1. Student Profile & Positioning
- Name: ${cleanName}
- Academic Status: First-Year B.Tech AI Student (${cleanUniversity})
- Core Identity: C Language learner and aspiring AI Engineer with hands-on experience in college hackathons and ideathons.
- Primary Goal: Present academic fundamentals, early engineering projects, and technical curiosity honestly—without exaggerated claims or cluttered visuals.

2. Visual Design & Color Rules (Strict)
- Aesthetic: Clean, editorial, and structured—resembling a crisp engineering notebook or minimalist academic resume site.
- Color Palette: Strictly NO neon colours, NO dark-mode cyberpunk gradients, and NO glowing effects.
  - Background Canvas: Crisp off-white / paper slate (#F8FAFC and #FFFFFF).
  - Structural Surfaces: White cards with subtle 1px hairline borders (#E2E8F0) and charcoal slate typography (#0F172A primary, #475569 muted).
  - Single Accent Color: Deep Academic Cobalt (#1D4ED8) used sparingly for primary buttons, active tabs, and links.
- Typography: Use clean geometric sans-serif headings (Plus Jakarta Sans), legible body prose (DM Sans), and monospace (JetBrains Mono) only for code snippets and tabular numbers.
- Restraint: Avoid floating pill badges on cards, fake innovation scores, pulsing status dots, or decorative icons on every line.

3. Required Sections & Layout
- Header (Single-Row Navigation):
  - Brand wordmark on the left (${cleanName}).
  - Concise navigation links in the center: About, Skills, Projects, Hackathons.
  - One primary contact or resume action button on the right.
- Hero Section (Split Layout):
  - Left column: Clear academic kicker ("B.Tech AI · First Year · Aspiring AI Engineer"), concise headline, brief introduction highlighting C programming fundamentals and hackathon/ideathon experience, primary CTA ("View Projects"), and direct LinkedIn & GitHub text links.
  - Right column: Clean minimalist desk/study visual or structured profile summary card.
  - Below hero: Full-width 4-column summary strip (Academic Year, 3 Core Projects, 4 Technical Domains, Hackathons & Ideathons).
- Technical Stack Section:
  - Present skills honestly grouped by proficiency:
    1. C Language (Foundational — control flow, functions, arrays, pointers, CLI systems)
    2. Python (Core — scripting, data structures, problem solving)
    3. Web Development (Frontend — HTML, CSS, JavaScript, responsive UI)
    4. Generative AI (Beginner — prompt design, LLM workflow concepts, prototype ideation)
- Projects Showcase (With Interactive Live Demos):
  - Include category filtering (All, C Language, Python & Logic) and cards for these exact 3 projects:
    1. Voter Eligibility Calculator — Age, citizenship, and registration validation with clear eligibility messages.
    2. ATM Management System — Stateful PIN verification, balance inquiry, deposit, withdrawal validation, and transaction log.
    3. Student Grade Calculator — Multi-subject marks input computing total, percentage, 10-point CGPA, and letter grade.
  - Allow visitors to test each project interactively inside a clean modal or drawer and inspect the underlying C/Python logic.
- Hackathons, Ideathons & Footer:
  - Dedicated section summarizing problem framing, rapid 24-hour prototyping, teamwork, and beginner AI ideation experience.
  - Clean footer with LinkedIn (${cleanLinkedIn}) and GitHub (${cleanGitHub}) links.

4. Technical & Accessibility Standards
- Build with React, TypeScript, and Tailwind CSS.
- Ensure mobile responsiveness (390px) and desktop balance (1440px) with zero horizontal overflow.
- Use semantic HTML, visible keyboard focus rings, accessible form labels, and clear validation errors on all interactive project inputs.`;
}
