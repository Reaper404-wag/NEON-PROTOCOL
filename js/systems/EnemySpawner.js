// Система спавна врагов
class EnemySpawner {
    constructor(scene) {
        this.scene = scene;
        this.spawnPoints = [];
        this.spawnPatterns = new Map();
        this.currentPattern = 'basic';
        this.difficulty = 1.0;
        this.maxEnemies = 50;
        
        // Настройки спавна
        this.spawnRate = GameConstants.ENEMY_SPAWN_RATE;
        this.spawnTimer = null;
        this.enemyCount = 0;
        
        // Инициализируем систему
        this.initSpawnPoints();
        this.initSpawnPatterns();
        this.startSpawning();
    }

    initSpawnPoints() {
        // Создаем точки спавна по краям экрана
        const margin = 50;
        const width = this.scene.cameras.main.width;
        const height = this.scene.cameras.main.height;
        
        // Верхний край
        for (let x = margin; x < width - margin; x += 100) {
            this.spawnPoints.push({ x: x, y: -margin, direction: 'down' });
        }
        
        // Нижний край
        for (let x = margin; x < width - margin; x += 100) {
            this.spawnPoints.push({ x: x, y: height + margin, direction: 'up' });
        }
        
        // Левый край
        for (let y = margin; y < height - margin; y += 100) {
            this.spawnPoints.push({ x: -margin, y: y, direction: 'right' });
        }
        
        // Правый край
        for (let y = margin; y < height - margin; y += 100) {
            this.spawnPoints.push({ x: width + margin, y: y, direction: 'left' });
        }
        
        // Угловые точки
        this.spawnPoints.push({ x: -margin, y: -margin, direction: 'diagonal' });
        this.spawnPoints.push({ x: width + margin, y: -margin, direction: 'diagonal' });
        this.spawnPoints.push({ x: -margin, y: height + margin, direction: 'diagonal' });
        this.spawnPoints.push({ x: width + margin, y: height + margin, direction: 'diagonal' });
    }

    initSpawnPatterns() {
        // Базовый паттерн - случайные враги
        this.spawnPatterns.set('basic', {
            name: 'Базовый',
            description: 'Случайные враги появляются по краям экрана',
            spawnFunction: this.basicSpawn.bind(this),
            difficulty: 1.0
        });
        
        // Волновой паттерн - группы врагов
        this.spawnPatterns.set('wave', {
            name: 'Волновой',
            description: 'Враги появляются волнами',
            spawnFunction: this.waveSpawn.bind(this),
            difficulty: 1.2
        });
        
        // Спиральный паттерн - враги по спирали
        this.spawnPatterns.set('spiral', {
            name: 'Спиральный',
            description: 'Враги появляются по спиральной траектории',
            spawnFunction: this.spiralSpawn.bind(this),
            difficulty: 1.5
        });
        
        // Круговой паттерн - враги по кругу
        this.spawnPatterns.set('circle', {
            name: 'Круговой',
            description: 'Враги появляются по кругу вокруг игрока',
            spawnFunction: this.circleSpawn.bind(this),
            difficulty: 1.8
        });
        
        // Босс паттерн - появление босса
        this.spawnPatterns.set('boss', {
            name: 'Босс',
            description: 'Появляется сильный враг',
            spawnFunction: this.bossSpawn.bind(this),
            difficulty: 2.0
        });
    }

    startSpawning() {
        // Запускаем основной таймер спавна
        this.spawnTimer = this.scene.time.addEvent({
            delay: this.spawnRate,
            callback: this.spawnEnemies,
            callbackScope: this,
            loop: true
        });
        
        // Запускаем таймер смены паттернов
        this.scene.time.addEvent({
            delay: 30000, // каждые 30 секунд
            callback: this.changePattern,
            callbackScope: this,
            loop: true
        });
    }

