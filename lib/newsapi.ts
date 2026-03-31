import type { Conflict, ConflictEvent } from './types';

// newsapi.ai (Event Registry) endpoint
const BASE_URL = 'https://eventregistry.org/api/v1/article/getArticles';

interface NewsAiArticle {
  title: string;
  body: string;
  dateTime: string;        // "2026-03-31T14:00:00Z"
  url: string;
  source: { title: string };
}

interface NewsAiResponse {
  articles?: {
    results?: NewsAiArticle[];
  };
  error?: string;
}

export async function fetchConflictNews(conflict: Conflict): Promise<ConflictEvent[]> {
  const apiKey = process.env.NEWSAPI_KEY;
  if (!apiKey) return [];

  const keywords = conflict.countries.slice(0, 2);

  const body = {
    action: 'getArticles',
    keyword: keywords,
    keywordOper: 'or',
    articlesPage: 1,
    articlesCount: 5,
    articlesSortBy: 'date',
    articlesSortByAsc: false,
    lang: 'eng',
    resultType: 'articles',
    apiKey,
  };

  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error(`[newsapi.ai] ${conflict.id}: HTTP ${res.status}`);
      return [];
    }

    const data: NewsAiResponse = await res.json();

    if (data.error) {
      console.error(`[newsapi.ai] ${conflict.id}: ${data.error}`);
      return [];
    }

    const articles = data.articles?.results ?? [];

    return articles
      .filter((a) => a.title && a.title !== '[Removed]')
      .map((a) => ({
        date: a.dateTime.slice(0, 10),
        description: `${a.title}${a.body ? '. ' + a.body.slice(0, 200) : ''}`.slice(0, 300),
        tags: inferTags(a.title),
        source: a.source?.title ?? 'News',
      }));
  } catch (err) {
    console.error(`[newsapi.ai] ${conflict.id}:`, err);
    return [];
  }
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
