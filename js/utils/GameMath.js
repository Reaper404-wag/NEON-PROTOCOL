/**
 * GameMath.js - Математические утилиты для игры
 */

class GameMath {
    /**
     * Конвертирует градусы в радианы
     */
    static degToRad(degrees) {
        return degrees * (Math.PI / 180);
    }

    /**
     * Конвертирует радианы в градусы
     */
    static radToDeg(radians) {
        return radians * (180 / Math.PI);
    }

    /**
     * Вычисляет расстояние между двумя точками
     */
    static distance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Вычисляет угол между двумя точками в радианах
     */
    static angleBetween(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    }

    /**
     * Вычисляет угол между двумя точками в градусах
     */
    static angleBetweenDeg(x1, y1, x2, y2) {
        return this.radToDeg(this.angleBetween(x1, y1, x2, y2));
    }

    /**
     * Нормализует угол в диапазон 0-360 градусов
     */
    static normalizeAngle(angle) {
        while (angle < 0) angle += 360;
        while (angle >= 360) angle -= 360;
        return angle;
    }

    /**
     * Вычисляет точку на окружности по углу и радиусу
     */
    static pointOnCircle(centerX, centerY, radius, angle) {
        return {
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle)
        };
    }

    /**
     * Случайное число в диапазоне
     */
    static random(min, max) {
        return Math.random() * (max - min) + min;
    }

    /**
     * Случайное целое число в диапазоне
     */
    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Случайный элемент из массива
     */
    static randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    /**
     * Линейная интерполяция между двумя значениями
     */
    static lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    /**
     * Ограничивает значение в заданном диапазоне
     */
    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    /**
     * Проверяет, находится ли точка внутри прямоугольника
     */
    static pointInRect(x, y, rectX, rectY, rectWidth, rectHeight) {
        return x >= rectX && x <= rectX + rectWidth && 
               y >= rectY && y <= rectY + rectHeight;
    }

    /**
     * Проверяет, находится ли точка внутри круга
     */
    static pointInCircle(x, y, centerX, centerY, radius) {
        const distance = this.distance(x, y, centerX, centerY);
        return distance <= radius;
    }

    /**
     * Проверяет пересечение двух прямоугольников
     */
    static rectIntersects(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    /**
     * Проверяет пересечение двух кругов
     */
    static circleIntersects(x1, y1, r1, x2, y2, r2) {
        const distance = this.distance(x1, y1, x2, y2);
        return distance <= r1 + r2;
    }

    /**
     * Вычисляет направление движения (вектор)
     */
    static getDirectionVector(angle, speed = 1) {
        return {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed
        };
    }

    /**
     * Вычисляет скорость объекта по компонентам
     */
    static getSpeed(vx, vy) {
        return Math.sqrt(vx * vx + vy * vy);
    }

    /**
     * Нормализует вектор скорости
     */
    static normalizeVector(vx, vy) {
        const speed = this.getSpeed(vx, vy);
        if (speed === 0) return { x: 0, y: 0 };
        return { x: vx / speed, y: vy / speed };
    }

    /**
     * Вычисляет точку пересечения двух линий
     */
    static lineIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
        const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (den === 0) return null; // Линии параллельны

        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
        const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return {
                x: x1 + t * (x2 - x1),
                y: y1 + t * (y2 - y1)
            };
        }
        return null;
    }

    /**
     * Вычисляет площадь треугольника по координатам
     */
    static triangleArea(x1, y1, x2, y2, x3, y3) {
        return Math.abs((x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1)) / 2;
    }

    /**
     * Проверяет, находится ли точка внутри треугольника
     */
    static pointInTriangle(px, py, x1, y1, x2, y2, x3, y3) {
        const area = this.triangleArea(x1, y1, x2, y2, x3, y3);
        const area1 = this.triangleArea(px, py, x2, y2, x3, y3);
        const area2 = this.triangleArea(x1, y1, px, py, x3, y3);
        const area3 = this.triangleArea(x1, y1, x2, y2, px, py);
        
        return Math.abs(area - (area1 + area2 + area3)) < 0.001;
    }

    /**
     * Вычисляет факториал
     */
    static factorial(n) {
        if (n <= 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    /**
     * Вычисляет биномиальный коэффициент
     */
    static binomial(n, k) {
        if (k > n) return 0;
        if (k === 0 || k === n) return 1;
        return this.factorial(n) / (this.factorial(k) * this.factorial(n - k));
    }

    /**
     * Генерирует случайную точку внутри прямоугольника
     */
    static randomPointInRect(rectX, rectY, rectWidth, rectHeight) {
        return {
            x: this.random(rectX, rectX + rectWidth),
            y: this.random(rectY, rectY + rectHeight)
        };
    }

    /**
     * Генерирует случайную точку внутри круга
     */
    static randomPointInCircle(centerX, centerY, radius) {
        const angle = this.random(0, Math.PI * 2);
        const r = Math.sqrt(this.random(0, 1)) * radius;
        return {
            x: centerX + r * Math.cos(angle),
            y: centerY + r * Math.sin(angle)
        };
    }

    /**
     * Вычисляет процентное соотношение
     */
    static percentage(value, total) {
        return total === 0 ? 0 : (value / total) * 100;
    }

    /**
     * Вычисляет процент от числа
     */
    static percentOf(percent, total) {
        return (percent / 100) * total;
    }

    /**
     * Форматирует число с разделителями тысяч
     */
    static formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    /**
     * Форматирует время в формате MM:SS
     */
    static formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    /**
     * Форматирует время в формате HH:MM:SS
     */
    static formatTimeLong(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
}

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameMath;
}