    spawnEnemies() {
        if (this.enemyCount >= this.maxEnemies) return;
        
        // Получаем текущий паттерн
        const pattern = this.spawnPatterns.get(this.currentPattern);
        if (pattern) {
            pattern.spawnFunction();
        }
    }

    basicSpawn() {
        // Случайно выбираем точку спавна
        const spawnPoint = this.getRandomSpawnPoint();
        if (!spawnPoint) return;
        
        // Случайно выбираем тип врага
        const enemyType = this.getRandomEnemyType();
        
        // Создаем врага
        const enemy = new Enemy(this.scene, spawnPoint.x, spawnPoint.y, enemyType);
        
        // Настраиваем направление движения
        this.setEnemyDirection(enemy, spawnPoint.direction);
        
        // Увеличиваем счетчик врагов
        this.enemyCount++;
        
        // Добавляем в группу врагов
        this.scene.enemyGroup.add(enemy);
        
        // Настраиваем физику
        this.scene.physics.add.existing(enemy);
        
        // Настраиваем коллизии
        this.setupEnemyCollisions(enemy);
    }

    waveSpawn() {
        // Создаем волну из нескольких врагов
        const waveSize = Math.min(3 + Math.floor(this.difficulty), 8);
        const spawnPoint = this.getRandomSpawnPoint();
        
        if (!spawnPoint) return;
        
        for (let i = 0; i < waveSize; i++) {
            if (this.enemyCount >= this.maxEnemies) break;
            
            // Создаем врага с небольшой задержкой
            this.scene.time.delayedCall(i * 200, () => {
                const enemyType = this.getRandomEnemyType();
                const enemy = new Enemy(this.scene, spawnPoint.x, spawnPoint.y, enemyType);
                
                // Настраиваем направление движения
                this.setEnemyDirection(enemy, spawnPoint.direction);
                
                // Увеличиваем счетчик врагов
                this.enemyCount++;
                
                // Добавляем в группу врагов
                this.scene.enemyGroup.add(enemy);
                
                // Настраиваем физику
                this.scene.physics.add.existing(enemy);
                
                // Настраиваем коллизии
                this.setupEnemyCollisions(enemy);
            });
        }
    }

    spiralSpawn() {
        // Создаем врагов по спиральной траектории
        const spiralSize = Math.min(5 + Math.floor(this.difficulty), 12);
        const centerX = this.scene.cameras.main.centerX;
        const centerY = this.scene.cameras.main.centerY;
        const radius = 100;
        
        for (let i = 0; i < spiralSize; i++) {
            if (this.enemyCount >= this.maxEnemies) break;
            
            // Вычисляем позицию по спирали
            const angle = (i / spiralSize) * Math.PI * 4;
            const distance = radius + (i * 20);
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            
            // Создаем врага
            const enemyType = this.getRandomEnemyType();
            const enemy = new Enemy(this.scene, x, y, enemyType);
            
            // Увеличиваем счетчик врагов
            this.enemyCount++;
            
            // Добавляем в группу врагов
            this.scene.enemyGroup.add(enemy);
            
            // Настраиваем физику
            this.scene.physics.add.existing(enemy);
            
            // Настраиваем коллизии
            this.setupEnemyCollisions(enemy);
        }
    }

    circleSpawn() {
        // Создаем врагов по кругу вокруг игрока
        if (!this.scene.player || !this.scene.player.active) return;
        
        const circleSize = Math.min(4 + Math.floor(this.difficulty), 10);
        const radius = 150;
        
        for (let i = 0; i < circleSize; i++) {
            if (this.enemyCount >= this.maxEnemies) break;
            
            // Вычисляем позицию по кругу
            const angle = (i / circleSize) * Math.PI * 2;
            const x = this.scene.player.x + Math.cos(angle) * radius;
            const y = this.scene.player.y + Math.sin(angle) * radius;
            
            // Создаем врага
            const enemyType = this.getRandomEnemyType();
            const enemy = new Enemy(this.scene, x, y, enemyType);
            
            // Увеличиваем счетчик врагов
            this.enemyCount++;
            
            // Добавляем в группу врагов
            this.scene.enemyGroup.add(enemy);
            
            // Настраиваем физику
            this.scene.physics.add.existing(enemy);
            
            // Настраиваем коллизии
            this.setupEnemyCollisions(enemy);
        }
    }

