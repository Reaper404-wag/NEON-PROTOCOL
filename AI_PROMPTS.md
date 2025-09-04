# AI Prompts для генерации игровых ресурсов

## 🎮 **Общие требования для всех промптов:**
- **Стиль:** Футуристический, киберпанк, научная фантастика
- **Цветовая схема:** Неоновые цвета (синий, зеленый, фиолетовый, розовый)
- **Размер:** 256x256 пикселей для спрайтов, 512x512 для фонов
- **Формат:** PNG с прозрачным фоном
- **Детализация:** Средняя, подходящая для 2D игры

---

## 🚀 **Промпты для OpenAI DALL-E/Midjourney:**

### **Игрок (Player):**
```
A futuristic cyberpunk character sprite, full body view, wearing sleek metallic armor with neon blue and green glowing accents, holding a high-tech weapon, standing in a heroic pose, 2D game art style, clean lines, transparent background, 256x256 pixels, sci-fi aesthetic, detailed but not overly complex
```

### **Враги (Enemies):**
```
Futuristic robotic enemy sprite, menacing design, metallic body with red glowing eyes, sharp angular features, aggressive pose, 2D game art, transparent background, 256x256 pixels, sci-fi horror aesthetic, suitable for top-down shooter game
```

### **Оружие (Weapons):**
```
Futuristic energy weapon sprite, glowing blue plasma core, sleek metallic design, sci-fi aesthetic, 2D game art style, transparent background, 128x128 pixels, high-tech appearance, suitable for space shooter game
```

### **Фон уровня (Level Background):**
```
Futuristic space station interior, metallic corridors with neon lighting, sci-fi aesthetic, 2D game background, 512x512 pixels, dark atmosphere with bright neon accents, suitable for top-down shooter game, clean design
```

### **Power-ups:**
```
Futuristic power-up orb, glowing with energy, floating in space, sci-fi aesthetic, 2D game art, transparent background, 64x64 pixels, bright neon colors, magical appearance
```

---

## 🎨 **Промпты для RetroDiffusion (Портреты и иконки):**

### **Портрет игрока:**
```
Portrait of a futuristic cyberpunk warrior, close-up face view, wearing high-tech helmet with glowing visor, determined expression, neon lighting, sci-fi aesthetic, retro-futuristic style, 128x128 pixels, detailed character art
```

### **Иконки способностей:**
```
Futuristic ability icon, glowing energy symbol, sci-fi aesthetic, retro-futuristic style, clean design, 64x64 pixels, neon colors, suitable for game UI, minimalist but recognizable
```

### **Иконки меню:**
```
Futuristic menu icon, sleek design, sci-fi aesthetic, retro-futuristic style, 32x32 pixels, neon colors, clean lines, suitable for game interface, modern appearance
```

---

## 🎭 **Промпты для Itch.io (Спрайты и анимации):**

### **Анимация ходьбы игрока:**
```
4-frame walking animation sprite sheet, futuristic cyberpunk character, side view, walking cycle, neon armor, sci-fi aesthetic, 2D game art, transparent background, 256x256 pixels total, smooth animation frames
```

### **Анимация стрельбы:**
```
3-frame shooting animation sprite sheet, futuristic weapon, energy blast effect, sci-fi aesthetic, 2D game art, transparent background, 128x128 pixels total, dynamic action frames
```

### **Анимация взрыва:**
```
6-frame explosion animation sprite sheet, energy blast, particle effects, sci-fi aesthetic, 2D game art, transparent background, 256x256 pixels total, dramatic explosion sequence
```

---

## 🔧 **Как использовать эти промпты:**

### **Для OpenAI DALL-E:**
1. Скопируйте нужный промпт
2. Вставьте в DALL-E
3. Выберите размер 256x256 или 512x512
4. Генерируйте несколько вариантов
5. Выберите лучший результат

### **Для Midjourney:**
1. Скопируйте промпт
2. Добавьте в начало `/imagine`
3. Добавьте в конец `--ar 1:1 --v 6`
4. Генерируйте и выбирайте лучший

### **Для RetroDiffusion:**
1. Используйте промпты для портретов и иконок
2. Выберите ретро-футуристический стиль
3. Настройте размер под ваши нужды

---

## 📁 **Структура папок для ресурсов:**

```
assets/
├── sprites/
│   ├── player/
│   ├── enemies/
│   ├── weapons/
│   └── powerups/
├── backgrounds/
├── ui/
│   ├── icons/
│   └── portraits/
└── animations/
    ├── player/
    ├── effects/
    └── enemies/
```

---

## 💡 **Советы по генерации:**

1. **Генерируйте несколько вариантов** каждого ресурса
2. **Сохраняйте все варианты** - они могут пригодиться позже
3. **Используйте единый стиль** для всех ресурсов
4. **Тестируйте в игре** - не все красивые картинки подходят для игр
5. **Оптимизируйте размеры** - большие файлы замедляют игру

---

## 🎯 **Приоритеты генерации:**

### **Высокий приоритет (сначала):**
- Игрок (Player)
- Основные враги (2-3 типа)
- Базовое оружие
- Фон уровня

### **Средний приоритет:**
- Power-ups
- Эффекты (взрывы, частицы)
- UI элементы

### **Низкий приоритет:**
- Дополнительные враги
- Специальные эффекты
- Детали интерфейса
