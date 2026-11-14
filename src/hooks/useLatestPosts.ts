import { useEffect, useState } from 'react';

export interface Post {
  title: string;
  url: string;
  summary: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
}

export type FeedState =
  | { status: 'loading' }
  | { status: 'ready'; posts: Post[]; total: number }
  | { status: 'error' };

/** Parse an RSS 2.0 document into posts, newest first. Exported for testing. */
export function parseRss(xml: string): Post[] {
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  if (doc.querySelector('parsererror')) throw new Error('Invalid RSS document');
  return Array.from(doc.querySelectorAll('channel > item'))
    .map((item) => {
      const text = (tag: string) => item.querySelector(tag)?.textContent?.trim() ?? '';
      const pub = new Date(text('pubDate'));
      return {
        title: text('title'),
        url: text('link'),
        summary: text('description'),
        date: Number.isNaN(pub.getTime()) ? '' : pub.toISOString().slice(0, 10),
      };
    })
    .filter((p) => p.title && p.url.startsWith('https://'))
    .sort((a, b) => b.date.localeCompare(a.date));
}

const FEED_TIMEOUT_MS = 5000;

/**
 * Reads the blog's RSS feed at runtime so the site never goes stale: the blog
 * rebuilds daily and its feed only lists already-published posts. Both sites
 * share the thenkei.github.io origin in production, so there is no CORS hop;
 * anywhere else (local dev, blog down) callers fall back to a curated list.
 */
export function useLatestPosts(feedUrl: string, limit: number): FeedState {
  const [state, setState] = useState<FeedState>({ status: 'loading' });

  useEffect(() => {
    const controller = new AbortController();
    // A hung request must not leave the section blank: time out into the fallback.
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, FEED_TIMEOUT_MS);

    fetch(feedUrl, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Feed responded ${res.status}`);
        return res.text();
      })
      .then((xml) => {
        const posts = parseRss(xml);
        if (posts.length === 0) throw new Error('Feed is empty');
        setState({ status: 'ready', posts: posts.slice(0, limit), total: posts.length });
      })
      .catch((err: unknown) => {
        // Aborted by unmount: nothing to do. Aborted by our timeout: fall back.
        if (controller.signal.aborted && !timedOut) return;
        console.warn('[writing] falling back to curated posts:', timedOut ? 'feed timed out' : err);
        setState({ status: 'error' });
      })
      .finally(() => clearTimeout(timer));
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [feedUrl, limit]);

  return state;
}
