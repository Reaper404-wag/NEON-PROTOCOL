# 🚀 Пошаговая инструкция загрузки проекта на GitHub

## 📋 Подготовка (выполните сначала)

### 1. Очистка проекта (рекомендуется)
```bash
# Удалите временные файлы
del temp.txt
del fix_particles.js
del AI_PROMPTS.md
del TASKS.md

# Удалите папки IDE (опционально)
rmdir /s /q .vscode
rmdir /s /q .VSCodeCounter
```

### 2. Проверьте .gitignore
Убедитесь, что файл `.gitignore` содержит:
```gitignore
node_modules/
*.log
.env
.vscode/
.idea/
*.tmp
*.temp
```

## 🌐 Создание репозитория на GitHub

### 1. Зайдите на GitHub.com
- Войдите в свой аккаунт
- Нажмите зеленую кнопку **"New"** или **"+"** → **"New repository"**

### 2. Настройте репозиторий
- **Repository name:** `neon-protocol` (или другое название)
- **Description:** `Интенсивная веб-игра выживания в стиле bullet-hell`
- **Public** (чтобы другие могли видеть)
- ❌ **НЕ** ставьте галочки на "Add a README file", "Add .gitignore", "Choose a license"
- Нажмите **"Create repository"**

## 💻 Команды для терминала

### Вариант 1: Если Git еще не инициализирован

```bash
# 1. Инициализируйте Git репозиторий
git init

# 2. Добавьте все файлы
git add .

# 3. Сделайте первый коммит
git commit -m "Initial commit: Neon Protocol game"

# 4. Переименуйте ветку в main (если нужно)
git branch -M main

# 5. Добавьте удаленный репозиторий (ЗАМЕНИТЕ на ваш URL!)
git remote add origin https://github.com/ВАШ_USERNAME/neon-protocol.git

# 6. Загрузите код на GitHub
git push -u origin main
```

### Вариант 2: Если Git уже инициализирован

```bash
# 1. Проверьте статус
git status

# 2. Добавьте все изменения
git add .

# 3. Сделайте коммит
git commit -m "Add game documentation and cleanup project"

# 4. Добавьте удаленный репозиторий (если еще не добавлен)
git remote add origin https://github.com/ВАШ_USERNAME/neon-protocol.git

# 5. Загрузите на GitHub
git push -u origin main
```

## 🔧 Полная последовательность команд (копируйте по порядку)

### Шаг 1: Подготовка
```bash
# Перейдите в папку проекта
cd путь/к/вашему/проекту

# Проверьте содержимое папки
dir
```

### Шаг 2: Git инициализация
```bash
# Инициализация (если еще не сделано)
git init

# Проверьте статус
git status
```

### Шаг 3: Добавление файлов
```bash
# Добавьте все файлы
git add .

# Проверьте что добавилось
git status
```

### Шаг 4: Первый коммит
```bash
# Сделайте коммит
git commit -m "Initial commit: Neon Protocol - cyberpunk survival game"
```

### Шаг 5: Настройка удаленного репозитория
```bash
# Переименуйте ветку в main
git branch -M main

# ВАЖНО: Замените ВАШ_USERNAME на ваш GitHub username!
git remote add origin https://github.com/ВАШ_USERNAME/neon-protocol.git
```

### Шаг 6: Загрузка на GitHub
```bash
# Загрузите код
git push -u origin main
```

## 🔑 Если требуется авторизация

### Вариант 1: Personal Access Token (рекомендуется)
```bash
# При запросе пароля введите ваш Personal Access Token
# Создайте токен: GitHub → Settings → Developer settings → Personal access tokens
```

### Вариант 2: SSH ключ
```bash
# Используйте SSH URL вместо HTTPS
git remote set-url origin git@github.com:ВАШ_USERNAME/neon-protocol.git
```

## 🎯 Пример с реальными данными

Если ваш GitHub username `dean123`, то команды будут:

```bash
git init
git add .
git commit -m "Initial commit: Neon Protocol game"
git branch -M main
git remote add origin https://github.com/dean123/neon-protocol.git
git push -u origin main
```

## 🚨 Возможные ошибки и решения

### Ошибка: "remote origin already exists"
```bash
# Удалите существующий remote и добавьте новый
git remote remove origin
git remote add origin https://github.com/ВАШ_USERNAME/neon-protocol.git
```

### Ошибка: "failed to push some refs"
```bash
# Принудительная загрузка (осторожно!)
git push -f origin main
```

### Ошибка: "Authentication failed"
```bash
# Используйте Personal Access Token вместо пароля
# Или настройте SSH ключи
```

## ✅ Проверка успешной загрузки

1. Откройте ваш репозиторий на GitHub
2. Убедитесь, что все файлы загрузились
3. Проверьте, что README.md отображается корректно
4. Протестируйте игру через GitHub Pages (если настроили)

## 🌐 Настройка GitHub Pages (бонус)

После загрузки кода:

1. Зайдите в **Settings** репозитория
2. Прокрутите до **Pages**
3. В **Source** выберите **Deploy from a branch**
4. Выберите **main** ветку
5. Нажмите **Save**

Ваша игра будет доступна по адресу:
`https://ВАШ_USERNAME.github.io/neon-protocol/`

## 📝 Следующие коммиты

Для будущих обновлений используйте:
```bash
git add .
git commit -m "Описание изменений"
git push
```

---

**Удачи с загрузкой! 🚀**