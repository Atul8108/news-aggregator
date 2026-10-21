import { RequestHandler } from 'express';
import { createError } from '../utils/appError';

export const notFound: RequestHandler = (req, _res, next) => {
    next(createError(404, `Route ${req.method} ${req.originalUrl} not found`));
};
