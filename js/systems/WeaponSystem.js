// Система оружия
class WeaponSystem {
    constructor(scene) {
        this.scene = scene;
        this.weapons = new Map();
        this.activeWeapon = 'basic_laser';
        this.weaponLevels = new Map();
        
        // Инициализируем оружие
        this.initWeapons();
        
        // Настройки стрельбы
        this.autoFire = false;
        this.autoFireTimer = null;
        this.lastFireTime = 0;
        
        // Модификаторы
        this.damageMultiplier = 1.0;
        this.fireRateMultiplier = 1.0;
        this.projectileSpeedMultiplier = 1.0;
        this.projectileSizeMultiplier = 1.0;
        
        // Специальные способности
        this.multiShot = 1;
        this.spreadAngle = 0;
        this.homingEnabled = false;
        this.explosiveEnabled = false;
    }

    initWeapons() {
        // Инициализируем все типы оружия
        Object.keys(WeaponTypes).forEach(weaponKey => {
            const weapon = WeaponTypes[weaponKey];
            this.weapons.set(weaponKey, {
                ...weapon,
                level: 1,
                unlocked: weaponKey === 'BASIC_LASER'
            });
            
            this.weaponLevels.set(weaponKey, 1);
        });
    }

    fire(player, targetX, targetY) {
        if (!player || !player.canFire()) return;
        
        const currentTime = Date.now();
        const weapon = this.weapons.get(this.activeWeapon);
        
        if (!weapon) return;
        
        // Проверяем скорострельность
        const fireRate = weapon.fireRate / this.fireRateMultiplier;
        if (currentTime - this.lastFireTime < fireRate) return;
        
        // Обновляем время последнего выстрела
        this.lastFireTime = currentTime;
        
        // Создаем снаряды
        this.createProjectiles(player, targetX, targetY, weapon);
        
        // Создаем эффекты стрельбы
        this.createFireEffects(player, targetX, targetY);
        
        // Обновляем статистику
        this.updateFireStats();
    }

    createProjectiles(player, targetX, targetY, weapon) {
        const projectileCount = this.multiShot;
        const spreadAngle = this.spreadAngle;
        
        for (let i = 0; i < projectileCount; i++) {
            // Вычисляем угол для множественных выстрелов
            let angle = Math.atan2(targetY - player.y, targetX - player.x);
            
            if (projectileCount > 1) {
                const spreadOffset = (i - (projectileCount - 1) / 2) * spreadAngle;
                angle += spreadOffset;
            }
            
            // Вычисляем позицию цели с учетом угла
            const distance = 100;
            const adjustedTargetX = player.x + Math.cos(angle) * distance;
            const adjustedTargetY = player.y + Math.sin(angle) * distance;
            
            // Создаем снаряд
            const projectile = new Projectile(
                this.scene,
                player.x,
                player.y,
                adjustedTargetX,
                adjustedTargetY,
                this.activeWeapon.toLowerCase()
            );
            
            // Применяем модификаторы
            this.applyProjectileModifiers(projectile, weapon);
            
            // Добавляем в группу снарядов
            this.scene.projectileGroup.add(projectile);
            
            // Настраиваем физику
            this.scene.physics.add.existing(projectile);
            
            // Настраиваем коллизии
            this.setupProjectileCollisions(projectile);
        }
    }

    applyProjectileModifiers(projectile, weapon) {
        // Применяем модификаторы урона
        projectile.damage = Math.floor(weapon.damage * this.damageMultiplier);
        
        // Применяем модификаторы скорости
        projectile.speed = weapon.projectileSpeed * this.projectileSpeedMultiplier;
        
        // Применяем модификаторы размера
        projectile.setScale(this.projectileSizeMultiplier);
        
        // Применяем специальные способности
        if (this.homingEnabled) {
            projectile.setHoming(this.scene.player, 0.05);
        }
        
        if (this.explosiveEnabled) {
            projectile.setExplosive(80, 30);
        }
    }

    setupProjectileCollisions(projectile) {
        // Коллизии с врагами
        this.scene.physics.add.overlap(
            projectile,
            this.scene.enemyGroup,
            (proj, enemy) => {
                projectile.onHit(enemy);
            },
            null,
            this.scene
        );
        
        // Коллизии с границами мира
        projectile.body.onWorldBounds = true;
        this.scene.physics.world.on('worldbounds', (body) => {
            if (body.gameObject === projectile) {
                projectile.destroy();
            }
        });
    }

