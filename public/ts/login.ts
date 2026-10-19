const avatars = ['🧑‍💻','👩‍🔬','👨‍💼','👩‍🎓','🧑‍🚀','🕵️','👨‍🔧','👩‍✈️','🧑‍🎤','👨‍🏫','👩‍⚕️','🧑‍🎨'];
  let selectedAvatar = null;

  const grid = document.getElementById('avatar-grid');
  avatars.forEach(av => {
    const div = document.createElement('div');
    div.className = 'avatar-option';
    div.textContent = av;
    div.onclick = () => selectAvatar(div, av);
    grid.appendChild(div);
  });

  function selectAvatar(el, av) {
    document.querySelectorAll('.avatar-option').forEach(o => o.classList.remove('selected'));
    el.classList.add('selected');
    selectedAvatar = av;
    document.getElementById('preview-avatar').textContent = av;
    document.getElementById('avatar-error').classList.remove('show');
  }

  const firstName = document.getElementById('first-name') as HTMLInputElement;
  const lastName = document.getElementById('last-name') as HTMLInputElement;
  const nickname = document.getElementById('nickname') as HTMLInputElement;

  function updatePreview() {
    const full = `${firstName.value.trim()} ${lastName.value.trim()}`.trim();
    document.getElementById('preview-name').textContent = full || 'نام و نام خانوادگی';
    document.getElementById('preview-nick').textContent = nickname.value.trim() ? '@' + nickname.value.trim() : 'نام مستعار';
  }
  [firstName, lastName, nickname].forEach(inp => inp.addEventListener('input', updatePreview));

  // اگر قبلاً وارد شده، فرم را با اطلاعات ذخیره‌شده پر کن
  API.me().then(({ user }) => {
    firstName.value = user.firstName;
    lastName.value = user.lastName;
    nickname.value = user.nickname;
    const idx = avatars.indexOf(user.avatar);
    if (idx >= 0) selectAvatar(grid.children[idx], user.avatar);
    updatePreview();
  }).catch(() => {});

  function validateField(input, errorId) {
    const errorEl = document.getElementById(errorId);
    if (!input.value.trim()) {
      input.classList.add('error');
      errorEl.classList.add('show');
      return false;
    }
    input.classList.remove('error');
    errorEl.classList.remove('show');
    return true;
  }

  function handleLogin() {
    const validFirst = validateField(firstName, 'first-name-error');
    const validLast = validateField(lastName, 'last-name-error');
    const validNick = validateField(nickname, 'nickname-error');

    const avatarError = document.getElementById('avatar-error');
    let validAvatar = true;
    if (!selectedAvatar) {
      avatarError.classList.add('show');
      validAvatar = false;
    } else {
      avatarError.classList.remove('show');
    }

    if (!validFirst || !validLast || !validNick || !validAvatar) return;

    const profile = {
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
      nickname: nickname.value.trim(),
      avatar: selectedAvatar
    };

    // ذخیره پروفایل در بک‌اند و انتقال به ماموریت بعدی
    const btn = document.getElementById('submit-btn') as HTMLButtonElement;
    btn.disabled = true;
    API.login(profile).then(() => {
      const allowed = ['scored.html', 'analytical.html', 'team.html'];
      const next = new URLSearchParams(location.search).get('next');
      location.href = allowed.includes(next) ? next : 'scored.html';
    }).catch(err => {
      btn.disabled = false;
      alert('ورود ناموفق بود: ' + err.message);
    });
  }
