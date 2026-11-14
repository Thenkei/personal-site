import { sideProjects, type SideProject } from '../content';

/** Evaluated once per page load; keeps render pure. */
const TODAY = new Date().toISOString().slice(0, 10);

function visibleLink(project: SideProject) {
  const { link } = project;
  if (!link || (link.from && TODAY < link.from)) return undefined;
  return link;
}

function Card({ project }: { project: SideProject }) {
  const link = visibleLink(project);
  const external = link ? !link.href.startsWith('https://thenkei.github.io/') : false;

  const body = (
    <>
      <p className="font-mono text-xs text-muted">
        <span className="text-accent">{project.when}</span> · {project.tags.join(' / ')}
      </p>
      <h3 className="mt-3 font-display text-2xl font-semibold leading-tight tracking-[-0.03em] text-ink transition-colors group-hover:text-accent">
        {project.name}
      </h3>
      <p className="mt-2 leading-relaxed text-ink-2">{project.description}</p>
      {link && (
        <p className="mt-auto pt-5 text-sm font-medium text-ink">
          {link.label} <span aria-hidden="true">{external ? '↗' : '→'}</span>
        </p>
      )}
    </>
  );

  const className = 'group flex h-full flex-col bg-paper p-6';
  return (
    <li className="flex">
      {link ? (
        <a
          href={link.href}
          className={`${className} w-full transition-colors hover:bg-paper-2`}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {body}
        </a>
      ) : (
        <div className={`${className} w-full`}>{body}</div>
      )}
    </li>
  );
}

export function SideProjects() {
  return (
    <ul className="grid gap-px overflow-hidden rounded-2xl border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
      {sideProjects.map((project) => (
        <Card key={project.name} project={project} />
      ))}
    </ul>
  );
}
