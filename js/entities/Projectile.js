// Класс снаряда
class Projectile extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, targetX, targetY, weaponType = 'basic') {
        super(scene, x, y, WeaponTypes[weaponType.toUpperCase()]?.key || 'projectile_basic');
        
        // Добавляем снаряд на сцену
        scene.add.existing(this);
        
        // Инициализируем свойства
        this.initProperties(weaponType);
        
        // Настраиваем физику
        this.setupPhysics();
        
        // Создаем эффекты
        this.createEffects();
        
        // Устанавливаем направление движения
        this.setDirection(targetX, targetY);
        
        // Настраиваем анимации
        this.setupAnimations();
        
        // Запускаем таймер жизни
        this.startLifespan();
    }

    initProperties(weaponType) {
        // Получаем характеристики типа оружия
        const weapon = WeaponTypes[weaponType.toUpperCase()] || WeaponTypes.BASIC_LASER;
        
        // Основные характеристики
        this.weaponType = weaponType;
        this.damage = weapon.damage;
        this.speed = weapon.projectileSpeed;
        this.size = weapon.projectileSize;
        this.color = weapon.color;
        
        // Состояния
        this.isActive = true;
        this.hasHit = false;
        
        // Физические свойства
        this.velocity = { x: 0, y: 0 };
        this.acceleration = { x: 0, y: 0 };
        this.gravity = 0;
        this.friction = 0.98;
        
        // Эффекты
        this.trailParticles = [];
        this.impactEffects = [];
        
        // Время жизни
        this.lifespan = 5000; // 5 секунд
        this.lifespanTimer = null;
    }

    setupPhysics() {
        // Настраиваем физическое тело
        this.body.setSize(this.size * 0.8, this.size * 0.8);
        this.body.setOffset(this.size * 0.1, this.size * 0.1);
        
        // Устанавливаем границы мира
        this.body.setCollideWorldBounds(true);
        this.body.setBounce(0.1);
    }

    createEffects() {
        // Создаем эффект свечения
        this.glowEffect = this.scene.add.graphics();
        this.glowEffect.lineStyle(2, this.color, 0.7);
        this.glowEffect.strokeCircle(0, 0, this.size * 0.8);
        this.glowEffect.setPosition(this.x, this.y);
        
        // Создаем эффект частиц для следа
        this.trailParticles = this.scene.add.particles('projectile_basic');
        this.trailEmitter = this.trailParticles.createEmitter({
            follow: this,
            speed: { min: 10, max: 30 },
            scale: { start: 0.3, end: 0 },
            alpha: { start: 0.6, end: 0 },
            tint: this.color,
            lifespan: 300,
            frequency: 50
        });
        
        // Создаем эффект искажения пространства
        this.createSpaceDistortion();
    }

    createSpaceDistortion() {
        // Создаем эффект искажения для футуристического вида
        this.distortionEffect = this.scene.add.graphics();
        this.distortionEffect.lineStyle(1, this.color, 0.3);
        this.distortionEffect.strokeCircle(0, 0, this.size * 1.5);
        this.distortionEffect.setPosition(this.x, this.y);
        
        // Анимация искажения
        this.scene.tweens.add({
            targets: this.distortionEffect,
            scaleX: 1.2,
            scaleY: 1.2,
            alpha: 0,
            duration: 200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    setDirection(targetX, targetY) {
        // Вычисляем направление к цели
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            // Нормализуем направление
            const directionX = dx / distance;
            const directionY = dy / distance;
            
            // Устанавливаем скорость
            this.velocity.x = directionX * this.speed;
            this.velocity.y = directionY * this.speed;
            
            // Поворачиваем снаряд в направлении движения
            const angle = Math.atan2(directionY, directionX);
            this.setRotation(angle);
        }
    }

    setupAnimations() {
        // Анимация пульсации
        this.scene.tweens.add({
            targets: this,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Анимация свечения
        this.scene.tweens.add({
            targets: this.glowEffect,
            alpha: 0.9,
            duration: 300,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    startLifespan() {
        // Запускаем таймер жизни снаряда
        this.lifespanTimer = this.scene.time.delayedCall(this.lifespan, () => {
            this.destroy();
        });
    }

    update() {
        if (!this.isActive) return;
        
        // Обновляем движение
        this.updateMovement();
        
        // Обновляем эффекты
        this.updateEffects();
        
        // Проверяем границы мира
        this.checkWorldBounds();
    }

    updateMovement() {
        // Применяем ускорение
        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;
        
        // Применяем гравитацию
        this.velocity.y += this.gravity;
        
        // Применяем трение
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        
        // Устанавливаем скорость физического тела
        this.body.setVelocity(this.velocity.x, this.velocity.y);
        
        // Обновляем позицию эффектов
        this.updateEffectPositions();
    }

    updateEffects() {
        // Обновляем позицию эффекта свечения
        if (this.glowEffect) {
            this.glowEffect.setPosition(this.x, this.y);
        }
        
        // Обновляем позицию эффекта искажения
        if (this.distortionEffect) {
            this.distortionEffect.setPosition(this.x, this.y);
        }
    }

    updateEffectPositions() {
        // Обновляем позиции всех эффектов
        if (this.glowEffect) {
            this.glowEffect.setPosition(this.x, this.y);
        }
        if (this.distortionEffect) {
            this.distortionEffect.setPosition(this.x, this.y);
        }
    }

    checkWorldBounds() {
        // Проверяем, не вышел ли снаряд за границы мира
        const worldBounds = this.scene.physics.world.bounds;
        
        if (this.x < worldBounds.x || this.x > worldBounds.x + worldBounds.width ||
            this.y < worldBounds.y || this.y > worldBounds.y + worldBounds.height) {
            this.destroy();
        }
    }

    onHit(target) {
        if (this.hasHit) return;
        
        this.hasHit = true;
        
        // Наносим урон цели
        if (target && typeof target.takeDamage === 'function') {
            target.takeDamage(this.damage);
        }
        
        // Создаем эффект попадания
        this.createHitEffect();
        
        // Уничтожаем снаряд
        this.destroy();
    }

    createHitEffect() {
        // Создаем эффект попадания
        const hitParticles = this.scene.add.particles('projectile_basic');
        const hitEmitter = hitParticles.createEmitter({
            x: this.x,
            y: this.y,
            speed: { min: 50, max: 150 },
            scale: { start: 0.5, end: 0 },
            alpha: { start: 1, end: 0 },
            tint: this.color,
            lifespan: 500,
            frequency: 30
        });
        
        // Останавливаем эмиттер через полсекунды
        this.scene.time.delayedCall(500, () => {
            hitEmitter.stop();
            this.scene.time.delayedCall(500, () => {
                hitParticles.destroy();
            });
        });
        
        // Создаем эффект вспышки
        this.createFlashEffect();
        
        // Создаем эффект ударной волны
        this.createShockwaveEffect();
    }

    createFlashEffect() {
        // Создаем вспышку в месте попадания
        const flash = this.scene.add.graphics();
        flash.fillStyle(this.color, 0.8);
        flash.fillCircle(this.x, this.y, this.size * 2);
        
        // Анимация исчезновения
        this.scene.tweens.add({
            targets: flash,
            scaleX: 3,
            scaleY: 3,
            alpha: 0,
            duration: 200,
            ease: 'Power2',
            onComplete: () => {
                flash.destroy();
            }
        });
    }

    createShockwaveEffect() {
        // Создаем ударную волну
        const shockwave = this.scene.add.graphics();
        shockwave.lineStyle(3, this.color, 0.6);
        shockwave.strokeCircle(this.x, this.y, this.size);
        
        // Анимация расширения
        this.scene.tweens.add({
            targets: shockwave,
            scaleX: 5,
            scaleY: 5,
            alpha: 0,
            duration: 300,
            ease: 'Power2',
            onComplete: () => {
                shockwave.destroy();
            }
        });
    }

    // Методы для изменения траектории
    setGravity(gravity) {
        this.gravity = gravity;
    }

    setAcceleration(accelX, accelY) {
        this.acceleration.x = accelX;
        this.acceleration.y = accelY;
    }

    setFriction(friction) {
        this.friction = friction;
    }

    // Метод для создания гомингового снаряда
    setHoming(target, homingStrength = 0.1) {
        this.homingTarget = target;
        this.homingStrength = homingStrength;
    }

    updateHoming() {
        if (!this.homingTarget || !this.homingTarget.active) return;
        
        // Вычисляем направление к цели
        const dx = this.homingTarget.x - this.x;
        const dy = this.homingTarget.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            // Нормализуем направление
            const directionX = dx / distance;
            const directionY = dy / distance;
            
            // Применяем гоминг
            this.velocity.x += directionX * this.homingStrength;
            this.velocity.y += directionY * this.homingStrength;
            
            // Ограничиваем максимальную скорость
            const currentSpeed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
            if (currentSpeed > this.speed) {
                this.velocity.x = (this.velocity.x / currentSpeed) * this.speed;
                this.velocity.y = (this.velocity.y / currentSpeed) * this.speed;
            }
        }
    }

    // Метод для создания разрывного снаряда
    setExplosive(explosionRadius = 100, explosionDamage = 50) {
        this.explosive = true;
        this.explosionRadius = explosionRadius;
        this.explosionDamage = explosionDamage;
    }

    createExplosion() {
        if (!this.explosive) return;
        
        // Создаем взрыв
        const explosion = this.scene.add.image(this.x, this.y, 'explosion');
        explosion.setScale(0.5);
        
        this.scene.tweens.add({
            targets: explosion,
            scaleX: this.explosionRadius / 32,
            scaleY: this.explosionRadius / 32,
            alpha: 0,
            duration: 500,
            ease: 'Power2',
            onComplete: () => {
                explosion.destroy();
            }
        });
        
        // Наносим урон всем врагам в радиусе
        const enemies = this.scene.enemyGroup.getChildren();
        enemies.forEach(enemy => {
            if (enemy.active && enemy.isAlive) {
                const dx = enemy.x - this.x;
                const dy = enemy.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance <= this.explosionRadius) {
                    // Урон уменьшается с расстоянием
                    const damageMultiplier = 1 - (distance / this.explosionRadius);
                    const damage = Math.floor(this.explosionDamage * damageMultiplier);
                    enemy.takeDamage(damage);
                }
            }
        });
        
        // Создаем эффект ударной волны
        this.createExplosionShockwave();
    }

    createExplosionShockwave() {
        // Создаем большую ударную волну
        const shockwave = this.scene.add.graphics();
        shockwave.lineStyle(5, 0xffaa00, 0.8);
        shockwave.strokeCircle(this.x, this.y, this.explosionRadius);
        
        // Анимация расширения
        this.scene.tweens.add({
            targets: shockwave,
            scaleX: 2,
            scaleY: 2,
            alpha: 0,
            duration: 600,
            ease: 'Power2',
            onComplete: () => {
                shockwave.destroy();
            }
        });
        
        // Тряска экрана
        this.scene.cameras.main.shake(300, 0.01);
    }

    destroy() {
        // Останавливаем таймер жизни
        if (this.lifespanTimer) {
            this.lifespanTimer.destroy();
        }
        
        // Останавливаем все анимации
        this.scene.tweens.killTweensOf(this);
        this.scene.tweens.killTweensOf(this.glowEffect);
        this.scene.tweens.killTweensOf(this.distortionEffect);
        
        // Уничтожаем эффекты
        if (this.glowEffect) {
            this.glowEffect.destroy();
        }
        if (this.distortionEffect) {
            this.distortionEffect.destroy();
        }
        if (this.trailParticles) {
            this.trailParticles.destroy();
        }
        
        // Уничтожаем сам снаряд
        super.destroy();
    }
}
