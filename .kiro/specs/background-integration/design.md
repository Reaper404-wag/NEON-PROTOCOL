# Design Document

## Overview

Система интеграции фонового изображения в игру Future Survivors с камерой dead zone, увеличенной картой и надежными барьерами. Дизайн включает систему плавного следования камеры, масштабирование карты под размер фона и создание невидимых барьеров для предотвращения выхода в космос.

## Architecture

### Camera System
- **CameraManager**: Управляет камерой с dead zone функциональностью
- **DeadZoneController**: Контролирует зону нечувствительности камеры

### Background System
- **BackgroundManager**: Управляет загрузкой и отображением увеличенного фона
- **MapScaler**: Масштабирует карту под размер фонового изображения

### Boundary System
- **BoundarySystem**: Создает невидимые барьеры по границам станции
- **SpaceBoundary**: Предотвращает выход персонажа в космос

### Integration Points
- **PreloadScene**: Загрузка фонового изображения и определение размеров карты
- **GameScene**: Интеграция камеры, фона и барьеров
- **Player**: Взаимодействие с системами камеры и границ

## Components and Interfaces

### CameraManager
```javascript
class CameraManager {
    constructor(scene, deadZoneWidth, deadZoneHeight)
    setupDeadZone(centerX, centerY)
    updateCamera(playerX, playerY)
    isInDeadZone(playerX, playerY)
    smoothFollow(targetX, targetY, speed)
}
```

### BackgroundManager
```javascript
class BackgroundManager {
    constructor(scene)
    loadBackground(key, path)
    createBackground(x, y, scale)
    getBackgroundDimensions()
    scaleToFitWorld(worldWidth, worldHeight)
}
```

### BoundarySystem
```javascript
class BoundarySystem {
    constructor(scene, worldBounds)
    createSpaceBoundaries(backgroundWidth, backgroundHeight)
    createStationBoundaries(stationAreas)
    checkPlayerBounds(player)
    constrainToStation(x, y)
}
```

### MapScaler
```javascript
class MapScaler {
    constructor(backgroundWidth, backgroundHeight)
    calculateWorldBounds()
    getScaledDimensions()
    convertScreenToWorld(screenX, screenY)
}
```

## Data Models

### Camera Configuration
```javascript
const CameraConfig = {
    deadZone: {
        width: 200,
        height: 150,
        centerX: 400,
        centerY: 300
    },
    followSpeed: 0.05,
    smoothing: true,
    bounds: {
        minX: 0,
        minY: 0,
        maxX: 2048,
        maxY: 1536
    }
}
```

### Background Configuration
```javascript
const BackgroundConfig = {
    key: 'background',
    path: 'image/bg.png',
    scale: 1.0,
    autoScale: true,
    worldBounds: {
        width: 2048,  // увеличенный размер
        height: 1536,
        margin: 100
    }
}
```

### Boundary Data
```javascript
const BoundaryData = {
    worldBounds: {
        left: 100,
        right: 1948,
        top: 100,
        bottom: 1436
    },
    spaceBoundaries: [
        // Области космоса, куда нельзя попасть
        { type: 'space', x: 0, y: 0, width: 100, height: 1536 },
        { type: 'space', x: 1948, y: 0, width: 100, height: 1536 }
    ],
    stationAreas: [
        // Безопасные области станции
        { type: 'station', x: 100, y: 100, width: 1848, height: 1336 }
    ]
}
```

## Error Handling

### Camera System Errors
- Валидация параметров dead zone
- Обработка некорректных координат камеры
- Восстановление камеры при сбоях следования

### Background Loading Errors
- Fallback к цветному фону при ошибке загрузки
- Автоматическое масштабирование при неизвестных размерах
- Логирование ошибок загрузки ресурсов

### Boundary System Errors
- Валидация координат персонажа перед перемещением
- Мягкое отталкивание от барьеров вместо жесткой остановки
- Восстановление позиции при попадании в космос
- Обработка некорректных данных границ станции

## Testing Strategy

### Unit Tests
- Тестирование BackgroundManager
- Проверка BoundarySystem
- Валидация координат и коллизий

### Integration Tests
- Взаимодействие фона с игровой сценой
- Интеграция границ с движением персонажа
- Проверка производительности отрисовки

### Visual Tests
- Корректность отображения фона
- Плавность движения персонажа
- Визуальная обратная связь на границах

## Implementation Details

### Background Analysis
1. Анализ размеров и содержимого bg.png
2. Определение оптимального масштабирования
3. Выявление визуальных границ на изображении
4. Планирование размещения коллизий

### Boundary Creation
1. Создание невидимых стен по краям карты
2. Анализ фона для специфических барьеров
3. Настройка физических коллизий
4. Интеграция с системой движения персонажа

### Test Structure
```
tests/
├── index.html (тестовая страница)
├── test-config.js (конфигурация тестов)
├── background-test.js (тесты фона)
├── boundary-test.js (тесты границ)
└── integration-test.js (интеграционные тесты)
```