    bossSpawn() {
        // Создаем босса
        if (this.enemyCount >= this.maxEnemies) return;
        
        // Выбираем случайную точку спавна
        const spawnPoint = this.getRandomSpawnPoint();
        if (!spawnPoint) return;
        
        // Создаем босса (танк враг)
        const boss = new Enemy(this.scene, spawnPoint.x, spawnPoint.y, 'tank');
        
        // Увеличиваем характеристики босса
        boss.health *= 2;
        boss.maxHealth = boss.health;
        boss.damage *= 1.5;
        boss.speed *= 0.8;
        boss.score *= 3;
        
        // Увеличиваем размер босса
        boss.setScale(1.5);
        
        // Увеличиваем счетчик врагов
        this.enemyCount++;
        
        // Добавляем в группу врагов
        this.scene.enemyGroup.add(boss);
        
        // Настраиваем физику
        this.scene.physics.add.existing(boss);
        
        // Настраиваем коллизии
        this.setupEnemyCollisions(boss);
        
        // Создаем эффект появления босса
        this.createBossSpawnEffect(boss);
    }

    createBossSpawnEffect(boss) {
        // Создаем эффект появления босса
        const warningText = this.scene.add.text(
            this.scene.cameras.main.centerX,
            this.scene.cameras.main.centerY - 100,
            'ВНИМАНИЕ! ПОЯВЛЯЕТСЯ БОСС!',
            {
                fontSize: '48px',
                fill: '#ff0000',
                fontFamily: 'Arial',
                stroke: '#660000',
                strokeThickness: 4
            }
        ).setOrigin(0.5);
        
        // Анимация предупреждения
        this.scene.tweens.add({
            targets: warningText,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 500,
            yoyo: true,
            repeat: 3,
            onComplete: () => {
                warningText.destroy();
            }
        });
        
        // Тряска экрана
        this.scene.cameras.main.shake(1000, 0.02);
        
        // Эффект частиц для босса
        const bossParticles = this.scene.add.particles('projectile_basic');
        const bossEmitter = bossParticles.createEmitter({
            follow: boss,
            speed: { min: 30, max: 80 },
            scale: { start: 0.6, end: 0 },
            alpha: { start: 0.8, end: 0 },
            tint: 0xff0000,
            lifespan: 800,
            frequency: 50
        });
        
        // Останавливаем эмиттер через 3 секунды
        this.scene.time.delayedCall(3000, () => {
            bossEmitter.stop();
            this.scene.time.delayedCall(800, () => {
                bossParticles.destroy();
            });
        });
    }

    getRandomSpawnPoint() {
        if (this.spawnPoints.length === 0) return null;
        
        // Выбираем случайную точку спавна
        const randomIndex = Math.floor(Math.random() * this.spawnPoints.length);
        return this.spawnPoints[randomIndex];
    }

    getRandomEnemyType() {
        const types = ['basic', 'fast', 'tank'];
        const weights = [0.6, 0.3, 0.1]; // Вероятности появления
        
        const random = Math.random();
        let cumulativeWeight = 0;
        
        for (let i = 0; i < types.length; i++) {
            cumulativeWeight += weights[i];
            if (random <= cumulativeWeight) {
                return types[i];
            }
        }
        
        return 'basic';
    }

