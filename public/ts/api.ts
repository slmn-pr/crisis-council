const isLoginPage = /login\.html$/.test(location.pathname);

async function call<T>(method: string, url: string, body?: unknown): Promise<T> {
  const response = await fetch(url, {
    method,
    credentials: 'same-origin',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await response.json().catch((): { error?: string } => ({}));
  if (!response.ok) {
    throw Object.assign(new Error(data.error || 'خطا'), { status: response.status });
  }
  return data as T;
}

window.API = {
  login: profile => call<{ user: User }>('POST', '/api/login', profile),
  me: () => call<{ user: User }>('GET', '/api/me'),
  logout: () => call<{ ok: boolean }>('POST', '/api/logout'),
  saveResult: (mission, data) => call<{ ok: boolean; id: string }>('POST', '/api/results', { mission, data }).catch(error => {
    console.error('ذخیره نتیجه ناموفق:', error);
    window.alert('ذخیره نتیجه ناموفق بود: ' + error.message);
    throw error;
  }),
  results: () => call<{ results: ResultEntry[] }>('GET', '/api/results'),
  leaderboard: () => call<{ leaderboard: Array<{ nickname: string; avatar: string; score: number }> }>('GET', '/api/leaderboard')
};

if (!isLoginPage && document.documentElement.hasAttribute('data-require-login')) {
  API.me().then(({ user }) => {
    window.currentUser = user;
  }).catch(() => {
    const next = location.pathname.split('/').pop();
    location.replace('/pages/login.html?next=' + encodeURIComponent(next));
  });
}
