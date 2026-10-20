# شورای بحران ۲۰۵۰

## اجرا با Docker Compose

Create a `.env` file next to `docker-compose.yml` (it must be in `.gitignore`):

```sh
ADMIN_USERNAME=admin
ADMIN_PASSWORD=choose-a-long-random-password   # at least 12 characters
```

Then start the stack:

```sh
docker compose up --build
```

The application is available at <http://localhost:3000>. PostgreSQL data is
stored in the named `postgres_data` volume. `ADMIN_USERNAME` and
`ADMIN_PASSWORD` are required: Compose refuses to start without them. Set
`POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `PORT` in the
environment to override the development defaults. Change the database password
and use a strong admin password before deploying anywhere public.

To stop the services while keeping the database, run `docker compose down`.
To also delete the database volume and its data, run
`docker compose down --volumes`.

## Local development

Requirements: Node.js 20+, npm, and a PostgreSQL database.

```sh
npm install
export ADMIN_USERNAME=admin
export ADMIN_PASSWORD=choose-a-long-random-password
npm start
```

On Windows PowerShell, use `$env:ADMIN_USERNAME="admin"` and
`$env:ADMIN_PASSWORD="..."` instead of `export`.

The server creates the database tables on startup and creates or updates the
admin account from `ADMIN_USERNAME` and `ADMIN_PASSWORD`. If either variable is
missing, the server still starts but no admin account is seeded and the
dashboard cannot be used. Set `DATABASE_URL` or the standard `PGHOST`,
`PGPORT`, `PGUSER`, `PGPASSWORD`, and `PGDATABASE` environment variables to
configure PostgreSQL (the local defaults are `localhost:5432`, user `crisis`,
password `crisis_dev_password`, and database `crisis_council`).

`npm start` builds the browser TypeScript into `public/js` before starting the
server. Run `npm run build:client` to build it separately. The admin dashboard
(`admin/`) is plain JavaScript and is not part of this build.

## Structure

- `server.js`: Express API, session/role handling, and static file servers.
- `schema.sql`: PostgreSQL schema, also loaded automatically by the Compose
  database on its first initialization. It is idempotent and runs again on
  every server start.
- `public/`: static HTML, extracted page CSS in `css/`, TypeScript sources in
  `ts/`, and their browser JavaScript output in `js/`. Everything here is
  public. `pages/admin-login.html` is the admin sign-in page.
- `admin/`: admin dashboard (HTML, CSS, JS). Served at `/admin/` only to
  signed-in admins. It is deliberately outside `public/`.
- `docker-compose.yml`: application and PostgreSQL services with a persistent
  database volume.

## User flow

`index → login → scored → analytical → team → index`

Mission pages redirect users who are not signed in to the login page and return
them to the requested mission after login.

## Admin dashboard

Players sign in without a password. The admin dashboard uses a separate,
password-protected account with the `admin` role.

- **Sign in:** `/pages/admin-login.html`, then you are redirected to `/admin/`.
- **Access control:** the role is checked on the server for both the dashboard
  files (`/admin/*`) and the API (`/api/admin/*`). Signed-out visitors are
  redirected to the admin login page, and signed-in players receive `403`.
- **Sessions:** admin sessions last 8 hours and are issued with a fresh session
  id on every login. Player sessions last 90 days.
- **Brute-force protection:** 5 failed logins per IP per 15 minutes, then `429`.
  The limiter is in-memory and per process; use a shared store if you run
  multiple replicas.
- **Features:** overview stats, a searchable user list with per-user results,
  filterable and paginated results (by mission, date range, and user), and CSV
  export.
- **Changing the admin password:** change `ADMIN_PASSWORD` and restart. The
  password is re-synced on every boot.

Admin users are excluded from player statistics, lists, and exports.

### Deployment notes

- Set `NODE_ENV=production` (Compose does this) so the session cookie is
  `Secure`. This requires HTTPS; browsers other than localhost-friendly ones
  drop `Secure` cookies on plain HTTP, and admin login will appear to succeed
  and then bounce back to the login page.
- Behind a reverse proxy, add `app.set('trust proxy', 1)` in `server.js` so the
  rate limiter sees real client IPs.
- Never commit `.env` or the admin password.

## API

| Method | Path | Description |
|---|---|---|
| POST | `/api/login` | Create or update a player profile (`firstName`, `lastName`, `nickname`, `avatar`) and set the session cookie. Admin sessions are never reused: a new player account and session are created |
| GET | `/api/me` | Return the current user (including `role`), or `401` when signed out |
| POST | `/api/logout` | Delete the current session |
| POST | `/api/results` | Save `{ mission: "scored" \| "analytical" \| "team", data }` for the signed-in user |
| GET | `/api/results` | Return the current user's results |
| GET | `/api/leaderboard` | Return the top 20 scores for the scored mission |
| POST | `/api/admin/login` | Admin sign-in with `{ username, password }`. Rate-limited |

### Admin API

All of these require an admin session: `401` when signed out, `403` for
non-admin users. List endpoints accept `page` and `limit` (max 100).

| Method | Path | Description |
|---|---|---|
| GET | `/api/admin/stats` | Totals, per-mission counts, scored average/max, and daily activity for the last 30 days |
| GET | `/api/admin/users` | Paginated players with result counts and last activity; optional `q` (name or nickname search) |
| GET | `/api/admin/users/:id` | One player and all their results |
| GET | `/api/admin/results` | Paginated results; optional `mission`, `from`, `to` (dates), and `q` |
| GET | `/api/admin/export.csv` | CSV export (up to 50,000 rows) using the same filters as `/api/admin/results` |

The old `GET /api/admin/users?key=...` endpoint and the `ADMIN_KEY` variable
have been removed.