const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const PORT = Number(process.env.PORT) || 3000;
const ADMIN_KEY = process.env.ADMIN_KEY || 'change-me';
const PUBLIC = path.join(__dirname, 'public');
const pool = new Pool(process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL }
  : {
      host: process.env.PGHOST || 'localhost',
      port: Number(process.env.PGPORT) || 5432,
      user: process.env.PGUSER || 'crisis',
      password: process.env.PGPASSWORD || 'crisis_dev_password',
      database: process.env.PGDATABASE || 'crisis_council'
    });
const MISSIONS = new Set(['scored', 'analytical', 'team']);
const SESSION_MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000;

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '100kb' }));

function sendError(res, status, error) {
  return res.status(status).json({ error });
}

function clean(value, maxLength) {
  return String(value ?? '').replace(/[<>]/g, '').trim().slice(0, maxLength);
}

function publicUser(user) {
  return {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    nickname: user.nickname,
    avatar: user.avatar
  };
}

function getSessionId(req) {
  const match = (req.headers.cookie || '').match(/(?:^|;\s*)sid=([^;]*)/);
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}

async function currentUser(req) {
  const sid = getSessionId(req);
  if (!sid) return null;
  const { rows } = await pool.query(
    `SELECT u.id, u.first_name, u.last_name, u.nickname, u.avatar
       FROM sessions s
       JOIN users u ON u.id = s.user_id
      WHERE s.id = $1 AND s.expires_at > NOW()`,
    [sid]
  );
  return rows[0] || null;
}

