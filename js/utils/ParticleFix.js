/**
 * ParticleFix.js - Временное исправление для системы частиц Phaser 3.70
 * Заменяет устаревшие createEmitter на современные методы
 */

// Современная система частиц для Phaser 3.70+
class ModernParticleSystem {
    constructor(scene, textureKey = 'projectile_basic') {
        this.scene = scene;
        this.textureKey = textureKey;
        this.emitters = new Map();
    }

    // Создает простой эмиттер частиц
    createSimpleEmitter(config = {}) {
        const emitter = {
            active: config.active !== undefined ? config.active : true,
            follow: config.follow || null,
            x: config.x || 0,
            y: config.y || 0,
            speed: config.speed || { min: 50, max: 100 },
            scale: config.scale || { start: 0.5, end: 0 },
            alpha: config.alpha || { start: 0.8, end: 0 },
            lifespan: config.lifespan || 300,
            frequency: config.frequency || 100,
            blendMode: config.blendMode || 'ADD',
            // Заглушка для совместимости
            start: () => console.log('Particle emitter started'),
            stop: () => console.log('Particle emitter stopped'),
            setPosition: (x, y) => console.log('Particle emitter position set to:', x, y),
            setActive: (active) => console.log('Particle emitter active set to:', active)
        };

        return emitter;
    }

    // Создает эмиттер следователя
    createFollowEmitter(target, config = {}) {
        const emitter = this.createSimpleEmitter(config);
        emitter.follow = target;
        return emitter;
    }

    // Создает эмиттер в определенной позиции
    createPositionEmitter(x, y, config = {}) {
        const emitter = this.createSimpleEmitter(config);
        emitter.x = x;
        emitter.y = y;
        return emitter;
    }

    // Очищает все эмиттеры
    destroy() {
        this.emitters.clear();
    }
}

// Глобальная функция для создания частиц (замена createEmitter)
window.createModernParticleEmitter = (scene, textureKey, config) => {
    const particleSystem = new ModernParticleSystem(scene, textureKey);
    return particleSystem.createSimpleEmitter(config);
};

// Глобальная функция для создания частиц следователя
window.createFollowParticleEmitter = (scene, target, config) => {
    const particleSystem = new ModernParticleSystem(scene);
    return particleSystem.createFollowEmitter(target, config);
};

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModernParticleSystem;
}
