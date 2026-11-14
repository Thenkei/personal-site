import { Fragment, useState, type ReactNode } from 'react';
import { blog, offTrail, profile, toolkit } from './content';
import { Hero } from './components/Hero';
import { Route } from './components/Route';
import { Writing } from './components/Writing';
import { ThemeToggle } from './components/ThemeToggle';
import { TrailBlaze } from './components/TrailBlaze';

const randomSeed = () => Math.floor(Math.random() * 9000) + 1000;
/** Every visit gets its own map. Module scope keeps render pure. */
const INITIAL_SEED = randomSeed();

const NAV = [
  { href: '#route', label: 'Route' },
  { href: '#toolkit', label: 'Toolkit' },
  { href: '#writing', label: 'Writing' },
  { href: '#contact', label: 'Contact' },
] as const;

function Section({ id, index, kicker, title, children }: { id: string; index: string; kicker: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20 py-20 md:py-28" aria-labelledby={`${id}-title`}>
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <p className="mb-3 font-mono text-xs text-muted">
          <span className="text-accent">{index}</span> · {kicker}
        </p>
        <h2 id={`${id}-title`} className="mb-12 font-display text-5xl font-semibold leading-none tracking-[-0.04em] text-ink md:mb-16 md:text-6xl">
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}

export default function App() {
  const [seed, setSeed] = useState(INITIAL_SEED);

  return (
    <div className="min-h-svh bg-paper text-ink">
      <a href="#route" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-ink focus:px-3 focus:py-2 focus:text-paper">
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-rule/70 bg-paper/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
          <a href="#" className="flex items-center gap-3 text-sm font-medium text-ink" aria-label="Back to top">
            <TrailBlaze />
            <span className="hidden sm:inline">
              {profile.name.first} {profile.name.last}
            </span>
          </a>
          <nav className="flex items-center gap-1 sm:gap-4" aria-label="Main">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className="rounded-full px-2.5 py-1.5 text-sm text-ink-2 transition-colors hover:text-ink">
                {item.label}
              </a>
            ))}
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main>
        <Hero seed={seed} onRegenerate={() => setSeed(randomSeed())} />

        <Section id="route" index="01" kicker="Route" title="The climb so far">
          <Route />
        </Section>

        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <hr className="border-rule" />
        </div>

        <Section id="toolkit" index="02" kicker="Toolkit" title="What I carry">
          <div className="grid gap-12 md:grid-cols-[1fr_2fr] md:gap-16">
            <div>
              <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-muted">Practice</h3>
              <ul className="space-y-2 text-lg text-ink">
                {toolkit.practice.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-muted">Stack</h3>
              <dl>
                {toolkit.stack.map(({ group, items }) => (
                  <div key={group} className="grid gap-x-6 gap-y-1 border-t border-rule py-4 sm:grid-cols-[8.5rem_1fr]">
                    <dt className="pt-1.5 font-mono text-xs text-muted">{group}</dt>
                    <dd className="font-display text-xl font-medium leading-snug tracking-[-0.02em] text-ink md:text-2xl">
                      {items.map((item, i) => (
                        <Fragment key={item}>
                          {/* nowrap keeps "Amazon Bedrock," together; the space outside is the break point. */}
                          <span className="whitespace-nowrap">
                            {item}
                            {i < items.length - 1 && <span className="text-accent">,</span>}
                          </span>{' '}
                        </Fragment>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <dl className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-rule bg-rule md:grid-cols-3">
            {offTrail.map(({ term, detail }) => (
              <div key={term} className="bg-paper p-6">
                <dt className="mb-2 font-mono text-xs uppercase tracking-widest text-muted">{term}</dt>
                <dd className="leading-relaxed text-ink">{detail}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <hr className="border-rule" />
        </div>

        <Section id="writing" index="03" kicker="Writing" title="Latest from the blog">
          <Writing />
        </Section>

        <section id="contact" className="band scroll-mt-20 py-24 md:py-32" aria-labelledby="contact-title">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <p className="mb-3 font-mono text-xs opacity-60">
              <span className="text-accent">04</span> · Contact
            </p>
            <h2 id="contact-title" className="font-display text-[clamp(3rem,10vw,7.5rem)] font-semibold leading-[0.95] tracking-[-0.045em]">
              Let’s build something
              <br />
              <em className="font-serif font-normal italic tracking-[-0.01em] text-accent">that lasts.</em>
            </h2>
            <div className="mt-12 flex flex-col gap-4 text-lg sm:flex-row sm:items-center sm:gap-10">
              <a href={`mailto:${profile.email}`} className="link-underline w-fit break-all">
                {profile.email}
              </a>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="link-underline w-fit">
                LinkedIn ↗
              </a>
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="link-underline w-fit">
                GitHub ↗
              </a>
              <a href={blog.url} className="link-underline w-fit">
                Blog →
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="band">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 border-t border-ink/15 px-5 py-6 font-mono text-[11px] opacity-60 md:px-8">
          <span>
            © {new Date().getFullYear()} {profile.name.first} {profile.name.last}
          </span>
          <span>Terrain #{seed} · generated in your browser</span>
        </div>
      </footer>
    </div>
  );
}
