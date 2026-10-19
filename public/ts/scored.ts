// ════════════════════════════════
// DATA
// ════════════════════════════════
const rooms = [
  {
    id: 'logic',
    emoji: '🧮',
    name: 'اتاق منطق',
    field: 'استدلال منطقی-ریاضی',
    relatedMajor: 'ریاضی · کامپیوتر',
    questions: [
      {
        context: 'سیستم رمزگذاری لیزری شهر را باید رمزگشایی کنی',
        q: 'دنباله زیر را کامل کن: ۲، ۶، ۱۸، ۵۴، __',
        opts: ['۱۰۸', '۱۶۲', '۷۲', '۲۱۶'],
        correct: 1,
        explain: 'هر عدد ۳ برابر عدد قبلی است. ۵۴ × ۳ = ۱۶۲'
      },
      {
        context: 'پازل دیجیتال دروازه منطقی',
        q: 'اگر A=3 و B=5 باشد، مقدار (A² + B²) - AB چقدر است؟',
        opts: ['۱۹', '۲۳', '۱۷', '۲۵'],
        correct: 0,
        explain: '9 + 25 - 15 = 19'
      },
      {
        context: 'رمز دروازه نهایی منطق',
        q: 'در یک سودوکو ۳×۳، خانه‌ها اعداد ۱ تا ۹ هستند. اگر ردیف اول [۱، ۵، ۹] و ستون اول [۱، ۴، ۷] باشد، خانه وسط کدام عدد است؟',
        opts: ['۲', '۵', '۸', '۶'],
        correct: 1,
        explain: 'خانه وسط در هر دو ردیف دوم و ستون دوم قرار دارد و باید عدد ۵ باشد.'
      }
    ]
  },
  {
    id: 'bio',
    emoji: '🧪',
    name: 'اتاق بایو',
    field: 'تفکر علمی-استقرایی',
    relatedMajor: 'تجربی · پزشکی',
    questions: [
      {
        context: 'آزمایشگاه بحران بیولوژیکی شهر',
        q: 'برای ساخت پادزهر نیاز به ترکیب ماده‌ای با pH=۸ داری. کدام ماده مناسب است؟',
        opts: ['اسید کلریدریک', 'آب خالص', 'محلول بی‌کربنات سدیم', 'سرکه'],
        correct: 2,
        explain: 'بی‌کربنات سدیم (جوش شیرین) یک ماده قلیایی است با pH بالاتر از 7.'
      },
      {
        context: 'میکروسکوپ اورژانسی',
        q: 'کدام بخش از سلول مسئول تولید انرژی (ATP) است؟',
        opts: ['هسته', 'میتوکندری', 'ریبوزوم', 'دیواره سلولی'],
        correct: 1,
        explain: 'میتوکندری "نیروگاه سلول" نام دارد و ATP تولید می‌کند.'
      },
      {
        context: 'آزمایش ترکیب پادزهر نهایی',
        q: 'اگر یک موجود ۴۶ کروموزوم داشته باشد و میوز کامل شود، هر سلول جنسی چند کروموزوم دارد؟',
        opts: ['۲۳', '۴۶', '۹۲', '۱۲'],
        correct: 0,
        explain: 'در میوز تعداد کروموزوم‌ها نصف می‌شود: ۴۶ ÷ ۲ = ۲۳'
      }
    ]
  },
  {
    id: 'market',
    emoji: '📈',
    name: 'اتاق بازار',
    field: 'هوش اقتصادی و عددی',
    relatedMajor: 'انسانی · مدیریت',
    questions: [
      {
        context: 'شرکت تأمین انرژی شهر در بحران است',
        q: 'اگر شرکتی ۲۰٪ سود کند و بعد ۲۰٪ ضرر، نسبت به سرمایه اولیه چه وضعی دارد؟',
        opts: ['دقیقاً همان مقدار', '۴٪ کمتر', '۴٪ بیشتر', '۲٪ کمتر'],
        correct: 1,
        explain: 'اگر سرمایه ۱۰۰ باشد: ۱۰۰×۱.۲=۱۲۰ سپس ۱۲۰×۰.۸=۹۶. یعنی ۴٪ ضرر.'
      },
      {
        context: 'برنامه‌ریزی بحران اقتصادی',
        q: 'کدام تصمیم در بحران بهتر است؟',
        opts: [
          'کاهش فوری همه هزینه‌ها',
          'سرمایه‌گذاری در بخش‌های حیاتی با حفظ نقدینگی',
          'فروش دارایی‌های اصلی',
          'توقف فعالیت تا رفع بحران'
        ],
        correct: 1,
        explain: 'مدیریت بحران موفق معمولاً شامل حفظ نقدینگی و سرمایه‌گذاری هدفمند است.'
      },
      {
        context: 'بازار مجازی شهر ۲۰۵۰',
        q: 'اگر تورم ۱۰٪ و بهره بانکی ۷٪ باشد، سپرده‌گذاری در بانک:',
        opts: ['سود واقعی دارد', 'زیان واقعی دارد', 'خنثی است', 'بستگی به مدت دارد'],
        correct: 1,
        explain: 'نرخ بهره واقعی = ۷٪ - ۱۰٪ = منفی ۳٪، یعنی قدرت خرید کاهش می‌یابد.'
      }
    ]
  },
  {
    id: 'art',
    emoji: '🎨',
    name: 'اتاق آتلیه',
    field: 'خلاقیت و زیبایی‌شناسی',
    relatedMajor: 'هنر · معماری',
    questions: [
      {
        context: 'اثر هنری هولوگرافیک شهر آسیب دیده',
        q: 'کدام ترکیب رنگ برای ایجاد حس آرامش و اعتماد بهترین است؟',
        opts: ['قرمز و زرد', 'آبی و سبز', 'بنفش و نارنجی', 'سیاه و سفید'],
        correct: 1,
        explain: 'آبی و سبز در روانشناسی رنگ با آرامش، طبیعت و اعتماد مرتبط هستند.'
      },
      {
        context: 'بازسازی فراکتال دیجیتال',
        q: 'در طراحی معماری، قانون «نسبت طلایی» (φ ≈ 1.618) عمدتاً برای چه استفاده می‌شود؟',
        opts: [
          'انتخاب مواد ساختمانی',
          'ایجاد تناسبات زیباشناختی دلپذیر',
          'محاسبه مقاومت سازه',
          'برآورد هزینه'
        ],
        correct: 1,
        explain: 'نسبت طلایی در تناسبات بصری و معماری برای ایجاد حس زیبایی و هارمونی به کار می‌رود.'
      },
      {
        context: 'رمزگشایی هنری آخرین اتاق',
        q: 'در هنر انتزاعی، کدام هنرمند با استفاده از خطوط هندسی ساده (مربع، مستطیل) معروف است؟',
        opts: ['پیکاسو', 'داوینچی', 'موندریان', 'وارهول'],
        correct: 2,
        explain: 'پیت موندریان با گرید‌های مستطیلی و رنگ‌های اولیه از نمادهای هنر انتزاعی هندسی است.'
      }
    ]
  },
  {
    id: 'command',
    emoji: '🎖',
    name: 'اتاق فرماندهی',
    field: 'تصمیم‌گیری و رهبری',
    relatedMajor: 'مدیریت · عمومی',
    questions: [
      {
        context: 'بحران همزمان در ۳ نقطه شهر',
        q: 'بیمارستان، مدرسه و تأسیسات آب همزمان در خطرند و فقط یک تیم داری. اولویت اول:',
        opts: ['تأسیسات آب', 'بیمارستان', 'مدرسه', 'همه به یک اندازه مهم'],
        correct: 1,
        explain: 'بیمارستان اولویت دارد چون بیماران بدون دارو و امکانات، بی‌واسطه جانشان در خطر است.'
      },
      {
        context: 'تیم ناهماهنگ در بحران',
        q: 'دو عضو تیم اختلاف نظر دارند و زمان کم است. بهترین اقدام:',
        opts: [
          'صبر کن تا خودشان حل کنند',
          'نظر یکی را بدون بحث تحمیل کن',
          'سریع گوش بده، تصمیم بگیر، ادامه بده',
          'آن‌ها را از ماموریت کنار بگذار'
        ],
        correct: 2,
        explain: 'رهبر خوب در بحران سریع می‌شنود، قاطع تصمیم می‌گیرد و تیم را حرکت می‌دهد.'
      },
      {
        context: 'گزارش به ستاد مرکزی',
        q: 'بعد از بحران، اولین کار رهبر باید چه باشد؟',
        opts: [
          'جشن گرفتن موفقیت',
          'بررسی چه اشتباهی رخ داد',
          'برنامه‌ریزی عملیات بعدی',
          'استراحت'
        ],
        correct: 1,
        explain: 'یادگیری از هر ماموریت با «ارزیابی پس از عملیات» یکی از اصول رهبری موثر است.'
      }
    ]
  },
  {
    id: 'workshop',
    emoji: '🔧',
    name: 'اتاق کارگاه',
    field: 'هوش فضایی-مکانیکی',
    relatedMajor: 'فنی · مهندسی',
    questions: [
      {
        context: 'پهپاد امدادی نیاز به مونتاژ دارد',
        q: 'برای افزایش سرعت پهپاد بدون افزایش وزن، بهترین راه:',
        opts: [
          'اضافه کردن موتور بزرگتر',
          'کاهش مقاومت هوا با تغییر شکل بدنه',
          'اضافه کردن باتری بیشتر',
          'کاهش ارتفاع پرواز'
        ],
        correct: 1,
        explain: 'آیرودینامیک بهتر (شکل بدنه) مقاومت هوا را کاهش داده و سرعت را با همان وزن افزایش می‌دهد.'
      },
      {
        context: 'اتصال مدار برق پهپاد',
        q: 'در مدار موازی، اگر یک مقاومت قطع شود:',
        opts: [
          'کل مدار قطع می‌شود',
          'بقیه مقاومت‌ها به کار خود ادامه می‌دهند',
          'ولتاژ کاهش می‌یابد',
          'جریان در همه مقاومت‌ها صفر می‌شود'
        ],
        correct: 1,
        explain: 'در مدار موازی، هر شاخه مستقل است. قطع یک شاخه تأثیری بر بقیه ندارد.'
      },
      {
        context: 'بررسی مکانیکی موتور',
        q: 'اگر دنده A دارای ۲۰ دندانه و دنده B دارای ۴۰ دندانه باشد و A با ۱۰۰ دور بچرخد، B چند دور می‌چرخد؟',
        opts: ['۲۰۰', '۵۰', '۱۰۰', '۲۵'],
        correct: 1,
        explain: 'نسبت دنده: ۲۰/۴۰ = ۰.۵. بنابراین ۱۰۰ × ۰.۵ = ۵۰ دور.'
      }
    ]
  },
  {
    id: 'comm',
    emoji: '🗣',
    name: 'اتاق ارتباطات',
    field: 'هوش کلامی-میان‌فردی',
    relatedMajor: 'انسانی · حقوق',
    questions: [
      {
        context: 'ربات نگهبان ورودی منطقه را مسدود کرده',
        q: 'ربات می‌گوید «اثبات کن ماموریتت مشروع است». بهترین پاسخ:',
        opts: [
          'دستور می‌دهم کنار بروی!',
          'ماموریت محرمانه است، نمی‌توانم بگویم.',
          'مدارک رسمی را نشان می‌دهم و توضیح می‌دهم که نجات شهر وظیفه مشترک ماست.',
          'تهدید می‌کنم که خاموشش می‌کنم.'
        ],
        correct: 2,
        explain: 'متقاعدسازی مؤثر ترکیبی از شواهد (مدرک) و ارزش مشترک (هدف مشترک) است.'
      },
      {
        context: 'ارسال پیام رمزی به ستاد',
        q: 'کدام جمله «اثر متقاعدکنندگی» بیشتری دارد؟',
        opts: [
          'شاید بهتر باشد این کار را بکنیم.',
          'داده‌ها نشان می‌دهند این روش ۴۰٪ موثرتر است.',
          'می‌گویند این روش خوب است.',
          'احساس می‌کنم این درست است.'
        ],
        correct: 1,
        explain: 'شواهد آماری مشخص (۴۰٪) اعتبار ادعا را به طور چشمگیری افزایش می‌دهد.'
      },
      {
        context: 'مذاکره با ربات مرکزی',
        q: 'در مذاکره، «گوش دادن فعال» یعنی:',
        opts: [
          'صبر کردن تا طرف مقابل حرفش تمام شود',
          'خلاصه کردن آنچه شنیدی و تأیید درستی فهمت',
          'یادداشت برداری از تمام کلمات',
          'سریع‌تر حرف زدن'
        ],
        correct: 1,
        explain: 'گوش دادن فعال شامل立 پاسخ تأییدی، خلاصه‌سازی و نشان دادن درک است.'
      }
    ]
  },
  {
    id: 'puzzle',
    emoji: '🧩',
    name: 'اتاق معما',
    field: 'خلاقیت سیال و حل مسئله',
    relatedMajor: 'نخبگانی · عمومی',
    questions: [
      {
        context: 'اتاق فرار انتزاعی — بدون راهنمایی',
        q: 'یک کشاورز باید گرگ، بز و کلم را با قایق از رودخانه رد کند. قایق فقط یکی را حمل می‌کند. کدام ترتیب درست است؟',
        opts: [
          'ابتدا گرگ، سپس بز، سپس کلم',
          'ابتدا بز، سپس کلم، برگشت با کلم، سپس گرگ، سپس بز',
          'ابتدا کلم، سپس گرگ، سپس بز',
          'همزمان ممکن نیست'
        ],
        correct: 1,
        explain: 'راه حل کلاسیک: ابتدا بز، سپس کلم و برگشت با بز، سپس گرگ، سپس بز.'
      },
      {
        context: 'معمای اتاق ۷',
        q: 'اگر ۵ ماشین در ۵ دقیقه ۵ قطعه بسازند، ۱۰۰ ماشین در ۱۰۰ دقیقه چند قطعه می‌سازند؟',
        opts: ['۱۰۰', '۵۰۰', '۱۰۰۰', '۱۰۰۰۰'],
        correct: 2,
        explain: 'هر ماشین ۱ قطعه در ۵ دقیقه می‌سازد. ۱۰۰ ماشین × (۱۰۰÷۵) دقیقه = ۱۰۰ × ۲۰ = ۲۰۰۰... اما درست‌تر: هر ماشین در ۱۰۰ دقیقه ۲۰ قطعه، پس ۱۰۰ ماشین = ۱۰۰۰ قطعه.'
      },
      {
        context: 'پازل نهایی اتاق معما',
        q: 'چه چیزی همیشه پیش روی توست اما هرگز دیده نمی‌شود؟',
        opts: ['آینده', 'هوا', 'سایه', 'لبه صفحه'],
        correct: 0,
        explain: 'آینده همیشه «جلوی» ماست اما هرگز به‌صورت مستقیم قابل مشاهده نیست.'
      }
    ]
  }
];

