import { profile } from '../content';
import { TopoMap } from './TopoMap';

interface Props {
  seed: number;
  onRegenerate: () => void;
}

export function Hero({ seed, onRegenerate }: Props) {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-4rem)] flex-col overflow-hidden" aria-labelledby="hero-title">
      <TopoMap seed={seed} />
      <div className="topo-veil pointer-events-none absolute inset-0" />

      {/* Copy sits above the map but lets pointer events through, so the altitude probe works everywhere. */}
      <div className="pointer-events-none relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-5 py-16 md:px-8">
        <p className="mb-8 flex items-center gap-2 font-mono text-xs text-ink-2">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:hidden" />
            <span className="relative inline-flex size-2 rounded-full bg-accent" />
          </span>
          {profile.status}
        </p>

        <h1 id="hero-title" className="font-display text-[clamp(3.75rem,13vw,10rem)] font-semibold leading-[0.88] tracking-[-0.05em] text-ink">
          {profile.name.first}
          <br />
          <em className="font-serif font-normal italic tracking-[-0.01em] text-accent">{profile.name.last}</em>
        </h1>

        <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-2 md:text-xl">
          <strong className="font-medium text-ink">{profile.headline}.</strong> {profile.pitch}
        </p>

        <div className="pointer-events-auto mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <a
            href={`mailto:${profile.email}`}
            className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-accent"
          >
            Get in touch
            <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">
              →
            </span>
          </a>
          <a href="#route" className="link-underline text-sm font-medium text-ink">
            See the route
          </a>
        </div>
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl items-end justify-between gap-4 px-5 pb-6 font-mono text-[11px] text-muted md:px-8">
        <span>
          {profile.place.coords}
          <span className="hidden sm:inline"> · {profile.place.label}</span>
        </span>
        <button
          type="button"
          onClick={onRegenerate}
          className="group inline-flex items-center gap-1.5 rounded-full px-2 py-1 transition-colors hover:text-ink"
          title="Generate a new terrain"
        >
          <span className="inline-block transition-transform duration-500 group-hover:rotate-180" aria-hidden="true">
            ↻
          </span>
          <span>
            new terrain <span className="tabular-nums opacity-70">#{seed}</span>
          </span>
        </button>
      </div>
    </section>
  );
}
