# News Aggregator API

A RESTful API for a personalized news aggregator built with **Node.js**, **Express**, **TypeScript**, **bcrypt** and **JWT**. Users register, log in, save their news preferences, and get articles fetched from an external news API based on those preferences.

## Status

Work in progress. The project is built step by step; the table shows what exists today.

| Area | Status |
| --- | --- |
| TypeScript setup | Done |
| User types and in-memory user store | Done |
| Signup and login (bcrypt, JWT) | Planned |
| Auth middleware | Planned |
| Preferences endpoints | Planned |
| News endpoint with external API | Planned |
| Validation and error handling | Planned |
| Caching | Planned |

## Tech Stack

| Purpose | Tool |
| --- | --- |
| Runtime | Node.js 18+ |
| Language | TypeScript 5 |
| Framework | Express 4 |
| Password hashing | bcrypt (planned) |
| Auth tokens | jsonwebtoken (planned) |
| HTTP client | axios (planned) |
| Config | dotenv |
| Tests | tap + supertest (provided by the organisation) |

## Project Structure

```
news-aggregator-api/
├── app.ts                  # Express app setup, exported for the tests
├── tsconfig.json
├── src/
│   ├── consts/
│   ├── controllers/
│   ├── db/
│   │   └── userStore.ts    # In-memory user store
│   ├── enums/
│   ├── interfaces/
│   │   └── user.interface.ts
│   ├── middlewares/
│   ├── routes/
│   ├── utils/
│   └── validators/
└── test/
    └── server.test.js      # Provided test suite, do not modify
```

Empty folders are placeholders for upcoming steps.

## Getting Started

### Prerequisites

- Node.js 18 or later
- A news API key from [GNews](https://gnews.io) or [NewsAPI](https://newsapi.org) (needed once the news endpoint is built)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root. It is git-ignored.

```
PORT=3000
JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=1h
NEWS_API_KEY=your_news_api_key
CACHE_TTL_SECONDS=600
```

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Run the server with tsx in watch mode |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled server |
| `npm run typecheck` | Type-check without emitting |
| `npm test` | Run the provided tap test suite |

`npm test` compiles TypeScript on the fly, so no build is needed first. Until the routes are implemented, the provided tests fail.

## Design Decisions

- **Module-level store.** `src/db/userStore.ts` keeps its data in a private module variable and exports plain functions. A module is already a singleton in Node, so no class or static instance is needed.
- **Copies in, copies out.** The store never returns its internal objects or array, so callers cannot mutate state by accident.
- **Whitelisted fields.** `createUser` copies only `name`, `email`, `passwordHash` and `preferences` from its input, and generates `id` and `createdAt` itself. Callers cannot inject an id or extra properties.
- **Normalised emails.** Emails are lowercased on create and on lookup.
- **Real types.** Shared types live in `src/interfaces` as TypeScript files, replacing JSDoc typedefs.
- **Mongoose-shaped store.** The store exposes `findByEmail`, `findById`, `createUser` and `updateUserPreferences`, so replacing it with a database later means replacing one file.

## Planned API

### Auth

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/users/signup` | No | Register a new user |
| POST | `/users/login` | No | Log in and receive a JWT |

Signup body:

```json
{
  "name": "Atul Shaw",
  "email": "atul@example.com",
  "password": "StrongPass123",
  "preferences": ["technology", "business"]
}
```

Login response:

```json
{ "token": "<jwt>" }
```

### Preferences

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/users/preferences` | Bearer token | Get the user's preferences |
| PUT | `/users/preferences` | Bearer token | Replace the user's preferences |

### News

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/news` | Bearer token | Fetch news matching the user's preferences |

Protected requests send the token as `Authorization: Bearer <jwt>`.

### Status Codes

| Code | Meaning |
| --- | --- |
| 200 | Success |
| 201 | User created |
| 400 | Invalid or missing input |
| 401 | Missing or invalid token, or wrong credentials |
| 404 | Resource not found |
| 409 | Email already registered |
| 500 | Server or external API error |

## Author

Atul Shaw
