import { DEFAULT_LANGUAGE, DEFAULT_LIMIT, LANGUAGE_PATTERN, MAX_LIMIT, NEWS_QUERY_FIELDS } from '../consts/news.consts';
import { eHttpStatusCode } from '../enums/server.enums';
import { NewsQuery } from '../interfaces/news.interface';
import { createError } from '../utils/appError';

export const validateNewsQuery = (query: Record<string, unknown>): NewsQuery => {
    const unknown = Object.keys(query).find((key) => !NEWS_QUERY_FIELDS.includes(key));
    if (unknown) {
        throw createError(eHttpStatusCode.BAD_REQUEST, `Unknown query parameter: ${unknown}`);
    }

    let language = DEFAULT_LANGUAGE;
    if (query.language !== undefined) {
        if (typeof query.language !== 'string' || !LANGUAGE_PATTERN.test(query.language.toLowerCase())) {
            throw createError(eHttpStatusCode.BAD_REQUEST, 'language must be a 2-letter code such as en');
        }
        language = query.language.toLowerCase();
    }

    let limit = DEFAULT_LIMIT;
    if (query.limit !== undefined) {
        const parsed = typeof query.limit === 'string' ? Number(query.limit) : NaN;
        if (!Number.isInteger(parsed) || parsed < 1 || parsed > MAX_LIMIT) {
            throw createError(eHttpStatusCode.BAD_REQUEST, `limit must be an integer between 1 and ${MAX_LIMIT}`);
        }
        limit = parsed;
    }

    return { language, limit };
};
