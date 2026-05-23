# AGDIL Admin

Internal admin dashboard for the AGDIL platform. Runs on **port 3002** and talks to [agdil-backend](https://github.com/DevDavidWisdom/agdil-backend).

## Auth

Admin login uses **environment variables only** (not the `users` table):

| Variable | Purpose |
|----------|---------|
| `ADMIN_EMAIL` | Sign-in email |
| `ADMIN_PASSWORD` | Sign-in password |
| `ADMIN_SESSION_SECRET` | Signs the HTTP-only session cookie |
| `ADMIN_API_KEY` | Must match `ADMIN_API_KEY` on the backend |
| `API_URL` | Backend base URL (default `http://localhost:3001`) |

Copy `.env.example` to `.env.local` and set values before running.

## Develop

```bash
npm install
cp .env.example .env.local
# Set ADMIN_* and ADMIN_API_KEY to match agdil-backend .env

npm run dev
```

Open [http://localhost:3002/login](http://localhost:3002/login).

Backend must be running with the same `ADMIN_API_KEY` and `ADMIN_ORIGIN=http://localhost:3002`.

## Sections

- **Overview** — user, store, product, order counts
- **Users** — registered accounts
- **Orders** — update order status
- **Join submissions** — raw join payloads
