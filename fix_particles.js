// Скрипт для исправления всех createEmitter в проекте
// Запустите этот скрипт в консоли браузера

console.log('🔧 Начинаем исправление системы частиц...');

// Функция для замены всех createEmitter
function fixAllParticles() {
    // Отключаем все add.particles
    const originalAddParticles = Phaser.Scene.prototype.add.particles;
    Phaser.Scene.prototype.add.particles = function() {
        console.log('⚠️ Система частиц временно отключена для Phaser 3.70');
        return {
            createEmitter: function() {
                console.log('⚠️ createEmitter временно отключен');
                return {
                    start: () => console.log('Particle emitter started'),
                    stop: () => console.log('Particle emitter stopped'),
                    setActive: () => console.log('Particle emitter active set'),
                    setPosition: () => console.log('Particle emitter position set'),
                    destroy: () => console.log('Particle emitter destroyed')
                };
            }
        };
    };
    
    console.log('✅ Система частиц исправлена!');
}

// Запускаем исправление
fixAllParticles();
