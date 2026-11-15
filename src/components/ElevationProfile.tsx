import { useId, useMemo, useState } from 'react';

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
const H = 340;
/** Left inset — wide enough that centred axis labels never overflow on phones. */
const PAD = 72;
/** Width reserved right of the last checkpoint for the forecast. */
const FUTURE = 190;
/** Headroom above the highest checkpoint, where the forecast escapes to. */
const TOP = 190;
const BASE = 300;
const MOON = { x: W - 40, y: 34, r: 22 } as const;
/** Steepness of the forecast. Higher = flatter start, more violent finish. */
const GROWTH = 5.5;
/** Minimum distance between two axis labels, in viewBox units: phones, then `sm` and up. */
const LABEL_GAP = { base: 110, sm: 48 } as const;

interface Pt {
  x: number;
  y: number;
}

/** Catmull-Rom → cubic Bézier segments: a smooth curve through every point. */
function smoothSegments(pts: readonly Pt[]): string[] {
  const segs: string[] = [];
  const f = (n: number) => n.toFixed(1);
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    segs.push(`C${f(c1.x)},${f(c1.y)} ${f(c2.x)},${f(c2.y)} ${f(p2.x)},${f(p2.y)}`);
  }
  return segs;
}

/**
 * Which axis labels to show at a given spacing. Walks from the right so the
 * current checkpoint is always labelled, and skips a label equal to the last
 * one shown (several roles can start the same year).
 */
function visibleLabels(xs: readonly number[], labels: readonly string[], gap: number): boolean[] {
  const shown = xs.map(() => false);
  let lastX = Infinity;
  let lastLabel = '';
  for (let i = xs.length - 1; i >= 0; i--) {
    if (labels[i] === lastLabel || lastX - xs[i] < gap) continue;
    shown[i] = true;
    lastX = xs[i];
    lastLabel = labels[i];
  }
  return shown;
}

/** Deterministic pseudo-noise in [-1, 1] — stable across renders, no PRNG state. */
const noise = (n: number) => {
  const s = Math.sin(n * 12.9898) * 43758.5453;
  return (s - Math.floor(s)) * 2 - 1;
};

/**
 * Career drawn as a trail's elevation profile. Checkpoints are evenly spaced
 * (stages, not a time axis) and their height is the role's `elevation`.
 * Past the last checkpoint, a dashed exponential forecast heads for the moon —
 * hover (or tap) it for the easter egg.
 */
