// ════════════════
// SCENARIOS DATA
// ════════════════
const scenarios = [
  {
    id: 'logic',
    badge: 'ZONE_01 · LOGIC_CHAMBER',
    emoji: '🧮',
    title: 'در قلب پردازنده‌ها',
    story: 'تو وارد اتاق منطق می‌شوی. یک پازل رمزی روی نمایشگر کوانتومی نمایش داده می‌شود. سیستم منتظر ورودی است. سه مسیر پیش رو داری.',
    question: 'برای حل این رمز چه رویکردی انتخاب می‌کنی؟',
    paths: [
      { label: 'مسیر A', text: 'شروع با فرمول ریاضی مشخص و حل منطقی گام به گام', hint: 'دقیق، ساختارمند، بدون ریسک', tag: 'analytical', need: 'power' },
      { label: 'مسیر B', text: 'آزمایش چندین روش مختلف تا پیدا کردن جواب', hint: 'اکتشافی، خلاق، آزادانه', tag: 'exploratory', need: 'freedom' },
      { label: 'مسیر C', text: 'درخواست سرنخ از ربات همکار و کار مشارکتی', hint: 'تیمی، مشارکتی، اجتماعی', tag: 'social', need: 'love' }
    ]
  },
  {
    id: 'bio',
    badge: 'ZONE_02 · BIO_LAB',
    emoji: '🧪',
    title: 'آزمایشگاه بحران',
    story: 'در آزمایشگاه بایو، یک پادزهر پیچیده باید تولید شود. چندین ماده موجود است اما فقط ترکیب درستی نجات‌بخش خواهد بود. خطای آزمایشگر قبلی منجر به آلودگی شده.',
    question: 'رویکرد اصلی تو برای حل این بحران آزمایشگاهی چیست؟',
    paths: [
      { label: 'مسیر A', text: 'مطالعه دقیق دستورالعمل‌ها و پروتکل استاندارد قبل از شروع', hint: 'منظم، دقیق، کم‌خطا', tag: 'analytical', need: 'survival' },
      { label: 'مسیر B', text: 'شروع آزمایش بلافاصله — از خطاها یاد می‌گیرم', hint: 'جسور، تجربی، ریسک‌پذیر', tag: 'exploratory', need: 'freedom' },
      { label: 'مسیر C', text: 'رهبری تیم برای تقسیم کار و حل گروهی', hint: 'رهبری، تیم‌محور، سازمان‌دهی', tag: 'social', need: 'power' }
    ]
  },
  {
    id: 'market',
    badge: 'ZONE_03 · MARKET_CRISIS',
    emoji: '📈',
    title: 'اتاق اقتصاد بحران‌زده',
    story: 'شرکت تأمین انرژی شهر ورشکسته شده. تو مدیرعامل موقت هستی. ۱۰ حرکت داری تا آن را نجات دهی. نمودارها قرمزند. کارمندان نگرانند.',
    question: 'اولین تصمیم تو به عنوان مدیر بحران چیست؟',
    paths: [
      { label: 'مسیر A', text: 'تحلیل کامل داده‌های مالی و شناسایی ریشه بحران پیش از هر اقدامی', hint: 'تحلیلگر، داده‌محور، سنجیده', tag: 'analytical', need: 'power' },
      { label: 'مسیر B', text: 'اجرای سریع چند تصمیم جسورانه برای معکوس کردن روند', hint: 'قاطع، ریسک‌پذیر، نتیجه‌محور', tag: 'exploratory', need: 'freedom' },
      { label: 'مسیر C', text: 'برگزاری جلسه با تیم برای شنیدن ایده‌های همه', hint: 'مشارکتی، دموکراتیک، انسان‌محور', tag: 'social', need: 'love' }
    ]
  },
  {
    id: 'command',
    badge: 'ZONE_04 · COMMAND_CENTER',
    emoji: '🎖',
    title: 'مرکز فرماندهی بحران',
    story: 'یک بحران همزمان در ۳ نقطه شهر. منابع محدودند. تیمت منتظر تصمیم تو هستند. ثانیه‌ها می‌گذرند.',
    question: 'سبک تصمیم‌گیری تو در این لحظه چیست؟',
    paths: [
      { label: 'مسیر A', text: 'جمع‌آوری حداکثر اطلاعات قبل از هر دستوری', hint: 'احتیاطی، سیستماتیک', tag: 'analytical', need: 'survival' },
      { label: 'مسیر B', text: 'اعتماد به شهود و تصمیم سریع با اطلاعات موجود', hint: 'غریزی، قاطع، شجاع', tag: 'exploratory', need: 'power' },
      { label: 'مسیر C', text: 'مشورت سریع با اعضای ارشد تیم و تصمیم مشارکتی', hint: 'تیم‌محور، اجماع‌ساز', tag: 'social', need: 'love' }
    ]
  },
  {
    id: 'puzzle',
    badge: 'ZONE_05 · ENIGMA_ROOM',
    emoji: '🧩',
    title: 'اتاق معمای انتزاعی',
    story: 'تو با یک اتاق کاملاً بدون راهنمایی روبرو هستی. هیچ دستورالعملی نیست. هیچ راهنمایی نیست. فقط تو و معما.',
    question: 'اولین واکنش تو به این ابهام کامل چیست؟',
    paths: [
      { label: 'مسیر A', text: 'تلاش برای پیدا کردن قانون و الگوی پنهان', hint: 'منطقی، جستجوگر ساختار', tag: 'analytical', need: 'power' },
      { label: 'مسیر B', text: 'لذت بردن از ابهام و کشف آزادانه بدون هدف مشخص', hint: 'بازیگوش، خلاق، لذت‌جو', tag: 'exploratory', need: 'fun' },
      { label: 'مسیر C', text: 'احساس ناراحتی از نبود راهنما و جستجوی کمک', hint: 'ساختارمحور، نیاز به پشتیبانی', tag: 'analytical', need: 'survival' }
    ]
  }
];

