/**
 * Single source of truth for everything the site says.
 * Edit this file to update the CV — components derive layout (including the
 * elevation profile) from it, so nothing else needs to change.
 */

/** `YYYY` or `YYYY-MM`. Month precision is optional (education rarely has it). */
export type PartialDate = `${number}` | `${number}-${number}`;

export interface Role {
  /** Stable id, used to sync the elevation profile with the route log. */
  id: string;
  title: string;
  start: PartialDate;
  /** Omit for the current role. */
  end?: PartialDate;
  /** 0–1. Relative height on the career elevation profile. */
  elevation: number;
  /** Short label for the profile when the year alone is ambiguous. */
  marker?: string;
}

export interface Leg {
  id: string;
  org: string;
  kind: 'work' | 'study';
  summary?: string;
  tags?: readonly string[];
  /** Chronological, oldest first. */
  roles: readonly Role[];
}

export const profile = {
  name: { first: 'Morgan', last: 'Perre' },
  headline: 'Staff Engineer at RockFi',
  pitch:
    'I work across AI, data, backend and internal tools, and on the technical decisions that go with them. On weekends I run ultra trails.',
  status: 'Open to strategic projects',
  email: 'morgan.perre@gmail.com',
  linkedin: 'https://www.linkedin.com/in/morgan-perre-15295782',
  github: 'https://github.com/Thenkei',
  place: {
    label: "La Chapelle-d'Aurec, Haute-Loire",
    coords: '45.3°N · 4.2°E',
  },
} as const;

export const blog = {
  url: 'https://thenkei.github.io/blog/',
  /** Same origin as this site in production; only lists already-published posts. */
  feed: 'https://thenkei.github.io/blog/rss.xml',
  /** Shown when the feed is unreachable (local dev, blog down). Newest first. */
  fallback: [
    {
      title: 'Would we make the same choice again?',
      url: 'https://thenkei.github.io/blog/en/posts/data-platform-retrospective',
      summary:
        "Last episode of the series: what really paid off (Snowflake, dbt, Dagster assets), what costs more than expected, why orchestrator execution stays inside our infrastructure, what we would do differently, and a grid to decide whether a stack like ours makes sense for you.",
      date: '2026-11-09',
    },
    {
      title: "From Zero to Hero: Building RockFi's Product OS",
      url: 'https://thenkei.github.io/blog/en/posts/ai-human-judgment-rockfi',
      summary:
        "How the Claude Code Challenges got good AI practices out of terminal histories, and how we then encoded them as plugins connecting discovery, design, and delivery, without ever handing the merge to an agent.",
      date: '2026-07-10',
    },
    {
      title: 'Fifteen Hours on the Trail du Saint-Jacques 100K',
      url: 'https://thenkei.github.io/blog/en/posts/trail-saint-jacques-100k-2026',
      summary:
        "A personal race report from my first 100K at the Trail du Saint-Jacques: a difficult day, improvised friendships, an empty water supply, and a shared finish with Blandine.",
      date: '2026-08-08',
    },
  ],
} as const;

/** Most recent first — that is the order the route log reads in. */
export const legs: readonly Leg[] = [
  {
    id: 'rockfi',
    org: 'RockFi',
    kind: 'work',
    summary:
      'I joined RockFi to build its data platform. Today I work across the whole stack as a staff engineer: AI, data, backend, internal tools, and the technical decisions between them.',
    tags: ['TypeScript', 'NestJS', 'Python', 'Dagster', 'Snowflake', 'AWS', 'LLMs'],
    roles: [{ id: 'rockfi-staff', title: 'Staff Engineer', start: '2024-11', elevation: 0.96 }],
  },
  {
    id: 'forest-admin',
    org: 'Forest Admin',
    kind: 'work',
    summary:
      'Internal-tools platform that helps enterprises move faster. Grew from senior IC to staff, then ran engineering management alongside the staff role — aligning technical roadmaps with business goals.',
    tags: ['Node.js', 'TypeScript', 'PostgreSQL', 'Redis', 'AWS'],
    roles: [
      { id: 'fa-senior', title: 'Senior Software Engineer', start: '2023-01', end: '2024-01', elevation: 0.56 },
      { id: 'fa-staff', title: 'Staff Software Engineer', start: '2024-01', end: '2024-11', elevation: 0.72 },
      {
        id: 'fa-em',
        title: 'Engineering Manager & Staff Engineer',
        start: '2024-06',
        end: '2024-11',
        elevation: 0.84,
      },
    ],
  },
  {
    id: 'isima',
    org: 'ISIMA Clermont-Ferrand',
    kind: 'study',
    roles: [{ id: 'isima', title: "Diplôme d'ingénieur, Computer Science", start: '2014', end: '2017', elevation: 0.26 }],
  },
  {
    id: 'iut',
    org: 'IUT Le Puy-en-Velay',
    kind: 'study',
    roles: [{ id: 'iut', title: 'DUT, Computer Science & Digital Imaging', start: '2012', end: '2014', elevation: 0.1 }],
  },
];

