const express = require("express");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");
const { promisify } = require("util");

const PORT = Number(process.env.PORT) || 3000;

const scrypt = promisify(crypto.scrypt);
const ADMIN_DIR = path.join(__dirname, "admin");
const ADMIN_SESSION_MS = 8 * 60 * 60 * 1000;
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const PUBLIC = path.join(__dirname, "public");
const pool = new Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : {
        host: process.env.PGHOST || "localhost",
        port: Number(process.env.PGPORT) || 5432,
        user: process.env.PGUSER || "crisis",
        password: process.env.PGPASSWORD || "crisis_dev_password",
        database: process.env.PGDATABASE || "crisis_council",
      },
);
const MISSIONS = new Set(["scored", "analytical", "team"]);
const SESSION_MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000;

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "100kb" }));

function sendError(res, status, error) {
  return res.status(status).json({ error });
}

function clean(value, maxLength) {
  return String(value ?? "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, maxLength);
}

const ah = (fn) => (req, res, next) => fn(req, res, next).catch(next);

async function hashPassword(pw) {
  const salt = crypto.randomBytes(16);
  const key = await scrypt(pw, salt, 64);
  return `${salt.toString("hex")}:${key.toString("hex")}`;
}

async function verifyPassword(pw, stored) {
  const [saltHex, keyHex] = String(stored || "").split(":");
  if (!saltHex || !keyHex) return false;
  const key = await scrypt(pw, Buffer.from(saltHex, "hex"), 64);
  const expected = Buffer.from(keyHex, "hex");
  return (
    expected.length === key.length && crypto.timingSafeEqual(key, expected)
  );
}

function setSessionCookie(res, sid, maxAge) {
  return res.cookie("sid", sid, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });
}

// naive in-memory limiter: 5 failed admin logins / 15 min / IP
const attempts = new Map();
function loginLimiter(req, res, next) {
  const now = Date.now();
  let rec = attempts.get(req.ip);
  if (!rec || rec.reset <= now) {
    rec = { count: 0, reset: now + 15 * 60 * 1000 };
    attempts.set(req.ip, rec);
  }
  if (rec.count >= 5)
    return sendError(res, 429, "تلاش بیش از حد؛ بعداً دوباره امتحان کنید");
  next();
}

const loadUser = ah(async (req, res, next) => {
  req.user = await currentUser(req);
  next();
});

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return sendError(res, 401, "وارد نشده‌اید");
    if (req.user.role !== role) return sendError(res, 403, "دسترسی غیرمجاز");
    next();
  };
}

async function requireAdminPage(req, res, next) {
  try {
    const user = await currentUser(req);
    if (user?.role !== "admin") return res.redirect("/pages/admin-login.html");
    res.set("Cache-Control", "no-store");
    next();
  } catch (error) {
    next(error);
  }
}

function publicUser(user) {
  return {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    nickname: user.nickname,
    avatar: user.avatar,
    role: user.role,
  };
}

function getSessionId(req) {
  const match = (req.headers.cookie || "").match(/(?:^|;\s*)sid=([^;]*)/);
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
    `SELECT u.id, u.first_name, u.last_name, u.nickname, u.avatar, u.role
       FROM sessions s
       JOIN users u ON u.id = s.user_id
      WHERE s.id = $1 AND s.expires_at > NOW()`,
    [sid],
  );
  return rows[0] || null;
}

