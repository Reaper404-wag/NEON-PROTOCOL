// Класс усиления
class PowerUp extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, type = 'health') {
        super(scene, x, y, PowerUpTypes[type.toUpperCase()]?.key || 'powerup_health');
        
        // Добавляем усиление на сцену
        scene.add.existing(this);
        
        // Инициализируем свойства
        this.initProperties(type);
        
        // Настраиваем физику
        this.setupPhysics();
        
        // Создаем эффекты
        this.createEffects();
        
        // Настраиваем анимации
        this.setupAnimations();
        
        // Запускаем таймер жизни
        this.startLifespan();
    }

    initProperties(type) {
        // Получаем характеристики типа усиления
        const powerUpType = PowerUpTypes[type.toUpperCase()] || PowerUpTypes.HEALTH;
        
        // Основные характеристики
        this.type = type;
        this.effect = powerUpType.effect;
        this.value = powerUpType.value;
        this.duration = powerUpType.duration;
        this.color = powerUpType.color;
        
        // Состояния
        this.isActive = true;
        this.isCollected = false;
        
        // Эффекты
        this.glowIntensity = 0.5;
        this.pulseSpeed = 2;
        
        // Время жизни
        this.lifespan = 15000; // 15 секунд
        this.lifespanTimer = null;
        this.timeAlive = 0;
        
        // Анимация
        this.rotationSpeed = 0.02;
        this.bobSpeed = 0.003;
        this.bobAmplitude = 5;
    }

    setupPhysics() {
        // Настраиваем физическое тело
        this.body.setSize(16, 16);
        this.body.setOffset(0, 0);
        
        // Устанавливаем границы мира
        this.body.setCollideWorldBounds(true);
        this.body.setBounce(0.3);
    }

    createEffects() {
        // Создаем эффект свечения
        this.glowEffect = this.scene.add.graphics();
        this.glowEffect.lineStyle(3, this.color, this.glowIntensity);
        this.glowEffect.strokeCircle(0, 0, 20);
        this.glowEffect.setPosition(this.x, this.y);
        
        // Создаем эффект частиц
        this.createParticleEffect();
        
        // Создаем эффект ауры
        this.createAuraEffect();
        
        // Создаем текст типа усиления
        this.createTypeText();
    }

    createParticleEffect() {
        // Создаем систему частиц для усиления
        this.particles = this.scene.add.particles('projectile_basic');
        this.particleEmitter = this.particles.createEmitter({
            follow: this,
            speed: { min: 20, max: 50 },
            scale: { start: 0.4, end: 0 },
            alpha: { start: 0.7, end: 0 },
            tint: this.color,
            lifespan: 800,
            frequency: 100
        });
    }

    createAuraEffect() {
        // Создаем эффект ауры
        this.auraEffect = this.scene.add.graphics();
        this.auraEffect.lineStyle(1, this.color, 0.3);
        this.auraEffect.strokeCircle(0, 0, 30);
        this.auraEffect.setPosition(this.x, this.y);
        
        // Анимация ауры
        this.scene.tweens.add({
            targets: this.auraEffect,
            scaleX: 1.3,
            scaleY: 1.3,
            alpha: 0.6,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    createTypeText() {
        // Создаем текст типа усиления
        const typeNames = {
            'health': 'HP',
            'speed': 'SPD',
            'damage': 'DMG',
            'fireRate': 'FR'
        };
        
        this.typeText = this.scene.add.text(0, -25, typeNames[this.type] || 'UP', {
            fontSize: '12px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Добавляем к усилению
        this.add(this.typeText);
    }

    setupAnimations() {
        // Анимация вращения
        this.scene.tweens.add({
            targets: this,
            angle: 360,
            duration: 3000,
            repeat: -1,
            ease: 'Linear'
        });
        
        // Анимация пульсации
        this.scene.tweens.add({
            targets: this,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Анимация свечения
        this.scene.tweens.add({
            targets: this.glowEffect,
            alpha: 0.8,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Анимация движения вверх-вниз
        this.scene.tweens.add({
            targets: this,
            y: this.y + this.bobAmplitude,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    startLifespan() {
        // Запускаем таймер жизни усиления
        this.lifespanTimer = this.scene.time.delayedCall(this.lifespan, () => {
            this.destroy();
        });
    }

    update() {
        if (!this.isActive || this.isCollected) return;
        
        // Обновляем время жизни
        this.timeAlive += this.scene.game.loop.delta;
        
        // Обновляем эффекты
        this.updateEffects();
        
        // Обновляем анимации
        this.updateAnimations();
        
        // Проверяем границы мира
        this.checkWorldBounds();
    }

    updateEffects() {
        // Обновляем позицию эффекта свечения
        if (this.glowEffect) {
            this.glowEffect.setPosition(this.x, this.y);
        }
        
        // Обновляем позицию эффекта ауры
        if (this.auraEffect) {
            this.auraEffect.setPosition(this.x, this.y);
        }
        
        // Обновляем интенсивность свечения в зависимости от оставшегося времени
        this.updateGlowIntensity();
    }

    updateGlowIntensity() {
        if (this.glowEffect) {
            const timeLeft = this.lifespan - this.timeAlive;
            const intensity = 0.3 + (timeLeft / this.lifespan) * 0.7;
            
            this.glowEffect.clear();
            this.glowEffect.lineStyle(3, this.color, intensity);
            this.glowEffect.strokeCircle(0, 0, 20);
        }
    }

    updateAnimations() {
        // Обновляем вращение
        this.rotation += this.rotationSpeed;
        
        // Обновляем движение вверх-вниз
        const bobOffset = Math.sin(this.timeAlive * this.bobSpeed) * this.bobAmplitude;
        this.y = this.y + bobOffset * 0.1;
    }

    checkWorldBounds() {
        // Проверяем, не вышел ли объект за границы мира
        const worldBounds = this.scene.physics.world.bounds;
        
        if (this.x < worldBounds.x || this.x > worldBounds.x + worldBounds.width ||
            this.y < worldBounds.y || this.y > worldBounds.y + worldBounds.height) {
            this.destroy();
        }
    }

    collect() {
        if (this.isCollected) return;
        
        this.isCollected = true;
        
        // Создаем эффект сбора
        this.createCollectEffect();
        
        // Уничтожаем усиление
        this.destroy();
    }

    createCollectEffect() {
        // Создаем эффект сбора
        const collectParticles = this.scene.add.particles('projectile_basic');
        const collectEmitter = collectParticles.createEmitter({
            x: this.x,
            y: this.y,
            speed: { min: 100, max: 200 },
            scale: { start: 0.8, end: 0 },
            alpha: { start: 1, end: 0 },
            tint: this.color,
            lifespan: 1000,
            frequency: 20
        });
        
        // Останавливаем эмиттер через секунду
        this.scene.time.delayedCall(1000, () => {
            collectEmitter.stop();
            this.scene.time.delayedCall(1000, () => {
                collectParticles.destroy();
            });
        });
        
        // Создаем эффект вспышки
        this.createCollectFlash();
        
        // Создаем эффект ударной волны
        this.createCollectShockwave();
        
        // Создаем текст сбора
        this.createCollectText();
    }

    createCollectFlash() {
        // Создаем вспышку в месте сбора
        const flash = this.scene.add.graphics();
        flash.fillStyle(this.color, 0.9);
        flash.fillCircle(this.x, this.y, 25);
        
        // Анимация исчезновения
        this.scene.tweens.add({
            targets: flash,
            scaleX: 2,
            scaleY: 2,
            alpha: 0,
            duration: 300,
            ease: 'Power2',
            onComplete: () => {
                flash.destroy();
            }
        });
    }

    createCollectShockwave() {
        // Создаем ударную волну
        const shockwave = this.scene.add.graphics();
        shockwave.lineStyle(4, this.color, 0.7);
        shockwave.strokeCircle(this.x, this.y, 25);
        
        // Анимация расширения
        this.scene.tweens.add({
            targets: shockwave,
            scaleX: 4,
            scaleY: 4,
            alpha: 0,
            duration: 400,
            ease: 'Power2',
            onComplete: () => {
                shockwave.destroy();
            }
        });
    }

    createCollectText() {
        // Создаем текст сбора
        const collectText = this.scene.add.text(this.x, this.y - 40, 'ПОДОБРАНО!', {
            fontSize: '16px',
            fill: this.color,
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        // Анимация текста
        this.scene.tweens.add({
            targets: collectText,
            y: this.y - 80,
            alpha: 0,
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                collectText.destroy();
            }
        });
    }

    // Методы для изменения свойств
    setColor(color) {
        this.color = color;
        if (this.glowEffect) {
            this.glowEffect.clear();
            this.glowEffect.lineStyle(3, this.color, this.glowIntensity);
            this.glowEffect.strokeCircle(0, 0, 20);
        }
    }

    setGlowIntensity(intensity) {
        this.glowIntensity = Math.max(0, Math.min(1, intensity));
        if (this.glowEffect) {
            this.glowEffect.clear();
            this.glowEffect.lineStyle(3, this.color, this.glowIntensity);
            this.glowEffect.strokeCircle(0, 0, 20);
        }
    }

    setPulseSpeed(speed) {
        this.pulseSpeed = speed;
        // Обновляем анимацию пульсации
        this.scene.tweens.killTweensOf(this);
        this.scene.tweens.add({
            targets: this,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 1000 / this.pulseSpeed,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    // Метод для создания магнитного эффекта
    setMagnetic(target, magneticStrength = 0.1) {
        this.magneticTarget = target;
        this.magneticStrength = magneticStrength;
    }

    updateMagnetic() {
        if (!this.magneticTarget || !this.magneticTarget.active) return;
        
        // Вычисляем направление к цели
        const dx = this.magneticTarget.x - this.x;
        const dy = this.magneticTarget.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0 && distance < 100) {
            // Нормализуем направление
            const directionX = dx / distance;
            const directionY = dy / distance;
            
            // Применяем магнитный эффект
            const magneticForce = this.magneticStrength * (1 - distance / 100);
            this.x += directionX * magneticForce;
            this.y += directionY * magneticForce;
        }
    }

    // Метод для создания телепортирующегося усиления
    setTeleporting(teleportInterval = 3000) {
        this.teleporting = true;
        this.teleportInterval = teleportInterval;
        this.lastTeleportTime = 0;
        
        // Запускаем таймер телепортации
        this.teleportTimer = this.scene.time.addEvent({
            delay: this.teleportInterval,
            callback: this.teleport,
            callbackScope: this,
            loop: true
        });
    }

    teleport() {
        if (!this.teleporting) return;
        
        // Создаем эффект телепортации
        this.createTeleportEffect();
        
        // Выбираем новую случайную позицию
        const newX = Math.random() * (this.scene.cameras.main.width - 100) + 50;
        const newY = Math.random() * (this.scene.cameras.main.height - 100) + 50;
        
        // Телепортируемся
        this.x = newX;
        this.y = newY;
        
        // Создаем эффект появления
        this.createTeleportInEffect();
    }

    createTeleportEffect() {
        // Создаем эффект исчезновения
        const teleportOut = this.scene.add.graphics();
        teleportOut.lineStyle(5, this.color, 0.8);
        teleportOut.strokeCircle(this.x, this.y, 30);
        
        // Анимация исчезновения
        this.scene.tweens.add({
            targets: teleportOut,
            scaleX: 0,
            scaleY: 0,
            alpha: 0,
            duration: 200,
            ease: 'Power2',
            onComplete: () => {
                teleportOut.destroy();
            }
        });
        
        // Скрываем усиление
        this.setAlpha(0);
    }

    createTeleportInEffect() {
        // Создаем эффект появления
        const teleportIn = this.scene.add.graphics();
        teleportIn.lineStyle(5, this.color, 0.8);
        teleportIn.strokeCircle(this.x, this.y, 30);
        
        // Анимация появления
        this.scene.tweens.add({
            targets: teleportIn,
            scaleX: 1,
            scaleY: 1,
            alpha: 0,
            duration: 200,
            ease: 'Power2',
            onComplete: () => {
                teleportIn.destroy();
            }
        });
        
        // Показываем усиление
        this.setAlpha(1);
    }

    destroy() {
        // Останавливаем таймер жизни
        if (this.lifespanTimer) {
            this.lifespanTimer.destroy();
        }
        
        // Останавливаем таймер телепортации
        if (this.teleportTimer) {
            this.teleportTimer.destroy();
        }
        
        // Останавливаем все анимации
        this.scene.tweens.killTweensOf(this);
        this.scene.tweens.killTweensOf(this.glowEffect);
        this.scene.tweens.killTweensOf(this.auraEffect);
        
        // Уничтожаем эффекты
        if (this.glowEffect) {
            this.glowEffect.destroy();
        }
        if (this.auraEffect) {
            this.auraEffect.destroy();
        }
        if (this.particles) {
            this.particles.destroy();
        }
        
        // Уничтожаем сам объект
        super.destroy();
    }
}
