import bcrypt from 'bcrypt';
import { eHttpStatusCode, eResponseStatus } from '../enums/server.enums';
import { Request, Response } from 'express';
import * as userStore from '../db/userStore';
import { User } from '../interfaces/user.interface';
import { createError } from '../utils/appError';
import { validateSignup } from '../validators/user.validator';

const SALT_ROUNDS = 10;

const toPublicUser = ({ id, name, email, preferences, createdAt }: User) => ({
    id,
    name,
    email,
    preferences,
    createdAt,
});

export const signup = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password, preferences } = validateSignup(req.body);

    if (userStore.findByEmail(email)) {
        throw createError(eHttpStatusCode.CONFLICT, 'Email already registered');
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = userStore.createUser({ name, email, passwordHash, preferences });

    res.status(eHttpStatusCode.OK).json({ status: eResponseStatus.SUCCESS, user: toPublicUser(user) });
};
