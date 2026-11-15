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
}

export interface Leg {
  id: string;
  org: string;
  kind: 'work' | 'study';
  summary?: string;
  tags?: readonly string[];
  link?: { label: string; href: string };
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

/**
 * Most recent first — the order the route log reads in. The elevation profile
 * walks it backwards (legs in reverse, roles as written), so overlapping
 * periods such as an internship during a degree keep the order chosen here.
 */
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
      'Forest Admin builds internal tools for companies, from startups to large enterprises. I joined as a software engineer, became senior then staff, and from June 2024 I also managed the engineering team. The tech team doubled to more than 20 engineers while I was there.',
    tags: ['Node.js', 'TypeScript', 'PostgreSQL', 'Redis', 'GraphQL', 'Ember.js', 'Elasticsearch', 'AWS'],
    roles: [
      { id: 'fa-engineer', title: 'Software Engineer', start: '2021-01', end: '2023-01', elevation: 0.52 },
      { id: 'fa-senior', title: 'Senior Software Engineer', start: '2023-01', end: '2024-01', elevation: 0.62 },
      { id: 'fa-staff', title: 'Staff Software Engineer', start: '2024-01', end: '2024-11', elevation: 0.74 },
      { id: 'fa-em', title: 'Software Engineering Manager', start: '2024-06', end: '2024-11', elevation: 0.84 },
    ],
  },
  {
    id: 'atos',
    org: 'Atos',
    kind: 'work',
    summary:
      "On assignment in Michelin's industrial IT team in Clermont-Ferrand. I built, simulated and deployed the applications that process and move raw materials in Michelin plants.",
    roles: [{ id: 'atos', title: 'Analyst Developer, at Michelin', start: '2019-11', end: '2021-01', elevation: 0.46 }],
  },
  {
    id: 'opla',
    org: 'Opla',
    kind: 'work',
    summary:
      'Between AI research and product. With an AI researcher, I designed and built aice.js, an open-source NLP engine in JavaScript, from architecture to CI and deployment, then worked with the product team to integrate it.',
    tags: ['JavaScript', 'NLP'],
    link: { label: 'aice.js on GitHub', href: 'https://github.com/Thenkei/aice.js' },
    roles: [{ id: 'opla', title: 'R&D Engineer, AI & NLP', start: '2019-04', end: '2019-10', elevation: 0.43 }],
  },
  {
    id: 'arkima',
    org: 'Arkima',
    kind: 'work',
    summary: 'A three-month mission: an automated pipeline that turns CAD models into low-poly 3D meshes with precomputed textures, ready for the web.',
    roles: [{ id: 'arkima', title: 'R&D Engineer', start: '2018-12', end: '2019-02', elevation: 0.38 }],
  },
  {
    id: 'polymagine',
    org: 'Polymagine',
    kind: 'work',
    summary:
      'My first permanent job, at a five-person startup. Research and development on 3D: reconstruction from 2D plans, real-time mesh deformation, face scanning, biometric detection on 3D meshes, 3D printing and rendering. I also followed client projects.',
    tags: ['3D reconstruction', 'Rendering'],
    roles: [{ id: 'polymagine', title: 'R&D Engineer', start: '2017-10', end: '2018-11', elevation: 0.34 }],
  },
  {
    id: 'michelin',
    org: 'Michelin',
    kind: 'work',
    summary:
      'I studied and rebuilt the CAD/CAM application that lays out the inserts of every Michelin tire curing mold, the parts that shape the tread grooves. From user needs and specifications to development and tests.',
    tags: ['C++', 'CAA', 'CAD/CAM'],
    roles: [{ id: 'michelin', title: 'Software Engineer', start: '2016-09', end: '2017-10', elevation: 0.28 }],
  },
  {
    id: 'ufmg',
    org: 'Universidade Federal de Minas Gerais',
    kind: 'work',
    summary:
      'Research in Belo Horizonte, Brazil, on planning the expansion of electrical distribution networks. I built an alternative mixed-integer linear programming model in Java with CPLEX.',
    tags: ['Java', 'CPLEX', 'MILP'],
    roles: [{ id: 'ufmg', title: 'Research Assistant', start: '2016-04', end: '2016-08', elevation: 0.22 }],
  },
  {
    id: 'isima',
    org: 'ISIMA Clermont-Ferrand',
    kind: 'study',
    roles: [{ id: 'isima', title: "Diplôme d'ingénieur, Computer Science", start: '2014', end: '2017', elevation: 0.14 }],
  },
  {
    id: 'aberystwyth',
    org: 'Aberystwyth University',
    kind: 'work',
    summary:
      'Research internship in Wales. With a PhD student, I built a light stage to capture the texture of human skin and reconstruct 3D models of heads. My first steps in electronics, with an Arduino.',
    tags: ['Arduino', '3D reconstruction'],
    roles: [{ id: 'aberystwyth', title: 'Research Assistant, internship', start: '2014-04', end: '2014-06', elevation: 0.18 }],
  },
  {
    id: 'iut',
    org: 'IUT Le Puy-en-Velay',
    kind: 'study',
    roles: [{ id: 'iut', title: 'DUT, Computer Science & Digital Imaging', start: '2012', end: '2014', elevation: 0.06 }],
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
