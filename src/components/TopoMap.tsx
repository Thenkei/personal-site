import { useCallback, useMemo, useRef, useState, type PointerEvent } from 'react';
import { generateTerrain } from '../lib/terrain';

const VIEW = { w: 1440, h: 900 } as const;
const LEVELS = 20;
/** Map normalised height onto plausible Haute-Loire altitudes. */
const ALTITUDE = { min: 460, max: 1240 } as const;

interface Probe {
  /** Position relative to the map wrapper, in CSS px. */
  px: number;
  py: number;
  altitude: number;
  /** Index into `contours` of the line nearest to the probe's altitude. */
  level: number;
}

const toAltitude = (h: number) => Math.round(ALTITUDE.min + h * (ALTITUDE.max - ALTITUDE.min));
const altFormat = new Intl.NumberFormat('fr-FR');

/**
 * Full-bleed generative contour map. Hovering (mouse only) reads the altitude
 * under the cursor and lights up the contour line at that height.
 */
export function TopoMap({ seed }: { seed: number }) {
  const terrain = useMemo(
    () => generateTerrain({ seed, width: VIEW.w, height: VIEW.h, cell: 12, levels: LEVELS }),
    [seed],
  );
  const svgRef = useRef<SVGSVGElement>(null);
  const frame = useRef<number | null>(null);
  const [probe, setProbe] = useState<Probe | null>(null);

  const onMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (e.pointerType !== 'mouse') return;
      const { clientX, clientY, currentTarget } = e;
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        frame.current = null;
        const ctm = svgRef.current?.getScreenCTM();
        if (!ctm) return;
        const p = new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse());
        const h = terrain.heightAt(p.x, p.y);
        const rect = currentTarget.getBoundingClientRect();
        setProbe({
          px: clientX - rect.left,
          py: clientY - rect.top,
          altitude: toAltitude(h),
          level: Math.round(h * LEVELS) - 1,
        });
      });
    },
    [terrain],
  );

  const onLeave = useCallback(() => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
    setProbe(null);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden" onPointerMove={onMove} onPointerLeave={onLeave} aria-hidden="true">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          {terrain.contours.map((c, i) => (
            <path
              // Keyed on seed so the draw-in animation replays on regenerate.
              key={`${seed}-${i}`}
              d={c.d}
              vectorEffect="non-scaling-stroke"
              className={`topo-line ${c.index ? 'topo-line--index' : ''} ${probe?.level === i ? 'topo-line--active' : ''}`}
              style={{ animationDelay: `${i * 45}ms` }}
            />
          ))}
        </g>
        <path
          d={`M${terrain.summit.x} ${terrain.summit.y - 9}l8 14h-16z`}
          className="fill-accent"
          style={{ animation: 'topo-in 600ms ease-out both', animationDelay: `${LEVELS * 45}ms` }}
        />
      </svg>

      {probe && (
        <div
          className="pointer-events-none absolute left-0 top-0 flex items-center gap-2"
          style={{ transform: `translate(${probe.px - 5}px, ${probe.py - 5}px)` }}
        >
          <span className="block size-2.5 rounded-full border-2 border-accent bg-paper" />
          <span className="rounded bg-ink px-1.5 py-0.5 font-mono text-[11px] tabular-nums text-paper">
            {altFormat.format(probe.altitude)} m
          </span>
        </div>
      )}
    </div>
  );
}
