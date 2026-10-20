const view = document.getElementById('view');
const dlg = document.getElementById('dlg');
const LABEL = { scored: 'امتیازی', analytical: 'تحلیلی', team: 'تیمی' };
const num = v => (typeof v === 'number' ? new Intl.NumberFormat('fa-IR').format(v) : (v ?? '—'));
const when = v => (v ? new Date(v).toLocaleString('fa-IR') : '—');
const qs = o => new URLSearchParams(Object.entries(o).filter(([, v]) => v !== '' && v != null)).toString();

function el(tag, attrs = {}, ...kids) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
    else if (v === true) n.setAttribute(k, '');
    else if (v !== false && v != null) n.setAttribute(k, v);
  }
  n.append(...kids.flat().filter(k => k != null));
  return n;
}

async function api(path) {
  const r = await fetch(path, { credentials: 'same-origin' });
  if (r.status === 401 || r.status === 403) { location.href = '/pages/admin-login.html'; throw new Error('unauthorized'); }
  if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || r.status);
  return r.json();
}

const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
const card = (label, value) => el('div', { class: 'card' }, el('span', {}, label), el('b', {}, num(value)));

function table(cols, rows, onRow) {
  return el('div', { class: 'scroll' }, el('table', {},
    el('thead', {}, el('tr', {}, cols.map(c => el('th', {}, c.h)))),
    el('tbody', {}, rows.map(r =>
      el('tr', onRow ? { 'data-row': '', onclick: () => onRow(r) } : {}, cols.map(c => el('td', {}, c.v(r))))))));
}

function pager(page, total, limit, go) {
  const pages = Math.max(1, Math.ceil(total / limit));
  return el('div', { class: 'pager' },
    el('button', { disabled: page <= 1, onclick: () => go(page - 1) }, 'قبلی'),
    el('span', {}, `${num(page)} / ${num(pages)} — ${num(total)} مورد`),
    el('button', { disabled: page >= pages, onclick: () => go(page + 1) }, 'بعدی'));
}

function showJson(obj) {
  document.getElementById('dlgBody').textContent = JSON.stringify(obj, null, 2);
  dlg.showModal();
}

async function overview() {
  const s = await api('/api/admin/stats');
  const max = Math.max(1, ...s.daily.map(d => d.count));
  view.replaceChildren(
    el('section', { class: 'cards' },
      card('کاربران', s.totals.users), card('کل نتایج', s.totals.results),
      card('نتایج ۲۴ ساعت اخیر', s.totals.results_24h),
      card('میانگین امتیاز', s.scored.avg), card('بالاترین امتیاز', s.scored.max)),
    el('h2', {}, 'فعالیت ۳۰ روز اخیر'),
    el('div', { class: 'bars' }, s.daily.map(d =>
      el('div', { class: 'bar', title: `${d.day}: ${d.count}`, style: `height:${(d.count / max) * 100}%` }))),
    el('h2', {}, 'به تفکیک ماموریت'),
    table([{ h: 'ماموریت', v: r => LABEL[r.mission] || r.mission },
           { h: 'تعداد نتایج', v: r => num(r.count) },
           { h: 'بازیکنان یکتا', v: r => num(r.players) }], s.missions));
}

// generic filterable + paginated list
async function listView({ path, filters, cols, onRow, extraButtons = [] }) {
  const form = el('form', { class: 'filters', onsubmit: e => e.preventDefault() }, filters, extraButtons);
  const body = el('div');
  let page = 1;
  const values = () => Object.fromEntries(new FormData(form));
  const load = async () => {
    try {
      const d = await api(`${path}?${qs({ ...values(), page, limit: 20 })}`);
      body.replaceChildren(table(cols, d.items, onRow), pager(d.page, d.total, d.limit, p => { page = p; load(); }));
    } catch (e) { body.replaceChildren(el('p', {}, 'خطا: ' + e.message)); }
  };
  form.addEventListener('input', debounce(() => { page = 1; load(); }, 300));
  form.values = values;
  view.replaceChildren(form, body);
  await load();
  return form;
}

const users = () => listView({
  path: '/api/admin/users',
  filters: [el('input', { type: 'search', name: 'q', placeholder: 'جستجوی نام یا نام مستعار…' })],
  cols: [
    { h: 'نام مستعار', v: r => `${r.avatar} ${r.nickname}` },
    { h: 'نام', v: r => `${r.firstName} ${r.lastName}` },
    { h: 'تعداد نتایج', v: r => num(r.resultsCount) },
    { h: 'آخرین فعالیت', v: r => when(r.lastActivity) },
    { h: 'عضویت', v: r => when(r.createdAt) }],
  onRow: async r => showJson(await api('/api/admin/users/' + r.id))
});

async function results() {
  const exportBtn = el('button', { type: 'button' }, 'خروجی CSV');
  const form = await listView({
    path: '/api/admin/results',
    filters: [
      el('input', { type: 'search', name: 'q', placeholder: 'جستجوی کاربر…' }),
      el('select', { name: 'mission' }, el('option', { value: '' }, 'همه ماموریت‌ها'),
        ...Object.entries(LABEL).map(([k, v]) => el('option', { value: k }, v))),
      el('input', { type: 'date', name: 'from' }), el('input', { type: 'date', name: 'to' })],
    extraButtons: [exportBtn],
    cols: [
      { h: 'زمان', v: r => when(r.createdAt) },
      { h: 'ماموریت', v: r => LABEL[r.mission] || r.mission },
      { h: 'کاربر', v: r => `${r.avatar} ${r.nickname}` },
      { h: 'امتیاز', v: r => num(r.data?.finalScore) }],
    onRow: r => showJson(r)
  });
  exportBtn.addEventListener('click', () => { location.href = '/api/admin/export.csv?' + qs(form.values()); });
}

const tabs = { overview, users, results };
document.getElementById('tabs').addEventListener('click', e => {
  const b = e.target.closest('button[data-tab]');
  if (!b) return;
  document.querySelectorAll('#tabs button').forEach(x => x.classList.toggle('on', x === b));
  tabs[b.dataset.tab]().catch(console.error);
});
document.getElementById('dlgClose').addEventListener('click', () => dlg.close());
document.getElementById('logout').addEventListener('click', async () => {
  await fetch('/api/logout', { method: 'POST' });
  location.href = '/pages/admin-login.html';
});
overview().catch(console.error);