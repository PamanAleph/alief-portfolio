/**
 * All personal content for the site lives here. Pages and components only render it.
 * Every fact below comes from the previous version of the site (résumé data) —
 * nothing is invented. Learning entries live in `src/content/learning/*.md`.
 */

export type AccentName = "violet" | "pink" | "lime" | "cyan" | "orange";

export interface SocialLink {
  label: string;
  href: string;
  /** Accessible name for screen readers. */
  ariaLabel: string;
}

export interface Profile {
  name: string;
  /** Name split into display lines for the hero headline. */
  nameLines: string[];
  shortName: string;
  monogram: string;
  role: string;
  tagline: string;
  pitch: string;
  roleWords: string[];
  email: string;
  location: string;
  timeZone: string;
  timeZoneLabel: string;
  available: boolean;
  socials: SocialLink[];
}

export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export interface Manifesto {
  /** Plain text; words wrapped in [[double brackets]] get an accent marker. */
  text: string;
}

export interface StackGroup {
  name: string;
  items: string[];
}

export interface Job {
  org: string;
  place: string;
  role: string;
  dates: string;
  bullets: string[];
}

export interface Entry {
  org: string;
  dates: string;
  detail: string;
}

export interface Principle {
  title: string;
  body: string;
}

export const profile: Profile = {
  name: "Muhammad Alief Firmanda",
  nameLines: ["Muhammad", "Alief", "Firmanda"],
  shortName: "Alief Firmanda",
  monogram: "AF",
  role: "Fullstack Engineer",
  tagline: "Fullstack engineering, audited by design.",
  pitch:
    "Scalable, secure software aligned with governance, risk, and compliance standards — shipped by someone who owns both sides of the request.",
  roleWords: ["Frontend", "Backend", "Governance", "Scrum"],
  email: "aliefbuscode@gmail.com",
  location: "Tangerang Regency, Banten, Indonesia",
  timeZone: "Asia/Jakarta",
  timeZoneLabel: "WIB",
  available: true,
  socials: [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/muhammad-alief-firmanda/",
      ariaLabel: "LinkedIn profile of Muhammad Alief Firmanda",
    },
    {
      label: "Medium",
      href: "https://medium.com/@aliefbuscode",
      ariaLabel: "Medium articles by Muhammad Alief Firmanda",
    },
  ],
};

export const marqueeLines: [string[], string[]] = [
  ["Available for work", "Audited by design", "Ship it, prove it's safe", "Clean code"],
  ["Frontend", "Backend", "RBAC", "Audit logs", "CI/CD", "Scrum"],
];

export const manifesto: Manifesto = {
  text:
    "I design [[scalable, secure, and compliant]] systems, aligned with [[governance, risk, and compliance]] standards — and as a Scrum Master I lead Agile teams that deliver high-quality products on time.",
};

export const stats: Stat[] = [
  { value: 5, suffix: "", label: "Engineering roles" },
  { value: 60, suffix: "+", label: "Secure REST endpoints" },
  { value: 10, suffix: "+", label: "Developers mentored" },
  { value: 65, suffix: "%", label: "Dashboard latency cut" },
];

export const stack: StackGroup[] = [
  { name: "Core languages", items: ["TypeScript", "Golang", "Python", "JavaScript (ES6+)", "SQL", "PHP"] },
  { name: "Backend", items: ["Node.js (Express.js)", "PostgreSQL", "MongoDB", "Redis", "Laravel", "BullMQ"] },
  {
    name: "Frontend",
    items: ["React.js", "Next.js (SSR/ISR)", "Astro", "React Native", "Tailwind CSS", "Zustand", "Redux", "SvelteKit"],
  },
  {
    name: "DevOps",
    items: ["Docker", "Portainer", "GitHub Actions (CI/CD)", "Linux Administration (SSH/VM)", "Nginx"],
  },
  {
    name: "Security & quality",
    items: ["K6 load testing", "Jest/Vitest", "RBAC design", "JWT/OAuth2", "OWASP Top 10", "PII data masking"],
  },
];

export const experienceHeadline = "Five roles, one thread — ship it, then prove it’s safe.";

