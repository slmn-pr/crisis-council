const isLoginPage = /login\.html$/.test(location.pathname);
async function call(method, url, body) {
    const response = await fetch(url, {
        method,
        credentials: 'same-origin',
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw Object.assign(new Error(data.error || 'خطا'), { status: response.status });
    }
    return data;
}
window.API = {
    login: profile => call('POST', '/api/login', profile),
    me: () => call('GET', '/api/me'),
    logout: () => call('POST', '/api/logout'),
    saveResult: (mission, data) => call('POST', '/api/results', { mission, data }).catch(error => {
        console.error('ذخیره نتیجه ناموفق:', error);
        window.alert('ذخیره نتیجه ناموفق بود: ' + error.message);
        throw error;
    }),
    results: () => call('GET', '/api/results'),
    leaderboard: () => call('GET', '/api/leaderboard')
};
if (!isLoginPage && document.documentElement.hasAttribute('data-require-login')) {
    API.me().then(({ user }) => {
        window.currentUser = user;
    }).catch(() => {
        const next = location.pathname.split('/').pop();
        location.replace('/pages/login.html?next=' + encodeURIComponent(next));
    });
}
