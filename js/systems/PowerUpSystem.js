// Система усилений
class PowerUpSystem {
    constructor(scene) {
        this.scene = scene;
        this.powerUps = new Map();
        this.activePowerUps = new Map();
        this.spawnTimer = null;
        this.spawnRate = 10000; // 10 секунд
        
        // Настройки системы
        this.maxPowerUps = 5;
        this.powerUpCount = 0;
        this.rarityMultiplier = 1.0;
        
        // Инициализируем систему
        this.initPowerUps();
        this.startSpawning();
    }

    initPowerUps() {
        // Инициализируем все типы усилений
        Object.keys(PowerUpTypes).forEach(powerUpKey => {
            const powerUp = PowerUpTypes[powerUpKey.toUpperCase()];
            this.powerUps.set(powerUpKey, {
                ...powerUp,
                rarity: this.calculateRarity(powerUpKey),
                unlocked: true
            });
        });
    }

    calculateRarity(powerUpKey) {
        // Вычисляем редкость усиления
        const rarityMap = {
            'health': 0.4,      // Частое
            'speed': 0.3,       // Среднее
            'damage': 0.2,      // Редкое
            'fireRate': 0.1     // Очень редкое
        };
        
        return rarityMap[powerUpKey] || 0.3;
    }

    startSpawning() {
        // Запускаем таймер спавна усилений
        this.spawnTimer = this.scene.time.addEvent({
            delay: this.spawnRate,
            callback: this.spawnPowerUp,
            callbackScope: this,
            loop: true
        });
    }

    spawnPowerUp() {
        if (this.powerUpCount >= this.maxPowerUps) return;
        
        // Выбираем случайный тип усиления
        const powerUpType = this.selectRandomPowerUpType();
        if (!powerUpType) return;
        
        // Выбираем случайную позицию для спавна
        const spawnPosition = this.getRandomSpawnPosition();
        
        // Создаем усиление
        const powerUp = new PowerUp(this.scene, spawnPosition.x, spawnPosition.y, powerUpType);
        
        // Применяем специальные эффекты
        this.applySpecialEffects(powerUp, powerUpType);
        
        // Увеличиваем счетчик усилений
        this.powerUpCount++;
        
        // Добавляем в группу усилений
        this.scene.powerUpGroup.add(powerUp);
        
        // Настраиваем физику
        this.scene.physics.add.existing(powerUp);
        
        // Настраиваем коллизии
        this.setupPowerUpCollisions(powerUp);
        
        // Создаем эффект появления
        this.createSpawnEffect(powerUp);
    }

    selectRandomPowerUpType() {
        const availablePowerUps = Array.from(this.powerUps.entries())
            .filter(([key, powerUp]) => powerUp.unlocked);
        
        if (availablePowerUps.length === 0) return null;
        
        // Вычисляем общую редкость
        const totalRarity = availablePowerUps.reduce((sum, [key, powerUp]) => {
            return sum + (powerUp.rarity * this.rarityMultiplier);
        }, 0);
        
        // Выбираем случайное усиление с учетом редкости
        const random = Math.random() * totalRarity;
        let cumulativeRarity = 0;
        
        for (const [key, powerUp] of availablePowerUps) {
            cumulativeRarity += powerUp.rarity * this.rarityMultiplier;
            if (random <= cumulativeRarity) {
                return key;
            }
        }
        
        return availablePowerUps[0][0];
    }

    getRandomSpawnPosition() {
        // Выбираем случайную позицию на экране
        const margin = 100;
        const width = this.scene.cameras.main.width;
        const height = this.scene.cameras.main.height;
        
        let x, y;
        let attempts = 0;
        const maxAttempts = 10;
        
        do {
            x = margin + Math.random() * (width - 2 * margin);
            y = margin + Math.random() * (height - 2 * margin);
            attempts++;
        } while (this.isPositionOccupied(x, y) && attempts < maxAttempts);
        
        return { x, y };
    }

    isPositionOccupied(x, y) {
        // Проверяем, не занята ли позиция другими объектами
        const checkDistance = 50;
        
        // Проверяем расстояние до игрока
        if (this.scene.player && this.scene.player.active) {
            const playerDistance = Math.sqrt(
                Math.pow(x - this.scene.player.x, 2) + 
                Math.pow(y - this.scene.player.y, 2)
            );
            if (playerDistance < checkDistance) return true;
        }
        
        // Проверяем расстояние до врагов
        const enemies = this.scene.enemyGroup.getChildren();
        for (const enemy of enemies) {
            if (enemy.active) {
                const enemyDistance = Math.sqrt(
                    Math.pow(x - enemy.x, 2) + 
                    Math.pow(y - enemy.y, 2)
                );
                if (enemyDistance < checkDistance) return true;
            }
        }
        
        // Проверяем расстояние до других усилений
        const powerUps = this.scene.powerUpGroup.getChildren();
        for (const powerUp of powerUps) {
            if (powerUp.active) {
                const powerUpDistance = Math.sqrt(
                    Math.pow(x - powerUp.x, 2) + 
                    Math.pow(y - powerUp.y, 2)
                );
                if (powerUpDistance < checkDistance) return true;
            }
        }
        
        return false;
    }

