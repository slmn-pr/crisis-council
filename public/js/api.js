// کلاینت API مشترک بین همه صفحات
(function () {
  const isLoginPage = /login\.html$/.test(location.pathname);

  async function call(method, url, body) {
    const r = await fetch(url, {
      method, credentials: 'same-origin',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw Object.assign(new Error(data.error || 'خطا'), { status: r.status });
    return data;
  }

  window.API = {
    login: p => call('POST', '/api/login', p),
    me: () => call('GET', '/api/me'),
    logout: () => call('POST', '/api/logout'),
    saveResult: (mission, data) => call('POST', '/api/results', { mission, data }).catch(e => console.warn('ذخیره نتیجه ناموفق:', e.message)),
    results: () => call('GET', '/api/results'),
    leaderboard: () => call('GET', '/api/leaderboard')
  };

  // محافظ صفحات ماموریت: اگر وارد نشده، به login برو و بعد از ورود برگرد
  if (!isLoginPage && document.documentElement.hasAttribute('data-require-login')) {
    API.me().then(r => { window.currentUser = r.user; }).catch(() => {
      const next = location.pathname.split('/').pop();
      location.replace('login.html?next=' + encodeURIComponent(next));
    });
  }
})();