    createFireEffects(player, targetX, targetY) {
        // Создаем эффект вспышки
        this.createMuzzleFlash(player, targetX, targetY);
        
        // Создаем эффект отдачи
        this.createRecoilEffect(player, targetX, targetY);
        
        // Создаем звуковой эффект
        this.playFireSound();
    }

    createMuzzleFlash(player, targetX, targetY) {
        // Вычисляем позицию вспышки
        const angle = Math.atan2(targetY - player.y, targetX - player.x);
        const flashDistance = 20;
        const flashX = player.x + Math.cos(angle) * flashDistance;
        const flashY = player.y + Math.sin(angle) * flashDistance;
        
        // Создаем вспышку
        const flash = this.scene.add.graphics();
        flash.fillStyle(0xffff00, 0.8);
        flash.fillCircle(flashX, flashY, 8);
        
        // Анимация вспышки
        this.scene.tweens.add({
            targets: flash,
            scaleX: 2,
            scaleY: 2,
            alpha: 0,
            duration: 100,
            ease: 'Power2',
            onComplete: () => {
                flash.destroy();
            }
        });
    }

    createRecoilEffect(player, targetX, targetY) {
        // Вычисляем направление отдачи
        const angle = Math.atan2(targetY - player.y, targetX - player.x);
        const recoilDistance = 3;
        const recoilX = player.x - Math.cos(angle) * recoilDistance;
        const recoilY = player.y - Math.sin(angle) * recoilDistance;
        
        // Создаем эффект отдачи
        this.scene.tweens.add({
            targets: player,
            x: recoilX,
            y: recoilY,
            duration: 50,
            yoyo: true,
            ease: 'Power2'
        });
    }

    playFireSound() {
        // Здесь можно добавить воспроизведение звука
        // this.scene.audioManager.playSound('fire');
    }

    updateFireStats() {
        // Обновляем статистику стрельбы
        // Можно добавить счетчики выстрелов, попаданий и т.д.
    }

    // Методы для изменения оружия
    switchWeapon(weaponKey) {
        const weapon = this.weapons.get(weaponKey.toUpperCase());
        if (weapon && weapon.unlocked) {
            this.activeWeapon = weaponKey.toUpperCase();
            this.updateWeaponStats();
        }
    }

    unlockWeapon(weaponKey) {
        const weapon = this.weapons.get(weaponKey.toUpperCase());
        if (weapon) {
            weapon.unlocked = true;
            this.updateWeaponStats();
        }
    }

    upgradeWeapon(weaponKey) {
        const weapon = this.weapons.get(weaponKey.toUpperCase());
        if (weapon && weapon.unlocked) {
            const currentLevel = this.weaponLevels.get(weaponKey.toUpperCase()) || 1;
            this.weaponLevels.set(weaponKey.toUpperCase(), currentLevel + 1);
            
            // Улучшаем характеристики оружия
            weapon.damage = Math.floor(weapon.damage * 1.2);
            weapon.fireRate = Math.max(100, weapon.fireRate * 0.9);
            weapon.projectileSpeed = Math.floor(weapon.projectileSpeed * 1.1);
            
            this.updateWeaponStats();
        }
    }

    updateWeaponStats() {
        // Обновляем характеристики активного оружия
        const weapon = this.weapons.get(this.activeWeapon);
        if (weapon) {
            // Можно добавить обновление UI
            this.scene.events.emit('weaponChanged', this.activeWeapon, weapon);
        }
    }

    // Методы для модификаторов
    setDamageMultiplier(multiplier) {
        this.damageMultiplier = multiplier;
    }

    setFireRateMultiplier(multiplier) {
        this.fireRateMultiplier = multiplier;
    }

    setProjectileSpeedMultiplier(multiplier) {
        this.projectileSpeedMultiplier = multiplier;
    }

    setProjectileSizeMultiplier(multiplier) {
        this.projectileSizeMultiplier = multiplier;
    }

    // Методы для специальных способностей
    setMultiShot(count) {
        this.multiShot = Math.max(1, count);
    }

    setSpreadAngle(angle) {
        this.spreadAngle = angle;
    }

