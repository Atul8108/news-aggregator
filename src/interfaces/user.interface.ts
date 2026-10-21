export interface User {
    id: number;
    name: string;
    email: string;
    passwordHash: string;
    preferences: string[];
    createdAt: string;
}

export type NewUser = Omit<User, 'id' | 'createdAt'>;