// ════════════════════
// DATA
// ════════════════════
const phases = [
    {
        badge: 'PHASE_01 · INTEL_GATHERING',
        phaseTitle: 'فاز ۱: دریافت اطلاعات',
        story: `<strong>وضعیت اضطراری:</strong> هوش مصنوعی مرکزی شهر ۲۰۵۰ در حال خرابی است. کد ۱۶ رقمی بین ۴ مأمور در ۴ شهر توزیع شده. تو بخش اول کد را داری: <strong style="color:var(--cyan); font-family:Orbitron,monospace">A7-B2</strong> — باید اطلاعات بقیه را جمع‌آوری کنی.`,
        question: 'چطور اطلاعات سایر اعضا را جمع‌آوری می‌کنی؟',
        decisions: [
            { icon: '📋', text: 'یک قالب مشترک می‌فرستم تا همه اطلاعاتشان را منظم بنویسند', hint: 'ساختارمند، منظم', tag: 'coordinator', behavior: 'رهبری ساختاری' },
            { icon: '🗣', text: 'شروع به صحبت می‌کنم و از هر کدام به ترتیب می‌پرسم', hint: 'رهبری مستقیم', tag: 'leader', behavior: 'ارتباط‌گیری فعال' },
            { icon: '🎯', text: 'اطلاعاتم را اول می‌فرستم و منتظر می‌مانم', hint: 'مشارکت‌محور', tag: 'implementer', behavior: 'مشارکت تعاملی' },
            { icon: '🔍', text: 'سوال می‌کنم آیا کسی تجربه‌ای از این نوع کد دارد', hint: 'بهره‌گیری از دانش تیم', tag: 'evaluator', behavior: 'ارزیابی منابع تیمی' }
        ],
        codeReveal: [0, 1, 2, 3], // indices to reveal
        clues: [
            'سارا: «بخش من A7 است»',
            'علی: «بخش من F5-G9 است»',
            'نازنین: «بخش من X2-K1 است — مطمئنم!»'
        ]
    },
    {
        badge: 'PHASE_02 · CONFLICT_DETECTION',
        phaseTitle: 'فاز ۲: شناسایی اطلاعات نادرست',
        story: `<strong>⚠️ هشدار:</strong> یک عضو تیم اطلاعات نادرست دارد! پس از تجزیه اولیه، کد در بخش‌های مختلف تناقض دارد. علی می‌گوید بخش او <strong style="color:var(--gold)">F5-G9</strong> است اما نازنین می‌گوید این با بخش او یعنی <strong style="color:var(--danger)">X2-K1</strong> تناقض دارد — یکی از آن‌ها اشتباه است.`,
        question: 'چطور این تعارض را حل می‌کنی؟',
        decisions: [
            { icon: '🤝', text: 'از هر دو می‌خواهم اطلاعات را دوباره بررسی و تأیید کنند', hint: 'مدیریت تعارض آرام', tag: 'coordinator', behavior: 'مدیریت تعارض' },
            { icon: '⚡', text: 'اعلام می‌کنم که نازنین اشتباه می‌کند — منطقاً کد علی درست‌تر است', hint: 'قاطع اما شاید عجولانه', tag: 'leader', behavior: 'قاطعیت' },
            { icon: '🔬', text: 'یک آزمایش طراحی می‌کنم تا کدام بخش درست است را تست کنیم', hint: 'تحلیلی، داده‌محور', tag: 'evaluator', behavior: 'تفکر نقادانه' },
            { icon: '🗳', text: 'رأی‌گیری می‌کنم که تیم کدام نسخه را باور دارد', hint: 'دموکراتیک', tag: 'implementer', behavior: 'مشارکت‌سازی' }
        ],
        codeReveal: [4, 5, 6, 7],
        clues: [
            '⚠️ کد علی و نازنین با هم تناقض دارند',
            'سارا: «من هم مطمئن نیستم کدام درست است»',
            'بررسی: بخش نازنین با الگوی سیستم سازگارتر است'
        ]
    },
    {
        badge: 'PHASE_03 · FINAL_ASSEMBLY',
        phaseTitle: 'فاز ۳: بازسازی کد نهایی',
        story: `<strong>مرحله حساس:</strong> کشف شد که <strong style="color:var(--danger)">علی</strong> اطلاعات نادرست داشت (عمداً یا سهواً). کد درست نازنین است: <strong style="color:var(--success); font-family:Orbitron,monospace">X2-K1</strong>. حالا باید کد کامل را مونتاژ کنی. فقط ۳ دقیقه مانده!`,
        question: 'آخرین اقدام قبل از وارد کردن کد:',
        decisions: [
            { icon: '✅', text: 'کد را دوباره با همه اعضا بررسی می‌کنم تا مطمئن شوم', hint: 'دقیق و اطمینان‌بخش', tag: 'coordinator', behavior: 'تأیید گروهی' },
            { icon: '⚡', text: 'بدون تأخیر کد را وارد می‌کنم — وقت نداریم', hint: 'سریع، قاطع', tag: 'leader', behavior: 'اقدام سریع' },
            { icon: '💡', text: 'منطق کد را برای تیم توضیح می‌دهم تا همه بفهمند', hint: 'آموزشی، شفاف‌ساز', tag: 'evaluator', behavior: 'انتقال دانش' },
            { icon: '🙏', text: 'از نازنین که اطلاعات درست داشت تشکر می‌کنم', hint: 'قدردانی، انسانی', tag: 'implementer', behavior: 'روحیه تیمی' }
        ],
        codeReveal: [8, 9, 10, 11, 12, 13, 14, 15],
        clues: [
            '✅ کد کامل: A7-B2-X2-K1-[مشترک]',
            '✅ نازنین اطلاعات درست داشت',
            '⚠️ علی منبع اطلاعات نادرست بود'
        ]
    }
];
// ════════════════════
// STATE
// ════════════════════
let phase = 0;
let timeLeft = 1800; // 30 min
let timerInterval;
let myChoices = [];
let codeState = Array(16).fill(null);
let missionSuccess = false;
const roleCodes = { coordinator: 0, leader: 0, evaluator: 0, implementer: 0 };
function toPersian(n) {
    return String(n).replace(/\d/g, c => '۰۱۲۳۴۵۶۷۸۹'[c]);
}
// ════════════════════
// START
// ════════════════════
function startMission() {
    showScreen('screen-game');
    initCodeDisplay();
    renderPhase();
    timerInterval = setInterval(tick, 1000);
    // Simulate team activity
    scheduleTeamEvents();
}
function tick() {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        finishMission(false);
    }
}
function updateTimerDisplay() {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    const str = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    const farsi = str.replace(/\d/g, c => '۰۱۲۳۴۵۶۷۸۹'[c]);
    document.getElementById('game-timer').textContent = farsi;
    document.getElementById('topbar-timer').textContent = farsi;
    if (timeLeft <= 180) {
        document.getElementById('game-timer').classList.add('danger');
    }
    const pct = Math.round((1800 - timeLeft) / 1800 * 100);
    document.getElementById('progress-fill').style.width = pct + '%';
    document.getElementById('progress-pct').textContent = toPersian(pct) + '٪';
}
// ════════════════════
// CODE DISPLAY
// ════════════════════
const codeChars = ['A', '7', '-', 'B', '2', '-', 'X', '2', '-', 'K', '1', '-', 'Q', '9', '-', 'Z'];
function initCodeDisplay() {
    const el = document.getElementById('code-segments');
    el.innerHTML = '';
    codeChars.forEach((c, i) => {
        const seg = document.createElement('div');
        seg.className = 'code-seg';
        seg.id = 'code-' + i;
        seg.textContent = c === '-' ? '-' : '?';
        if (c === '-') {
            seg.style.background = 'transparent';
            seg.style.border = 'none';
            seg.style.color = 'var(--muted)';
        }
        el.appendChild(seg);
    });
}
function revealCodeParts(indices) {
    indices.forEach(i => {
        const seg = document.getElementById('code-' + i);
        if (seg) {
            seg.textContent = codeChars[i];
            seg.classList.add('revealed');
        }
    });
}
// ════════════════════
// RENDER PHASE
// ════════════════════
function renderPhase() {
    const p = phases[phase];
    document.getElementById('phase-title').textContent = p.phaseTitle;
    document.getElementById('story-badge').textContent = p.badge;
    document.getElementById('story-text').innerHTML = p.story;
    document.getElementById('decision-question').textContent = p.question;
    // Decisions
    const grid = document.getElementById('decision-grid');
    grid.innerHTML = '';
    p.decisions.forEach((d, i) => {
        const btn = document.createElement('button');
        btn.className = 'decision-btn';
        btn.innerHTML = `
      <span class="d-icon">${d.icon}</span>
      <div class="d-text">${d.text}</div>
      <div class="d-hint">${d.hint}</div>
      <span class="d-tag">${d.behavior}</span>
    `;
        btn.onclick = () => makeDecision(i, d.tag, d.behavior, btn);
        grid.appendChild(btn);
    });
    // Clues
    updateClues(p.clues);
}
function makeDecision(idx, tag, behavior, btn) {
    document.querySelectorAll('.decision-btn').forEach(b => { b.disabled = true; });
    btn.classList.add('chosen');
    myChoices.push({ phase, tag, behavior });
    roleCodes[tag]++;
    addLog('positive', `تو: ${behavior}`);
    const p = phases[phase];
    revealCodeParts(p.codeReveal);
    setTimeout(() => {
        phase++;
        if (phase < phases.length) {
            renderPhase();
            addLog('', `فاز جدید: ${phases[phase].phaseTitle}`);
        }
        else {
            finishMission(true);
        }
    }, 800);
}
// ════════════════════
// TEAM SIMULATION
// ════════════════════
function scheduleTeamEvents() {
    const events = [
        { time: 3000, fn: () => { document.getElementById('sara-status').innerHTML = '<span class="online-dot"></span>سارا: «کد من A7 است!»'; addLog('positive', 'سارا بخش کدش را فرستاد'); } },
        { time: 6000, fn: () => { document.getElementById('ali-status').innerHTML = '<span class="online-dot"></span>علی: «F5-G9 — مطمئنم»'; addLog('', 'علی بخش کدش را فرستاد'); } },
        { time: 9000, fn: () => { document.getElementById('nazanin-status').innerHTML = '<span class="online-dot"></span>نازنین: «X2-K1 فرستادم»'; addLog('positive', 'نازنین بخش کدش را فرستاد'); } },
        { time: 18000, fn: () => addLog('negative', 'تعارض شناسایی شد در بخش کد') },
        { time: 25000, fn: () => { document.getElementById('ali-status').innerHTML = '<span class="online-dot" style="background:var(--danger)"></span>علی: «اشتباه گرفتم، معذرت...»'; addLog('negative', 'علی خطای خود را تأیید کرد'); } }
    ];
    events.forEach(e => setTimeout(e.fn, e.time));
}
function updateClues(clues) {
    const el = document.getElementById('clues-list');
    el.innerHTML = '';
    clues.forEach(c => {
        const div = document.createElement('div');
        div.className = 'clue-item' + (c.includes('⚠️') ? ' false-clue' : '');
        div.textContent = c;
        el.appendChild(div);
    });
}
function addLog(type, text) {
    const el = document.getElementById('event-log-items');
    const elapsed = 1800 - timeLeft;
    const m = Math.floor(elapsed / 60);
    const s = elapsed % 60;
    const timeStr = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    const div = document.createElement('div');
    div.className = 'log-item ' + type;
    div.innerHTML = `<span class="log-time">${timeStr}</span> ${text}`;
    el.insertBefore(div, el.firstChild);
}
// ════════════════════
// FINISH
// ════════════════════
function finishMission(success) {
    clearInterval(timerInterval);
    missionSuccess = success;
    // Determine dominant role
    const dominant = Object.entries(roleCodes).sort((a, b) => b[1] - a[1])[0][0];
    showResults(dominant, success);
}
function showResults(dominantRole, success) {
    showScreen('screen-result');
    document.getElementById('r-badge').textContent = success ? '🏅' : '🔴';
    document.getElementById('r-outcome-label').textContent = success ? 'ماموریت موفق' : 'پایان وقت';
    document.getElementById('r-outcome-title').textContent = success ? 'شهر ۲۰۵۰ نجات یافت!' : 'زمان به پایان رسید';
    document.getElementById('r-subtitle').textContent = success ? 'تیم شما با موفقیت کد ۱۶ رقمی را بازسازی کرد.' : 'تیم تجربه ارزشمندی کسب کرد.';
    const roles = {
        coordinator: { icon: '🤝', name: 'هماهنگ‌کننده', desc: 'نقش طبیعی شما ایجاد نظم در میان هرج و مرج است. بدون اینکه دیکتاتوری باشید، جریان کار را مدیریت می‌کنید و مطمئن می‌شوید همه در مسیر درست هستند.' },
        leader: { icon: '🦅', name: 'رهبر', desc: 'تصمیم‌گیری سریع و جهت‌دهی به تیم طبیعت ذاتی شماست. در مواقع بحرانی اول شما قدم برمی‌دارید و بقیه را هدایت می‌کنید.' },
        evaluator: { icon: '🔬', name: 'ارزیاب', desc: 'قبل از هر تصمیمی، داده جمع می‌کنید. ذهن شما به دنبال منطق و شواهد است. در تیم نقش «مغز تحلیلگر» را بازی می‌کنید.' },
        implementer: { icon: '⚡', name: 'مجری', desc: 'شما عمل‌گرا هستید. وقتی تصمیم گرفته شد، شما اول اجرا می‌کنید. اطمینان از پیاده‌سازی برنامه وظیفه طبیعی شماست.' }
    };
    const r = roles[dominantRole];
    document.getElementById('r-role-icon').textContent = r.icon;
    document.getElementById('r-role-name').textContent = r.name;
    document.getElementById('r-role-desc').textContent = r.desc;
    // Behavior metrics
    const behaviorData = [
        ['رهبری دموکراتیک', dominantRole === 'coordinator' ? 85 : dominantRole === 'leader' ? 92 : 65],
        ['گوش دادن فعال', dominantRole === 'coordinator' ? 90 : dominantRole === 'evaluator' ? 88 : 72],
        ['مدیریت تعارض', dominantRole === 'evaluator' ? 85 : dominantRole === 'coordinator' ? 78 : 60],
        ['سهم مشارکت', myChoices.length >= 3 ? 80 : 55],
        ['سرعت تصمیم‌گیری', dominantRole === 'leader' ? 95 : 70]
    ];
    const bl = document.getElementById('behavior-list');
    bl.innerHTML = '';
    behaviorData.forEach(([name, val]) => {
        const row = document.createElement('div');
        row.className = 'behavior-row';
        row.innerHTML = `
      <span class="beh-name">${name}</span>
      <div class="beh-bar-wrap"><div class="beh-bar-fill" style="width:${val}%"></div></div>
      <span class="beh-pct">${toPersian(val)}٪</span>
    `;
        bl.appendChild(row);
    });
    setTimeout(() => {
        document.querySelectorAll('.beh-bar-fill').forEach(b => b.style.transform = 'scaleX(1)');
    }, 300);
    // Quotes
    const quotes = {
        coordinator: [
            { text: '«بیایید اطلاعاتمون رو اول روی یک قالب مشترک بنویسیم»', tag: 'تفکر ساختاریافته ✓' },
            { text: '«از نازنین و سارا تشکر می‌کنم که اطلاعاتشون رو سریع فرستادن»', tag: 'روحیه تیمی ✓' }
        ],
        leader: [
            { text: '«من تصمیم می‌گیرم — کد نازنین درسته، ادامه بدیم»', tag: 'رهبری قاطع ✓' },
            { text: '«وقت نداریم — وارد می‌کنم»', tag: 'اقدام سریع ✓' }
        ],
        evaluator: [
            { text: '«بیایید یک آزمایش طراحی کنیم تا بفهمیم کدام کد درسته»', tag: 'تفکر نقادانه ✓' },
            { text: '«منطق کد رو براتون توضیح می‌دم»', tag: 'انتقال دانش ✓' }
        ],
        implementer: [
            { text: '«کدم رو اول می‌فرستم تا کار شروع بشه»', tag: 'ابتکار عمل ✓' },
            { text: '«از نازنین ممنونم — درست گفت»', tag: 'قدردانی از تیم ✓' }
        ]
    };
    const ql = document.getElementById('quotes-list');
    ql.innerHTML = '';
    (quotes[dominantRole] || []).forEach(q => {
        const div = document.createElement('div');
        div.className = 'quote-box';
        div.innerHTML = `<div class="quote-text">${q.text}</div><div class="quote-tag">${q.tag}</div>`;
        ql.appendChild(div);
    });
    // Growth
    const growths = {
        coordinator: `<p>شما در هماهنگ‌کردن تیم و گوش دادن به دیگران قوی هستید. برای آینده، بهتر است گاهی جسورانه‌تر ایده‌های خود را مطرح کنید، حتی اگر مخالف نظر اکثریت باشد.</p>`,
        leader: `<p>رهبری طبیعی شما یک مزیت بزرگ است. با این حال، گاهی صرف چند ثانیه بیشتر برای شنیدن نظرات تیم می‌تواند تصمیم‌های بهتری به دنبال داشته باشد.</p>`,
        evaluator: `<p>تحلیل دقیق شما ارزشمند است. در مواقع بحرانی یاد بگیرید که گاهی «تصمیم خوب سریع» از «تصمیم کامل دیر» بهتر است.</p>`,
        implementer: `<p>انرژی و عمل‌گرایی شما محرک تیم است. روی ارتباط قبل از عمل سرمایه‌گذاری کنید — گاهی یک سوال ساده قبل از شروع، وقت زیادی صرفه‌جویی می‌کند.</p>`
    };
    document.getElementById('growth-text').innerHTML = growths[dominantRole];
    // Major impact
    const majors = {
        coordinator: 'مهارت‌های هماهنگی بالا شما را برای پزشکی، مدیریت و مهندسی صنایع بسیار مناسب می‌کند — حوزه‌هایی که کار تیمی در آن‌ها حیاتی است.',
        leader: 'توانایی رهبری طبیعی شما در مدیریت، حقوق و کارآفرینی یک مزیت استثنایی است.',
        evaluator: 'تفکر تحلیلی شما در علوم دقیق، هوش مصنوعی و پژوهش علمی به اوج می‌رسد.',
        implementer: 'عمل‌گرایی و انرژی شما در مهندسی، معماری و طراحی صنعتی شکوفا خواهد شد.'
    };
    document.getElementById('major-text').textContent = majors[dominantRole];
    // Dashboard
    document.getElementById('d-score').textContent = '—';
    document.getElementById('d-profile').textContent = '—';
    document.getElementById('d-role').textContent = r.name;
    document.getElementById('d-suggest').textContent = majors[dominantRole].split(' ')[0] + '...';
}
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo(0, 0);
}
// ════════ ذخیره نتیجه + پر کردن داشبورد از ماموریت‌های قبلی ════════
(function () {
    const _show = showResults;
    window.showResults = function (dominantRole, success) {
        _show.apply(this, arguments);
        API.saveResult('team', { role: dominantRole, success, choices: myChoices, timeLeft })
            .then(() => API.results())
            .then(({ results }) => {
            const last = m => results.filter(r => r.mission === m).pop();
            const sc = last('scored'), an = last('analytical');
            if (sc)
                document.getElementById('d-score').textContent = toPersian(sc.data.finalScore);
            if (an)
                document.getElementById('d-profile').textContent = an.data.profileTitle;
        }).catch(error => console.error('Could not load mission results:', error));
    };
})();