// ════════════════
// STATE
// ════════════════
let currentSc = 0;
let choices = []; // [{need, tag}]

// ════════════════
// SCREEN
// ════════════════
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0,0);
}

// ════════════════
// SCENARIO RENDER
// ════════════════
function renderScenario() {
  const sc = scenarios[currentSc];

  document.getElementById('sc-num').textContent = toPersian(currentSc + 1);
  document.getElementById('sc-total').textContent = toPersian(scenarios.length);
  document.getElementById('sc-title').textContent = sc.title;
  document.getElementById('sc-field').textContent = `منطقه ${toPersian(currentSc+1)} از ${toPersian(scenarios.length)}`;
  document.getElementById('scene-badge').textContent = sc.badge;
  document.getElementById('scene-emoji').textContent = sc.emoji;
  document.getElementById('scene-title').textContent = sc.title;
  document.getElementById('scene-story').textContent = sc.story;
  document.getElementById('scene-question').textContent = sc.question;

  // Progress dots
  const dotsEl = document.getElementById('progress-dots');
  dotsEl.innerHTML = '';
  scenarios.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'dot ' + (i < currentSc ? 'done' : i === currentSc ? 'current' : '');
    dotsEl.appendChild(d);
  });

  // Paths
  const container = document.getElementById('paths-container');
  container.innerHTML = '';
  const tagLabels = { analytical: 'تحلیلی', exploratory: 'اکتشافی', social: 'مشارکتی' };
  const tagClasses = { analytical: 'tag-analytical', exploratory: 'tag-exploratory', social: 'tag-social' };

  sc.paths.forEach((path, i) => {
    const btn = document.createElement('button');
    btn.className = 'path-btn';
    btn.innerHTML = `
      <div class="path-label">${path.label}</div>
      <div class="path-text">${path.text}</div>
      <div class="path-hint">${path.hint}</div>
      <span class="thinking-tag ${tagClasses[path.tag]}">${tagLabels[path.tag]}</span>
    `;
    btn.onclick = () => selectPath(i, path.need, path.tag, btn);
    container.appendChild(btn);
  });
}

function selectPath(idx, need, tag, btn) {
  document.querySelectorAll('.path-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');

  setTimeout(() => {
    choices.push({ need, tag, sc: currentSc });
    currentSc++;
    if (currentSc < scenarios.length) {
      renderScenario();
    } else {
      showResults();
    }
  }, 400);
}