// ════════════════════════════════
// STATE
// ════════════════════════════════
let roomScores = {};
let currentRoom = null;
let currentQIndex = 0;
let roomTimer = null;
let roomTimeLeft = 180;
let roomCorrect = 0;
let questionAnswered = false;

// ════════════════════════════════
// SCREEN MANAGEMENT
// ════════════════════════════════
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (id === 'screen-rooms') renderRooms();
  window.scrollTo(0,0);
}

// ════════════════════════════════
// RENDER ROOMS
// ════════════════════════════════
function renderRooms() {
  const list = document.getElementById('rooms-list');
  const prog = document.getElementById('progress-line');
  list.innerHTML = '';
  prog.innerHTML = '';
  let doneCount = 0;

  rooms.forEach((r, i) => {
    const done = roomScores[r.id] !== undefined;
    if (done) doneCount++;
    const card = document.createElement('div');
    card.className = 'room-btn' + (done ? ' done' : '');
    card.innerHTML = `
      ${done ? '<div class="done-badge">✓</div>' : ''}
      <span class="emoji">${r.emoji}</span>
      <div class="rname">${r.name}</div>
      ${done ? `<div class="rscore">${toPersian(roomScores[r.id])}</div>` : '<div class="rscore" style="color:var(--muted)">——</div>'}
      <div class="rfield">${r.relatedMajor}</div>
    `;
    if (!done) card.onclick = () => startRoom(r.id);
    list.appendChild(card);

    const seg = document.createElement('div');
    seg.className = 'prog-seg' + (done ? ' done' : '');
    prog.appendChild(seg);
  });

  const finBtn = document.getElementById('finish-all-btn');
  if (doneCount === rooms.length) finBtn.style.display = 'inline-flex';
  else finBtn.style.display = 'none';
}