app.post('/api/login', async (req, res, next) => {
  try {
    const firstName = clean(req.body?.firstName, 40);
    const lastName = clean(req.body?.lastName, 40);
    const nickname = clean(req.body?.nickname, 30);
    const avatar = clean(req.body?.avatar, 16);
    if (!firstName || !lastName || !nickname || !avatar) {
      return sendError(res, 400, 'همه فیلدها الزامی است');
    }

    const existingUser = await currentUser(req);
    let user;
    if (existingUser) {
      const { rows } = await pool.query(
        `UPDATE users
            SET first_name = $1, last_name = $2, nickname = $3, avatar = $4, updated_at = NOW()
          WHERE id = $5
          RETURNING id, first_name, last_name, nickname, avatar`,
        [firstName, lastName, nickname, avatar, existingUser.id]
      );
      user = rows[0];
    } else {
      const { rows } = await pool.query(
        `INSERT INTO users (first_name, last_name, nickname, avatar)
         VALUES ($1, $2, $3, $4)
         RETURNING id, first_name, last_name, nickname, avatar`,
        [firstName, lastName, nickname, avatar]
      );
      user = rows[0];
    }

    const previousSid = getSessionId(req);
    const sid = previousSid && existingUser ? previousSid : crypto.randomBytes(24).toString('hex');
    await pool.query(
      `INSERT INTO sessions (id, user_id, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '90 days')
       ON CONFLICT (id) DO UPDATE SET user_id = EXCLUDED.user_id, expires_at = EXCLUDED.expires_at`,
      [sid, user.id]
    );
    return res
      .cookie('sid', sid, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: SESSION_MAX_AGE_MS
      })
      .status(200)
      .json({ user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
});

app.get('/api/me', async (req, res, next) => {
  try {
    const user = await currentUser(req);
    return user ? res.json({ user: publicUser(user) }) : sendError(res, 401, 'وارد نشده‌اید');
  } catch (error) {
    return next(error);
  }
});

app.post('/api/logout', async (req, res, next) => {
  try {
    const sid = getSessionId(req);
    if (sid) await pool.query('DELETE FROM sessions WHERE id = $1', [sid]);
    return res.clearCookie('sid', { httpOnly: true, sameSite: 'lax', path: '/' }).json({ ok: true });
  } catch (error) {
    return next(error);
  }
});

app.post('/api/results', async (req, res, next) => {
  try {
    const user = await currentUser(req);
    if (!user) return sendError(res, 401, 'وارد نشده‌اید');
    const { mission, data } = req.body || {};
    if (!MISSIONS.has(mission)) return sendError(res, 400, 'ماموریت نامعتبر');

    const { rows } = await pool.query(
      `INSERT INTO results (user_id, mission, data)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [user.id, mission, data ?? {}]
    );
    return res.status(201).json({ ok: true, id: rows[0].id });
  } catch (error) {
    return next(error);
  }
});

app.get('/api/results', async (req, res, next) => {
  try {
    const user = await currentUser(req);
    if (!user) return sendError(res, 401, 'وارد نشده‌اید');
    const { rows } = await pool.query(
      `SELECT id, user_id AS "userId", mission, data,
              (EXTRACT(EPOCH FROM created_at) * 1000)::bigint AS "createdAt"
         FROM results
        WHERE user_id = $1
        ORDER BY created_at, id`,
      [user.id]
    );
    return res.json({ results: rows.map(row => ({ ...row, createdAt: Number(row.createdAt) })) });
  } catch (error) {
    return next(error);
  }
});

app.get('/api/leaderboard', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT r.user_id, u.nickname, u.avatar, r.data
         FROM results r
         JOIN users u ON u.id = r.user_id
        WHERE r.mission = 'scored'
        ORDER BY r.created_at`
    );
    const best = new Map();
    for (const row of rows) {
      const score = Number(row.data?.finalScore) || 0;
      if (!best.has(row.user_id) || score > best.get(row.user_id).score) {
        best.set(row.user_id, { nickname: row.nickname, avatar: row.avatar, score });
      }
    }
    const leaderboard = [...best.values()]
      .sort((left, right) => right.score - left.score)
      .slice(0, 20);
    return res.json({ leaderboard });
  } catch (error) {
    return next(error);
  }
});

app.get('/api/admin/users', async (req, res, next) => {
  try {
    const key = req.get('x-admin-key') || req.query.key;
    if (!ADMIN_KEY || key !== ADMIN_KEY) return sendError(res, 403, 'forbidden');
    const { rows } = await pool.query(
      `SELECT u.id, u.first_name AS "firstName", u.last_name AS "lastName",
              u.nickname, u.avatar,
              (EXTRACT(EPOCH FROM u.created_at) * 1000)::bigint AS "createdAt",
              (EXTRACT(EPOCH FROM u.updated_at) * 1000)::bigint AS "updatedAt",
              COALESCE(
                json_agg(
                  json_build_object(
                    'id', r.id, 'userId', r.user_id, 'mission', r.mission,
                    'data', r.data, 'createdAt', (EXTRACT(EPOCH FROM r.created_at) * 1000)::bigint
                  ) ORDER BY r.created_at
                ) FILTER (WHERE r.id IS NOT NULL),
                '[]'::json
              ) AS results
         FROM users u
         LEFT JOIN results r ON r.user_id = u.id
        GROUP BY u.id
        ORDER BY u.created_at`
    );
    const users = rows.map(user => ({
      ...user,
      createdAt: Number(user.createdAt),
      updatedAt: Number(user.updatedAt),
      results: user.results.map(result => ({ ...result, createdAt: Number(result.createdAt) }))
    }));
    return res.json({ count: users.length, users });
  } catch (error) {
    return next(error);
  }
});

app.use('/api', (req, res) => sendError(res, 404, 'not found'));
app.use(express.static(PUBLIC));
app.use((req, res) => res.status(404).type('text/plain').send('صفحه پیدا نشد'));

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return sendError(res, 400, 'درخواست نامعتبر');
  }
  console.error(error);
  return sendError(res, 500, 'خطای داخلی سرور');
});

async function start() {
  await pool.query(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'));
  app.listen(PORT, () => console.log(`✅ سرور روی http://localhost:${PORT} اجرا شد`));
}

start().catch(error => {
  console.error('Could not start server:', error);
  process.exitCode = 1;
});