    enableHoming(enabled) {
        this.homingEnabled = enabled;
    }

    enableExplosive(enabled) {
        this.explosiveEnabled = enabled;
    }

    // Методы для автоматической стрельбы
    enableAutoFire(enabled) {
        this.autoFire = enabled;
        
        if (enabled) {
            this.startAutoFire();
        } else {
            this.stopAutoFire();
        }
    }

    startAutoFire() {
        if (this.autoFireTimer) return;
        
        this.autoFireTimer = this.scene.time.addEvent({
            delay: 100,
            callback: () => {
                if (this.autoFire && this.scene.player && this.scene.player.isAlive) {
                    // Стреляем в направлении курсора
                    const pointer = this.scene.input.activePointer;
                    this.fire(this.scene.player, pointer.x, pointer.y);
                }
            },
            loop: true
        });
    }

    stopAutoFire() {
        if (this.autoFireTimer) {
            this.autoFireTimer.destroy();
            this.autoFireTimer = null;
        }
    }

    // Методы для получения информации
    getActiveWeapon() {
        return this.weapons.get(this.activeWeapon);
    }

    getWeaponLevel(weaponKey) {
        return this.weaponLevels.get(weaponKey.toUpperCase()) || 1;
    }

    isWeaponUnlocked(weaponKey) {
        const weapon = this.weapons.get(weaponKey.toUpperCase());
        return weapon ? weapon.unlocked : false;
    }

    getWeaponStats(weaponKey) {
        const weapon = this.weapons.get(weaponKey.toUpperCase());
        if (!weapon) return null;
        
        const level = this.getWeaponLevel(weaponKey);
        const levelMultiplier = 1 + (level - 1) * 0.2;
        
        return {
            damage: Math.floor(weapon.damage * levelMultiplier * this.damageMultiplier),
            fireRate: Math.max(50, weapon.fireRate / this.fireRateMultiplier),
            projectileSpeed: Math.floor(weapon.projectileSpeed * this.projectileSpeedMultiplier),
            projectileSize: Math.floor(weapon.projectileSize * this.projectileSizeMultiplier),
            level: level,
            unlocked: weapon.unlocked
        };
    }

    // Методы для сброса модификаторов
    resetModifiers() {
        this.damageMultiplier = 1.0;
        this.fireRateMultiplier = 1.0;
        this.projectileSpeedMultiplier = 1.0;
        this.projectileSizeMultiplier = 1.0;
        this.multiShot = 1;
        this.spreadAngle = 0;
        this.homingEnabled = false;
        this.explosiveEnabled = false;
    }

    // Методы для сохранения/загрузки
    saveWeaponData() {
        return {
            activeWeapon: this.activeWeapon,
            weaponLevels: Object.fromEntries(this.weaponLevels),
            unlockedWeapons: Array.from(this.weapons.entries())
                .filter(([key, weapon]) => weapon.unlocked)
                .map(([key]) => key)
        };
    }

    loadWeaponData(data) {
        if (data.activeWeapon) {
            this.activeWeapon = data.activeWeapon;
        }
        
        if (data.weaponLevels) {
            Object.entries(data.weaponLevels).forEach(([key, level]) => {
                this.weaponLevels.set(key, level);
            });
        }
        
        if (data.unlockedWeapons) {
            data.unlockedWeapons.forEach(weaponKey => {
                const weapon = this.weapons.get(weaponKey);
                if (weapon) {
                    weapon.unlocked = true;
                }
            });
        }
        
        this.updateWeaponStats();
    }

    // Методы для отладки
    debugWeaponInfo() {
        console.log('=== Weapon System Debug Info ===');
        console.log('Active Weapon:', this.activeWeapon);
        console.log('Weapon Levels:', Object.fromEntries(this.weaponLevels));
        console.log('Modifiers:', {
            damage: this.damageMultiplier,
            fireRate: this.fireRateMultiplier,
            projectileSpeed: this.projectileSpeedMultiplier,
            projectileSize: this.projectileSizeMultiplier
        });
        console.log('Special Abilities:', {
            multiShot: this.multiShot,
            spreadAngle: this.spreadAngle,
            homing: this.homingEnabled,
            explosive: this.explosiveEnabled
        });
        console.log('===============================');
    }
}