    setEnemyDirection(enemy, direction) {
        switch (direction) {
            case 'down':
                enemy.moveDirection = { x: 0, y: 1 };
                break;
            case 'up':
                enemy.moveDirection = { x: 0, y: -1 };
                break;
            case 'left':
                enemy.moveDirection = { x: -1, y: 0 };
                break;
            case 'right':
                enemy.moveDirection = { x: 1, y: 0 };
                break;
            case 'diagonal':
                const angle = Math.random() * Math.PI * 2;
                enemy.moveDirection = {
                    x: Math.cos(angle),
                    y: Math.sin(angle)
                };
                break;
        }
    }

    setupEnemyCollisions(enemy) {
        // Коллизии с игроком
        this.scene.physics.add.collider(
            enemy,
            this.scene.player,
            (enemy, player) => {
                // Обработка коллизии происходит в GameScene
            },
            null,
            this.scene
        );
        
        // Коллизии с снарядами
        this.scene.physics.add.overlap(
            enemy,
            this.scene.projectileGroup,
            (enemy, projectile) => {
                // Обработка попадания происходит в GameScene
            },
            null,
            this.scene
        );
    }

    changePattern() {
        // Случайно выбираем новый паттерн
        const patterns = Array.from(this.spawnPatterns.keys());
        const currentIndex = patterns.indexOf(this.currentPattern);
        
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * patterns.length);
        } while (newIndex === currentIndex);
        
        this.currentPattern = patterns[newIndex];
        
        // Показываем уведомление о смене паттерна
        this.showPatternChangeNotification();
        
        // Обновляем сложность
        this.updateDifficulty();
    }

    showPatternChangeNotification() {
        const pattern = this.spawnPatterns.get(this.currentPattern);
        if (!pattern) return;
        
        const notification = this.scene.add.text(
            this.scene.cameras.main.centerX,
            this.scene.cameras.main.centerY + 200,
            `ПАТТЕРН: ${pattern.name}`,
            {
                fontSize: '24px',
                fill: '#00ffff',
                fontFamily: 'Arial',
                stroke: '#003333',
                strokeThickness: 2
            }
        ).setOrigin(0.5);
        
        // Анимация уведомления
        this.scene.tweens.add({
            targets: notification,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 300,
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                notification.destroy();
            }
        });
    }

    updateDifficulty() {
        // Увеличиваем сложность со временем
        this.difficulty += 0.1;
        
        // Обновляем скорость спавна
        this.spawnRate = Math.max(500, GameConstants.ENEMY_SPAWN_RATE - (this.difficulty * 50));
        
        // Обновляем таймер спавна
        if (this.spawnTimer) {
            this.spawnTimer.delay = this.spawnRate;
        }
        
        // Обновляем максимальное количество врагов
        this.maxEnemies = Math.min(100, 50 + Math.floor(this.difficulty * 10));
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

    setMaxEnemies(max) {
        this.maxEnemies = max;
    }

    setPattern(patternKey) {
        if (this.spawnPatterns.has(patternKey)) {
            this.currentPattern = patternKey;
            this.showPatternChangeNotification();
        }
    }

    // Методы для получения информации
    getCurrentPattern() {
        return this.spawnPatterns.get(this.currentPattern);
    }

    getAvailablePatterns() {
        return Array.from(this.spawnPatterns.keys());
    }

    getEnemyCount() {
        return this.enemyCount;
    }

    getDifficulty() {
        return this.difficulty;
    }

    // Методы для отладки
    debugSpawnInfo() {
        console.log('=== Enemy Spawner Debug Info ===');
        console.log('Current Pattern:', this.currentPattern);
        console.log('Difficulty:', this.difficulty);
        console.log('Spawn Rate:', this.spawnRate);
        console.log('Max Enemies:', this.maxEnemies);
        console.log('Current Enemies:', this.enemyCount);
        console.log('Spawn Points:', this.spawnPoints.length);
        console.log('===============================');
    }

    // Методы для очистки
    cleanup() {
        this.stopSpawning();
        this.spawnPoints = [];
        this.spawnPatterns.clear();
        this.enemyCount = 0;
    }
}