export const jobs: Job[] = [
  {
    org: "Cekat.AI",
    place: "PT Teknologi Cekat Indonesia, Tangerang",
    role: "Fullstack Engineer",
    dates: "Oct 2025 — Present",
    bullets: [
      "Architected and deployed a centralized Enterprise SaaS ERP adopted across multiple departments.",
      "Engineered a high-concurrency analytics engine with Golang’s errgroup across Postgres and ClickHouse, cutting dashboard latency by 65%.",
      "Enforced IT governance with a granular audit log system and automated anomaly detection on state-altering changes.",
    ],
  },
  {
    org: "PT Ksatria Mitra Solusindo",
    place: "Surabaya (Remote)",
    role: "Fullstack Engineer",
    dates: "May 2025 — Oct 2025",
    bullets: [
      "Built and maintained backend services with Express.js and MongoDB, cutting API response time by 20%.",
      "Integrated AI-powered auto-reply and a ticketing system to streamline customer support.",
      "Developed “Beliin” (proxy purchasing) and “Kirimin” (international shipping) marketplace modules end to end.",
    ],
  },
  {
    org: "Percetakan Uang Republik Indonesia",
    place: "GovTech, South Jakarta",
    role: "Fullstack Developer Intern",
    dates: "Oct 2024 — Oct 2025",
    bullets: [
      "Migrated the Meterai Elektronik frontend from PHP to Next.js, then to Astro as a layout wrapper over the same React architecture — 50% faster page loads.",
      "Designed 60+ secure RESTful endpoints (Express.js, PostgreSQL, JWT, RBAC), cutting API-related bug reports by 65% in QA.",
      "Applied role-based data masking on NIK fields and centralized error masking for PII compliance.",
    ],
  },
  {
    org: "President University",
    place: "Bekasi Regency",
    role: "Software Developer Intern",
    dates: "Sep 2024 — Dec 2024",
    bullets: [
      "Led a fullstack accreditation system (Next.js SSR + Express.js/PostgreSQL) for the Internal Quality Assurance Directorate.",
      "Built a responsive, role-based management dashboard — 40% faster, 25% lower bounce rate.",
      "Implemented RBAC and encrypted dynamic route parameters to prevent ID-enumeration attacks.",
    ],
  },
  {
    org: "PUFA Computing",
    place: "Bekasi Regency",
    role: "Front End Web Developer",
    dates: "Nov 2023 — Oct 2024",
    bullets: [
      "Integrated NextAuth.js login with TOTP-based 2FA, lifting registrations 25% and cutting unauthorized attempts 40%.",
      "Shipped SSR plus ARIA and semantic HTML for accessibility and SEO — 25% more organic traffic.",
      "Lazy-loaded images and components for a 40% faster initial load.",
    ],
  },
];

export const education: Entry[] = [
  {
    org: "President University, Bekasi Regency — Bachelor of Informatics",
    dates: "Sep 2022 — Dec 2025 · GPA 3.66 / 4.00",
    detail:
      "Software Engineering, Data Structures & Algorithms, Database Systems, Security Compliance & Audit, Network Security. Applied RBAC, data masking, and the OWASP Top 10 in coursework projects.",
  },
];

export const leadership: Entry[] = [
  {
    org: "Internal Capstone Project, President University — Frontend Engineer",
    dates: "Jan 2025 — Jul 2025",
    detail:
      "Architected a feature-based Next.js structure with strict domain encapsulation; 95% sprint completion rate across the build.",
  },
  {
    org: "President University Developer Club — Team Mentor, Frontend Path",
    dates: "Jan 2025 — Jul 2025",
    detail: "Mentored 10+ aspiring developers from React fundamentals through advanced patterns and API integration.",
  },
  {
    org: "PUFA Computing — Member, Research & Technology",
    dates: "Nov 2023 — Nov 2024",
    detail:
      "Pair-programmed with a junior developer on component-based React, Next.js, and TypeScript work; aligned weekly with backend and UI/UX on API specs.",
  },
];

export const principles: Principle[] = [
  {
    title: "Ship fullstack, end to end.",
    body: "React and Next.js or Astro on the front, Node.js, Golang, and PostgreSQL on the back — the same person owns both sides of the request.",
  },
  {
    title: "Build for governance, not just features.",
    body: "RBAC, audit logs, PII masking, and OWASP-aligned validation, baked in from the first commit rather than bolted on after a finding.",
  },
  {
    title: "Run the team, not just the code.",
    body: "Scrum Master and mentor — sprint planning, API design reviews, and onboarding ten-plus junior developers into production codebases.",
  },
];

export const learningIntro = {
  title: "Things I’ve built, and what I’m learning from them.",
  lede: "One set, newest first — systems shipped in the roles on the experience page, and notes written along the way.",
};

export const contact = {
  headline: ["Let’s build", "something."],
  cta: "Email me",
};

/** Accent used by each home section, in page order. */
export const sectionAccents: Record<string, AccentName> = {
  hero: "violet",
  marquee: "lime",
  about: "lime",
  work: "pink",
  stack: "cyan",
  journey: "orange",
  contact: "pink",
  footer: "lime",
};

/** Accent cycle for repeated items (project cards, learning rows). */
export const accentCycle: AccentName[] = ["violet", "lime", "cyan", "orange", "pink"];

/** Shape of a learning entry once mapped for the Work cards and Learning list. */
export interface WorkItem {
  id: string;
  href: string;
  title: string;
  /** Title before the first colon — used as the giant card type. */
  shortTitle: string;
  description: string;
  type: "project" | "writing";
  dateLabel: string;
  org?: string;
  tags: string[];
}
