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

/** Compact form for tight axis labels: `2024-11` → `Nov ’24`, `2014` → `2014`. */
export function formatShort(date: PartialDate): string {
  const { year, month } = parse(date);
  return month ? `${month} ’${year.slice(2)}` : year;
}

export function formatRange(start: PartialDate, end?: PartialDate): string {
  return `${formatDate(start)} — ${end ? formatDate(end) : 'now'}`;
}
