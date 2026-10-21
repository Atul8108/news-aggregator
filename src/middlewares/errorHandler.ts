import { ErrorRequestHandler } from 'express';
import { isHttpError } from '../utils/appError';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    if (isHttpError(err)) {
        res.status(err.statusCode).json({ error: err.message });
        return;
    }
    if (err instanceof SyntaxError && 'body' in err) {
        res.status(400).json({ error: 'Malformed JSON body' });
        return;
    }
    if (process.env.NODE_ENV !== 'test') {
        console.error(err);
    }
    res.status(500).json({ error: 'Internal server error' });
};
