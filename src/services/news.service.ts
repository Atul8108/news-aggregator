import axios from 'axios';
import { createHash } from 'crypto';
import { env } from '../config/env';
import { GNEWS_BASE_URL, GNEWS_TIMEOUT_MS } from '../consts/news.consts';
import { eHttpStatusCode } from '../enums/server.enums';
import { Article, NewsQuery } from '../interfaces/news.interface';
import { createError } from '../utils/appError';
import { getCached, setCached } from './cache.service';

interface GNewsArticle {
    title?: string;
    description?: string;
    url?: string;
    image?: string | null;
    publishedAt?: string;
    source?: { name?: string };
}

const toArticle = (raw: GNewsArticle): Article => {
    const url = raw.url ?? '';
    return {
        id: createHash('sha256').update(url).digest('hex').slice(0, 16),
        title: raw.title ?? '',
        description: raw.description ?? '',
        url,
        image: raw.image ?? null,
        publishedAt: raw.publishedAt ?? '',
        source: raw.source?.name ?? '',
    };
};

const buildSearchTerm = (preferences: string[]): string =>
    preferences.map((preference) => `"${preference.replace(/"/g, '')}"`).join(' OR ');

const toServiceError = (error: unknown) => {
    if (axios.isAxiosError(error) && error.response) {
        const { status } = error.response;
        if (status === eHttpStatusCode.TOO_MANY_REQUESTS) {
            return createError(eHttpStatusCode.TOO_MANY_REQUESTS, 'News provider rate limit reached, try again later');
        }
        if (status === eHttpStatusCode.UNAUTHORIZED || status === 403) {
            return createError(eHttpStatusCode.BAD_GATEWAY, 'News provider rejected the API credentials');
        }
    }
    return createError(eHttpStatusCode.BAD_GATEWAY, 'Failed to fetch news from the provider');
};

export const fetchNews = async (preferences: string[], { language, limit }: NewsQuery): Promise<Article[]> => {
    if (!env.newsApiKey) {
        throw createError(eHttpStatusCode.INTERNAL_SERVER_ERROR, 'News service is not configured');
    }

    const term = buildSearchTerm(preferences);
    const cacheKey = `news:${language}:${limit}:${term}`;
    const cached = getCached<Article[]>(cacheKey);
    if (cached) {
        return cached;
    }

    const endpoint = term ? 'search' : 'top-headlines';
    const params: Record<string, string | number> = { lang: language, max: limit, apikey: env.newsApiKey };
    if (term) {
        params.q = term;
    }

    try {
        const response = await axios.get<{ articles?: GNewsArticle[] }>(`${GNEWS_BASE_URL}/${endpoint}`, {
            params,
            timeout: GNEWS_TIMEOUT_MS,
        });
        const articles = (response.data.articles ?? []).map(toArticle);
        setCached(cacheKey, articles);
        return articles;
    } catch (error) {
        throw toServiceError(error);
    }
};