export function ElevationProfile({ waypoints, activeId, currentId, onActive }: Props) {
  const hatchId = useId();
  const [dreaming, setDreaming] = useState(false);
  const step = (W - FUTURE - PAD) / Math.max(1, waypoints.length - 1);

  const { points, history, forecast, area } = useMemo(() => {
    const points = waypoints.map((w, i) => ({ x: PAD + i * step, y: BASE - w.elevation * (BASE - TOP) }));
    const last = points[points.length - 1];

    // Small undulations between checkpoints so it reads as terrain, not a chart.
    const past: Pt[] = [{ x: 0, y: points[0].y + 14 }];
    points.forEach((p, i) => {
      past.push(p);
      const next = points[i + 1];
      if (!next) return;
      for (let k = 1; k < 4; k++) {
        const t = k / 4;
        past.push({ x: p.x + (next.x - p.x) * t, y: p.y + (next.y - p.y) * t + noise(i * 4 + k) * 9 });
      }
    });

    // Exponential from the last checkpoint straight into the moon.
    const future: Pt[] = [];
    const norm = Math.exp(GROWTH) - 1;
    for (let k = 1; k <= 14; k++) {
      const t = k / 14;
      const climb = (Math.exp(GROWTH * t) - 1) / norm;
      future.push({ x: last.x + (MOON.x - last.x) * t, y: last.y - (last.y - MOON.y) * climb });
    }

    // One spline over past + future keeps the join tangent-continuous; split it after.
    const segs = smoothSegments([...past, ...future]);
    const split = past.length - 1;
    const start = `M${past[0].x},${past[0].y}`;
    const history = start + segs.slice(0, split).join('');
    return {
      points,
      history,
      forecast: `M${last.x},${last.y}` + segs.slice(split).join(''),
      area: `${history}L${last.x},${H}L0,${H}Z`,
    };
  }, [waypoints, step]);

  const last = points[points.length - 1];
  const labels = useMemo(() => {
    const xs = points.map((p) => p.x);
    const text = waypoints.map((w) => w.label);
    return { base: visibleLabels(xs, text, LABEL_GAP.base), sm: visibleLabels(xs, text, LABEL_GAP.sm) };
  }, [points, waypoints]);
  const pct = (x: number, axis: number) => `${(x / axis) * 100}%`;

  return (
    <div className="relative select-none">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="block h-auto w-full overflow-visible"
        role="img"
        aria-label={`Career elevation profile, ${waypoints.length} checkpoints from ${waypoints[0].label} to today, then a forecast heading for the moon`}
      >
        <defs>
          <pattern id={hatchId} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="7" className="stroke-line-strong" strokeWidth="1.2" />
          </pattern>
        </defs>

        <path d={area} fill={`url(#${hatchId})`} />
        <path d={history} fill="none" className="stroke-ink" strokeWidth="2" vectorEffect="non-scaling-stroke" />

        {/* --- Forecast ------------------------------------------------------ */}
        <path
          d={forecast}
          fill="none"
          className={`stroke-accent ${dreaming ? 'forecast-dash--run' : ''}`}
          strokeWidth="2"
          strokeDasharray="6 6"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <g className={`moon ${dreaming ? 'moon--lit' : ''}`}>
          <circle cx={MOON.x} cy={MOON.y} r={MOON.r + 10} className="moon-halo fill-accent" />
          <circle cx={MOON.x} cy={MOON.y} r={MOON.r} className="fill-paper stroke-ink" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          <circle cx={MOON.x - 7} cy={MOON.y - 5} r="4.5" className="fill-line-strong" />
          <circle cx={MOON.x + 6} cy={MOON.y + 7} r="3" className="fill-line-strong" />
          <circle cx={MOON.x + 8} cy={MOON.y - 8} r="2" className="fill-line-strong" />
        </g>

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

        {/* Easter-egg hit zone: everything right of the current checkpoint. */}
        <rect
          x={last.x + step / 2}
          y={-20}
          width={W - last.x - step / 2 + 20}
          height={H + 20}
          fill="transparent"
          className="cursor-pointer"
          // Hover for mice; tap toggles on touch (touch also emits emulated mouse
          // events, so filtering on pointerType avoids an open-then-close flicker).
          onPointerEnter={(e) => e.pointerType === 'mouse' && setDreaming(true)}
          onPointerLeave={(e) => e.pointerType === 'mouse' && setDreaming(false)}
          onPointerUp={(e) => e.pointerType !== 'mouse' && setDreaming((d) => !d)}
        />
      </svg>

      {/* Easter egg. Always rendered so it can fade out, hidden from AT when idle. */}
      <div
        className={`band pointer-events-none absolute z-10 w-max max-w-[15rem] rounded-xl px-4 py-3 shadow-lg transition-[opacity,transform] duration-300 ${
          dreaming ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          left: `calc(${pct(MOON.x - MOON.r, W)} - 14px)`,
          top: pct(MOON.y, H),
          transform: `translate(-100%, ${dreaming ? '-50%' : '-20%'})`,
        }}
        aria-hidden={!dreaming}
      >
        <p className="font-mono text-[10px] uppercase tracking-widest opacity-60">Forecast · 384 400 km</p>
        <p className="mt-1 font-display text-lg font-semibold leading-tight tracking-[-0.02em]">
          Dream big. <em className="font-serif font-normal italic text-accent">To the moon.</em>
        </p>
      </div>

      <div className="relative mt-2 h-4" aria-hidden="true">
        {points.map((p, i) => {
          const { id, label } = waypoints[i];
          if (!labels.sm[i]) return null;
          const visibility = labels.base[i] ? '' : 'hidden sm:block';
          return (
            <span
              key={id}
              className={`absolute top-0 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] tracking-tight tabular-nums transition-colors sm:text-[11px] sm:tracking-normal ${visibility} ${
                id === activeId ? 'text-accent' : 'text-muted'
              }`}
              style={{ left: pct(p.x, W) }}
            >
              {label}
            </span>
          );
        })}
        <span
          className={`absolute top-0 -translate-x-1/2 font-mono text-[10px] transition-colors sm:text-[11px] ${dreaming ? 'text-accent' : 'text-muted'}`}
          style={{ left: pct(MOON.x, W) }}
        >
          ∞
        </span>
      </div>
    </div>
  );
}
