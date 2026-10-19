# شورای بحران ۲۰۵۰

## اجرا با Docker Compose

```sh
docker compose up --build
```

The application is available at <http://localhost:3000>. PostgreSQL data is
stored in the named `postgres_data` volume. Set `POSTGRES_DB`, `POSTGRES_USER`,
`POSTGRES_PASSWORD`, `PORT`, and `ADMIN_KEY` in the environment before starting
Compose to override the development defaults. Change `ADMIN_KEY` before
deploying anywhere public.

To stop the services while keeping the database, run `docker compose down`.
To also delete the database volume and its data, run
`docker compose down --volumes`.

## Local development

Requirements: Node.js 20+, npm, and a PostgreSQL database.

```sh
npm install
npm start
```

The server creates the database tables on startup. Set `DATABASE_URL` or the
standard `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, and `PGDATABASE`
environment variables to configure PostgreSQL (the local defaults are
`localhost:5432`, user `crisis`, password `crisis_dev_password`, and database
`crisis_council`).
`npm start` builds the browser TypeScript into `public/js` before starting the
server. Run `npm run build:client` to build it separately.

## Structure

- `server.js`: Express API and static file server.
- `schema.sql`: PostgreSQL schema, also loaded automatically by the Compose
  database on its first initialization.
- `public/`: static HTML, extracted page CSS in `css/`, TypeScript sources in
  `ts/`, and their browser JavaScript output in `js/`.
- `docker-compose.yml`: application and PostgreSQL services with a persistent
  database volume.

## User flow

`index → login → scored → analytical → team → index`

Mission pages redirect users who are not signed in to the login page and return
them to the requested mission after login.

## API

| Method | Path | Description |
|---|---|---|
| POST | `/api/login` | Create or update a profile (`firstName`, `lastName`, `nickname`, `avatar`) and set the session cookie |
| GET | `/api/me` | Return the current user, or `401` when signed out |
| POST | `/api/logout` | Delete the current session |
| POST | `/api/results` | Save `{ mission: "scored" \| "analytical" \| "team", data }` for the signed-in user |
| GET | `/api/results` | Return the current user's results |
| GET | `/api/leaderboard` | Return the top 20 scores for the scored mission |
| GET | `/api/admin/users` | Return all users and their results; supply `x-admin-key` or `?key=ADMIN_KEY` |
