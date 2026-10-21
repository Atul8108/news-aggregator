import { Router } from 'express';
import { getNews } from '../controllers/news.controller';
import { authenticate } from '../middlewares/auth';
import { asyncHandler } from '../utils/asyncHandler';

export const newsRoutes = Router();

newsRoutes.get('/', authenticate, asyncHandler(getNews));