// ════════════════════════════════
// START ROOM
// ════════════════════════════════
function startRoom(roomId) {
  currentRoom = rooms.find(r => r.id === roomId);
  currentQIndex = 0;
  roomCorrect = 0;
  roomTimeLeft = 180;

  document.getElementById('game-room-name').textContent = currentRoom.name;
  document.getElementById('game-room-field').textContent = currentRoom.field;

  showScreen('screen-game');
  loadQuestion();
  startTimer();
}

function loadQuestion() {
  const q = currentRoom.questions[currentQIndex];
  questionAnswered = false;

  document.getElementById('q-current').textContent = toPersian(currentQIndex + 1);
  document.getElementById('q-total').textContent = toPersian(currentRoom.questions.length);

  document.getElementById('game-question').innerHTML = `
    <span class="context-line">📡 ${q.context}</span>
    ${q.q}
  `;

  const grid = document.getElementById('options-grid');
  grid.innerHTML = '';
  q.opts.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'opt-btn';
    btn.textContent = opt;
    btn.onclick = () => checkAnswer(i, q.correct, q.explain, btn);
    grid.appendChild(btn);
  });

  document.getElementById('game-feedback').className = 'game-feedback';
  document.getElementById('game-feedback').textContent = '';
  document.getElementById('next-btn').className = 'next-btn';
}

