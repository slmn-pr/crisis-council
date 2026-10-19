// بک‌اند شورای بحران ۲۰۵۰ — Node.js خالص، بدون نیاز به npm install
// اجرا: node server.js   →   http://localhost:3000
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const ADMIN_KEY = process.env.ADMIN_KEY || 'change-me';
const PUBLIC = path.join(__dirname, 'public');
const DB_FILE = path.join(__dirname, 'data', 'db.json');

// ───────── ذخیره‌سازی (فایل JSON با نوشتن اتمیک) ─────────
let db = { users: {}, sessions: {}, results: [] };
try { db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); } catch (_) {}
function save() {
  const tmp = DB_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
  fs.renameSync(tmp, DB_FILE);
}

// ───────── ابزارها ─────────
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon', '.woff2': 'font/woff2'
};
const MISSIONS = ['scored', 'analytical', 'team'];

function send(res, code, obj, headers = {}) {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', ...headers });
  res.end(JSON.stringify(obj));
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', c => { raw += c; if (raw.length > 100_000) { reject(new Error('too large')); req.destroy(); } });
    req.on('end', () => { try { resolve(raw ? JSON.parse(raw) : {}); } catch (e) { reject(e); } });
  });
}
function getCookie(req, name) {
  const m = (req.headers.cookie || '').split(';').map(s => s.trim()).find(s => s.startsWith(name + '='));
  return m ? decodeURIComponent(m.slice(name.length + 1)) : null;
}
function currentUser(req) {
  const sid = getCookie(req, 'sid');
  const uid = sid && db.sessions[sid];
  return uid ? db.users[uid] : null;
}
const clean = (v, max) => String(v ?? '').replace(/[<>]/g, '').trim().slice(0, max);
const publicUser = u => ({ id: u.id, firstName: u.firstName, lastName: u.lastName, nickname: u.nickname, avatar: u.avatar });

// ───────── API ─────────
async function handleApi(req, res, url) {
  const route = `${req.method} ${url.pathname}`;

  if (route === 'POST /api/login') {
    const b = await readBody(req);
    const firstName = clean(b.firstName, 40), lastName = clean(b.lastName, 40);
    const nickname = clean(b.nickname, 30), avatar = clean(b.avatar, 16);
    if (!firstName || !lastName || !nickname || !avatar)
      return send(res, 400, { error: 'همه فیلدها الزامی است' });

    let user = currentUser(req);
    if (user) {                       // کاربر قبلاً وارد شده → ویرایش پروفایل
      Object.assign(user, { firstName, lastName, nickname, avatar, updatedAt: Date.now() });
    } else {
      user = { id: crypto.randomUUID(), firstName, lastName, nickname, avatar, createdAt: Date.now(), updatedAt: Date.now() };
      db.users[user.id] = user;
    }
    const sid = getCookie(req, 'sid') && db.sessions[getCookie(req, 'sid')] ? getCookie(req, 'sid') : crypto.randomBytes(24).toString('hex');
    db.sessions[sid] = user.id;
    save();
    return send(res, 200, { user: publicUser(user) }, {
      'Set-Cookie': `sid=${sid}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 90}`
    });
  }

  if (route === 'GET /api/me') {
    const u = currentUser(req);
    return u ? send(res, 200, { user: publicUser(u) }) : send(res, 401, { error: 'وارد نشده‌اید' });
  }

  if (route === 'POST /api/logout') {
    const sid = getCookie(req, 'sid');
    if (sid) { delete db.sessions[sid]; save(); }
    return send(res, 200, { ok: true }, { 'Set-Cookie': 'sid=; Path=/; Max-Age=0' });
  }

  if (route === 'POST /api/results') {
    const u = currentUser(req);
    if (!u) return send(res, 401, { error: 'وارد نشده‌اید' });
    const b = await readBody(req);
    if (!MISSIONS.includes(b.mission)) return send(res, 400, { error: 'ماموریت نامعتبر' });
    const entry = { id: crypto.randomUUID(), userId: u.id, mission: b.mission, data: b.data ?? {}, createdAt: Date.now() };
    db.results.push(entry);
    save();
    return send(res, 201, { ok: true, id: entry.id });
  }

  if (route === 'GET /api/results') {
    const u = currentUser(req);
    if (!u) return send(res, 401, { error: 'وارد نشده‌اید' });
    return send(res, 200, { results: db.results.filter(r => r.userId === u.id) });
  }

  if (route === 'GET /api/leaderboard') {          // رتبه‌بندی ماموریت امتیازی
    const best = {};
    db.results.filter(r => r.mission === 'scored').forEach(r => {
      const s = Number(r.data.finalScore) || 0;
      if (!best[r.userId] || s > best[r.userId]) best[r.userId] = s;
    });
    const rows = Object.entries(best)
      .map(([uid, score]) => ({ nickname: db.users[uid]?.nickname, avatar: db.users[uid]?.avatar, score }))
      .sort((a, b) => b.score - a.score).slice(0, 20);
    return send(res, 200, { leaderboard: rows });
  }

  if (route === 'GET /api/admin/users') {           // ?key=ADMIN_KEY
    if (url.searchParams.get('key') !== ADMIN_KEY) return send(res, 403, { error: 'forbidden' });
    const users = Object.values(db.users).map(u => ({
      ...u, results: db.results.filter(r => r.userId === u.id)
    }));
    return send(res, 200, { count: users.length, users });
  }

  return send(res, 404, { error: 'not found' });
}

// ───────── فایل‌های استاتیک ─────────
function serveStatic(req, res, url) {
  let p = decodeURIComponent(url.pathname);
  if (p === '/') p = '/index.html';
  const file = path.normalize(path.join(PUBLIC, p));
  if (!file.startsWith(PUBLIC)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); return res.end('صفحه پیدا نشد'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    res.end(buf);
  });
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  try {
    if (url.pathname.startsWith('/api/')) await handleApi(req, res, url);
    else serveStatic(req, res, url);
  } catch (e) {
    console.error(e);
    send(res, 400, { error: 'درخواست نامعتبر' });
  }
}).listen(PORT, () => console.log(`✅ سرور روی http://localhost:${PORT} اجرا شد`));
