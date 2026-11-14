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
    'I design software architecture for private wealth management — systems that have to be right, auditable, and still pleasant to change. Weekends, I trade the terminal for trails.',
  status: 'Open to strategic projects',
  email: 'morgan.perre@gmail.com',
  linkedin: 'https://www.linkedin.com/in/morgan-perre-15295782',
  place: {
    label: "La Chapelle-d'Aurec, Haute-Loire",
    coords: '45.3°N · 4.2°E',
  },
} as const;

/** Most recent first — that is the order the route log reads in. */
export const legs: readonly Leg[] = [
  {
    id: 'rockfi',
    org: 'RockFi',
    kind: 'work',
    summary:
      'Building a new private wealth management experience. Interconnecting with key partners to design future-proof, scalable private banking products — with AI where it genuinely helps.',
    tags: ['Architecture', 'Partner integrations', 'AI'],
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

export const toolkit = {
  practice: ['Software design', 'Solution architecture', 'Team leadership', 'NLP', '3D reconstruction'],
  stack: [
    'TypeScript',
    'Node.js',
    'PostgreSQL',
    'Redis',
    'Fastify',
    'Koa',
    'Express',
    'GraphQL',
    'Ember.js',
    'Docker',
    'AWS',
    'GitHub Actions',
  ],
} as const;

export const offTrail = [
  { term: 'Weekends', detail: 'Trail running & mountain biking' },
  { term: 'Base', detail: "La Chapelle-d'Aurec, Auvergne-Rhône-Alpes" },
  { term: 'Languages', detail: 'French (native) · English (full professional) · Italian, Portuguese, Spanish (elementary)' },
] as const;
