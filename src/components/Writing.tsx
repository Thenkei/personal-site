import { blog } from '../content';
import { useLatestPosts, type Post } from '../hooks/useLatestPosts';
import { formatDay } from '../lib/dates';

const LIMIT = 3;

function PostRow({ post }: { post: Post }) {
  return (
    <li className="border-t border-rule">
      <a href={post.url} className="group grid gap-x-10 gap-y-2 py-6 md:grid-cols-[12rem_1fr_auto] md:py-8">
        <span className="pt-1 font-mono text-xs tabular-nums text-muted">
          {formatDay(post.date)}
        </span>
        <span>
          <span className="block font-display text-2xl font-semibold leading-tight tracking-[-0.03em] text-ink transition-colors group-hover:text-accent md:text-3xl">
            {post.title}
          </span>
          {post.summary && <span className="mt-2 line-clamp-2 block max-w-2xl leading-relaxed text-ink-2">{post.summary}</span>}
        </span>
        <span className="hidden pt-1 text-muted transition-transform group-hover:translate-x-1 group-hover:text-accent md:block" aria-hidden="true">
          →
        </span>
      </a>
    </li>
  );
}

export function Writing() {
  const feed = useLatestPosts(blog.feed, LIMIT);
  const posts = feed.status === 'ready' ? feed.posts : blog.fallback;

  return (
    <>
      <ol aria-busy={feed.status === 'loading'} className={`transition-opacity duration-300 ${feed.status === 'loading' ? 'opacity-0' : 'opacity-100'}`}>
        {posts.map((post) => (
          <PostRow key={post.url} post={post} />
        ))}
      </ol>
      <div className="border-t border-rule pt-6">
        <a href={blog.url} className="link-underline font-medium text-ink">
          {feed.status === 'ready' ? `All ${feed.total} articles on the blog` : 'All articles on the blog'} →
        </a>
      </div>
    </>
  );
}