// ════════════════
// RESULTS
// ════════════════
function showResults() {
  showScreen('screen-result');

  // Count needs
  const needCounts = { power:0, freedom:0, love:0, fun:0, survival:0 };
  const tagCounts = { analytical:0, exploratory:0, social:0 };
  choices.forEach(c => {
    needCounts[c.need]++;
    tagCounts[c.tag]++;
  });

  const dominant = Object.entries(needCounts).sort((a,b)=>b[1]-a[1])[0][0];
  const dominantTag = Object.entries(tagCounts).sort((a,b)=>b[1]-a[1])[0][0];

  // Profile mapping
  const profiles = {
    power: { icon:'🦅', title:'رهبر تحلیلگر', type:'Analytical Leader', desc:'شما به رقابت، موفقیت و تسلط بر محیط نیاز دارید. بهترین عملکردتان زمانی است که هدف مشخص و معیار موفقیت واضح باشد. در محیط‌های رقابتی می‌درخشید.' },
    freedom: { icon:'🦋', title:'کاشف مستقل', type:'Independent Explorer', desc:'شما به آزادی انتخاب و استقلال نیاز بالایی دارید. از قالب‌های از پیش تعریف‌شده فرار می‌کنید. در محیط‌های انعطاف‌پذیر خلاق‌ترین هستید.' },
    love: { icon:'🤝', title:'هماهنگ‌کننده اجتماعی', type:'Social Coordinator', desc:'روابط انسانی و احساس تعلق به گروه برای شما حیاتی است. در کار تیمی به اوج می‌رسید و نقش چسب گروه را دارید.' },
    fun: { icon:'🎯', title:'اکتشاف‌گر خلاق', type:'Creative Explorer', desc:'کنجکاوی و لذت یادگیری از مهمترین انگیزه‌های شماست. از حل معماها و کشف موضوعات جدید انرژی می‌گیرید.' },
    survival: { icon:'🏗', title:'معمار ثبات', type:'Structure Builder', desc:'ساختار و قابل‌پیش‌بینی بودن محیط برای شما مهم است. دقیق، قابل اعتماد و منظم هستید. در محیط‌های سازمان‌یافته بهترین عملکرد را دارید.' }
  };

  const p = profiles[dominant];
  document.getElementById('r-icon').textContent = p.icon;
  document.getElementById('r-title').textContent = p.title;
  document.getElementById('r-type').textContent = p.type;
  document.getElementById('r-desc').textContent = p.desc;

  // Competencies
  const compData = {
    power: [['استدلال منطقی',9],['قاطعیت',8],['رقابت',9],['تمرکز بر هدف',8]],
    freedom: [['خلاقیت',9],['انعطاف‌پذیری',8],['ریسک‌پذیری',8],['نوآوری',9]],
    love: [['گوش دادن فعال',9],['همکاری',9],['همدلی',8],['حل تعارض',7]],
    fun: [['کنجکاوی',9],['یادگیری سریع',8],['حل خلاقانه',9],['سیال بودن',8]],
    survival: [['دقت',9],['قابل‌اعتماد بودن',9],['برنامه‌ریزی',8],['ثبات',8]]
  };

  const comps = compData[dominant];
  const compEl = document.getElementById('comp-list');
  compEl.innerHTML = '';
  comps.forEach(([name, val]) => {
    const row = document.createElement('div');
    row.className = 'comp-item';
    let dots = '';
    for(let i=0;i<10;i++) dots += `<div class="comp-dot-meter ${i<val?'filled':''}"></div>`;
    row.innerHTML = `<span class="comp-name">${name}</span><div class="comp-meter">${dots}</div>`;
    compEl.appendChild(row);
  });

  // Thinking style
  const thinkingEl = document.getElementById('thinking-list');
  thinkingEl.innerHTML = '';
  const styles = { analytical:'تفکر تحلیلی', exploratory:'تفکر اکتشافی', social:'تفکر مشارکتی' };
  Object.entries(tagCounts).forEach(([tag, count]) => {
    const pct = Math.round(count / choices.length * 100);
    const row = document.createElement('div');
    row.className = 'comp-item';
    let dots = '';
    for(let i=0;i<10;i++) dots += `<div class="comp-dot-meter ${i<Math.round(pct/10)?'filled':''}"></div>`;
    row.innerHTML = `<span class="comp-name">${styles[tag]}</span><div class="comp-meter">${dots}</div>`;
    thinkingEl.appendChild(row);
  });

  // Needs bars
  const needsEl = document.getElementById('needs-list');
  needsEl.innerHTML = '';
  const needLabels = { power:'قدرت', freedom:'آزادی', love:'تعلق', fun:'تفریح', survival:'امنیت' };
  const needColors = { power:'var(--cyan)', freedom:'var(--purple-light)', love:'#FF9F43', fun:'#2ECC71', survival:'#74B9FF' };

  Object.entries(needCounts).forEach(([need, count]) => {
    const pct = Math.round(count / choices.length * 100);
    const row = document.createElement('div');
    row.className = 'need-bar-row';
    row.innerHTML = `
      <span class="need-name">${needLabels[need]}</span>
      <div class="need-bar-wrap"><div class="need-bar-fill" style="width:${pct}%; background: linear-gradient(to left, ${needColors[need]}, ${needColors[need]}88);"></div></div>
      <span class="need-level">${toPersian(pct)}٪</span>
    `;
    needsEl.appendChild(row);
  });

  setTimeout(() => {
    document.querySelectorAll<HTMLElement>('.need-bar-fill').forEach(b => b.style.transform = 'scaleX(1)');
  }, 300);

  // Insight
  const insightData = {
    power: `<p>شما از حل مسائل پیچیده به تنهایی لذت می‌برید و نیاز بالایی به استقلال دارید. بهترین عملکرد شما زمانی است که اختیار کامل داشته باشید.</p><p>توصیه می‌شود روی مهارت‌های ارتباطی و همکاری کار کنید، زیرا حتی در مشاغل فنی، توانایی انتقال ایده‌ها حیاتی است.</p>`,
    freedom: `<p>شما ذاتاً یک نوآور هستید. قالب‌های ثابت را دوست ندارید و در محیط‌هایی که آزادی عمل دارید شکوفا می‌شوید.</p><p>توجه کنید که گاهی ساختار و برنامه‌ریزی می‌تواند خلاقیت را تقویت کند نه محدود کند. یادگیری مدیریت زمان برای شما مفید خواهد بود.</p>`,
    love: `<p>شما در محیط‌های گروهی بهترین عملکردتان را دارید. توانایی بالایی در ایجاد هماهنگی و ارتباط موثر دارید.</p><p>برای توسعه، گاهی تصمیم‌گیری مستقل را تمرین کنید. اتکا به گروه نباید مانع شکوفایی فردی شما شود.</p>`,
    fun: `<p>کنجکاوی ذاتی شما یک مزیت رقابتی بزرگ است. یادگیری سریع و دیدن زوایای جدید از ویژگی‌های اصلی شماست.</p><p>در حوزه‌ای که واقعاً علاقه دارید پیشرفت شما استثنایی خواهد بود. کافی است بتوانید روی یک حوزه تمرکز کنید.</p>`,
    survival: `<p>دقت، نظم و قابل‌اعتماد بودن از ارزشمندترین ویژگی‌های شماست. در هر تیمی ستون محکمی هستید.</p><p>توصیه می‌شود گاهی با ریسک‌های کوچک راحت‌تر کنار بیایید. نوآوری نیاز به تحمل عدم قطعیت دارد.</p>`
  };
  document.getElementById('insight-text').innerHTML = insightData[dominant];

  // Suggestions
  const suggestData = {
    power: [
      { pct:'۹۱٪', cls:'s-best', label:'بهترین انتخاب', title:'ریاضی-فیزیک / علوم کامپیوتر', reason:'استدلال بالا، نیاز به قدرت و پیشرفت مداوم' },
      { pct:'۸۵٪', cls:'s-second', label:'انتخاب دوم', title:'مهندسی برق / مهندسی کامپیوتر', reason:'محیط رقابتی، چالش‌های فنی مداوم' },
      { pct:'۵۵٪', cls:'s-warn', label:'با احتیاط', title:'علوم پزشکی', reason:'نیاز بالا به کار تیمی و ارتباطات' }
    ],
    freedom: [
      { pct:'۸۸٪', cls:'s-best', label:'بهترین انتخاب', title:'معماری / طراحی صنعتی', reason:'خلاقیت و آزادی بیان در بالاترین سطح' },
      { pct:'۸۳٪', cls:'s-second', label:'انتخاب دوم', title:'هنر / ادبیات', reason:'فضای اکتشافی و ابتکاری' },
      { pct:'۵۰٪', cls:'s-warn', label:'با احتیاط', title:'مهندسی صنایع', reason:'نیاز به ساختار و پروتکل ثابت' }
    ],
    love: [
      { pct:'۹۲٪', cls:'s-best', label:'بهترین انتخاب', title:'پزشکی / پرستاری', reason:'ارتباط انسانی عمیق، کار تیمی دائمی' },
      { pct:'۸۷٪', cls:'s-second', label:'انتخاب دوم', title:'مدیریت / روان‌شناسی', reason:'رهبری تیمی و توسعه منابع انسانی' },
      { pct:'۵۸٪', cls:'s-warn', label:'با احتیاط', title:'فیزیک نظری', reason:'کار عمدتاً فردی و منزوی' }
    ],
    fun: [
      { pct:'۸۹٪', cls:'s-best', label:'بهترین انتخاب', title:'علوم پایه / تحقیق', reason:'کنجکاوی دائمی، کشف موضوعات جدید' },
      { pct:'۸۴٪', cls:'s-second', label:'انتخاب دوم', title:'هوش مصنوعی / علوم داده', reason:'حوزه‌ای پویا با چالش‌های متنوع' },
      { pct:'۵۲٪', cls:'s-warn', label:'با احتیاط', title:'حسابداری', reason:'تکراری و کم‌تنوع برای این شخصیت' }
    ],
    survival: [
      { pct:'۸۶٪', cls:'s-best', label:'بهترین انتخاب', title:'مهندسی عمران / برق', reason:'ساختارمند، دارای پروتکل دقیق و قابل‌اعتماد' },
      { pct:'۸۱٪', cls:'s-second', label:'انتخاب دوم', title:'حقوق / قضاوت', reason:'نیاز به دقت، ساختار و قانون‌مداری' },
      { pct:'۴۸٪', cls:'s-warn', label:'با احتیاط', title:'کارآفرینی / استارتاپ', reason:'نیاز به تحمل بالای ابهام و عدم قطعیت' }
    ]
  };

  const sl = document.getElementById('suggest-list');
  sl.innerHTML = '';
  (suggestData[dominant] || []).forEach(s => {
    const div = document.createElement('div');
    div.className = `suggest-row ${s.cls}`;
    div.innerHTML = `
      <div class="suggest-pct">${s.pct}</div>
      <div class="suggest-text">
        <h4>${s.label}: ${s.title}</h4>
        <p>${s.reason}</p>
      </div>
    `;
    sl.appendChild(div);
  });
}

function toPersian(n) {
  return String(n).replace(/\d/g, c => '۰۱۲۳۴۵۶۷۸۹'[c]);
}

// init
renderScenario();

// ════════ ذخیره نتیجه در بک‌اند ════════
(function () {
  const _show = showResults;
  window.showResults = function () {
    _show.apply(this, arguments);
    const needCounts = { power:0, freedom:0, love:0, fun:0, survival:0 };
    const tagCounts = { analytical:0, exploratory:0, social:0 };
    choices.forEach(c => { needCounts[c.need]++; tagCounts[c.tag]++; });
    const dominantNeed = Object.entries(needCounts).sort((a, b) => b[1] - a[1])[0][0];
    const dominantTag = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])[0][0];
    API.saveResult('analytical', {
      needCounts, tagCounts, dominantNeed, dominantTag,
      profileTitle: document.getElementById('r-title').textContent
    }).catch(() => {});
  };
})();
