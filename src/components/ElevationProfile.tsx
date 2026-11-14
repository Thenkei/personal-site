import { useId, useMemo } from 'react';

export interface Waypoint {
  id: string;
  label: string;
  elevation: number;
}

interface Props {
  waypoints: readonly Waypoint[];
  activeId: string | null;
  currentId: string;
  onActive: (id: string | null) => void;
}

const W = 1000;
const H = 240;
/** Horizontal inset — wide enough that centred axis labels never overflow on phones. */
const PAD = 72;
const TOP = 28;
const BASE = 196;

interface Pt {
  x: number;
  y: number;
}

/** Catmull-Rom → cubic Bézier: a smooth curve that passes through every point. */
function smoothPath(pts: readonly Pt[]): string {
  let d = `M${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += `C${c1.x.toFixed(1)},${c1.y.toFixed(1)} ${c2.x.toFixed(1)},${c2.y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  return d;
}

/** Deterministic pseudo-noise in [-1, 1] — stable across renders, no PRNG state. */
const noise = (n: number) => {
  const s = Math.sin(n * 12.9898) * 43758.5453;
  return (s - Math.floor(s)) * 2 - 1;
};

/**
 * Career drawn as a trail's elevation profile. Checkpoints are evenly spaced
 * (stages, not a time axis) and their height is the role's `elevation`.
 */
export function ElevationProfile({ waypoints, activeId, currentId, onActive }: Props) {
  const hatchId = useId();
  const step = (W - 2 * PAD) / Math.max(1, waypoints.length - 1);

  const { points, line, area } = useMemo(() => {
    const points = waypoints.map((w, i) => ({ x: PAD + i * step, y: BASE - w.elevation * (BASE - TOP) }));

    // Add small undulations between checkpoints so it reads as terrain, not a chart.
    const dense: Pt[] = [{ x: 0, y: points[0].y + 14 }];
    points.forEach((p, i) => {
      dense.push(p);
      const next = points[i + 1];
      if (!next) return;
      for (let k = 1; k < 4; k++) {
        const t = k / 4;
        dense.push({ x: p.x + (next.x - p.x) * t, y: p.y + (next.y - p.y) * t + noise(i * 4 + k) * 9 });
      }
    });
    const last = points[points.length - 1];
    dense.push({ x: W, y: last.y + 10 });

    const line = smoothPath(dense);
    return { points, line, area: `${line}L${W},${H}L0,${H}Z` };
  }, [waypoints, step]);

  const summary = waypoints.map((w) => w.label).join(', ');

  return (
    <div className="relative select-none">
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label={`Career elevation profile with checkpoints: ${summary}`}>
        <defs>
          <pattern id={hatchId} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="7" className="stroke-line-strong" strokeWidth="1.2" />
          </pattern>
        </defs>

        <path d={area} fill={`url(#${hatchId})`} />
        <path d={line} fill="none" className="stroke-ink" strokeWidth="2" vectorEffect="non-scaling-stroke" />

        {points.map((p, i) => {
          const { id } = waypoints[i];
          const active = id === activeId;
          const current = id === currentId;
          return (
            <g key={id}>
              <line
                x1={p.x}
                x2={p.x}
                y1={p.y}
                y2={H}
                strokeDasharray="3 4"
                vectorEffect="non-scaling-stroke"
                className={active ? 'stroke-accent' : 'stroke-muted'}
                strokeOpacity={active ? 1 : 0.5}
              />
              {current && <circle cx={p.x} cy={p.y} r="12" className="pulse-ring fill-accent" />}
              <circle
                cx={p.x}
                cy={p.y}
                r={active ? 8 : 6}
                strokeWidth="2.5"
                vectorEffect="non-scaling-stroke"
                className={`transition-[r] duration-200 ${active || current ? 'fill-accent stroke-accent' : 'fill-paper stroke-ink'}`}
              />
              {/* Generous invisible hit column: hovering anywhere above a checkpoint selects it. */}
              <rect
                x={p.x - step / 2}
                y={0}
                width={step}
                height={H}
                fill="transparent"
                onMouseEnter={() => onActive(id)}
                onMouseLeave={() => onActive(null)}
              />
            </g>
          );
        })}
      </svg>

      <div className="relative mt-2 h-4" aria-hidden="true">
        {points.map((p, i) => {
          const { id, label } = waypoints[i];
          return (
            <span
              key={id}
              className={`absolute top-0 -translate-x-1/2 whitespace-nowrap font-mono text-[11px] tabular-nums transition-colors ${
                id === activeId ? 'text-accent' : 'text-muted'
              }`}
              style={{ left: `${(p.x / W) * 100}%` }}
            >
              {label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
