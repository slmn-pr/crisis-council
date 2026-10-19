// ── Starfield Canvas ──
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let W, H, stars = [];
function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
}
function initStars() {
    stars = [];
    for (let i = 0; i < 160; i++) {
        stars.push({
            x: Math.random() * W,
            y: Math.random() * H,
            r: Math.random() * 1.5 + 0.3,
            a: Math.random(),
            speed: Math.random() * 0.3 + 0.05,
            pulse: Math.random() * Math.PI * 2
        });
    }
}
function drawStars(t) {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => {
        s.pulse += 0.02;
        const alpha = (Math.sin(s.pulse) * 0.3 + 0.6) * s.a;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,119,182,${alpha * 0.6})`;
        ctx.fill();
        s.y -= s.speed;
        if (s.y < 0) {
            s.y = H;
            s.x = Math.random() * W;
        }
    });
    requestAnimationFrame(drawStars);
}
resize();
initStars();
drawStars(0);
window.addEventListener('resize', () => { resize(); initStars(); });
// ── Countdown: تا پایان مهلت ارسال ──
function updateCountdown() {
    const target = new Date();
    target.setDate(target.getDate() + 14);
    target.setHours(0, 0, 0, 0);
    const now = new Date();
    const diff = target.getTime() - now.getTime();
    if (diff <= 0)
        return;
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const toFa = n => String(n).padStart(2, '0').replace(/\d/g, c => '۰۱۲۳۴۵۶۷۸۹'[c]);
    document.getElementById('cd-days').textContent = toFa(d);
    document.getElementById('cd-hours').textContent = toFa(h);
    document.getElementById('cd-mins').textContent = toFa(m);
    document.getElementById('cd-secs').textContent = toFa(s);
}
updateCountdown();
setInterval(updateCountdown, 1000);