app.post("/api/login", async (req, res, next) => {
  try {
    const firstName = clean(req.body?.firstName, 40);
    const lastName = clean(req.body?.lastName, 40);
    const nickname = clean(req.body?.nickname, 30);
    const avatar = clean(req.body?.avatar, 16);
    if (!firstName || !lastName || !nickname || !avatar) {
      return sendError(res, 400, "همه فیلدها الزامی است");
    }

    const sessionUser = await currentUser(req);
    const existingUser = sessionUser?.role === 'user' ? sessionUser : null;

    let user;
    if (existingUser) {
      const { rows } = await pool.query(
        `UPDATE users
            SET first_name = $1, last_name = $2, nickname = $3, avatar = $4, updated_at = NOW()
          WHERE id = $5
          RETURNING id, first_name, last_name, nickname, avatar`,
        [firstName, lastName, nickname, avatar, existingUser.id],
      );
      user = rows[0];
    } else {
      const { rows } = await pool.query(
        `INSERT INTO users (first_name, last_name, nickname, avatar)
         VALUES ($1, $2, $3, $4)
         RETURNING id, first_name, last_name, nickname, avatar`,
        [firstName, lastName, nickname, avatar],
      );
      user = rows[0];
    }

    const previousSid = getSessionId(req);
    const sid =
      previousSid && existingUser
        ? previousSid
        : crypto.randomBytes(24).toString("hex");
    await pool.query(
      `INSERT INTO sessions (id, user_id, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '90 days')
       ON CONFLICT (id) DO UPDATE SET user_id = EXCLUDED.user_id, expires_at = EXCLUDED.expires_at`,
      [sid, user.id],
    );
    return res
      .cookie("sid", sid, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: SESSION_MAX_AGE_MS,
      })
      .status(200)
      .json({ user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
});

app.post('/api/admin/login', loginLimiter, ah(async (req, res) => {
  const username = clean(req.body?.username, 60).toLowerCase();
  const password = String(req.body?.password ?? '').slice(0, 200);
  const { rows } = await pool.query(
    `SELECT id, first_name, last_name, nickname, avatar, role, password_hash
       FROM users WHERE username = $1 AND role = 'admin'`, [username]);
  const admin = rows[0];
  let ok = false;
  if (admin) ok = await verifyPassword(password, admin.password_hash);
  else await scrypt(password, 'x', 64); // burn similar time for unknown usernames
  if (!ok) {
    attempts.get(req.ip).count++;
    return sendError(res, 401, 'نام کاربری یا رمز عبور اشتباه است');
  }
  attempts.delete(req.ip);
  const sid = crypto.randomBytes(24).toString('hex'); // always a fresh sid (no fixation)
  await pool.query(
    `INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, NOW() + INTERVAL '8 hours')`,
    [sid, admin.id]);
  setSessionCookie(res, sid, ADMIN_SESSION_MS).json({ user: publicUser(admin) });
}));

// ---------- admin API (everything below requires role=admin) ----------
const admin = express.Router();

function paging(req) {
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  return { limit, page, offset: (page - 1) * limit };
}
const like = s => `%${s.replace(/[\\%_]/g, '\\$&')}%`;

function resultFilters(query) {
  const where = [`u.role = 'user'`], params = [];
  const add = (sql, value) => {
    params.push(value);
    where.push(sql.replaceAll('?', `$${params.length}`));
  };
  if (MISSIONS.has(query.mission)) add('r.mission = ?', query.mission);
  const from = new Date(query.from), to = new Date(query.to);
  if (!isNaN(from)) add('r.created_at >= ?', from);
  if (!isNaN(to)) add('r.created_at < ?', new Date(to.getTime() + 86400000));
  const q = clean(query.q, 60);
  if (q) add('(u.nickname ILIKE ? OR u.first_name ILIKE ? OR u.last_name ILIKE ?)', like(q));
  return { where: where.join(' AND '), params };
}

admin.get('/stats', ah(async (req, res) => {
  const [totals, missions, scored, daily] = await Promise.all([
    pool.query(`SELECT
        (SELECT COUNT(*) FROM users WHERE role = 'user')::int AS users,
        (SELECT COUNT(*) FROM results)::int AS results,
        (SELECT COUNT(*) FROM results WHERE created_at > NOW() - INTERVAL '24 hours')::int AS results_24h`),
    pool.query(`SELECT mission, COUNT(*)::int AS count, COUNT(DISTINCT user_id)::int AS players
                  FROM results GROUP BY mission ORDER BY mission`),
    pool.query(`SELECT ROUND(AVG(s), 1)::float AS avg, MAX(s)::float AS max FROM (
                  SELECT CASE WHEN data->>'finalScore' ~ '^-?[0-9]+(\\.[0-9]+)?$'
                              THEN (data->>'finalScore')::numeric END AS s
                    FROM results WHERE mission = 'scored') t`),
    pool.query(`SELECT to_char(date_trunc('day', created_at), 'YYYY-MM-DD') AS day, COUNT(*)::int AS count
                  FROM results WHERE created_at > NOW() - INTERVAL '30 days'
                 GROUP BY 1 ORDER BY 1`)
  ]);
  res.json({ totals: totals.rows[0], missions: missions.rows, scored: scored.rows[0], daily: daily.rows });
}));

admin.get('/users', ah(async (req, res) => {
  const { limit, page, offset } = paging(req);
  const q = clean(req.query.q, 60);
  const params = [q ? like(q) : null];
  const where = `u.role = 'user' AND ($1::text IS NULL
                 OR u.nickname ILIKE $1 OR u.first_name ILIKE $1 OR u.last_name ILIKE $1)`;
  const [list, count] = await Promise.all([
    pool.query(
      `SELECT u.id, u.first_name AS "firstName", u.last_name AS "lastName", u.nickname, u.avatar,
              u.created_at AS "createdAt", COUNT(r.id)::int AS "resultsCount",
              MAX(r.created_at) AS "lastActivity"
         FROM users u LEFT JOIN results r ON r.user_id = u.id
        WHERE ${where}
        GROUP BY u.id
        ORDER BY "lastActivity" DESC NULLS LAST, u.created_at DESC
        LIMIT $2 OFFSET $3`, [...params, limit, offset]),
    pool.query(`SELECT COUNT(*)::int AS n FROM users u WHERE ${where}`, params)
  ]);
  res.json({ items: list.rows, total: count.rows[0].n, page, limit });
}));

admin.get('/users/:id', ah(async (req, res) => {
  if (!UUID_RE.test(req.params.id)) return sendError(res, 400, 'شناسه نامعتبر');
  const u = await pool.query(
    `SELECT id, first_name AS "firstName", last_name AS "lastName", nickname, avatar,
            created_at AS "createdAt", updated_at AS "updatedAt"
       FROM users WHERE id = $1 AND role = 'user'`, [req.params.id]);
  if (!u.rows[0]) return sendError(res, 404, 'کاربر پیدا نشد');
  const r = await pool.query(
    `SELECT id, mission, data, created_at AS "createdAt"
       FROM results WHERE user_id = $1 ORDER BY created_at DESC`, [req.params.id]);
  res.json({ user: u.rows[0], results: r.rows });
}));

admin.get('/results', ah(async (req, res) => {
  const { limit, page, offset } = paging(req);
  const f = resultFilters(req.query);
  const n = f.params.length;
  const [list, count] = await Promise.all([
    pool.query(
      `SELECT r.id, r.mission, r.data, r.created_at AS "createdAt",
              u.id AS "userId", u.nickname, u.avatar
         FROM results r JOIN users u ON u.id = r.user_id
        WHERE ${f.where}
        ORDER BY r.created_at DESC LIMIT $${n + 1} OFFSET $${n + 2}`,
      [...f.params, limit, offset]),
    pool.query(`SELECT COUNT(*)::int AS n FROM results r JOIN users u ON u.id = r.user_id
                 WHERE ${f.where}`, f.params)
  ]);
  res.json({ items: list.rows, total: count.rows[0].n, page, limit });
}));

admin.get('/export.csv', ah(async (req, res) => {
  const f = resultFilters(req.query);
  const { rows } = await pool.query(
    `SELECT r.id, r.created_at, r.mission, u.first_name, u.last_name, u.nickname, r.data
       FROM results r JOIN users u ON u.id = r.user_id
      WHERE ${f.where} ORDER BY r.created_at DESC LIMIT 50000`, f.params);
  // prefix formula-trigger chars to prevent CSV/Excel injection from user-supplied names
  const cell = v => {
    let s = String(v ?? '');
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
    return `"${s.replace(/"/g, '""')}"`;
  };
  const lines = [['result_id', 'created_at', 'mission', 'first_name', 'last_name', 'nickname', 'final_score', 'data']
    .map(cell).join(',')];
  for (const r of rows) {
    lines.push([r.id, r.created_at.toISOString(), r.mission, r.first_name, r.last_name,
                r.nickname, r.data?.finalScore, JSON.stringify(r.data)].map(cell).join(','));
  }
  res.type('text/csv; charset=utf-8')
     .set('Content-Disposition', 'attachment; filename="results.csv"')
     .send('\uFEFF' + lines.join('\r\n')); // BOM so Excel reads Persian correctly
}));

app.use('/api/admin', loadUser, requireRole('admin'), admin);
app.use('/admin', requireAdminPage, express.static(ADMIN_DIR));

app.get("/api/me", async (req, res, next) => {
  try {
    const user = await currentUser(req);
    return user
      ? res.json({ user: publicUser(user) })
      : sendError(res, 401, "وارد نشده‌اید");
  } catch (error) {
    return next(error);
  }
});

app.post("/api/logout", async (req, res, next) => {
  try {
    const sid = getSessionId(req);
    if (sid) await pool.query("DELETE FROM sessions WHERE id = $1", [sid]);
    return res
      .clearCookie("sid", { httpOnly: true, sameSite: "lax", path: "/" })
      .json({ ok: true });
  } catch (error) {
    return next(error);
  }
});

app.post("/api/results", async (req, res, next) => {
  try {
    const user = await currentUser(req);
    if (!user) return sendError(res, 401, "وارد نشده‌اید");
    const { mission, data } = req.body || {};
    if (!MISSIONS.has(mission)) return sendError(res, 400, "ماموریت نامعتبر");

    const { rows } = await pool.query(
      `INSERT INTO results (user_id, mission, data)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [user.id, mission, data ?? {}],
    );
    return res.status(201).json({ ok: true, id: rows[0].id });
  } catch (error) {
    return next(error);
  }
});

app.get("/api/results", async (req, res, next) => {
  try {
    const user = await currentUser(req);
    if (!user) return sendError(res, 401, "وارد نشده‌اید");
    const { rows } = await pool.query(
      `SELECT id, user_id AS "userId", mission, data,
              (EXTRACT(EPOCH FROM created_at) * 1000)::bigint AS "createdAt"
         FROM results
        WHERE user_id = $1
        ORDER BY created_at, id`,
      [user.id],
    );
    return res.json({
      results: rows.map((row) => ({
        ...row,
        createdAt: Number(row.createdAt),
      })),
    });
  } catch (error) {
    return next(error);
  }
});

app.get("/api/leaderboard", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT r.user_id, u.nickname, u.avatar, r.data
         FROM results r
         JOIN users u ON u.id = r.user_id
        WHERE r.mission = 'scored'
        ORDER BY r.created_at`,
    );
    const best = new Map();
    for (const row of rows) {
      const score = Number(row.data?.finalScore) || 0;
      if (!best.has(row.user_id) || score > best.get(row.user_id).score) {
        best.set(row.user_id, {
          nickname: row.nickname,
          avatar: row.avatar,
          score,
        });
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

app.use("/api", (req, res) => sendError(res, 404, "not found"));
app.use(express.static(PUBLIC));
app.use((req, res) => res.status(404).type("text/plain").send("Page not found"));

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return sendError(res, 400, "Bad request");
  }
  console.error(error);
  return sendError(res, 500, "Internal server error");
});

async function seedAdmin() {
  const username = (process.env.ADMIN_USERNAME || '').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || '';
  if (!username || !password) return console.warn('⚠️  ADMIN_USERNAME/ADMIN_PASSWORD not set: no admin seeded');
  if (password.length < 12) throw new Error('ADMIN_PASSWORD must be at least 12 characters');
  await pool.query(
    `INSERT INTO users (first_name, last_name, nickname, avatar, role, username, password_hash)
     VALUES ('Admin', '', $1, '🛡️', 'admin', $1, $2)
     ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = 'admin'`,
    [username, await hashPassword(password)]);
}

async function start() {
  await pool.query(fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8"));
  await seedAdmin();
  app.listen(PORT, () =>
    console.log(`✅ App successfully run on: http://localhost:${PORT}`),
  );
}

start().catch((error) => {
  console.error("Could not start server:", error);
  process.exitCode = 1;
});
