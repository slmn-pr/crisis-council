# بک‌اند شورای بحران ۲۰۵۰

## اجرا
    node server.js          # نیاز به Node 18+، بدون npm install
    # http://localhost:3000

متغیرهای محیطی: `PORT` (پیش‌فرض ۳۰۰۰) و `ADMIN_KEY` (حتماً قبل از انتشار عوض کنید).

## ساختار
    server.js        سرور + API + سرو فایل‌های استاتیک
    data/db.json     ذخیره کاربران و نتایج (خودکار ساخته می‌شود)
    public/          index.html، js/api.js و پوشه pages (login, scored, analytical, team)

## مسیر کاربر
index → login → scored → analytical → team → index
(صفحات ماموریت اگر کاربر وارد نشده باشد خودکار به login می‌روند و بعد از ورود برمی‌گردند)

## API
| متد | مسیر | توضیح |
|---|---|---|
| POST | /api/login | ساخت/ویرایش پروفایل (firstName, lastName, nickname, avatar) و ست شدن کوکی نشست |
| GET | /api/me | کاربر فعلی (۴۰۱ اگر وارد نشده) |
| POST | /api/logout | خروج |
| POST | /api/results | ذخیره نتیجه `{mission: scored|analytical|team, data}` |
| GET | /api/results | نتایج کاربر فعلی |
| GET | /api/leaderboard | ۲۰ امتیاز برتر ماموریت امتیازی |
| GET | /api/admin/users?key=ADMIN_KEY | همه کاربران و نتایجشان |
