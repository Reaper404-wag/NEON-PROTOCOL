// Класс игрока
class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player');
        
        // Добавляем игрока на сцену
        scene.add.existing(this);
        
        // Инициализируем свойства
        this.initProperties();
        
        // Настраиваем физику
        this.setupPhysics();
        
        // Создаем эффекты
        this.createEffects();
        
        // Настраиваем анимации
        this.setupAnimations();
    }

    initProperties() {
        // Основные характеристики
        this.health = GameConstants.PLAYER_HEALTH;
        this.maxHealth = GameConstants.PLAYER_HEALTH;
        this.speed = GameConstants.PLAYER_SPEED;
        this.baseSpeed = GameConstants.PLAYER_SPEED;
        
        // Состояния
        this.isAlive = true;
        this.isInvulnerable = false;
        this.invulnerabilityTime = 0;
        this.invulnerabilityDuration = 1000; // 1 секунда
        
        // Модификаторы
        this.speedMultiplier = 1.0;
        this.damageMultiplier = 1.0;
        this.fireRateMultiplier = 1.0;
        
        // Время последнего выстрела
        this.lastFireTime = 0;
        
        // Направление движения
        this.moveDirection = { x: 0, y: 0 };
        
        // Эффекты
        this.activeEffects = new Map();
    }

    setupPhysics() {
        // Настраиваем физическое тело
        this.body.setSize(GameConstants.PLAYER_SIZE * 0.8, GameConstants.PLAYER_SIZE * 0.8);
        this.body.setOffset(GameConstants.PLAYER_SIZE * 0.1, GameConstants.PLAYER_SIZE * 0.1);
        
        // Устанавливаем границы мира
        this.body.setCollideWorldBounds(true);
        this.body.setBounce(0.1);
    }

    createEffects() {
        // Создаем эффект свечения
        this.glowEffect = this.scene.add.graphics();
        this.glowEffect.lineStyle(2, 0x00ff00, 0.5);
        this.glowEffect.strokeCircle(0, 0, GameConstants.PLAYER_SIZE * 0.6);
        this.glowEffect.setPosition(this.x, this.y);
        
        // Создаем эффект частиц для движения (временно отключено для Phaser 3.70)
        // this.movementParticles = this.scene.add.particles('projectile_basic');
        // this.movementEmitter = this.movementParticles.createEmitter({
        //     follow: this,
        //     followOffset: { x: 0, y: GameConstants.PLAYER_SIZE / 2 },
        //     speed: { min: 20, max: 50 },
        //     scale: { start: 0.3, end: 0 },
        //     alpha: { start: 0.5, end: 0 },
        //     lifespan: 500,
        //     frequency: 100,
        //     active: false
        // });
    }

    setupAnimations() {
        // Анимация пульсации
        this.scene.tweens.add({
            targets: this,
            scaleX: 1.05,
            scaleY: 1.05,
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
    }

    update() {
        if (!this.isAlive) return;
        
        // Обновляем управление
        this.handleInput();
        
        // Обновляем движение
        this.updateMovement();
        
        // Обновляем эффекты
        this.updateEffects();
        
        // Обновляем неуязвимость
        this.updateInvulnerability();
        
        // Обновляем активные эффекты
        this.updateActiveEffects();
    }

    handleInput() {
        // Сбрасываем направление движения
        this.moveDirection.x = 0;
        this.moveDirection.y = 0;
        
        // Проверяем нажатые клавиши
        const cursors = this.scene.cursors;
        const wasd = this.scene.wasd;
        
        // Стрелки
        if (cursors.left.isDown || wasd.A.isDown) {
            this.moveDirection.x = -1;
        } else if (cursors.right.isDown || wasd.D.isDown) {
            this.moveDirection.x = 1;
        }
        
        if (cursors.up.isDown || wasd.W.isDown) {
            this.moveDirection.y = -1;
        } else if (cursors.down.isDown || wasd.S.isDown) {
            this.moveDirection.y = 1;
        }
        
        // Нормализуем диагональное движение
        if (this.moveDirection.x !== 0 && this.moveDirection.y !== 0) {
            this.moveDirection.x *= 0.707; // 1/√2
            this.moveDirection.y *= 0.707;
        }
    }

    updateMovement() {
        if (this.moveDirection.x !== 0 || this.moveDirection.y !== 0) {
            // Вычисляем скорость с учетом модификаторов
            const currentSpeed = this.speed * this.speedMultiplier;
            
            // Устанавливаем скорость движения
            this.body.setVelocity(
                this.moveDirection.x * currentSpeed,
                this.moveDirection.y * currentSpeed
            );
            
            // Активируем эффект частиц движения (временно отключено)
            // this.movementEmitter.setActive(true);
            
            // Поворачиваем игрока в направлении движения
            const angle = Math.atan2(this.moveDirection.y, this.moveDirection.x);
            this.setRotation(angle);
        } else {
            // Останавливаем движение
            this.body.setVelocity(0, 0);
            // this.movementEmitter.setActive(false);
            
            // Возвращаем игрока в исходное положение
            this.setRotation(0);
        }
    }

    updateEffects() {
        // Обновляем позицию эффекта свечения
        if (this.glowEffect) {
            this.glowEffect.setPosition(this.x, this.y);
        }
    }

    updateInvulnerability() {
        if (this.isInvulnerable) {
            this.invulnerabilityTime += this.scene.game.loop.delta;
            
            // Мигание при неуязвимости
            this.setAlpha(this.invulnerabilityTime % 200 < 100 ? 0.5 : 1);
            
            if (this.invulnerabilityTime >= this.invulnerabilityDuration) {
                this.isInvulnerable = false;
                this.invulnerabilityTime = 0;
                this.setAlpha(1);
            }
        }
    }

    updateActiveEffects() {
        const currentTime = Date.now();
        
        // Проверяем и обновляем активные эффекты
        for (const [effectType, effect] of this.activeEffects) {
            if (effect.duration > 0 && currentTime >= effect.endTime) {
                // Эффект истек, убираем его
                this.removeEffect(effectType);
            }
        }
    }

    takeDamage(damage) {
        if (this.isInvulnerable || !this.isAlive) return;
        
        // Применяем модификатор урона
        const actualDamage = Math.floor(damage * this.damageMultiplier);
        this.health = Math.max(0, this.health - actualDamage);
        
        // Активируем неуязвимость
        this.isInvulnerable = true;
        this.invulnerabilityTime = 0;
        
        // Создаем эффект получения урона
        this.createDamageEffect(actualDamage);
        
        // Проверяем, не умер ли игрок
        if (this.health <= 0) {
            this.die();
        }
        
        // Обновляем UI
        this.scene.events.emit('playerDamaged', this.health);
    }

    heal(amount) {
        if (!this.isAlive) return;
        
        this.health = Math.min(this.maxHealth, this.health + amount);
        
        // Создаем эффект лечения
        this.createHealEffect(amount);
        
        // Обновляем UI
        this.scene.events.emit('playerDamaged', this.health);
    }

    createDamageEffect(damage) {
        // Создаем текст урона
        const damageText = this.scene.add.text(this.x, this.y - 30, `-${damage}`, {
            fontSize: '24px',
            fill: '#ff0000',
            fontFamily: 'Arial',
            stroke: '#660000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Анимация текста урона
        this.scene.tweens.add({
            targets: damageText,
            y: this.y - 80,
            alpha: 0,
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                damageText.destroy();
            }
        });
        
        // Эффект тряски экрана
        this.scene.cameras.main.shake(200, 0.01);
    }

    createHealEffect(amount) {
        // Создаем текст лечения
        const healText = this.scene.add.text(this.x, this.y - 30, `+${amount}`, {
            fontSize: '24px',
            fill: '#00ff00',
            fontFamily: 'Arial',
            stroke: '#006600',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Анимация текста лечения
        this.scene.tweens.add({
            targets: healText,
            y: this.y - 80,
            alpha: 0,
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                healText.destroy();
            }
        });
        
        // Эффект частиц лечения (временно отключено для Phaser 3.70)
        // const healParticles = this.scene.add.particles('projectile_basic');
        // const healEmitter = healParticles.createEmitter({
        //     x: this.x,
        //     y: this.y,
        //     speed: { min: 50, max: 100 },
        //     scale: { start: 0.5, end: 0 },
        //     alpha: { start: 1, end: 0 },
        //     tint: 0x00ff00,
        //     lifespan: 1000,
        //     frequency: 50
        // });
        
        // Останавливаем эмиттер через секунду
        // this.scene.time.delayedCall(1000, () => {
        //     healEmitter.stop();
        //     this.scene.time.delayedCall(1000, () => {
        //         healParticles.destroy();
        //     });
        // });
    }

    addEffect(effectType, effect) {
        // Добавляем новый эффект или обновляем существующий
        this.activeEffects.set(effectType, {
            ...effect,
            startTime: Date.now(),
            endTime: effect.duration > 0 ? Date.now() + effect.duration : 0
        });
        
        // Применяем эффект
        this.applyEffect(effectType, effect);
    }

    removeEffect(effectType) {
        const effect = this.activeEffects.get(effectType);
        if (effect) {
            // Убираем эффект
            this.removeEffectModifier(effectType, effect);
            this.activeEffects.delete(effectType);
        }
    }

    applyEffect(effectType, effect) {
        switch (effectType) {
            case 'speed':
                this.speedMultiplier = effect.value;
                break;
            case 'damage':
                this.damageMultiplier = effect.value;
                break;
            case 'fireRate':
                this.fireRateMultiplier = effect.value;
                break;
            case 'health':
                this.heal(effect.value);
                break;
        }
    }

    removeEffectModifier(effectType, effect) {
        switch (effectType) {
            case 'speed':
                this.speedMultiplier = 1.0;
                break;
            case 'damage':
                this.damageMultiplier = 1.0;
                break;
            case 'fireRate':
                this.fireRateMultiplier = 1.0;
                break;
        }
    }

    canFire() {
        if (!this.isAlive) return false;
        
        const currentTime = Date.now();
        const fireRate = GameConstants.BASIC_WEAPON_FIRE_RATE / this.fireRateMultiplier;
        
        return currentTime - this.lastFireTime >= fireRate;
    }

    fire() {
        if (!this.canFire()) return false;
        
        this.lastFireTime = Date.now();
        return true;
    }

    die() {
        this.isAlive = false;
        
        // Создаем эффект смерти
        this.createDeathEffect();
        
        // Останавливаем все анимации
        this.scene.tweens.killTweensOf(this);
        this.scene.tweens.killTweensOf(this.glowEffect);
        
        // Уничтожаем эффекты
        if (this.glowEffect) {
            this.glowEffect.destroy();
        }
        if (this.movementParticles) {
            this.movementParticles.destroy();
        }
        
        // Устанавливаем прозрачность
        this.setAlpha(0.3);
        
        // Уведомляем сцену о смерти игрока
        this.scene.events.emit('playerDied');
    }

    createDeathEffect() {
        // Создаем эффект взрыва
        const explosion = this.scene.add.image(this.x, this.y, 'explosion');
        explosion.setScale(0.5);
        
        this.scene.tweens.add({
            targets: explosion,
            scaleX: 3,
            scaleY: 3,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                explosion.destroy();
            }
        });
        
        // Сильная тряска экрана
        this.scene.cameras.main.shake(500, 0.02);
        
        // Эффект частиц смерти (временно отключено для Phaser 3.70)
        // const deathParticles = this.scene.add.particles('projectile_basic');
        // const deathEmitter = deathParticles.createEmitter({
        //     x: this.x,
        //     y: this.y,
        //     speed: { min: 100, max: 200 },
        //     scale: { start: 1, end: 0 },
        //     alpha: { start: 1, end: 0 },
        //     tint: 0xff0000,
        //     lifespan: 2000,
        //     frequency: 20
        // });
        
        // Останавливаем эмиттер через 2 секунды
        // this.scene.time.delayedCall(2000, () => {
        //     deathEmitter.stop();
        //     this.scene.time.delayedCall(2000, () => {
        //         deathEmitter.destroy();
        //     });
        // });
    }

    // Геттеры для получения текущих характеристик
    getCurrentSpeed() {
        return this.speed * this.speedMultiplier;
    }

    getCurrentDamage() {
        return GameConstants.BASIC_WEAPON_DAMAGE * this.damageMultiplier;
    }

    getCurrentFireRate() {
        return GameConstants.BASIC_WEAPON_FIRE_RATE / this.fireRateMultiplier;
    }

    // Метод для сброса всех эффектов
    resetEffects() {
        this.activeEffects.clear();
        this.speedMultiplier = 1.0;
        this.damageMultiplier = 1.0;
        this.fireRateMultiplier = 1.0;
    }

    // Метод для восстановления игрока
    respawn() {
        this.isAlive = true;
        this.health = this.maxHealth;
        this.isInvulnerable = false;
        this.invulnerabilityTime = 0;
        this.setAlpha(1);
        this.resetEffects();
        
        // Создаем эффекты заново
        this.createEffects();
        this.setupAnimations();
    }
}