    applySpecialEffects(powerUp, powerUpType) {
        // Применяем специальные эффекты в зависимости от типа
        switch (powerUpType) {
            case 'health':
                // Усиление здоровья может быть магнитным
                if (Math.random() < 0.3) {
                    powerUp.setMagnetic(this.scene.player, 0.15);
                }
                break;
                
            case 'speed':
                // Усиление скорости может телепортироваться
                if (Math.random() < 0.2) {
                    powerUp.setTeleporting(4000);
                }
                break;
                
            case 'damage':
                // Усиление урона может быть взрывным
                if (Math.random() < 0.4) {
                    powerUp.setExplosive(60, 20);
                }
                break;
                
            case 'fireRate':
                // Усиление скорострельности может быть нестабильным
                if (Math.random() < 0.3) {
                    this.makeUnstable(powerUp);
                }
                break;
        }
    }

    makeUnstable(powerUp) {
        // Делаем усиление нестабильным (меняет цвет и эффекты)
        const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];
        let colorIndex = 0;
        
        const colorTimer = this.scene.time.addEvent({
            delay: 200,
            callback: () => {
                powerUp.setColor(colors[colorIndex]);
                colorIndex = (colorIndex + 1) % colors.length;
            },
            loop: true
        });
        
        // Останавливаем таймер через 5 секунд
        this.scene.time.delayedCall(5000, () => {
            colorTimer.destroy();
            powerUp.setColor(PowerUpTypes.FIRE_RATE.color);
        });
    }

    setupPowerUpCollisions(powerUp) {
        // Коллизии с игроком
        this.scene.physics.add.overlap(
            powerUp,
            this.scene.player,
            (powerUp, player) => {
                this.collectPowerUp(powerUp, player);
            },
            null,
            this.scene
        );
        
        // Коллизии с границами мира
        powerUp.body.onWorldBounds = true;
        this.scene.physics.world.on('worldbounds', (body) => {
            if (body.gameObject === powerUp) {
                this.destroyPowerUp(powerUp);
            }
        });
    }

    createSpawnEffect(powerUp) {
        // Создаем эффект появления усиления
        const spawnParticles = this.scene.add.particles('projectile_basic');
        const spawnEmitter = spawnParticles.createEmitter({
            x: powerUp.x,
            y: powerUp.y,
            speed: { min: 30, max: 80 },
            scale: { start: 0.5, end: 0 },
            alpha: { start: 1, end: 0 },
            tint: powerUp.color,
            lifespan: 600,
            frequency: 30
        });
        
        // Останавливаем эмиттер через секунду
        this.scene.time.delayedCall(1000, () => {
            spawnEmitter.stop();
            this.scene.time.delayedCall(600, () => {
                spawnParticles.destroy();
            });
        });
        
        // Создаем эффект появления
        powerUp.setScale(0);
        this.scene.tweens.add({
            targets: powerUp,
            scaleX: 1,
            scaleY: 1,
            duration: 500,
            ease: 'Back.easeOut'
        });
    }

    collectPowerUp(powerUp, player) {
        if (powerUp.isCollected) return;
        
        // Применяем эффект усиления
        this.applyPowerUp(player, powerUp);
        
        // Уменьшаем счетчик усилений
        this.powerUpCount--;
        
        // Уничтожаем усиление
        this.destroyPowerUp(powerUp);
    }

    applyPowerUp(player, powerUp) {
        const powerUpType = powerUp.type;
        const powerUpData = this.powerUps.get(powerUpType);
        
        if (!powerUpData) return;
        
        // Применяем эффект к игроку
        player.addEffect(powerUpType, {
            effect: powerUpData.effect,
            value: powerUpData.value,
            duration: powerUpData.duration
        });
        
        // Добавляем в активные усиления
        this.activePowerUps.set(powerUpType, {
            startTime: Date.now(),
            endTime: powerUpData.duration > 0 ? Date.now() + powerUpData.duration : 0,
            value: powerUpData.value
        });
        
        // Уведомляем сцену о получении усиления
        this.scene.events.emit('powerUpCollected', powerUpType);
        
        // Создаем эффект применения
        this.createApplyEffect(player, powerUpType);
        
        // Обновляем UI
        this.updatePowerUpUI();
    }

    createApplyEffect(player, powerUpType) {
        // Создаем эффект применения усиления
        const effectNames = {
            'health': 'ЗДОРОВЬЕ +20',
            'speed': 'СКОРОСТЬ +50%',
            'damage': 'УРОН +100%',
            'fireRate': 'СКОРОСТРЕЛЬНОСТЬ +100%'
        };
        
        const effectText = this.scene.add.text(
            player.x,
            player.y - 50,
            effectNames[powerUpType] || 'УСИЛЕНИЕ!',
            {
                fontSize: '20px',
                fill: '#ffff00',
                fontFamily: 'Arial',
                stroke: '#ff8800',
                strokeThickness: 3
            }
        ).setOrigin(0.5);
        
        // Анимация текста
        this.scene.tweens.add({
            targets: effectText,
            y: player.y - 100,
            alpha: 0,
            scaleX: 1.3,
            scaleY: 1.3,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => {
                effectText.destroy();
            }
        });
        
        // Эффект частиц вокруг игрока
        const applyParticles = this.scene.add.particles('projectile_basic');
        const applyEmitter = applyParticles.createEmitter({
            follow: player,
            speed: { min: 40, max: 100 },
            scale: { start: 0.4, end: 0 },
            alpha: { start: 0.8, end: 0 },
            tint: PowerUpTypes[powerUpType.toUpperCase()]?.color || 0xffff00,
            lifespan: 800,
            frequency: 40
        });
        
        // Останавливаем эмиттер через 2 секунды
        this.scene.time.delayedCall(2000, () => {
            applyEmitter.stop();
            this.scene.time.delayedCall(800, () => {
                applyParticles.destroy();
            });
        });
    }

    updatePowerUpUI() {
        // Обновляем UI активных усилений
        // Можно добавить отображение активных эффектов
        this.scene.events.emit('powerUpUIUpdated', this.activePowerUps);
    }

    destroyPowerUp(powerUp) {
        // Уничтожаем усиление
        powerUp.destroy();
    }

    // Методы для управления системой
    pauseSpawning() {
        if (this.spawnTimer) {
            this.spawnTimer.paused = true;
        }
    }

    resumeSpawning() {
        if (this.spawnTimer) {
            this.spawnTimer.paused = false;
        }
    }

    stopSpawning() {
        if (this.spawnTimer) {
            this.spawnTimer.destroy();
            this.spawnTimer = null;
        }
    }

    setSpawnRate(rate) {
        this.spawnRate = rate;
        if (this.spawnTimer) {
            this.spawnTimer.delay = rate;
        }
    }

    setMaxPowerUps(max) {
        this.maxPowerUps = max;
    }

    setRarityMultiplier(multiplier) {
        this.rarityMultiplier = multiplier;
    }

    // Методы для разблокировки усилений
    unlockPowerUp(powerUpKey) {
        const powerUp = this.powerUps.get(powerUpKey);
        if (powerUp) {
            powerUp.unlocked = true;
        }
    }

    lockPowerUp(powerUpKey) {
        const powerUp = this.powerUps.get(powerUpKey);
        if (powerUp) {
            powerUp.unlocked = false;
        }
    }

    // Методы для получения информации
    getActivePowerUps() {
        return this.activePowerUps;
    }

    getPowerUpInfo(powerUpKey) {
        return this.powerUps.get(powerUpKey);
    }

    getAvailablePowerUps() {
        return Array.from(this.powerUps.entries())
            .filter(([key, powerUp]) => powerUp.unlocked)
            .map(([key]) => key);
    }

    getPowerUpCount() {
        return this.powerUpCount;
    }

    // Методы для очистки
    clearActivePowerUps() {
        this.activePowerUps.clear();
        this.updatePowerUpUI();
    }

    removePowerUp(powerUpType) {
        this.activePowerUps.delete(powerUpType);
        this.updatePowerUpUI();
    }

    // Методы для отладки
    debugPowerUpInfo() {
        console.log('=== PowerUp System Debug Info ===');
        console.log('Active PowerUps:', this.activePowerUps);
        console.log('PowerUp Count:', this.powerUpCount);
        console.log('Max PowerUps:', this.maxPowerUps);
        console.log('Spawn Rate:', this.spawnRate);
        console.log('Rarity Multiplier:', this.rarityMultiplier);
        console.log('Available PowerUps:', this.getAvailablePowerUps());
        console.log('=================================');
    }

    // Методы для сохранения/загрузки
    savePowerUpData() {
        return {
            activePowerUps: Object.fromEntries(this.activePowerUps),
            unlockedPowerUps: this.getAvailablePowerUps()
        };
    }

    loadPowerUpData(data) {
        if (data.activePowerUps) {
            Object.entries(data.activePowerUps).forEach(([key, value]) => {
                this.activePowerUps.set(key, value);
            });
        }
        
        if (data.unlockedPowerUps) {
            // Сначала блокируем все
            Array.from(this.powerUps.keys()).forEach(key => {
                this.lockPowerUp(key);
            });
            
            // Затем разблокируем нужные
            data.unlockedPowerUps.forEach(key => {
                this.unlockPowerUp(key);
            });
        }
        
        this.updatePowerUpUI();
    }
}
