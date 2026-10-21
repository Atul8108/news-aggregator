import { Request, Response } from 'express';
import * as userStore from '../db/userStore';
import { eHttpStatusCode, eResponseStatus } from '../enums/server.enums';
import { fetchNews } from '../services/news.service';
import { createError } from '../utils/appError';
import { validateNewsQuery } from '../validators/news.validator';

export const getNews = async (req: Request, res: Response): Promise<void> => {
    const query = validateNewsQuery(req.query);

    const user = userStore.findById(res.locals.userId);
    if (!user) {
        throw createError(eHttpStatusCode.UNAUTHORIZED, 'Invalid or expired token');
    }

    const news = await fetchNews(user.preferences, query);

    res.status(eHttpStatusCode.OK).json({ status: eResponseStatus.SUCCESS, news });
};