export interface StackGroup {
  group: string;
  items: readonly string[];
}

export const toolkit: { practice: readonly string[]; stack: readonly StackGroup[] } = {
  practice: [
    'Software design',
    'Solution architecture',
    'Domain-driven design',
    'Data platforms',
    'AI & LLM products',
    'Team leadership',
    'NLP',
    '3D reconstruction',
  ],
  stack: [
    {
      group: 'Backend',
      items: ['TypeScript', 'Node.js', 'NestJS', 'Prisma', 'PostgreSQL', 'Redis', 'BullMQ', 'Zod', 'GraphQL', 'Fastify', 'Koa', 'Express'],
    },
    {
      group: 'Data',
      items: ['Python', 'Dagster', 'dbt', 'Airbyte', 'dlt', 'Snowflake', 'Polars', 'Redpanda'],
    },
    {
      group: 'AI',
      items: ['Vercel AI SDK', 'Amazon Bedrock', 'Opik', 'Claude Code & MCP'],
    },
    {
      group: 'Front & mobile',
      items: ['React', 'Next.js', 'React Native', 'Expo', 'Tailwind CSS', 'Ember.js'],
    },
    {
      group: 'Cloud & ops',
      items: ['AWS', 'Terraform', 'Kubernetes', 'Docker', 'GitHub Actions', 'OpenTelemetry', 'Grafana', 'Sentry'],
    },
  ],
};

export interface SideProject {
  name: string;
  /** Free text: a year, or a period like "High school". */
  when: string;
  description: string;
  tags: readonly string[];
  link?: {
    label: string;
    href: string;
    /** ISO date. The link is hidden before it, e.g. for a blog post that is scheduled but not yet published. */
    from?: string;
  };
}

/** Newest first. */
export const sideProjects: readonly SideProject[] = [
  {
    name: 'Short films',
    when: '2026',
    description: 'Animated short films made from my blog articles, with the same characters in every episode.',
    tags: ['Remotion', 'Agents'],
    link: { label: 'Read about it', href: 'https://thenkei.github.io/blog/en/posts/short-films-series', from: '2026-12-14' },
  },
  {
    name: 'Jokarikara',
    when: '2026',
    description: 'A rhythm game for mobile: stack shapes by tapping at the right moment. My first personal project built with AI.',
    tags: ['React', 'TypeScript', 'Canvas'],
    link: { label: 'Read about it', href: 'https://thenkei.github.io/blog/en/posts/jokarikara-first-ai-project' },
  },
  {
    name: 'Chuchoter',
    when: '2026',
    description:
      'Speech-to-text that runs locally on macOS, from the menu bar, with whisper.cpp. Part of my speech-to-text and text-to-speech experiments.',
    tags: ['Swift', 'Rust', 'whisper.cpp'],
    link: { label: 'GitHub', href: 'https://github.com/Thenkei/chuchoter' },
  },
  {
    name: 'OverTheLimits',
    when: '2019',
    description: 'A neural network bot that learns to pick the winning card in Under the Limit.',
    tags: ['C++', 'Neural network'],
    link: { label: 'GitHub', href: 'https://github.com/Thenkei/OverTheLimits' },
  },
  {
    name: 'Under the Limit',
    when: '2018',
    description:
      'An open-source online card game, built for a friend. Its WebSocket code later ran the games we played during lockdown.',
    tags: ['Node.js', 'WebSockets', 'Kubernetes'],
    link: { label: 'GitHub', href: 'https://github.com/Thenkei/UnderTheLimits' },
  },
  {
    name: 'HeavenCraft',
    when: 'High school',
    description: 'A French Minecraft server. The first time thousands of people used something I built.',
    tags: ['Minecraft', 'Community'],
    link: { label: 'Read about it', href: 'https://thenkei.github.io/blog/en/posts/heavencraft-first-systems' },
  },
];

export interface OffTrailItem {
  term: string;
  detail: string;
  link?: { label: string; href: string };
}

export const offTrail: readonly OffTrailItem[] = [
  {
    term: 'Weekends',
    detail: 'Ultra trail: 100 km at the Trail du Saint-Jacques in 2026, 140 km planned for 2027. Mountain biking.',
    link: { label: 'Race report', href: 'https://thenkei.github.io/blog/en/posts/trail-saint-jacques-100k-2026' },
  },
  { term: 'Base', detail: "La Chapelle-d'Aurec, Auvergne-Rhône-Alpes" },
  { term: 'Languages', detail: 'French (native) · English (full professional) · Italian, Portuguese, Spanish (elementary)' },
];
