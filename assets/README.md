# Папка ресурсов (Assets)

Эта папка содержит все игровые ресурсы: изображения, звуки, музыку и другие медиафайлы.

## 📁 Структура папок

```
assets/
├── images/          # Изображения и спрайты
├── sounds/          # Звуковые эффекты
├── music/           # Музыкальные треки
├── fonts/           # Шрифты (если нужны)
└── data/            # Данные (JSON, XML и т.д.)
```

## 🖼️ Изображения (images/)

### Требования к изображениям
- **Формат**: PNG (для прозрачности) или JPG
- **Размер**: Оптимизированный для веба
- **Разрешение**: Поддерживайте различные DPI

### Рекомендуемые размеры
- **Игрок**: 32x32, 64x64
- **Враги**: 24x24, 32x32, 48x48
- **Снаряды**: 8x8, 16x16
- **Усиления**: 16x16, 32x32
- **UI элементы**: 64x64, 128x128
- **Фоны**: 1280x720, 1920x1080

### Названия файлов
Используйте понятные названия:
- `player.png` - спрайт игрока
- `enemy_basic.png` - базовый враг
- `enemy_fast.png` - быстрый враг
- `enemy_tank.png` - танк враг
- `projectile_basic.png` - базовый снаряд
- `powerup_health.png` - усиление здоровья
- `background_space.png` - космический фон

## 🔊 Звуки (sounds/)

### Требования к звукам
- **Формат**: MP3, OGG, WAV
- **Качество**: 44.1kHz, 16-bit
- **Размер**: Оптимизированный для веба

### Типы звуков
- **Выстрелы**: `fire_laser.mp3`, `fire_plasma.mp3`
- **Взрывы**: `explosion_small.mp3`, `explosion_large.mp3`
- **Урон**: `player_hit.mp3`, `enemy_hit.mp3`
- **Усиления**: `powerup_collect.mp3`, `powerup_activate.mp3`
- **UI**: `button_click.mp3`, `menu_select.mp3`

## 🎵 Музыка (music/)

### Требования к музыке
- **Формат**: MP3, OGG
- **Битрейт**: 128-192 kbps
- **Длительность**: 1-3 минуты для зацикливания

### Типы музыки
- `main_theme.mp3` - главная тема
- `battle_music.mp3` - боевая музыка
- `menu_music.mp3` - музыка меню
- `boss_music.mp3` - музыка босса

## 🎨 Создание ресурсов

### Генерация изображений
Используйте нейросети для создания футуристических изображений:

1. **Midjourney**: Для фонов и концепт-арта
2. **DALL-E**: Для спрайтов и UI элементов
3. **Stable Diffusion**: Для текстуры и деталей

### Промпты для нейросетей

#### Игрок
```
futuristic sci-fi character, pixel art style, 32x32, green glowing armor, laser weapon, top-down view
```

#### Враги
```
futuristic robot enemy, pixel art style, 32x32, red glowing eyes, mechanical design, top-down view
```

#### Фоны
```
futuristic space station interior, sci-fi environment, 1280x720, neon lights, metallic surfaces, game background
```

#### Снаряды
```
futuristic laser projectile, pixel art style, 16x16, green energy beam, glowing effect, top-down view
```

## 🔧 Оптимизация

### Изображения
- Сжимайте PNG файлы
- Используйте WebP для современных браузеров
- Создайте спрайтшиты для похожих объектов

### Звуки
- Сжимайте аудиофайлы
- Используйте OGG для лучшего сжатия
- Создайте короткие звуки для эффектов

### Музыка
- Оптимизируйте битрейт
- Создайте seamless loops
- Используйте fade in/out для плавных переходов

## 📱 Адаптивность

### Различные разрешения
Создайте ресурсы для разных размеров экрана:
- `@1x` - базовое разрешение
- `@2x` - для Retina дисплеев
- `@3x` - для устройств с высоким DPI

### Мобильная версия
- Уменьшенные спрайты для мобильных устройств
- Оптимизированные звуки
- Адаптивные UI элементы

## 🚀 Загрузка ресурсов

### В коде игры
```javascript
// Загрузка изображения
this.load.image('player', 'assets/images/player.png');

// Загрузка звука
this.load.audio('fire', 'assets/sounds/fire_laser.mp3');

// Загрузка музыки
this.load.audio('main_theme', 'assets/music/main_theme.mp3');
```

### Спрайтшиты
```javascript
// Загрузка спрайтшита
this.load.spritesheet('player', 'assets/images/player_sheet.png', {
    frameWidth: 32,
    frameHeight: 32
});
```

## 📋 Чек-лист

- [ ] Все изображения оптимизированы
- [ ] Звуки имеют правильный формат
- [ ] Музыка зацикливается корректно
- [ ] Ресурсы загружаются без ошибок
- [ ] Размер файлов приемлемый
- [ ] Названия файлов понятные
- [ ] Поддержка различных разрешений

## 💡 Советы

1. **Начните с простых ресурсов** - создайте базовые спрайты и звуки
2. **Используйте нейросети** - для генерации уникального контента
3. **Тестируйте производительность** - следите за размером файлов
4. **Создавайте вариации** - разные цвета и стили для разнообразия
5. **Документируйте** - ведите список всех ресурсов

## 🔗 Полезные ссылки

- [Phaser Asset Loading](https://photonstorm.github.io/phaser3-docs/Phaser.Loader.LoaderPlugin.html)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Image Optimization](https://web.dev/fast/#optimize-your-images)
- [Audio Compression](https://web.dev/fast/#optimize-your-audio)
