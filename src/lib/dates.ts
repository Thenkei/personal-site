import type { PartialDate } from '../content';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

function parse(date: PartialDate): { year: string; month?: (typeof MONTHS)[number] } {
  const [year, month] = date.split('-');
  return { year, month: month ? MONTHS[Number(month) - 1] : undefined };
}

/** `2024-11` → `Nov 2024`, `2014` → `2014`. */
export function formatDate(date: PartialDate): string {
  const { year, month } = parse(date);
  return month ? `${month} ${year}` : year;
}

/** ISO day `2026-11-13` → `13 Nov 2026`. Empty string for anything unparseable. */
export function formatDay(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return '';
  return `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}`;
}

export function formatRange(start: PartialDate, end?: PartialDate): string {
  return `${formatDate(start)} — ${end ? formatDate(end) : 'now'}`;
}
