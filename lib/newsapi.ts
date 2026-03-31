import type { Conflict, ConflictEvent } from './types';

const BASE_URL = 'https://newsapi.org/v2';

interface NewsArticle {
  title: string;
  description: string | null;
  url: string;
  publishedAt: string;
  source: { name: string };
}

export async function fetchConflictNews(conflict: Conflict): Promise<ConflictEvent[]> {
  const apiKey = process.env.NEWSAPI_KEY;
  if (!apiKey) return [];

  const query = conflict.countries.slice(0, 2).join(' OR ');
  const url = `${BASE_URL}/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=5&language=en&apiKey=${apiKey}`;

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return [];

  const data = await res.json();
  const articles: NewsArticle[] = data.articles ?? [];

  return articles
    .filter((a) => a.title && a.description)
    .map((a) => ({
      date: a.publishedAt.slice(0, 10),
      description: `${a.title}. ${a.description ?? ''}`.slice(0, 300),
      tags: inferTags(a.title),
      source: a.source.name,
    }));
}

function inferTags(title: string): string[] {
  const t = title.toLowerCase();
  const tags: string[] = [];
  if (/airstrike|bomb|missile|drone|strike/.test(t)) tags.push('Airstrike');
  if (/ceasefire|peace|negotiat|talk|deal/.test(t)) tags.push('Diplomatic');
  if (/sanction|embargo|ban|restrict/.test(t)) tags.push('Sanctions');
  if (/troops|military|soldier|army|forces/.test(t)) tags.push('Military');
  if (/casualt|killed|dead|wounded|civilian/.test(t)) tags.push('Casualties');
  if (/refugee|displace|flee|evacuat/.test(t)) tags.push('Humanitarian');
  return tags.length ? tags : ['News'];
}
