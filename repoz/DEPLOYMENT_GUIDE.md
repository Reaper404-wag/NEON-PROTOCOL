# Руководство по развертыванию Future Survivors

## 🚀 Варианты развертывания

### 1. GitHub Pages (Рекомендуется)

#### Автоматическое развертывание
```bash
# 1. Создайте репозиторий на GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/future-survivors.git
git push -u origin main

# 2. В настройках репозитория включите GitHub Pages
# Settings → Pages → Source: Deploy from a branch → main
```

#### Ручное развертывание
```bash
# Создание отдельной ветки для GitHub Pages
git checkout --orphan gh-pages
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
```

**URL игры:** `https://yourusername.github.io/future-survivors/`

### 2. Netlify

#### Через Git интеграцию
1. Зарегистрируйтесь на [Netlify](https://netlify.com)
2. Подключите GitHub репозиторий
3. Настройки сборки:
   ```
   Build command: (оставить пустым)
   Publish directory: /
   ```

#### Через Drag & Drop
```bash
# Создайте архив проекта
zip -r future-survivors.zip . -x "node_modules/*" ".git/*"
# Загрузите на netlify.com/drop
```

### 3. Vercel

```bash
# Установите Vercel CLI
npm i -g vercel

# Развертывание
vercel

# Следуйте инструкциям в терминале
```

### 4. Firebase Hosting

```bash
# Установите Firebase CLI
npm install -g firebase-tools

# Инициализация
firebase login
firebase init hosting

# Настройки:
# Public directory: .
# Single-page app: No
# Overwrite index.html: No

# Развертывание
firebase deploy
```

### 5. Surge.sh

```bash
# Установите Surge
npm install -g surge

# Развертывание
surge .

# Выберите домен или используйте предложенный
```

## 🔧 Настройка для production

### 1. Оптимизация файлов

#### Минификация JavaScript (опционально)
```bash
# Установите UglifyJS
npm install -g uglify-js

# Минифицируйте файлы
find js -name "*.js" -exec uglify-js {} -o {}.min \;
```

#### Оптимизация изображений
```bash
# Установите imagemin
npm install -g imagemin-cli

# Оптимизируйте изображения
imagemin image/*.png --out-dir=image/optimized
```

### 2. Настройка кэширования

#### .htaccess для Apache
```apache
# Создайте файл .htaccess
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>
```

#### netlify.toml для Netlify
```toml
[[headers]]
  for = "*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[headers]]
  for = "*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[headers]]
  for = "*.png"
  [headers.values]
    Cache-Control = "public, max-age=31536000"
```

### 3. Content Security Policy

#### Добавьте в index.html
```html
<meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data:;
    connect-src 'self';
">
```

## 🌐 Настройка домена

### Пользовательский домен для GitHub Pages
```bash
# Создайте файл CNAME в корне проекта
echo "yourdomain.com" > CNAME
git add CNAME
git commit -m "Add custom domain"
git push
```

### DNS настройки
```
# A записи для apex домена
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153

# CNAME для поддомена
www.yourdomain.com → yourusername.github.io
```

## 📱 PWA настройка

### 1. Создайте manifest.json
```json
{
  "name": "Future Survivors",
  "short_name": "FutureSurvivors",
  "description": "Футуристическая игра выживания",
  "start_url": "/",
  "display": "fullscreen",
  "background_color": "#000011",
  "theme_color": "#00ff00",
  "icons": [
    {
      "src": "icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 2. Добавьте в index.html
```html
<link rel="manifest" href="manifest.json">
<meta name="theme-color" content="#00ff00">
```

### 3. Service Worker (sw.js)
```javascript
const CACHE_NAME = 'future-survivors-v1';
const urlsToCache = [
  '/',
  '/js/main.js',
  '/js/config/gameConfig.js',
  '/css/style.css',
  'https://cdn.jsdelivr.net/npm/phaser@3.70.0/dist/phaser.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

## 🔍 SEO оптимизация

### Meta теги
```html
<!-- Добавьте в index.html -->
<meta name="description" content="Future Survivors - футуристическая веб-игра выживания в стиле Vampire Survivors">
<meta name="keywords" content="игра, выживание, javascript, phaser, веб-игра">
<meta name="author" content="Ваше имя">

<!-- Open Graph -->
<meta property="og:title" content="Future Survivors">
<meta property="og:description" content="Футуристическая игра выживания">
<meta property="og:image" content="https://yourdomain.com/preview.png">
<meta property="og:url" content="https://yourdomain.com">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Future Survivors">
<meta name="twitter:description" content="Футуристическая игра выживания">
<meta name="twitter:image" content="https://yourdomain.com/preview.png">
```

### robots.txt
```
User-agent: *
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml
```

### sitemap.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourdomain.com/</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

## 📊 Аналитика

### Google Analytics
```html
<!-- Добавьте перед </head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Игровая аналитика
```javascript
// Добавьте в игровой код
class GameAnalytics {
  static trackEvent(action, category = 'Game') {
    if (typeof gtag !== 'undefined') {
      gtag('event', action, {
        event_category: category,
        event_label: 'Future Survivors'
      });
    }
  }
  
  static trackGameStart() {
    this.trackEvent('game_start');
  }
  
  static trackGameOver(score) {
    this.trackEvent('game_over', 'Game', score);
  }
}
```

## 🚨 Мониторинг ошибок

### Sentry интеграция
```html
<script src="https://browser.sentry-cdn.com/7.0.0/bundle.min.js"></script>
<script>
  Sentry.init({
    dsn: 'YOUR_SENTRY_DSN',
    environment: 'production'
  });
</script>
```

## ✅ Чек-лист развертывания

### Перед развертыванием:
- [ ] Замените все placeholder данные
- [ ] Проверьте работоспособность на localhost
- [ ] Оптимизируйте изображения
- [ ] Настройте кэширование
- [ ] Добавьте мета-теги для SEO
- [ ] Настройте аналитику
- [ ] Проверьте на разных устройствах

### После развертывания:
- [ ] Проверьте загрузку всех ресурсов
- [ ] Протестируйте на мобильных устройствах
- [ ] Проверьте скорость загрузки
- [ ] Убедитесь в работе аналитики
- [ ] Проверьте SEO с помощью инструментов Google

## 🔗 Полезные ссылки

- [GitHub Pages документация](https://docs.github.com/en/pages)
- [Netlify документация](https://docs.netlify.com/)
- [Vercel документация](https://vercel.com/docs)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)
- [PWA руководство](https://web.dev/progressive-web-apps/)
- [Web Performance](https://web.dev/performance/)

---

**Успешного развертывания! 🚀**