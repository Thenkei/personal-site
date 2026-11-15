import { useMemo, useState } from 'react';
import { legs, type Leg, type Role } from '../content';
import { formatDate, formatRange } from '../lib/dates';
import { ElevationProfile, type Waypoint } from './ElevationProfile';

interface Checkpoint extends Waypoint {
  role: Role;
  org: string;
}

function legRange(leg: Leg): string {
  const start = leg.roles[0].start;
  const ongoing = leg.roles.some((r) => !r.end);
  const end = ongoing ? undefined : leg.roles[leg.roles.length - 1].end;
  return formatRange(start, end);
}

export function Route() {
  const [activeId, setActiveId] = useState<string | null>(null);

  const checkpoints = useMemo<Checkpoint[]>(
    () =>
      [...legs]
        .reverse()
        .flatMap((leg) => leg.roles.map((role) => ({ role, org: leg.org })))
        .map(({ role, org }) => ({ id: role.id, label: role.start.slice(0, 4), elevation: role.elevation, role, org })),
    [],
  );

  const current = checkpoints[checkpoints.length - 1];
  const focused = checkpoints.find((c) => c.id === activeId) ?? current;

  return (
    <>
      <div className="mb-10 md:mb-14">
        <p className="mb-6 flex flex-wrap items-baseline gap-x-3 font-mono text-xs text-muted" aria-hidden="true">
          <span className="text-accent">{focused.id === current.id ? 'You are here' : 'Checkpoint'}</span>
          <span className="text-ink">
            {focused.role.title}, {focused.org}
          </span>
          <span>{formatRange(focused.role.start, focused.role.end)}</span>
        </p>
        <ElevationProfile waypoints={checkpoints} activeId={activeId} currentId={current.id} onActive={setActiveId} />
      </div>

      <ol>
        {legs.map((leg) => (
          <li key={leg.id} className="grid gap-x-10 gap-y-3 border-t border-rule py-8 md:grid-cols-[12rem_1fr] md:py-10">
            <div className="font-mono text-xs leading-relaxed text-muted">
              <div className="tabular-nums">{legRange(leg)}</div>
              <div className="uppercase tracking-widest">{leg.kind === 'work' ? 'Work' : 'Study'}</div>
            </div>

            <div>
              <h3 className="font-display text-3xl font-semibold leading-tight tracking-[-0.035em] text-ink md:text-4xl">{leg.org}</h3>
              <ul className="mt-3 space-y-1">
                {[...leg.roles].reverse().map((role) => {
                  const active = role.id === activeId;
                  return (
                    <li
                      key={role.id}
                      onMouseEnter={() => setActiveId(role.id)}
                      onMouseLeave={() => setActiveId(null)}
                      onFocus={() => setActiveId(role.id)}
                      onBlur={() => setActiveId(null)}
                      onClick={() => setActiveId(role.id)}
                      tabIndex={0}
                      className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent flex flex-wrap items-baseline justify-between gap-x-6 gap-y-0.5"
                    >
                      <span className={`relative transition-colors ${active ? 'text-accent' : 'text-ink'}`}>
                        <span
                          className={`absolute -left-4 top-1 text-[10px] leading-none text-accent transition-opacity ${active ? 'opacity-100' : 'opacity-0'}`}
                          aria-hidden="true"
                        >
                          ▲
                        </span>
                        {role.title}
                      </span>
                      {leg.roles.length > 1 && (
                        <span className="font-mono text-xs tabular-nums text-muted">
                          {formatDate(role.start)} — {role.end ? formatDate(role.end) : 'now'}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
              {leg.summary && <p className="mt-4 max-w-2xl leading-relaxed text-ink-2">{leg.summary}</p>}
              {leg.tags && <p className="mt-4 font-mono text-xs text-muted">{leg.tags.join(' / ')}</p>}
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}