function checkAnswer(selected, correct, explain, btn) {
  if (questionAnswered) return;
  questionAnswered = true;

  const grid = document.getElementById('options-grid');
  const btns = grid.querySelectorAll<HTMLButtonElement>('.opt-btn');
  btns.forEach(b => { b.disabled = true; });

  const fb = document.getElementById('game-feedback');

  if (selected === correct) {
    btn.classList.add('correct');
    btns[correct].classList.add('correct');
    fb.className = 'game-feedback correct-fb show';
    fb.innerHTML = `✅ <strong>درست!</strong> ${explain}`;
    roomCorrect++;
  } else {
    btn.classList.add('wrong');
    btns[correct].classList.add('correct');
    fb.className = 'game-feedback wrong-fb show';
    fb.innerHTML = `❌ <strong>نادرست.</strong> ${explain}`;
  }

  document.getElementById('next-btn').className = 'next-btn show';
  if (currentQIndex >= currentRoom.questions.length - 1) {
    document.getElementById('next-btn').textContent = 'ثبت امتیاز ✓';
  }
}

function nextQuestion() {
  currentQIndex++;
  if (currentQIndex >= currentRoom.questions.length) {
    finishRoom();
  } else {
    loadQuestion();
  }
}

// ════════════════════════════════
// TIMER
// ════════════════════════════════
function startTimer() {
  clearInterval(roomTimer);
  roomTimeLeft = 180;
  updateTimerDisplay();
  roomTimer = setInterval(() => {
    roomTimeLeft--;
    updateTimerDisplay();
    if (roomTimeLeft <= 0) {
      clearInterval(roomTimer);
      finishRoom();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const m = Math.floor(roomTimeLeft / 60);
  const s = roomTimeLeft % 60;
  const str = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  const box = document.getElementById('game-timer-box');
  document.getElementById('game-timer-display').textContent = str;
  box.textContent = str;
  if (roomTimeLeft <= 30) box.classList.add('danger');
  else box.classList.remove('danger');
}

function finishRoom() {
  clearInterval(roomTimer);
  // Score: accuracy × time bonus
  const accuracy = roomCorrect / currentRoom.questions.length;
  const timeBonus = Math.max(0, roomTimeLeft / 180);
  const score = Math.round((accuracy * 80 + timeBonus * 20) * 1.25);
  roomScores[currentRoom.id] = Math.min(100, score);
  showScreen('screen-rooms');
}

// ════════════════════════════════
// SHOW RESULTS
// ════════════════════════════════
function showResults() {
  showScreen('screen-results');

  const skillEmojis = { logic:'🧮', bio:'🧪', market:'📈', art:'🎨', command:'🎖', workshop:'🔧', comm:'🗣', puzzle:'🧩' };
  const skillNames = { logic:'منطق', bio:'علوم', market:'اقتصاد', art:'خلاقیت', command:'رهبری', workshop:'فنی', comm:'ارتباطات', puzzle:'حل مسئله' };

  let total = 0;
  const list = document.getElementById('skills-list');
  list.innerHTML = '';

  rooms.forEach(r => {
    const s = roomScores[r.id] || 0;
    total += s;
    const row = document.createElement('div');
    row.className = 'skill-row';
    row.innerHTML = `
      <span class="skill-emoji">${skillEmojis[r.id]}</span>
      <span class="skill-name">${skillNames[r.id]}</span>
      <div class="skill-bar-wrap"><div class="skill-bar-fill" style="width:${s}%"></div></div>
      <span class="skill-pct">${toPersian(s)}٪</span>
    `;
    list.appendChild(row);
  });

  const finalScore = Math.round(total * 1.25);
  document.getElementById('final-score').textContent = toPersian(finalScore);

  // Rank simulation
  const rank = Math.max(1, Math.round(10000 - finalScore * 85));
  document.getElementById('final-rank').textContent = `رتبه تخمینی: ${toPersian(rank)} از ۱۰۰,۰۰۰ شرکت‌کننده`;

  // Animate bars
  setTimeout(() => {
    document.querySelectorAll<HTMLElement>('.skill-bar-fill').forEach(b => {
      b.style.transform = 'scaleX(1)';
    });
  }, 300);

  // Suggestions based on top skills
  const sorted = rooms.map(r => ({ id: r.id, name: skillNames[r.id], score: roomScores[r.id] || 0, major: r.relatedMajor }))
                       .sort((a,b) => b.score - a.score);

  const majors = {
    logic: { title: 'ریاضی-فیزیک (گرایش کامپیوتر)', reason: 'استدلال منطقی و سرعت محاسبه' },
    bio: { title: 'علوم تجربی / پزشکی', reason: 'تفکر علمی و استقرایی' },
    market: { title: 'علوم انسانی / مدیریت', reason: 'هوش اقتصادی و تحلیل' },
    art: { title: 'هنر / معماری', reason: 'خلاقیت و زیبایی‌شناسی' },
    command: { title: 'مدیریت / علوم سیاسی', reason: 'رهبری و تصمیم‌گیری' },
    workshop: { title: 'مهندسی برق / مکانیک', reason: 'هوش فضایی و مکانیکی' },
    comm: { title: 'حقوق / روان‌شناسی', reason: 'هوش کلامی و ارتباطی' },
    puzzle: { title: 'ریاضی / علوم پایه', reason: 'حل مسئله و تفکر انتزاعی' }
  };

  const sugList = document.getElementById('suggestions-list');
  sugList.innerHTML = '';
  [sorted[0], sorted[1], sorted[sorted.length-1]].forEach((item, i) => {
    const m = majors[item.id];
    const div = document.createElement('div');
    div.className = 'suggest-item ' + ['best','second','risky'][i];
    const icons = ['✅','🔁','⚠️'];
    const labels = ['بهترین انتخاب','انتخاب دوم','انتخاب با ریسک'];
    div.innerHTML = `
      <span style="font-size:1.5rem">${icons[i]}</span>
      <div class="suggest-pct">${toPersian(item.score)}٪</div>
      <div class="suggest-info">
        <h4>${labels[i]}: ${m.title}</h4>
        <p>دلیل: ${m.reason}</p>
      </div>
    `;
    sugList.appendChild(div);
  });
}

// ════════════════════════════════
// HELPERS
// ════════════════════════════════
function toPersian(n) {
  return String(n).replace(/\d/g, c => '۰۱۲۳۴۵۶۷۸۹'[c]);
}

// Init
renderRooms();

// ════════ ذخیره نتیجه در بک‌اند ════════
(function () {
  const _show = showResults;
  window.showResults = function () {
    _show.apply(this, arguments);
    const total = rooms.reduce((a, r) => a + (roomScores[r.id] || 0), 0);
    API.saveResult('scored', { roomScores: { ...roomScores }, finalScore: Math.round(total * 1.25) })
      .catch(() => {});
  };
})();
