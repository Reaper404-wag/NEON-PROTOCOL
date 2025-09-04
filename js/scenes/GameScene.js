// Основная игровая сцена
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.gameTime = 0;
        this.score = 0;
        this.level = 1;
        this.enemiesKilled = 0;
        this.gameIsOver = false; // Флаг окончания игры
        this.gameIsPaused = false; // Флаг паузы игры
        this.lowHpMusicPlaying = false; // Флаг для предотвращения повторного запуска low_hp музыки
    }

    create() {
        console.log('=== GAME SCENE CREATE START ===');
        
        // ВАЖНО: Сбрасываем все флаги состояния при создании/рестарте сцены
        this.gameIsOver = false;
        this.gameIsPaused = false;
        this.lowHpMusicPlaying = false;
        this.gameTime = 0;
        this.score = 0;
        this.level = 1;
        this.enemiesKilled = 0;
        
        console.log('Game state reset: gameIsOver =', this.gameIsOver, 'gameIsPaused =', this.gameIsPaused);
        
        // Инициализируем игровые системы
        this.initGameSystems();
        
        // Создаем игровой мир
        this.createGameWorld();
        
        // Создаем игрока
        this.createPlayer();
        
        // Настраиваем камеру после создания игрока
        this.setupCamera();
        
        // Создаем UI
        this.createUI();
        
        // ВАЖНО: Обновляем UI сразу после создания чтобы показать правильные значения
        this.updateAllUI();
        
        // Создаем эффект виньетки (временно отключен)
        // this.createVignetteEffect();
        
        // Настраиваем управление
        this.setupControls();
        
        // Запускаем игровые циклы
        this.startGameLoops();
        
        // Добавляем обработчики событий
        this.setupEventHandlers();
        
        // Запускаем фоновую музыку
        if (this.audioManager) {
            this.time.delayedCall(1000, () => {
                this.audioManager.startGameMusic();
            });
        }
        
        console.log('=== GAME SCENE CREATE COMPLETED SUCCESSFULLY ===');
        console.log('Player exists:', !!this.player);
        console.log('Controls setup:', !!this.cursors, !!this.wasd);
        console.log('Game should be fully functional now!');
    }

    initGameSystems() {
        // Инициализируем основные системы
        this.backgroundManager = new BackgroundManager(this);
        this.boundarySystem = new BoundarySystem(this);
        this.buffSystem = new BuffSystem(this);
        
        // Получаем AudioManager из registry
        this.audioManager = this.registry.get('audioManager');
        if (!this.audioManager) {
            console.warn('AudioManager not found in registry, creating new one');
            this.audioManager = new AudioManager(this);
            this.audioManager.createAudioObjects();
            // Сохраняем обратно в registry
            this.registry.set('audioManager', this.audioManager);
        }
        console.log('AudioManager initialized in GameScene');
        
        // Инициализируем системы врагов и стрельбы
        this.enemySpawnTimer = null;
        this.playerProjectiles = [];
        this.enemyProjectiles = [];
        
        // Группа хилок
        this.healItemGroup = this.add.group();
        
        // Игровые группы
        this.playerGroup = this.add.group();
        this.enemyGroup = this.add.group();
        this.playerProjectileGroup = this.add.group();
        this.enemyProjectileGroup = this.add.group();
        this.powerUpGroup = this.add.group();
        this.effectGroup = this.add.group();
        this.droneGroup = this.add.group();
        
        // Инициализируем систему дронов
        this.drones = [];
    }

    createGameWorld() {
        // Создаем фон с помощью BackgroundManager
        this.background = this.backgroundManager.createBackground();
        
        // Размеры мира теперь точно равны размерам bg.png изображения
        console.log('Background created with original size - world bounds = image bounds');
        
        console.log('Background created:', this.background);
        console.log('BackgroundManager analysis:', this.backgroundManager.analysis);
        
        // ОТКЛЮЧАЕМ создание дополнительных барьеров - используем только физические границы мира
        // const worldWidth = this.backgroundManager.analysis.worldWidth || 3200;
        // const worldHeight = this.backgroundManager.analysis.worldHeight || 1800;
        // this.boundarySystem.createBoundaries(worldWidth, worldHeight);
        console.log('Boundary system disabled - using only world physics bounds');
        
        // Получаем визуальные границы из фона и создаем дополнительные барьеры
        const visualBoundaries = this.backgroundManager.getVisualBoundaries();
        if (visualBoundaries && visualBoundaries.length > 0) {
            this.boundarySystem.createVisualBarriers(visualBoundaries);
        }
        
        // Если фон не загрузился, добавляем простую сетку для ориентации
        if (!this.background || !this.textures.exists('background')) {
            console.log('Using fallback grid for navigation');
            this.createGrid();
        }
        
        console.log('Game world created with background and boundaries');
    }
    
    setupCamera() {
        // Настраиваем камеру для следования за игроком
        this.cameras.main.setBounds(0, 0, 1280, 720);
        this.cameras.main.setZoom(1);
        
        console.log('Setting up camera...');
        console.log('BackgroundManager analysis:', this.backgroundManager?.analysis);
        
        // Настраиваем камеру для следования за игроком
        if (this.backgroundManager && this.backgroundManager.analysis) {
            const worldWidth = this.backgroundManager.analysis.worldWidth || 3200;
            const worldHeight = this.backgroundManager.analysis.worldHeight || 1800;
            this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
        } else {
            this.cameras.main.setBounds(0, 0, 3200, 1800);
        }
        
        // Включаем ПЛАВНОЕ следование камеры за игроком
        this.cameras.main.startFollow(this.player, true, 0.05, 0.05); // Уменьшили с 0.1 до 0.05
        this.cameras.main.setDeadzone(50, 50); // Добавляем мертвую зону
        console.log('Camera setup completed - smooth following enabled');
    }
    
    createGrid() {
        const graphics = this.add.graphics();
        graphics.lineStyle(1, 0x003344, 0.3);
        
        // Вертикальные линии
        for (let x = 0; x <= 1280; x += 64) {
            graphics.moveTo(x, 0);
            graphics.lineTo(x, 720);
        }
        
        // Горизонтальные линии
        for (let y = 0; y <= 720; y += 64) {
            graphics.moveTo(0, y);
            graphics.lineTo(1280, y);
        }
    }

    createPlayer() {
        // Создаем простого игрока (временно без спрайтов)
        // Уменьшаем размер игрока для лучшего соответствия карте
        // Позиционируем игрока в центре экрана (на карте)
        let playerX, playerY;
    
        // Размещаем игрока в центре bg.png изображения
        if (this.backgroundManager && this.backgroundManager.analysis) {
            const bgAnalysis = this.backgroundManager.analysis;
            if (bgAnalysis.worldWidth && bgAnalysis.worldHeight) {
                playerX = bgAnalysis.worldWidth / 2;
                playerY = bgAnalysis.worldHeight / 2;
                console.log('Player positioned at center of bg.png:', playerX, playerY);
            } else {
                playerX = this.cameras.main.centerX;  // Fallback к центру экрана
                playerY = this.cameras.main.centerY;
            }
        } else {
            playerX = this.cameras.main.centerX;  // Fallback к центру экрана
            playerY = this.cameras.main.centerY;
        }
        
        console.log('Player will be created at:', playerX, playerY);
        
        this.player = new GifPlayer(this, playerX, playerY);
        this.playerGroup.add(this.player);
        
        // Физика уже добавлена в конструкторе GifPlayer
        
        // Устанавливаем границы мира точно по размерам ВИДИМОЙ карты
        if (this.backgroundManager && this.backgroundManager.analysis) {
            const worldWidth = this.backgroundManager.analysis.worldWidth || 3200;
            const worldHeight = this.backgroundManager.analysis.worldHeight || 1800;
            this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
            this.player.body.setCollideWorldBounds(true); // ВКЛЮЧАЕМ автостопку у краев мира
            console.log(`Physics world bounds set to background size: ${worldWidth}x${worldHeight}`);
        } else {
            this.physics.world.setBounds(0, 0, 3200, 1800);
            this.player.body.setCollideWorldBounds(true);
            console.log('Using fallback world bounds: 3200x1800');
        }
        
        // Инициализируем систему урона от границ (без дополнительных коллизий)
        this.boundaryDamageActive = false;
        this.lastBoundaryDamage = 0;
        
        console.log('Boundary damage system initialized without additional colliders');
        
        // ВРЕМЕННО: Добавляем визуальные индикаторы границ для отладки
        this.createBoundaryIndicators();
        
        // Временно отключаем коллизии с врагами и усилениями
        // this.physics.add.collider(this.player, this.enemyGroup, this.onPlayerEnemyCollision, null, this);
        // this.physics.add.overlap(this.player, this.powerUpGroup, this.onPlayerPowerUpCollision, null, this);
        
        // ГЛОБАЛЬНАЯ коллизия: снаряды врагов попадают в игрока
        this.physics.add.overlap(this.enemyProjectileGroup, this.player, (projectile, player) => {
            this.onEnemyProjectilePlayerCollision(player, projectile);
        }, null, this);
        
        // Коллизия игрока с хилками
        this.physics.add.overlap(this.player, this.healItemGroup, (player, healItem) => {
            this.onPlayerHealItemCollision(player, healItem);
        }, null, this);
        
        // Инициализируем здоровье игрока и баффы
        this.resetPlayerStats();
        
        // Добавляем текст "ИГРОК" над персонажем
        this.playerText = this.add.text(this.player.x, this.player.y - 30, 'ИГРОК', {
            fontSize: '12px',
            fill: '#ffffff',
            fontFamily: 'Sansation'
        }).setOrigin(0.5);
        
        console.log('Player created with boundary collision');
    }
    
    resetPlayerStats() {
        // Сбрасываем все характеристики игрока до начальных значений
        this.player.health = 100;
        this.player.maxHealth = 100;
        this.player.damageMultiplier = 1;
        this.player.speedMultiplier = 1;
        this.player.fireRateMultiplier = 1;
        this.player.armorReduction = 0;
        this.player.criticalChance = 0;
        this.player.regenRate = 0;
        this.player.magnetRadius = 0;
        this.player.experienceMultiplier = 1;
        this.player.projectileCount = 1;
        this.player.projectileSpeed = 1;
        this.player.piercing = 0;
        this.player.explosiveRadius = 0;
        
        // Сбрасываем активные баффы
        if (this.buffSystem) {
            this.buffSystem.activeBuffs = {};
        }
        
        // Удаляем всех дронов
        this.drones.forEach(drone => {
            if (drone && drone.active) {
                drone.destroy();
            }
        });
        this.drones = [];
        
        console.log('Player stats reset to default values');
    }
    
    createDrone() {
        if (!this.player) return;
        
        const drone = this.add.circle(this.player.x, this.player.y, 8, 0x00ffff); // Бирюзовый дрон
        this.physics.add.existing(drone);
        this.droneGroup.add(drone);
        
        // Параметры дрона
        drone.orbitRadius = 80 + (this.drones.length * 20); // Увеличиваем радиус для каждого дрона
        drone.orbitAngle = Math.random() * Math.PI * 2; // Случайный начальный угол
        drone.orbitSpeed = 0.02; // Скорость вращения
        drone.shootCooldown = 1000; // Стреляет каждую секунду
        drone.lastShot = 0;
        drone.damage = 8; // Меньше урона чем у игрока
        
        this.drones.push(drone);
        console.log('Drone created! Total drones:', this.drones.length);
        
        return drone;
    }
    
    updateDrones() {
        // НЕ обновляем дронов если игра на паузе
        if (this.gameIsPaused || !this.player || this.drones.length === 0) return;
        
        this.drones.forEach((drone, index) => {
            if (!drone || !drone.active) return;
            
            // Обновляем позицию дрона (вращение вокруг игрока)
            drone.orbitAngle += drone.orbitSpeed;
            const x = this.player.x + Math.cos(drone.orbitAngle) * drone.orbitRadius;
            const y = this.player.y + Math.sin(drone.orbitAngle) * drone.orbitRadius;
            
            drone.setPosition(x, y);
            
            // Проверяем стрельбу дрона
            const currentTime = this.time.now;
            if (currentTime - drone.lastShot > drone.shootCooldown) {
                this.droneShoot(drone);
                drone.lastShot = currentTime;
            }
        });
    }
    
    droneShoot(drone) {
        if (!drone || !this.player) return;
        
        // Ищем ближайшего врага
        let nearestEnemy = null;
        let nearestDistance = Infinity;
        
        this.enemyGroup.children.entries.forEach(enemy => {
            if (enemy && enemy.active) {
                const distance = Phaser.Math.Distance.Between(
                    drone.x, drone.y,
                    enemy.x, enemy.y
                );
                
                if (distance < nearestDistance && distance < 250) { // Дальность стрельбы дрона
                    nearestDistance = distance;
                    nearestEnemy = enemy;
                }
            }
        });
        
        console.log('Drone shooting check:', {
            droneExists: !!drone,
            playerExists: !!this.player,
            enemyCount: this.enemyGroup.children.entries.length,
            nearestEnemy: !!nearestEnemy,
            nearestDistance: nearestDistance
        });
        
        // Стреляем в ближайшего врага
        if (nearestEnemy) {
            const projectile = this.add.circle(drone.x, drone.y, 2, 0x00ffff); // Маленький снаряд дрона
            this.physics.add.existing(projectile);
            this.playerProjectileGroup.add(projectile);
            
            // Вычисляем направление
            const angle = Phaser.Math.Angle.Between(
                drone.x, drone.y,
                nearestEnemy.x, nearestEnemy.y
            );
            
            // Устанавливаем скорость снаряда
            const speed = 300;
            projectile.body.setVelocity(
                Math.cos(angle) * speed,
                Math.sin(angle) * speed
            );
            
            // Добавляем урон
            projectile.damage = drone.damage;
            
            // Настраиваем коллизию с врагами
            this.physics.add.overlap(projectile, this.enemyGroup, (proj, enemy) => {
                this.onPlayerProjectileEnemyCollision(proj, enemy);
            });
            
            // Воспроизводим звук стрельбы дрона (тот же что у игрока, но реже)
            if (this.audioManager && this.audioManager.playPlayerShoot) {
                // Дрон стреляет тем же звуком что игрок, но реже
                if (Math.random() < 0.3) { // 30% шанс воспроизвести звук
                    this.audioManager.playPlayerShoot();
                }
            }
        }
    }

    createUI() {
        // Создаем простой UI, зафиксированный к камере
        
        // Вычисляем размеры видео персонажа
        const videoScale = 0.5;
        const videoOriginalWidth = 200; // Примерный размер
        const videoOriginalHeight = 150;
        const videoWidth = videoOriginalWidth * videoScale;
        const videoHeight = videoOriginalHeight * videoScale;
        
        // Здоровье игрока (по центру экрана внизу, увеличенный размер)
        const healthX = this.cameras.main.centerX; // По центру экрана
        const healthY = this.cameras.main.height - 50; // Внизу экрана
        
        this.healthText = this.add.text(healthX, healthY, `HP: 100`, {
            fontSize: '48px', // Увеличен в 1.5 раза (32px * 1.5 = 48px)
            fill: '#ff0000',
            fontFamily: 'Sansation',
            fontStyle: 'bold'
        });
        this.healthText.setOrigin(0.5, 1); // По центру горизонтально, снизу вертикально
        this.healthText.setScrollFactor(0); // Фиксируем к камере
        
        // UI информация размещена правее от видео персонажа
        const uiStartX = videoWidth + 320; // Отступ 320px от видео (120 + 200)
        const uiStartY = this.cameras.main.height - 200; // Начинаем UI выше от нижнего края
        
        // Счет (правее от видео)
        this.scoreText = this.add.text(uiStartX, uiStartY, `СЧЕТ: ${this.score}`, {
            fontSize: '24px', // Уменьшаем размер для читаемости
            fill: '#00ff00',
            fontFamily: 'Sansation'
        });
        this.scoreText.setScrollFactor(0); // Фиксируем к камере
        
        // Время игры (правее от видео)
        this.timeText = this.add.text(uiStartX, uiStartY + 30, `ВРЕМЯ: 0:00`, {
            fontSize: '24px', // Уменьшаем размер для читаемости
            fill: '#00ff00',
            fontFamily: 'Sansation'
        });
        this.timeText.setScrollFactor(0); // Фиксируем к камере
        
        // Уровень (правее от видео)
        this.levelText = this.add.text(uiStartX, uiStartY + 60, `УРОВЕНЬ: ${this.level}`, {
            fontSize: '24px', // Уменьшаем размер для читаемости
            fill: '#00ff00',
            fontFamily: 'Sansation'
        });
        this.levelText.setScrollFactor(0); // Фиксируем к камере
        
        // Убито врагов (правее от видео)
        this.killsText = this.add.text(uiStartX, uiStartY + 90, `УБИТО: ${this.enemiesKilled}`, {
            fontSize: '24px', // Уменьшаем размер для читаемости
            fill: '#00ff00',
            fontFamily: 'Sansation'
        });
        this.killsText.setScrollFactor(0); // Фиксируем к камере
        
        // Полоска здоровья
        this.createHealthBar();
        
        // Добавляем видео персонажа в левый нижний угол
        console.log('=== CREATING PLAYER VIDEO ===');
        // Создаем видео персонажа
        this.createPlayerVideo();
        
        // Добавляем подсказки управления (в правом нижнем углу)
        this.escText = this.add.text(this.cameras.main.width - 20, this.cameras.main.height - 60, 'ESC - Настройки\nАвтострельба по курсору', {
            fontSize: '18px', // Уменьшаем размер подсказки
            fill: '#00ff00',
            fontFamily: 'Sansation',
            align: 'right'
        });
        this.escText.setOrigin(1, 1); // Правый нижний угол
        this.escText.setScrollFactor(0); // Фиксируем к камере
    }
    
    createPlayerVideo() {
        console.log('=== CREATING PLAYER VIDEO ===');
        try {
            // Позиция в левом нижнем углу (0, высота экрана)
            const videoX = 0;  // Левый край экрана
            const videoY = this.cameras.main.height; // Нижний край экрана

            // Создаем видео персонажа
            this.playerVideoSimple = this.add.video(videoX, videoY, 'player_video');
            
            if (this.playerVideoSimple) {
                // Базовые настройки
                this.playerVideoSimple.setOrigin(0, 1); // левый нижний угол
                this.playerVideoSimple.setDepth(2000);
                this.playerVideoSimple.setScrollFactor(0); // Фиксируем к камере
                
                // Размер и видимость через задержку
                this.time.delayedCall(50, () => {
                    if (this.playerVideoSimple) {
                        this.playerVideoSimple.setScale(0.5); // Уменьшенный размер
                        this.playerVideoSimple.setVisible(true);
                        this.playerVideoSimple.setLoop(true);
                        this.playerVideoSimple.setInteractive();
                    }
                });
                
                // Автозапуск видео
                this.time.delayedCall(100, () => {
                    if (this.playerVideoSimple) {
                        try {
                            this.playerVideoSimple.play();
                            console.log('Player video started successfully');
                        } catch (e) {
                            console.warn('Player video play failed:', e);
                        }
                    }
                });
                
                console.log(`Player video created at: ${videoX}, ${videoY} (left-bottom corner) with scale 0.5`);
            } else {
                console.warn('Player video creation returned null');
            }
        } catch (error) {
            console.error('Player video creation failed:', error);
        }
    }

    createVideoFallback(x, y, width, height) {
        console.log('Creating video fallback at:', x, y);
        
        // Создаем простую анимированную заглушку
        const fallbackRect = this.add.rectangle(x, y, width, height, 0x0066ff);
        fallbackRect.setOrigin(0, 0);
        fallbackRect.setDepth(1000);
        fallbackRect.setScrollFactor(0); // Фиксируем к камере
        
        const fallbackText = this.add.text(x + width/2, y + height/2, 'ВИДЕО\nПЕРСОНАЖА', {
            fontSize: '16px',
            fill: '#ffffff',
            fontFamily: 'Sansation',
            align: 'center'
        });
        fallbackText.setOrigin(0.5);
        fallbackText.setDepth(1001);
        fallbackText.setScrollFactor(0); // Фиксируем к камере
        
        // Простая анимация пульсации
        this.tweens.add({
            targets: fallbackRect,
            alpha: 0.7,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
        
        console.log('Video fallback created successfully');
    }

    startBoundaryDamage() {
        this.boundaryDamageActive = true;
        console.log('Started taking boundary damage');
    }

    stopBoundaryDamage() {
        this.boundaryDamageActive = false;
        console.log('Stopped taking boundary damage');
    }

    updateBoundaryDamage() {
        // Сначала проверяем, касается ли игрок границы СЕЙЧАС
        const isNearBoundary = this.checkPlayerNearBoundary();
        
        if (isNearBoundary && !this.boundaryDamageActive) {
            // Начинаем урон только если игрок касается границы
            this.startBoundaryDamage();
        } else if (!isNearBoundary && this.boundaryDamageActive) {
            // Останавливаем урон если игрок отошел от границы
            this.stopBoundaryDamage();
        }
        
        // Наносим урон только если игрок АКТИВНО касается границы
        if (this.boundaryDamageActive && isNearBoundary && this.player && this.player.health > 0) {
            const currentTime = this.time.now;
            
            // Проверяем, прошла ли секунда с последнего урона
            if (currentTime - this.lastBoundaryDamage >= 1000) {
                // Наносим ТОЧНО 5 урона каждую секунду
                this.player.health = Math.max(0, this.player.health - 5);
                this.lastBoundaryDamage = currentTime;
                
                // Обновляем UI
                this.healthText.setText(`HP: ${this.player.health}`);
                this.updateHealthBar(this.player.health);
                
                // Создаем эффект получения урона с правильной цифрой
                this.createDamageEffect(this.player.x, this.player.y, 5);
                
                // Воспроизводим звук получения урона от границ
                if (this.audioManager && this.audioManager.playDamageSound) {
                    this.audioManager.playDamageSound();
                }
                
                // Добавляем вибрацию камеры
                this.cameras.main.shake(100, 0.01);
                
                console.log(`Player took 5 boundary damage! Health: ${this.player.health}`);
                
                // Проверяем смерть только если игра еще не окончена
                if (this.player.health <= 0 && !this.gameIsOver) {
                    this.gameOver();
                }
            }
        }
    }

    checkPlayerNearBoundary() {
        if (!this.player) return false;
        
        // Получаем РЕАЛЬНЫЕ размеры мира из физики
        const worldBounds = this.physics.world.bounds;
        const margin = 30; // Уменьшили отступ для более точного определения
        
        const playerX = this.player.x;
        const playerY = this.player.y;
        
        // Проверяем близость к РЕАЛЬНЫМ границам физического мира
        const nearLeft = playerX < worldBounds.x + margin;
        const nearRight = playerX > worldBounds.right - margin;
        const nearTop = playerY < worldBounds.y + margin;
        const nearBottom = playerY > worldBounds.bottom - margin;
        
        if (nearLeft || nearRight || nearTop || nearBottom) {
            console.log(`Player near boundary at ${playerX}, ${playerY} - Left:${nearLeft} Right:${nearRight} Top:${nearTop} Bottom:${nearBottom}`);
        }
        
        return nearLeft || nearRight || nearTop || nearBottom;
    }

    createHealthBar() {
        // Полоска здоровья (под HP текстом)
        const barWidth = 200;
        const barHeight = 20;
        const videoWidth = 200;
        const videoHeight = 150;
        const barX = 240; // Справа от видео
        const barY = this.cameras.main.height - videoHeight + 50; // Под HP текстом
        
        // Удалены HP bar и 100/100 текст по просьбе пользователя
        // Оставляем только основной HP текст
    }

    setupControls() {
        // Управление с клавиатуры
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,A,S,D');
        
        // Тестовая стрельба отключена - уровень повышается только за убийства врагов
        
        // Пауза (временно отключено)
        // this.input.keyboard.on('keydown-P', () => {
        //     this.scene.pause();
        //     this.scene.launch('PauseScene');
        // });
        
        // Эта кнопка уже добавлена в createUI()
        
        // Автоматическая стрельба по курсору (2 выстрела/сек)
        this.setupAutoShooting();
        
        // Обработчик ESC - ПРОСТЫЕ НАСТРОЙКИ (с защитой от спама)
        this.lastEscPress = 0;
        this.input.keyboard.on('keydown-ESC', () => {
            const currentTime = this.time.now;
            if (currentTime - this.lastEscPress < 500) { // Защита от спама - 500ms
                console.log('ESC pressed too frequently, ignoring...');
                return;
            }
            this.lastEscPress = currentTime;
            
            console.log('ESC PRESSED! Opening simple settings...');
            this.openSimpleSettings();
        });
    }

    startGameLoops() {
        // Основной игровой цикл
        this.gameTimer = this.time.addEvent({
            delay: 1000,
            callback: this.updateGameTime,
            callbackScope: this,
            loop: true
        });
        
        // Спавн врагов
        this.enemySpawnTimer = this.time.addEvent({
            delay: 3000, // Каждые 3 секунды
            callback: this.spawnEnemies,
            callbackScope: this,
            loop: true
        });
        
        // this.powerUpTimer = this.time.addEvent({
        //     delay: 10000, // каждые 10 секунд
        //     callback: this.spawnPowerUp,
        //     callbackScope: this,
        //     loop: true
        // });
        
        // Убираем автоматическое повышение уровня по времени
        // Теперь уровень повышается только за убийства врагов
        
        // Настройки прогрессии по уровням
        this.levelRequirements = [
            0,   // Уровень 1 - стартовый
            10,  // Уровень 2 - 10 убийств
            30,  // Уровень 3 - еще 20 убийств (всего 30)
            70,  // Уровень 4 - еще 40 убийств (всего 70)
            110, // Уровень 5 - еще 40 убийств (всего 110)
            150, // Уровень 6 - еще 40 убийств (всего 150)
            190, // И так далее по 40...
            230,
            270,
            310
        ];
        
        console.log('Level progression system initialized');
    }

    setupEventHandlers() {
        // Обработчик смерти врага
        this.events.on('enemyKilled', this.onEnemyKilled, this);
        
        // Обработчик получения урона игроком
        this.events.on('playerDamaged', this.onPlayerDamaged, this);
        
        // Обработчик получения усиления
        this.events.on('powerUpCollected', this.onPowerUpCollected, this);
    }

    update() {
        // ОТЛАДОЧНЫЙ режим - упрощенный update
        try {
            // Проверяем, не на паузе ли игра
            if (this.gameIsPaused) {
                return; // Не обновляем ничего если игра на паузе
            }
            
            // Обновляем движение игрока
            this.updatePlayerMovement();
            
            // Обновляем анимацию игрока
            if (this.player && this.player.update) {
                this.player.update();
            }
            
            // Обновляем UI
            this.updateUI();
            
            // Обновляем урон от границ
            this.updateBoundaryDamage();
            
            // Обновляем врагов, снаряды и дронов
            this.updateEnemies();
            this.updateProjectiles();
            this.updateDrones();
        } catch (error) {
            console.error('Update loop error:', error);
        }
    }
    
    updatePlayerMovement() {
        if (!this.player) {
            console.warn('Player missing!');
            return;
        }
        
        if (!this.player.active) {
            console.warn('Player not active!');
            return;
        }
        
        // Сбрасываем скорость
        this.player.body.setVelocity(0, 0);
        
        // Проверяем нажатые клавиши
        const cursors = this.cursors;
        const wasd = this.wasd;
        
        let speed = 240; // Увеличили с 200 до 240 (200 * 1.2)
        let moved = false;
        
        // Стрелки или WASD
        if (cursors.left.isDown || wasd.A.isDown) {
            this.player.body.setVelocityX(-speed);
            moved = true;
        } else if (cursors.right.isDown || wasd.D.isDown) {
            this.player.body.setVelocityX(speed);
            moved = true;
        }
        
        if (cursors.up.isDown || wasd.W.isDown) {
            this.player.body.setVelocityY(-speed);
            moved = true;
        } else if (cursors.down.isDown || wasd.S.isDown) {
            this.player.body.setVelocityY(speed);
            moved = true;
        }
        
        // Отладочное сообщение при движении (отключено)
        // if (moved) {
        //     console.log(`Player moved to: ${this.player.x}, ${this.player.y}`);
        // }
        
        // Обновляем позицию текста игрока
        if (this.playerText) {
            this.playerText.setPosition(this.player.x, this.player.y - 30);
        }
        
        // Проверяем близость к границам (осторожно, может вызывать зависание)
        try {
            if (this.boundarySystem && this.boundarySystem.checkPlayerBounds) {
                const boundaryCheck = this.boundarySystem.checkPlayerBounds(this.player, 100);
                if (boundaryCheck && boundaryCheck.nearBoundary) {
                    // Можно добавить визуальную индикацию близости к границе
                    // console.log('Near boundary:', boundaryCheck.boundaries);
                }
            }
        } catch (error) {
            // Игнорируем ошибки границ, чтобы не крашить игру
            // console.warn('Boundary check error:', error);
        }
    }

    updateGameTime() {
        this.gameTime++;
        this.updateTimeDisplay();
    }

    updateTimeDisplay() {
        const minutes = Math.floor(this.gameTime / 60);
        const seconds = this.gameTime % 60;
        this.timeText.setText(`ВРЕМЯ: ${minutes}:${seconds.toString().padStart(2, '0')}`);
    }

    spawnEnemies() {
        // Количество врагов зависит от уровня (начинаем с малого количества)
        const baseCount = Math.min(1 + Math.floor(this.level / 3), 4); // 1-4 врага максимум
        const enemyCount = Math.max(1, baseCount);
        
        console.log(`Spawning ${enemyCount} enemies for level ${this.level}`);
        
        // Генерируем разнесенные позиции для всех врагов сразу
        const spawnPositions = this.generateSpreadSpawnPositions(enemyCount);
        
        for (let i = 0; i < enemyCount; i++) {
            this.spawnRandomEnemyAtPosition(spawnPositions[i]);
        }
    }
    
    generateSpreadSpawnPositions(count) {
        const positions = [];
        const camera = this.cameras.main;
        const margin = 100;
        const minDistance = 120; // Минимальное расстояние между врагами
        
        // Определяем доступные стороны экрана
        const sides = [
            { name: 'top', weight: 1 },
            { name: 'right', weight: 1 },
            { name: 'bottom', weight: 1 },
            { name: 'left', weight: 1 }
        ];
        
        for (let i = 0; i < count; i++) {
            let position;
            let attempts = 0;
            const maxAttempts = 20;
            
            do {
                // Выбираем случайную сторону
                const randomSide = sides[Math.floor(Math.random() * sides.length)];
                position = this.getPositionOnSide(randomSide.name, camera, margin);
                attempts++;
                
                // Проверяем расстояние от других позиций
                let validPosition = true;
                for (const existingPos of positions) {
                    const distance = Phaser.Math.Distance.Between(
                        position.x, position.y,
                        existingPos.x, existingPos.y
                    );
                    if (distance < minDistance) {
                        validPosition = false;
                        break;
                    }
                }
                
                if (validPosition || attempts >= maxAttempts) {
                    break;
                }
            } while (attempts < maxAttempts);
            
            positions.push(position);
        }
        
        console.log(`Generated ${positions.length} spread spawn positions:`, positions);
        return positions;
    }
    
    getPositionOnSide(side, camera, margin) {
        let x, y;
        
        switch (side) {
            case 'top':
                x = camera.scrollX + Math.random() * camera.width;
                y = camera.scrollY - margin;
                break;
            case 'right':
                x = camera.scrollX + camera.width + margin;
                y = camera.scrollY + Math.random() * camera.height;
                break;
            case 'bottom':
                x = camera.scrollX + Math.random() * camera.width;
                y = camera.scrollY + camera.height + margin;
                break;
            case 'left':
                x = camera.scrollX - margin;
                y = camera.scrollY + Math.random() * camera.height;
                break;
        }
        
        // Ограничиваем границами мира
        const worldBounds = this.physics.world.bounds;
        x = Phaser.Math.Clamp(x, 0, worldBounds.width);
        y = Phaser.Math.Clamp(y, 0, worldBounds.height);
        
        return { x, y };
    }

    spawnRandomEnemyAtPosition(position) {
        // Случайный тип врага
        const enemyTypes = ['assault', 'tank', 'mage'];
        const randomType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        
        let enemy;
        switch (randomType) {
            case 'assault':
                enemy = new GifAssaultEnemy(this, position.x, position.y);
                break;
            case 'tank':
                enemy = new GifTankEnemy(this, position.x, position.y);
                break;
            case 'mage':
                enemy = new GifMageEnemy(this, position.x, position.y);
                break;
        }
        
        if (enemy) {
            this.enemyGroup.add(enemy);
            
            // Настраиваем коллизии с снарядами игрока
            this.physics.add.overlap(this.playerProjectileGroup, enemy, this.onPlayerProjectileEnemyCollision, null, this);
            
            console.log(`Spawned ${randomType} enemy at ${position.x}, ${position.y}`);
        }
    }
    
    spawnRandomEnemy() {
        // Спавним врага за пределами экрана (старый метод для совместимости)
        const spawnPosition = this.getOffScreenSpawnPosition();
        this.spawnRandomEnemyAtPosition(spawnPosition);
    }
    
    getOffScreenSpawnPosition() {
        const camera = this.cameras.main;
        const margin = 100; // Отступ за экраном
        
        // Случайная сторона экрана (0-3: верх, право, низ, лево)
        const side = Math.floor(Math.random() * 4);
        let x, y;
        
        switch (side) {
            case 0: // Верх
                x = camera.scrollX + Math.random() * camera.width;
                y = camera.scrollY - margin;
                break;
            case 1: // Право
                x = camera.scrollX + camera.width + margin;
                y = camera.scrollY + Math.random() * camera.height;
                break;
            case 2: // Низ
                x = camera.scrollX + Math.random() * camera.width;
                y = camera.scrollY + camera.height + margin;
                break;
            case 3: // Лево
                x = camera.scrollX - margin;
                y = camera.scrollY + Math.random() * camera.height;
                break;
        }
        
        // Ограничиваем границами мира
        const worldBounds = this.physics.world.bounds;
        x = Phaser.Math.Clamp(x, 0, worldBounds.width);
        y = Phaser.Math.Clamp(y, 0, worldBounds.height);
        
        return { x, y };
    }

    spawnPowerUp() {
        const powerUp = this.powerUpSystem.spawnPowerUp();
        if (powerUp) {
            this.powerUpGroup.add(powerUp);
        }
    }

    checkLevelUp() {
        // Проверяем, достаточно ли убийств для следующего уровня
        let requiredKills = this.getRequiredKillsForLevel(this.level + 1);
        
        if (this.enemiesKilled >= requiredKills) {
            this.levelUp();
        }
    }

    getRequiredKillsForLevel(level) {
        if (level <= this.levelRequirements.length) {
            return this.levelRequirements[level - 1];
        } else {
            // После 10 уровня добавляем по 40 убийств за каждый уровень
            const baseKills = this.levelRequirements[this.levelRequirements.length - 1];
            const extraLevels = level - this.levelRequirements.length;
            return baseKills + (extraLevels * 40);
        }
    }

    levelUp() {
        this.level++;
        this.levelText.setText(`УРОВЕНЬ: ${this.level}`);
        
        console.log(`Level up! New level: ${this.level}, Kills: ${this.enemiesKilled}`);
        
        // Показываем уведомление о новом уровне
        this.showLevelUpNotification();
        
        // Показываем выбор баффов
        this.time.delayedCall(1500, () => {
            this.showBuffSelection();
        });
    }

    showLevelUpNotification() {
        const notification = this.add.text(640, 200, `УРОВЕНЬ ${this.level}!`, {
            fontSize: '48px',
            fill: '#00ff00',
            fontFamily: 'Sansation',
            stroke: '#003300',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: notification,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 500,
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                notification.destroy();
            }
        });
    }

    onPlayerEnemyCollision(player, enemy) {
        // Игрок получает урон
        player.takeDamage(enemy.damage);
        this.events.emit('playerDamaged', player.health);
        
        // Создаем эффект получения урона
        this.createDamageEffect(player.x, player.y);
        
        // Проверяем, не умер ли игрок
        if (player.health <= 0) {
            this.gameOver();
        }
    }

    onProjectileEnemyCollision(projectile, enemy) {
        // Враг получает урон
        enemy.takeDamage(projectile.damage);
        
        // Уничтожаем снаряд
        projectile.destroy();
        
        // Проверяем, не умер ли враг
        if (enemy.health <= 0) {
            this.onEnemyKilled(enemy);
        }
    }

    onPlayerPowerUpCollision(player, powerUp) {
        // Игрок подбирает усиление
        this.powerUpSystem.applyPowerUp(player, powerUp);
        this.events.emit('powerUpCollected', powerUp.type);
        
        // Уничтожаем усиление
        powerUp.destroy();
    }

    onEnemyKilled(enemy) {
        // Увеличиваем счет
        this.score += enemy.score || 10;
        this.enemiesKilled++;
        
        // Обновляем UI
        this.scoreText.setText(`СЧЕТ: ${this.score}`);
        this.killsText.setText(`УБИТО: ${this.enemiesKilled}`);
        
        // Создаем эффект смерти врага
        this.createEnemyDeathEffect(enemy.x, enemy.y);
        
        // 50/50 шанс выпадения хилки
        if (Math.random() < 0.5) {
            this.createHealDrop(enemy.x, enemy.y);
        }
        
        // ВАЖНО: Проверяем повышение уровня
        this.checkLevelUp();
        
        // Проверяем достижения
        this.checkAchievements();
        
        console.log(`Enemy killed! Total: ${this.enemiesKilled}, Next level at: ${this.getRequiredKillsForLevel(this.level + 1)}`);
    }
    
    updateEnemies() {
        // НЕ обновляем врагов если игра на паузе
        if (this.gameIsPaused) return;
        
        // Обновляем всех врагов
        this.enemyGroup.children.entries.forEach(enemy => {
            if (enemy && enemy.update) {
                enemy.update(this.time.now, this.game.loop.delta);
            }
        });
    }
    
    updateProjectiles() {
        // НЕ обновляем снаряды если игра на паузе (кроме снарядов игрока)
        // Снаряды игрока продолжают лететь, снаряды врагов останавливаются
        
        // Обновляем снаряды игрока (всегда активны)
        this.playerProjectileGroup.children.entries.forEach(projectile => {
            if (projectile && projectile.active) {
                // Проверяем, не вышел ли снаряд за границы экрана
                const camera = this.cameras.main;
                if (projectile.x < camera.scrollX - 100 || 
                    projectile.x > camera.scrollX + camera.width + 100 ||
                    projectile.y < camera.scrollY - 100 || 
                    projectile.y > camera.scrollY + camera.height + 100) {
                    projectile.destroy();
                }
                
                // Обновляем самонаводящиеся снаряды
                if (projectile.isHoming && projectile.homingTarget && projectile.homingTarget.active && projectile.body && projectile.body.velocity) {
                    const target = projectile.homingTarget;
                    const angle = Phaser.Math.Angle.Between(
                        projectile.x, projectile.y,
                        target.x, target.y
                    );
                    
                    const currentVelocity = projectile.body.velocity;
                    const homingForce = projectile.homingStrength || 0.02;
                    
                    projectile.body.setVelocity(
                        currentVelocity.x + Math.cos(angle) * homingForce * 100,
                        currentVelocity.y + Math.sin(angle) * homingForce * 100
                    );
                }
            }
        });
        
        // Обновляем снаряды врагов (только если игра НЕ на паузе)
        if (!this.gameIsPaused) {
            this.enemyProjectileGroup.children.entries.forEach(projectile => {
                if (projectile && projectile.active) {
                // Проверяем, не вышел ли снаряд за границы экрана
                const camera = this.cameras.main;
                if (projectile.x < camera.scrollX - 100 || 
                    projectile.x > camera.scrollX + camera.width + 100 ||
                    projectile.y < camera.scrollY - 100 || 
                    projectile.y > camera.scrollY + camera.height + 100) {
                    projectile.destroy();
                }
                
                // Обновляем самонаводящиеся снаряды врагов
                if (projectile.isHoming && projectile.homingTarget && projectile.homingTarget.active && projectile.body && projectile.body.velocity) {
                    const target = projectile.homingTarget;
                    const angle = Phaser.Math.Angle.Between(
                        projectile.x, projectile.y,
                        target.x, target.y
                    );
                    
                    const currentVelocity = projectile.body.velocity;
                    const homingForce = projectile.homingStrength || 0.02;
                    
                    projectile.body.setVelocity(
                        currentVelocity.x + Math.cos(angle) * homingForce * 100,
                        currentVelocity.y + Math.sin(angle) * homingForce * 100
                    );
                }
            }
            });
        }
    }
    
    createEnemyProjectile(fromX, fromY, toX, toY, speed, damage, color) {
        // Создаем снаряд врага
        const projectile = this.add.circle(fromX, fromY, 4, color);
        this.physics.add.existing(projectile);
        this.enemyProjectileGroup.add(projectile);
        
        // Вычисляем направление
        const angle = Phaser.Math.Angle.Between(fromX, fromY, toX, toY);
        
        // Устанавливаем скорость
        projectile.body.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );
        
        // Добавляем урон
        projectile.damage = damage;
        
        // Коллизия с игроком (только один раз)
        this.physics.add.overlap(projectile, this.player, (proj, player) => {
            this.onEnemyProjectilePlayerCollision(player, proj);
        }, null, this);
        
        return projectile;
    }
    
    onPlayerProjectileEnemyCollision(projectile, enemy) {
        // Снаряд игрока попал во врага
        enemy.takeDamage(10); // Базовый урон игрока
        projectile.destroy();
    }
    
    onEnemyProjectilePlayerCollision(player, projectile) {
        // Объявляем damage ВНЕ try-catch чтобы он был доступен везде
        let damage = 10;
        
        try {
            // Проверяем что игрок еще существует
            if (!player || !player.active || !this.player) {
                console.warn('Player collision but player not active');
                if (projectile && projectile.active) projectile.destroy();
                return;
            }
            
            // Предотвращаем повторные вызовы для того же снаряда
            if (projectile.hasHitPlayer) {
                console.warn('Projectile already hit player, ignoring');
                return;
            }
            projectile.hasHitPlayer = true;
            
            // Снаряд врага попал в игрока
            damage = projectile.damage || 10;
            console.log(`Player taking ${damage} damage`);
            
            // Используем метод takeDamage у GifPlayer если он есть
            if (this.player.takeDamage) {
                this.player.takeDamage(damage);
            } else {
                // Fallback для обычного игрока
                this.player.health = Math.max(0, this.player.health - damage);
            }
            
            // Безопасное обновление UI
            if (this.healthText) {
                this.healthText.setText(`HP: ${this.player.health}`);
            }
            if (this.updateHealthBar) {
                this.updateHealthBar(this.player.health);
            }
            
            // Безопасная проверка низкого HP
            try {
                this.checkLowHP();
            } catch (hpError) {
                console.error('Error in checkLowHP:', hpError);
            }
            
            // Безопасный эффект урона
            try {
                this.createDamageEffect(this.player.x, this.player.y, damage);
            } catch (effectError) {
                console.error('Error creating damage effect:', effectError);
            }
            
            // Безопасный звук урона
            try {
                if (this.audioManager && this.audioManager.playDamageSound) {
                    this.audioManager.playDamageSound();
                }
            } catch (audioError) {
                console.error('Error playing damage sound:', audioError);
            }
            
            // Уничтожаем снаряд
            if (projectile && projectile.active) {
                projectile.destroy();
            }
            
        } catch (error) {
            console.error('Critical error in onEnemyProjectilePlayerCollision:', error);
            // Аварийное уничтожение снаряда
            if (projectile && projectile.active) {
                projectile.destroy();
            }
        }
        
        // Проверяем смерть ТОЛЬКО если здоровье действительно 0 и игра еще не окончена
        if (this.player.health <= 0 && !this.gameIsOver) {
            console.log('Player health is 0, calling game over');
            this.gameOver();
        }
        
        console.log(`Player took ${damage} damage from enemy projectile! Health: ${this.player.health}`);
    }
    
    playerShootManual(pointer) {
        if (!this.player || !this.player.active || this.gameIsPaused || this.gameIsOver) return;
        
        // Стреляем в направлении курсора
        const worldPointer = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
        
        // Создаем снаряд
        const projectile = this.add.circle(this.player.x, this.player.y, 4, 0xffff00); // Больший снаряд игрока
        this.physics.add.existing(projectile);
        this.playerProjectileGroup.add(projectile);
        
        // Вычисляем направление к курсору
        const angle = Phaser.Math.Angle.Between(
            this.player.x, this.player.y,
            worldPointer.x, worldPointer.y
        );
        
        // Устанавливаем скорость снаряда
        const speed = 500; // Быстрее чем у автострельбы
        projectile.body.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );
        
        // Добавляем урон
        projectile.damage = 15; // Больше урона чем у автострельбы
        
        // Настраиваем коллизию с врагами
        this.physics.add.overlap(projectile, this.enemyGroup, (proj, enemy) => {
            this.onPlayerProjectileEnemyCollision(proj, enemy);
        });
        
        // Воспроизводим звук стрельбы игрока
        if (this.audioManager && this.audioManager.playPlayerShoot) {
            this.audioManager.playPlayerShoot();
        }
        
        console.log('Player manual shot fired!');
    }

    playerShoot() {
        if (!this.player || !this.player.active || this.gameIsPaused) return;
        
        // Ищем ближайшего врага
        let nearestEnemy = null;
        let nearestDistance = Infinity;
        
        this.enemyGroup.children.entries.forEach(enemy => {
            if (enemy && enemy.active) {
                const distance = Phaser.Math.Distance.Between(
                    this.player.x, this.player.y,
                    enemy.x, enemy.y
                );
                
                if (distance < nearestDistance && distance < 400) { // Максимальная дальность стрельбы
                    nearestDistance = distance;
                    nearestEnemy = enemy;
                }
            }
        });
        
        // Стреляем в ближайшего врага
        if (nearestEnemy) {
            const projectile = this.add.circle(this.player.x, this.player.y, 3, 0xffff00); // Желтый снаряд
            this.physics.add.existing(projectile);
            this.playerProjectileGroup.add(projectile);
            
            // Вычисляем направление
            const angle = Phaser.Math.Angle.Between(
                this.player.x, this.player.y,
                nearestEnemy.x, nearestEnemy.y
            );
            
            // Устанавливаем скорость снаряда
            const speed = 400;
            projectile.body.setVelocity(
                Math.cos(angle) * speed,
                Math.sin(angle) * speed
            );
            
            // Добавляем урон
            projectile.damage = 10;
            
            // Настраиваем коллизию с врагами
            this.physics.add.overlap(projectile, this.enemyGroup, (proj, enemy) => {
                this.onPlayerProjectileEnemyCollision(proj, enemy);
            });
        }
    }

    onPlayerDamaged(health) {
        // Обновляем UI здоровья
        this.healthText.setText(`HP: ${health}`);
        this.updateHealthBar(health);
        
        // Создаем эффект получения урона
        this.createDamageEffect(this.player.x, this.player.y);
        
        // Воспроизводим звук получения урона
        if (this.audioManager && this.audioManager.playDamageSound) {
            this.audioManager.playDamageSound();
        }
    }

    onPowerUpCollected(type) {
        // Показываем уведомление о полученном усилении
        this.showPowerUpNotification(type);
    }

    updateUI() {
        // Обновляем полоску здоровья
        if (this.player && this.player.active) {
            this.updateHealthBar(this.player.health);
        }
    }
    
    updateAllUI() {
        // Обновляем все элементы UI с текущими значениями
        if (this.healthText) {
            this.healthText.setText(`HP: ${this.player?.health || 100}`);
        }
        if (this.scoreText) {
            this.scoreText.setText(`СЧЕТ: ${this.score}`);
        }
        if (this.timeText) {
            this.updateTimeDisplay();
        }
        if (this.levelText) {
            this.levelText.setText(`УРОВЕНЬ: ${this.level}`);
        }
        if (this.killsText) {
            this.killsText.setText(`УБИТО: ${this.enemiesKilled}`);
        }
        console.log('All UI updated with current values');
    }

    updateHealthBar(health) {
        const maxHealth = 100;
        const barWidth = 200;
        const barHeight = 20;
        const barX = 20;
        const barY = 170;
        
        // HP bar удален по просьбе пользователя - обновляем только основной HP текст
    }

    createDamageEffect(x, y, damage = 5) {
        // Создаем эффект получения урона с правильной цифрой
        const damageText = this.add.text(x, y - 30, `-${damage}`, {
            fontSize: '24px',
            fill: '#ff0000',
            fontFamily: 'Sansation',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: damageText,
            y: y - 80,
            alpha: 0,
            duration: 1000,
            onComplete: () => {
                damageText.destroy();
            }
        });
    }
    
    checkLowHP() {
        if (!this.player || this.gameIsOver) return;
        
        const currentHP = this.player.health;
        
        // Если HP меньше 15 - включаем тревожную музыку (только один раз)
        if (currentHP < 15 && currentHP > 0 && !this.lowHpMusicPlaying) {
            if (this.audioManager && this.audioManager.playLowHpMusic) {
                console.log('Starting low HP music - HP is', currentHP);
                this.audioManager.playLowHpMusic();
                this.lowHpMusicPlaying = true;
            }
        } else if (currentHP >= 15 || currentHP <= 0) {
            // Если HP восстановилось или игрок умер - выключаем тревожную музыку
            if (this.lowHpMusicPlaying && this.audioManager && this.audioManager.stopLowHpMusic) {
                console.log('Stopping low HP music - HP is', currentHP);
                this.audioManager.stopLowHpMusic();
                this.lowHpMusicPlaying = false;
            }
        }
    }

    createEnemyDeathEffect(x, y) {
        // Создаем эффект смерти врага
        const explosion = this.add.image(x, y, 'explosion');
        explosion.setScale(0.5);
        
        this.tweens.add({
            targets: explosion,
            scaleX: 2,
            scaleY: 2,
            alpha: 0,
            duration: 500,
            onComplete: () => {
                explosion.destroy();
            }
        });
    }

    createHealDrop(x, y) {
        // Создаем хилку
        const healItem = this.add.image(x, y, 'heal_item');
        healItem.setScale(0.04); // Уменьшено еще в 4 раза (0.16 / 4 = 0.04)
        
        // Добавляем физику
        this.physics.add.existing(healItem);
        healItem.body.setCollideWorldBounds(true);
        healItem.body.setSize(8, 8); // Уменьшили хитбокс еще больше под крошечный размер
        
        // Случайное количество хп для лечения (10-15)
        healItem.healAmount = Math.floor(Math.random() * 6) + 10; // 10-15
        
        // Добавляем в группу
        this.healItemGroup.add(healItem);
        
        // Пульсирующий эффект
        this.tweens.add({
            targets: healItem,
            scaleX: 0.06, // Уменьшено еще в 4 раза (0.24 / 4 = 0.06)
            scaleY: 0.06, // Уменьшено еще в 4 раза (0.24 / 4 = 0.06)
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Автоудаление через 15 секунд
        this.time.delayedCall(15000, () => {
            if (healItem && healItem.active) {
                this.tweens.add({
                    targets: healItem,
                    alpha: 0,
                    duration: 1000,
                    onComplete: () => {
                        if (healItem && healItem.active) {
                            healItem.destroy();
                        }
                    }
                });
            }
        });
        
        console.log(`Heal drop created at (${x}, ${y}) for ${healItem.healAmount} HP`);
    }

    onPlayerHealItemCollision(player, healItem) {
        // Проверяем, что игрок не на полном хп
        if (player.health >= player.maxHealth) {
            return; // Не подбираем если здоровье полное
        }
        
        // Лечим игрока
        const healAmount = healItem.healAmount;
        const oldHealth = player.health;
        player.health = Math.min(player.health + healAmount, player.maxHealth);
        const actualHeal = player.health - oldHealth;
        
        // Обновляем UI
        if (this.healthText) {
            this.healthText.setText(`HP: ${player.health}/${player.maxHealth}`);
        }
        if (this.updateHealthBar) {
            this.updateHealthBar();
        }
        
        // Создаем эффект лечения
        this.createHealEffect(healItem.x, healItem.y, actualHeal);
        
        // Уничтожаем хилку
        healItem.destroy();
        
        console.log(`Player healed for ${actualHeal} HP! Current health: ${player.health}/${player.maxHealth}`);
    }

    createHealEffect(x, y, healAmount = 0) {
        // Создаем эффект лечения с зеленым текстом
        const healText = this.add.text(x, y - 30, `+${healAmount}`, {
            fontSize: '28px',
            fill: '#00ff00',
            fontFamily: 'Sansation',
            stroke: '#004400',
            strokeThickness: 2
        });
        healText.setOrigin(0.5);
        healText.setDepth(1000);
        
        // Анимация полета вверх и исчезновения
        this.tweens.add({
            targets: healText,
            y: y - 80,
            alpha: 0,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => {
                healText.destroy();
            }
        });
        
        // Эффект зеленых частиц
        const particles = [];
        for (let i = 0; i < 6; i++) {
            const particle = this.add.circle(
                x + (Math.random() - 0.5) * 40,
                y + (Math.random() - 0.5) * 40,
                Math.random() * 4 + 2,
                0x00ff00,
                0.8
            );
            particle.setDepth(999);
            particles.push(particle);
            
            this.tweens.add({
                targets: particle,
                y: particle.y - Math.random() * 50 - 20,
                alpha: 0,
                duration: Math.random() * 1000 + 500,
                ease: 'Power2',
                onComplete: () => {
                    particle.destroy();
                }
            });
        }
    }

    createBoundaryHitEffect(x, y) {
        // Создаем эффект столкновения с границей
        const effect = this.add.circle(x, y, 15, 0xff6600, 0.7);
        
        this.tweens.add({
            targets: effect,
            scaleX: 2,
            scaleY: 2,
            alpha: 0,
            duration: 300,
            onComplete: () => {
                effect.destroy();
            }
        });
        
        // Добавляем небольшую вибрацию камеры
        this.cameras.main.shake(100, 0.01);
    }

    showPowerUpNotification(type) {
        const powerUpNames = {
            'health': 'HP +20',
            'speed': 'СКОРОСТЬ +50%',
            'damage': 'УРОН +100%',
            'fireRate': 'СКОРОСТРЕЛЬНОСТЬ +100%'
        };
        
        const notification = this.add.text(640, 300, powerUpNames[type] || 'УСИЛЕНИЕ!', {
            fontSize: '32px',
            fill: '#ffff00',
            fontFamily: 'Sansation',
            stroke: '#ff8800',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        this.tweens.add({
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

    checkAchievements() {
        // Проверяем достижения
        if (this.enemiesKilled === 100) {
            this.showAchievement('УБИЙЦА', 'Уничтожено 100 врагов!');
        } else if (this.enemiesKilled === 500) {
            this.showAchievement('ИСТРЕБИТЕЛЬ', 'Уничтожено 500 врагов!');
        } else if (this.score >= 10000) {
            this.showAchievement('БОГАТЫРЬ', 'Набрано 10000 очков!');
        }
    }

    showAchievement(title, description) {
        const achievement = this.add.container(1280, 100);
        
        const bg = this.add.rectangle(0, 0, 300, 80, 0x000000, 0.9);
        bg.setStrokeStyle(2, 0x00ff00);
        
        const titleText = this.add.text(0, -15, title, {
            fontSize: '20px',
            fill: '#00ff00',
            fontFamily: 'Sansation'
        }).setOrigin(0.5);
        
        const descText = this.add.text(0, 15, description, {
            fontSize: '14px',
            fill: '#00ffff',
            fontFamily: 'Sansation'
        }).setOrigin(0.5);
        
        achievement.add([bg, titleText, descText]);
        
        // Анимация появления
        this.tweens.add({
            targets: achievement,
            x: 980,
            duration: 500,
            ease: 'Back.easeOut',
            onComplete: () => {
                // Убираем через 3 секунды
                this.time.delayedCall(3000, () => {
                    this.tweens.add({
                        targets: achievement,
                        x: 1280,
                        duration: 500,
                        ease: 'Back.easeIn',
                        onComplete: () => {
                            achievement.destroy();
                        }
                    });
                });
            }
        });
    }

    checkGameOver() {
        if (this.player && this.player.health <= 0) {
            this.gameOver();
        }
    }

    gameOver() {
        // Проверяем, не запущен ли уже Game Over
        if (this.gameIsOver) {
            console.log('Game Over already in progress, ignoring...');
            return;
        }
        
        console.log('Game Over! Player died');
        this.gameIsOver = true; // Устанавливаем флаг
        
        // Останавливаем все системы урона
        this.stopBoundaryDamage();
        
        // Останавливаем ВСЕ игровые циклы и таймеры
        if (this.gameTimer) this.gameTimer.destroy();
        if (this.enemySpawnTimer) this.enemySpawnTimer.destroy();
        if (this.playerShootTimer) this.playerShootTimer.destroy();
        if (this.autoShootTimer) this.autoShootTimer.destroy();
        
        // Устанавливаем паузу игры
        this.gameIsPaused = true;
        
        // Создаем финальное видео ПРЯМО В GAMESCENE
        this.createFinalVideoDirectly();
        
        // Запускаем финальную музыку
        console.log('=== GAME OVER - TRYING TO PLAY OUTRO AUDIO ===');
        console.log('AudioManager exists:', !!this.audioManager);
        
        let audioManager = this.audioManager;
        
        if (!audioManager) {
            console.warn('AudioManager not available, trying registry...');
            audioManager = this.registry.get('audioManager');
        }
        
        if (!audioManager) {
            console.warn('Creating new AudioManager for outro...');
            audioManager = new AudioManager(this);
            audioManager.createAudioObjects();
        }
        
        // Запускаем только аудио
        if (audioManager && audioManager.sounds && audioManager.sounds.the_end) {
            console.log('Playing outro audio...');
            audioManager.sounds.the_end.play();
        } else {
            console.error('CRITICAL: Cannot play outro audio!');
        }
        
        // Создаем финальный экран Game Over
        this.createGameOverScreen();
    }

    createGameOverScreen() {
        console.log('=== CREATING GAME OVER SCREEN ===');
        
        // Показываем экран сразу, чтобы видео было видно поверх
        // Убираем задержку в 5 секунд
        {
            // Затемняем экран
            const overlay = this.add.rectangle(
                this.cameras.main.centerX,
                this.cameras.main.centerY,
                this.cameras.main.width,
                this.cameras.main.height,
                0x000000,
                0.8
            );
            overlay.setScrollFactor(0);
            overlay.setDepth(12000);

            // Время выживания (самый верх, красиво)
            const survivalTimeText = this.add.text(
                this.cameras.main.centerX,
                this.cameras.main.centerY - 250,
                `Время выживания: ${Math.floor(this.gameTime / 60)}:${(this.gameTime % 60).toString().padStart(2, '0')}`,
                {
                    fontSize: '40px', // Умеренный размер
                    fill: '#ffff00', // Желтый цвет для выделения
                    fontFamily: 'Sansation',
                    fontStyle: 'bold'
                }
            );
            survivalTimeText.setOrigin(0.5);
            survivalTimeText.setScrollFactor(0);
            survivalTimeText.setDepth(12001);

            // Заголовок Game Over (центральный элемент)
            const gameOverText = this.add.text(
                this.cameras.main.centerX,
                this.cameras.main.centerY - 180,
                'ИГРА ОКОНЧЕНА',
                {
                    fontSize: '64px', // Читаемый размер
                    fill: '#ff0000',
                    fontFamily: 'Sansation',
                    fontStyle: 'bold'
                }
            );
            gameOverText.setOrigin(0.5);
            gameOverText.setScrollFactor(0);
            gameOverText.setDepth(12001);
            
            // Дополнительный текст (под заголовком)
            const endText = this.add.text(
                this.cameras.main.centerX,
                this.cameras.main.centerY - 120,
                'Спасибо за игру!',
                {
                    fontSize: '36px', // Умеренный размер
                    fill: '#ffffff',
                    fontFamily: 'Sansation'
                }
            );
            endText.setOrigin(0.5);
            endText.setScrollFactor(0);
            endText.setDepth(12001);

            // Статистика (компактно, с нормальными отступами)
            const statsText = this.add.text(
                this.cameras.main.centerX,
                this.cameras.main.centerY - 50,
                `Счет: ${this.score}\n` +
                `Уровень: ${this.level}\n` +
                `Убито врагов: ${this.enemiesKilled}`,
                {
                    fontSize: '28px', // Компактный размер
                    fill: '#ffffff',
                    fontFamily: 'Sansation',
                    align: 'center',
                    lineSpacing: 10 // Нормальные отступы
                }
            );
            statsText.setOrigin(0.5);
            statsText.setScrollFactor(0);
            statsText.setDepth(12001);

            // Кнопки рестарта (внизу, компактно)
            const restartText = this.add.text(
                this.cameras.main.centerX,
                this.cameras.main.centerY + 80,
                'НАЖМИТЕ R ДЛЯ РЕСТАРТА\nИЛИ ESC ДЛЯ МЕНЮ\n\nПРОБЕЛ/ENTER - ПРОПУСТИТЬ ВИДЕО',
                {
                    fontSize: '24px', // Компактный размер
                    fill: '#00ff00',
                    fontFamily: 'Sansation',
                    align: 'center',
                    lineSpacing: 8 // Компактные отступы
                }
            );
            restartText.setOrigin(0.5);
            restartText.setScrollFactor(0);
            restartText.setDepth(12001);

            // Обработчики клавиш
            this.input.keyboard.once('keydown-R', () => {
                console.log('Restarting game - resetting all stats and flags');
                
                // КРИТИЧЕСКИ ВАЖНО: Сбрасываем ВСЕ флаги состояния
                this.gameIsOver = false;
                this.gameIsPaused = false;
                this.lowHpMusicPlaying = false;
                
                // Останавливаем все таймеры перед рестартом
                if (this.gameTimer) this.gameTimer.destroy();
                if (this.enemySpawnTimer) this.enemySpawnTimer.destroy();
                if (this.playerShootTimer) this.playerShootTimer.destroy();
                if (this.autoShootTimer) this.autoShootTimer.destroy();
                
                // Очищаем все обработчики событий
                this.input.removeAllListeners();
                
                console.log('All timers stopped, flags reset, restarting scene...');
                this.scene.restart();
            });

            this.input.keyboard.once('keydown-ESC', () => {
                this.scene.start('MenuScene');
            });
            
            console.log('Game Over screen created immediately - video should be visible on top');
        }
    }

    createBoundaryIndicators() {
        // Создаем ВИДИМЫЕ линии по краям мира для отладки
        const worldBounds = this.physics.world.bounds;
        const graphics = this.add.graphics();
        graphics.lineStyle(4, 0xff0000, 1); // Красные линии толщиной 4px
        
        // Верхняя граница
        graphics.moveTo(worldBounds.x, worldBounds.y);
        graphics.lineTo(worldBounds.right, worldBounds.y);
        
        // Нижняя граница
        graphics.moveTo(worldBounds.x, worldBounds.bottom);
        graphics.lineTo(worldBounds.right, worldBounds.bottom);
        
        // Левая граница
        graphics.moveTo(worldBounds.x, worldBounds.y);
        graphics.lineTo(worldBounds.x, worldBounds.bottom);
        
        // Правая граница
        graphics.moveTo(worldBounds.right, worldBounds.y);
        graphics.lineTo(worldBounds.right, worldBounds.bottom);
        
        graphics.setDepth(1000); // Поверх всего
        
        console.log('Boundary indicators created at:', worldBounds);
    }

    showBuffSelection() {
        console.log('Showing buff selection screen');
        
        // КРИТИЧЕСКИ ВАЖНО: Ставим игру на ПОЛНУЮ паузу
        console.log('=== PAUSING GAME FOR BUFF SELECTION ===');
        this.gameIsPaused = true;
        
        // Останавливаем ВСЕ игровые таймеры
        if (this.gameTimer) this.gameTimer.paused = true;
        if (this.enemySpawnTimer) this.enemySpawnTimer.paused = true;
        if (this.playerShootTimer) this.playerShootTimer.paused = true;
        if (this.autoShootTimer) this.autoShootTimer.paused = true;
        
        // Останавливаем всех врагов (замораживаем их позиции)
        this.enemyGroup.children.entries.forEach(enemy => {
            if (enemy && enemy.body) {
                enemy.pausedVelocityX = enemy.body.velocity.x;
                enemy.pausedVelocityY = enemy.body.velocity.y;
                enemy.body.setVelocity(0, 0); // Полная остановка
            }
        });
        
        // Останавливаем все снаряды врагов
        this.enemyProjectileGroup.children.entries.forEach(projectile => {
            if (projectile && projectile.body) {
                projectile.pausedVelocityX = projectile.body.velocity.x;
                projectile.pausedVelocityY = projectile.body.velocity.y;
                projectile.body.setVelocity(0, 0); // Полная остановка
            }
        });
        
        // Останавливаем дронов
        this.drones.forEach(drone => {
            if (drone && drone.body) {
                drone.pausedVelocityX = drone.body.velocity.x || 0;
                drone.pausedVelocityY = drone.body.velocity.y || 0;
                if (drone.body.setVelocity) drone.body.setVelocity(0, 0);
            }
        });
        
        console.log('All game systems paused for buff selection');
        
        // Получаем 3 случайных баффа
        const availableBuffs = this.buffSystem.getRandomBuffs(3);
        
        // Создаем затемнение экрана
        const overlay = this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            this.cameras.main.width,
            this.cameras.main.height,
            0x000000,
            0.8
        );
        overlay.setScrollFactor(0);
        overlay.setDepth(3000);

        // Заголовок
        const title = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 180,
            `УРОВЕНЬ ${this.level} - ВЫБЕРИТЕ УЛУЧШЕНИЕ`,
            {
                fontSize: '32px',
                fill: '#00ff00',
                fontFamily: 'Sansation',
                fontStyle: 'bold'
            }
        );
        title.setOrigin(0.5);
        title.setScrollFactor(0);
        title.setDepth(3001);
        
        // Индикация паузы
        const pauseIndicator = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 140,
            '⏸️ ИГРА НА ПАУЗЕ ⏸️',
            {
                fontSize: '20px',
                fill: '#ffff00',
                fontFamily: 'Sansation',
                fontStyle: 'bold'
            }
        );
        pauseIndicator.setOrigin(0.5);
        pauseIndicator.setScrollFactor(0);
        pauseIndicator.setDepth(3001);
        
        // Сохраняем ссылку для удаления
        this.buffPauseIndicator = pauseIndicator;

        // Создаем кнопки для каждого баффа
        const buffButtons = [];
        const buttonWidth = 250;
        const buttonHeight = 150;
        const spacing = 280;
        const startX = this.cameras.main.centerX - spacing;

        availableBuffs.forEach((buff, index) => {
            const buttonX = startX + (index * spacing);
            const buttonY = this.cameras.main.centerY;

            // Фон кнопки
            const buttonBg = this.add.rectangle(buttonX, buttonY, buttonWidth, buttonHeight, 0x003300);
            buttonBg.setStrokeStyle(3, 0x00ff00);
            buttonBg.setScrollFactor(0);
            buttonBg.setDepth(3001);
            buttonBg.setInteractive();

            // Иконка баффа
            const icon = this.add.text(buttonX, buttonY - 40, buff.icon, {
                fontSize: '48px'
            });
            icon.setOrigin(0.5);
            icon.setScrollFactor(0);
            icon.setDepth(3002);

            // Название баффа
            const name = this.add.text(buttonX, buttonY, buff.name, {
                fontSize: '16px',
                fill: '#ffffff',
                fontFamily: 'Sansation',
                fontStyle: 'bold',
                align: 'center'
            });
            name.setOrigin(0.5);
            name.setScrollFactor(0);
            name.setDepth(3002);

            // Описание баффа
            const description = this.add.text(buttonX, buttonY + 25, buff.description, {
                fontSize: '12px',
                fill: '#cccccc',
                fontFamily: 'Sansation',
                align: 'center',
                wordWrap: { width: buttonWidth - 20 }
            });
            description.setOrigin(0.5);
            description.setScrollFactor(0);
            description.setDepth(3002);

            // Обработчик клика
            buttonBg.on('pointerdown', () => {
                console.log('=== BUFF BUTTON CLICKED ===');
                console.log('Selected buff:', buff.name, 'ID:', buff.id);
                console.log('BuffSystem exists:', !!this.buffSystem);
                console.log('Player exists:', !!this.player);
                
                this.selectBuff(buff.id);
                this.closeBuffSelection(overlay, title, buffButtons);
            });

            // Эффект наведения
            buttonBg.on('pointerover', () => {
                buttonBg.setFillStyle(0x004400);
                buttonBg.setStrokeStyle(4, 0x00ff00);
            });

            buttonBg.on('pointerout', () => {
                buttonBg.setFillStyle(0x003300);
                buttonBg.setStrokeStyle(3, 0x00ff00);
            });

            buffButtons.push({
                bg: buttonBg,
                icon: icon,
                name: name,
                description: description
            });
        });

        // Инструкция
        this.buffInstructionText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 120,
            'Кликните на улучшение чтобы выбрать',
            {
                fontSize: '18px',
                fill: '#ffff00',
                fontFamily: 'Sansation'
            }
        );
        this.buffInstructionText.setOrigin(0.5);
        this.buffInstructionText.setScrollFactor(0);
        this.buffInstructionText.setDepth(3001);

        // ВАЖНО: НЕ используем scene.pause() - он блокирует input!
        // Используем наш собственный gameIsPaused
        this.gameIsPaused = true;
        
        // Останавливаем игровые таймеры вручную
        if (this.gameTimer) this.gameTimer.paused = true;
        if (this.enemySpawnTimer) this.enemySpawnTimer.paused = true;
        if (this.playerShootTimer) this.playerShootTimer.paused = true;
        
        // ВАЖНО: Временно отключаем обработчик стрельбы для выбора баффов
        // Не удаляем все обработчики, чтобы потом их восстановить
        
        console.log('Buff selection interface created with', buffButtons.length, 'buttons');
    }

    selectBuff(buffId) {
        console.log('=== APPLYING BUFF ===');
        console.log('Buff ID:', buffId);
        console.log('BuffSystem:', this.buffSystem);
        console.log('Player before buff:', this.player?.health, this.player?.maxHealth);
        
        if (!this.buffSystem) {
            console.error('BuffSystem not found!');
            return;
        }
        
        if (!this.player) {
            console.error('Player not found!');
            return;
        }
        
        // Применяем выбранный бафф
        const result = this.buffSystem.applyBuff(buffId, this.player);
        console.log('Buff result:', result);
        console.log('Player after buff:', this.player?.health, this.player?.maxHealth);
        
        // Показываем уведомление о примененном баффе
        if (result) {
            this.showBuffAppliedNotification(result);
        }
        
        // Обновляем UI здоровья если изменилось
        if (this.player.maxHealth) {
            this.updateHealthBar(this.player.health);
            this.healthText.setText(`HP: ${this.player.health}`);
        }
        
        // Проверяем и создаем дронов если получен бафф дрона
        console.log('Drone check:', {
            hasDrone: this.player.hasDrone,
            droneCount: this.player.droneCount,
            currentDrones: this.drones.length
        });
        
        if (this.player.hasDrone && this.player.droneCount > this.drones.length) {
            const dronesToCreate = this.player.droneCount - this.drones.length;
            console.log(`Creating ${dronesToCreate} drones`);
            for (let i = 0; i < dronesToCreate; i++) {
                this.createDrone();
            }
        }
    }

    closeBuffSelection(overlay, title, buffButtons) {
        console.log('=== CLOSING BUFF SELECTION ===');
        
        // Удаляем все элементы интерфейса безопасно
        try {
            if (overlay && overlay.active) overlay.destroy();
            if (title && title.active) title.destroy();
            
            buffButtons.forEach(button => {
                if (button.bg && button.bg.active) button.bg.destroy();
                if (button.icon && button.icon.active) button.icon.destroy();
                if (button.name && button.name.active) button.name.destroy();
                if (button.description && button.description.active) button.description.destroy();
            });
            
            // Удаляем инструкцию если она существует
            if (this.buffInstructionText && this.buffInstructionText.active) {
                this.buffInstructionText.destroy();
                this.buffInstructionText = null;
            }
            
            // Удаляем индикатор паузы
            if (this.buffPauseIndicator && this.buffPauseIndicator.active) {
                this.buffPauseIndicator.destroy();
                this.buffPauseIndicator = null;
            }
        } catch (error) {
            console.warn('Error destroying buff selection UI:', error);
        }

        // КРИТИЧЕСКИ ВАЖНО: Возобновляем игру
        console.log('=== RESUMING GAME AFTER BUFF SELECTION ===');
        this.gameIsPaused = false;
        
        // Возобновляем игровые таймеры
        if (this.gameTimer) this.gameTimer.paused = false;
        if (this.enemySpawnTimer) this.enemySpawnTimer.paused = false;
        if (this.playerShootTimer) this.playerShootTimer.paused = false;
        
        // Возобновляем движение всех врагов
        this.enemyGroup.children.entries.forEach(enemy => {
            if (enemy && enemy.body) {
                const velX = enemy.pausedVelocityX || 0;
                const velY = enemy.pausedVelocityY || 0;
                enemy.body.setVelocity(velX, velY);
                // Очищаем сохраненные скорости
                delete enemy.pausedVelocityX;
                delete enemy.pausedVelocityY;
            }
        });
        
        // Возобновляем движение снарядов врагов
        this.enemyProjectileGroup.children.entries.forEach(projectile => {
            if (projectile && projectile.body) {
                const velX = projectile.pausedVelocityX || 0;
                const velY = projectile.pausedVelocityY || 0;
                projectile.body.setVelocity(velX, velY);
                // Очищаем сохраненные скорости
                delete projectile.pausedVelocityX;
                delete projectile.pausedVelocityY;
            }
        });
        
        // Возобновляем дронов
        this.drones.forEach(drone => {
            if (drone && drone.body) {
                const velX = drone.pausedVelocityX || 0;
                const velY = drone.pausedVelocityY || 0;
                if (drone.body.setVelocity) drone.body.setVelocity(velX, velY);
                // Очищаем сохраненные скорости
                delete drone.pausedVelocityX;
                delete drone.pausedVelocityY;
            }
        });
        
        // ВАЖНО: Восстанавливаем автоматическую стрельбу
        if (this.autoShootTimer) {
            this.autoShootTimer.paused = false;
        } else {
            this.setupAutoShooting();
        }
        
        console.log('Game fully resumed: enemies moving, projectiles flying, timers running');
    }
    
    setupAutoShooting() {
        // Автоматическая стрельба каждые 500мс (2 выстрела/сек)
        this.autoShootTimer = this.time.addEvent({
            delay: 500, // 2 выстрела в секунду
            callback: this.playerAutoShoot,
            callbackScope: this,
            loop: true
        });
        
        console.log('Auto-shooting setup completed: 2 shots per second');
    }
    
    playerAutoShoot() {
        // Не стреляем если игра на паузе, окончена, или игрок неактивен
        if (this.gameIsPaused || this.gameIsOver || !this.player || !this.player.active) {
            return;
        }
        
        // Получаем позицию курсора в мировых координатах
        const pointer = this.input.activePointer;
        const worldPointer = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
        
        // Создаем снаряд
        const projectile = this.add.circle(this.player.x, this.player.y, 4, 0xffff00); // Желтый снаряд
        this.physics.add.existing(projectile);
        this.playerProjectileGroup.add(projectile);
        
        // Вычисляем направление к курсору
        const angle = Phaser.Math.Angle.Between(
            this.player.x, this.player.y,
            worldPointer.x, worldPointer.y
        );
        
        // Устанавливаем скорость снаряда
        const speed = 500;
        projectile.body.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );
        
        // Добавляем урон
        projectile.damage = 15;
        
        // Настраиваем коллизию с врагами
        this.physics.add.overlap(projectile, this.enemyGroup, (proj, enemy) => {
            this.onPlayerProjectileEnemyCollision(proj, enemy);
        });
        
        // Воспроизводим звук стрельбы игрока
        if (this.audioManager && this.audioManager.playPlayerShoot) {
            this.audioManager.playPlayerShoot();
        }
        
        console.log('Auto-shot fired towards cursor');
    }

    showBuffAppliedNotification(result) {
        const notification = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 50,
            `${result.name}\n${result.description}`,
            {
                fontSize: '24px',
                fill: '#00ff00',
                fontFamily: 'Sansation',
                fontStyle: 'bold',
                align: 'center'
            }
        );
        notification.setOrigin(0.5);
        notification.setScrollFactor(0);
        notification.setDepth(4000);

        // Анимация исчезновения
        this.tweens.add({
            targets: notification,
            alpha: 0,
            y: notification.y - 50,
            duration: 3000,
            onComplete: () => {
                notification.destroy();
            }
        });
    }

    createVignetteEffect() {
        console.log('Creating vignette effect...');
        
        // Создаем радиальный градиент для эффекта виньетки
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;
        
        // Создаем графический объект для виньетки
        const vignetteGraphics = this.add.graphics();
        
        // Создаем очень мягкий радиальный градиент
        const centerX = screenWidth / 2;
        const centerY = screenHeight / 2;
        const maxRadius = Math.max(screenWidth, screenHeight) * 1.2;
        const innerRadius = Math.min(screenWidth, screenHeight) * 0.6; // Больше светлая область
        
        // Рисуем круги с очень мягким градиентом
        for (let i = 0; i <= 30; i++) {
            const radius = innerRadius + (maxRadius - innerRadius) * (i / 30);
            const alpha = Math.pow(i / 30, 3) * 0.15; // Очень мягкое затемнение максимум 15%
            
            vignetteGraphics.fillStyle(0x000000, alpha);
            vignetteGraphics.fillCircle(centerX, centerY, radius);
        }
        
        // Создаем текстуру из графики
        vignetteGraphics.generateTexture('vignette', screenWidth, screenHeight);
        vignetteGraphics.destroy();
        
        // Создаем изображение виньетки
        this.vignetteOverlay = this.add.image(centerX, centerY, 'vignette');
        this.vignetteOverlay.setOrigin(0.5);
        this.vignetteOverlay.setScrollFactor(0); // Фиксируем к камере
        this.vignetteOverlay.setDepth(5000); // Поверх игрового контента, но под UI
        this.vignetteOverlay.setBlendMode(Phaser.BlendModes.MULTIPLY); // Эффект затемнения
        
        console.log('Vignette effect created successfully');
    }

    openInGameSettings() {
        try {
            console.log('Opening in-game settings...');
            
            // Приостанавливаем игру
            this.scene.pause();
            
            // Создаем простое затемнение
            this.settingsOverlay = this.add.rectangle(
                this.cameras.main.centerX,
                this.cameras.main.centerY,
                this.cameras.main.width,
                this.cameras.main.height,
                0x000000,
                0.8
            );
            this.settingsOverlay.setScrollFactor(0);
            this.settingsOverlay.setDepth(10000);
            
            // Простой заголовок
            this.settingsTitle = this.add.text(
                this.cameras.main.centerX,
                this.cameras.main.centerY - 100,
                'НАСТРОЙКИ ИГРЫ',
                {
                    fontSize: '32px',
                    fill: '#00ff00',
                    fontFamily: 'Sansation'
                }
            ).setOrigin(0.5);
            this.settingsTitle.setScrollFactor(0);
            this.settingsTitle.setDepth(10001);
            
            // Простая кнопка "Продолжить"
            this.continueButton = this.add.text(
                this.cameras.main.centerX,
                this.cameras.main.centerY,
                'ПРОДОЛЖИТЬ ИГРУ',
                {
                    fontSize: '24px',
                    fill: '#00ff00',
                    fontFamily: 'Sansation'
                }
            ).setOrigin(0.5);
            this.continueButton.setScrollFactor(0);
            this.continueButton.setDepth(10001);
            this.continueButton.setInteractive();
            
            this.continueButton.on('pointerdown', () => {
                this.closeInGameSettings();
            });
            
            // Простая кнопка "Выйти"
            this.exitButton = this.add.text(
                this.cameras.main.centerX,
                this.cameras.main.centerY + 50,
                'ВЫЙТИ В МЕНЮ',
                {
                    fontSize: '24px',
                    fill: '#ff0000',
                    fontFamily: 'Sansation'
                }
            ).setOrigin(0.5);
            this.exitButton.setScrollFactor(0);
            this.exitButton.setDepth(10001);
            this.exitButton.setInteractive();
            
            this.exitButton.on('pointerdown', () => {
                this.closeInGameSettings();
                this.scene.start('MenuScene');
            });
            
            // Обработчик ESC для закрытия
            this.settingsEscHandler = this.input.keyboard.once('keydown-ESC', () => {
                this.closeInGameSettings();
            });
            
            console.log('In-game settings opened successfully');
            
        } catch (error) {
            console.error('Error opening in-game settings:', error);
            // Если настройки не открылись, просто возобновляем игру
            this.scene.resume();
        }
    }
    
    createVolumeSlider() {
        try {
            const sliderX = this.cameras.main.centerX;
            const sliderY = this.cameras.main.centerY - 50;
            const sliderWidth = 200;
            
            // Фон слайдера
            this.volumeSliderBg = this.add.rectangle(sliderX, sliderY, sliderWidth, 10, 0x666666);
            this.volumeSliderBg.setScrollFactor(0);
            this.volumeSliderBg.setDepth(10001);
            
            // Безопасное получение громкости
            let currentVolume = 0.5; // Значение по умолчанию
            if (this.audioManager && this.audioManager.settings && typeof this.audioManager.settings.masterVolume === 'number') {
                currentVolume = this.audioManager.settings.masterVolume;
            }
            
            const handleX = sliderX - sliderWidth/2 + (currentVolume * sliderWidth);
        
        this.volumeHandle = this.add.rectangle(handleX, sliderY, 20, 20, 0x00ff00);
        this.volumeHandle.setScrollFactor(0);
        this.volumeHandle.setDepth(10002);
        this.volumeHandle.setInteractive({ draggable: true });
        
        // Обработка перетаскивания
        this.volumeHandle.on('drag', (pointer, dragX) => {
            const minX = sliderX - sliderWidth/2;
            const maxX = sliderX + sliderWidth/2;
            const clampedX = Phaser.Math.Clamp(dragX, minX, maxX);
            
            this.volumeHandle.x = clampedX;
            
            const volume = (clampedX - minX) / sliderWidth;
            if (this.audioManager) {
                this.audioManager.setMasterVolume(volume);
            }
            
            console.log('Volume set to:', volume);
        });
        
        // Значение громкости
        this.volumeValue = this.add.text(
            sliderX + 120,
            sliderY,
            `${Math.round(currentVolume * 100)}%`,
            {
                fontSize: '18px',
                fill: '#00ff00',
                fontFamily: 'Sansation'
            }
        ).setOrigin(0.5);
            this.volumeValue.setScrollFactor(0);
            this.volumeValue.setDepth(10001);
        } catch (error) {
            console.error('Error creating volume slider:', error);
            // Создаем простой текст вместо слайдера
            this.volumeValue = this.add.text(
                this.cameras.main.centerX,
                this.cameras.main.centerY - 50,
                'Громкость: 50%',
                {
                    fontSize: '18px',
                    fill: '#ffffff',
                    fontFamily: 'Sansation'
                }
            ).setOrigin(0.5);
            this.volumeValue.setScrollFactor(0);
            this.volumeValue.setDepth(10001);
        }
    }
    
    createSettingsButtons() {
        try {
            // Кнопка "Продолжить игру"
        this.continueButton = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 50,
            'ПРОДОЛЖИТЬ ИГРУ',
            {
                fontSize: '24px',
                fill: '#00ff00',
                fontFamily: 'Sansation',
                stroke: '#003300',
                strokeThickness: 2
            }
        ).setOrigin(0.5);
        this.continueButton.setScrollFactor(0);
        this.continueButton.setDepth(10001);
        this.continueButton.setInteractive();
        
        this.continueButton.on('pointerdown', () => {
            this.closeInGameSettings();
        });
        
        this.continueButton.on('pointerover', () => {
            this.continueButton.setFill('#ffff00');
        });
        
        this.continueButton.on('pointerout', () => {
            this.continueButton.setFill('#00ff00');
        });
        
        // Кнопка "Выйти в меню"
        this.exitButton = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 100,
            'ВЫЙТИ В МЕНЮ',
            {
                fontSize: '24px',
                fill: '#ff0000',
                fontFamily: 'Sansation',
                stroke: '#330000',
                strokeThickness: 2
            }
        ).setOrigin(0.5);
        this.exitButton.setScrollFactor(0);
        this.exitButton.setDepth(10001);
        this.exitButton.setInteractive();
        
        this.exitButton.on('pointerdown', () => {
            this.closeInGameSettings();
            this.scene.start('MenuScene');
        });
        
        this.exitButton.on('pointerover', () => {
            this.exitButton.setFill('#ffff00');
        });
        
            this.exitButton.on('pointerout', () => {
                this.exitButton.setFill('#ff0000');
            });
        } catch (error) {
            console.error('Error creating settings buttons:', error);
        }
    }
    
    closeInGameSettings() {
        try {
            console.log('Closing in-game settings...');
            
            // Убираем все элементы настроек безопасно
            if (this.settingsOverlay) {
                this.settingsOverlay.destroy();
                this.settingsOverlay = null;
            }
            if (this.settingsTitle) {
                this.settingsTitle.destroy();
                this.settingsTitle = null;
            }
            if (this.continueButton) {
                this.continueButton.destroy();
                this.continueButton = null;
            }
            if (this.exitButton) {
                this.exitButton.destroy();
                this.exitButton = null;
            }
            
            // Убираем обработчик ESC
            if (this.settingsEscHandler) {
                this.settingsEscHandler.destroy();
                this.settingsEscHandler = null;
            }
            
            // Возобновляем игру
            this.scene.resume();
            
            console.log('In-game settings closed successfully');
            
        } catch (error) {
            console.error('Error closing in-game settings:', error);
            // В любом случае возобновляем игру
            this.scene.resume();
        }
    }

    openSimpleSettings() {
        console.log('Opening simple settings menu...');
        
        // Проверяем, не открыто ли меню уже или игра не окончена
        if (this.gameIsPaused || this.gameIsOver) {
            console.log('Settings already open or game is over, ignoring...');
            return;
        }
        
        // Дополнительная защита от дублирования элементов
        if (this.simpleOverlay) {
            console.log('Settings UI already exists, ignoring...');
            return;
        }
        
        // ВАЖНО: НЕ ИСПОЛЬЗУЕМ scene.pause() - он блокирует input
        // Вместо этого останавливаем игровые циклы вручную
        this.gameIsPaused = true;
        
        // Останавливаем игровые таймеры
        if (this.gameTimer) this.gameTimer.paused = true;
        
        // Создаем простое затемнение
        this.simpleOverlay = this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            this.cameras.main.width,
            this.cameras.main.height,
            0x000000,
            0.7
        );
        this.simpleOverlay.setScrollFactor(0);
        this.simpleOverlay.setDepth(9000);
        
        // Простой заголовок
        this.simpleTitle = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 150,
            'ПАУЗА',
            {
                fontSize: '48px',
                fill: '#00ff00',
                fontFamily: 'Sansation'
            }
        ).setOrigin(0.5);
        this.simpleTitle.setScrollFactor(0);
        this.simpleTitle.setDepth(9001);
        
        // Добавляем ползунок громкости
        this.createVolumeSliderSimple();
        
        // Простая кнопка продолжить
        this.simpleContinue = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 50,
            'ПРОДОЛЖИТЬ (ESC)',
            {
                fontSize: '24px',
                fill: '#ffffff',
                fontFamily: 'Sansation'
            }
        ).setOrigin(0.5);
        this.simpleContinue.setScrollFactor(0);
        this.simpleContinue.setDepth(9001);
        
        // Простая кнопка выхода
        this.simpleExit = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 100,
            'ВЫЙТИ В МЕНЮ (M)',
            {
                fontSize: '24px',
                fill: '#ff0000',
                fontFamily: 'Sansation'
            }
        ).setOrigin(0.5);
        this.simpleExit.setScrollFactor(0);
        this.simpleExit.setDepth(9001);
        
        // Простые обработчики
        this.simpleEscHandler = this.input.keyboard.once('keydown-ESC', () => {
            this.closeSimpleSettings();
        });
        
        this.simpleMHandler = this.input.keyboard.once('keydown-M', () => {
            this.closeSimpleSettings();
            this.scene.start('MenuScene');
        });
        
        console.log('Simple settings opened successfully');
    }
    
    createVolumeSliderSimple() {
        try {
            const sliderX = this.cameras.main.centerX;
            const sliderY = this.cameras.main.centerY - 50;
            const sliderWidth = 200;
            
            // Заголовок "Громкость"
            this.simpleVolumeLabel = this.add.text(
                sliderX,
                sliderY - 40,
                'ГРОМКОСТЬ',
                {
                    fontSize: '20px',
                    fill: '#ffffff',
                    fontFamily: 'Sansation'
                }
            ).setOrigin(0.5);
            this.simpleVolumeLabel.setScrollFactor(0);
            this.simpleVolumeLabel.setDepth(9001);
            
            // Фон слайдера
            this.simpleVolumeSliderBg = this.add.rectangle(sliderX, sliderY, sliderWidth, 10, 0x666666);
            this.simpleVolumeSliderBg.setScrollFactor(0);
            this.simpleVolumeSliderBg.setDepth(9001);
            
            // Получаем текущую громкость
            let currentVolume = 0.5;
            if (this.audioManager && this.audioManager.settings && typeof this.audioManager.settings.masterVolume === 'number') {
                currentVolume = this.audioManager.settings.masterVolume;
            }
            
            const handleX = sliderX - sliderWidth/2 + (currentVolume * sliderWidth);
            
            // Ползунок
            this.simpleVolumeHandle = this.add.rectangle(handleX, sliderY, 20, 20, 0x00ff00);
            this.simpleVolumeHandle.setScrollFactor(0);
            this.simpleVolumeHandle.setDepth(9002);
            this.simpleVolumeHandle.setInteractive({ draggable: true });
            
            // Обработка перетаскивания
            this.simpleVolumeHandle.on('drag', (pointer, dragX) => {
                const minX = sliderX - sliderWidth/2;
                const maxX = sliderX + sliderWidth/2;
                const clampedX = Phaser.Math.Clamp(dragX, minX, maxX);
                
                this.simpleVolumeHandle.x = clampedX;
                
                const volume = (clampedX - minX) / sliderWidth;
                if (this.audioManager && this.audioManager.setMasterVolume) {
                    this.audioManager.setMasterVolume(volume);
                }
                
                // Обновляем текст громкости
                if (this.simpleVolumeValue) {
                    this.simpleVolumeValue.setText(`${Math.round(volume * 100)}%`);
                }
                
                console.log('Volume set to:', volume);
            });
            
            // Значение громкости
            this.simpleVolumeValue = this.add.text(
                sliderX,
                sliderY + 30,
                `${Math.round(currentVolume * 100)}%`,
                {
                    fontSize: '18px',
                    fill: '#00ff00',
                    fontFamily: 'Sansation'
                }
            ).setOrigin(0.5);
            this.simpleVolumeValue.setScrollFactor(0);
            this.simpleVolumeValue.setDepth(9001);
            
        } catch (error) {
            console.error('Error creating simple volume slider:', error);
        }
    }
    
    closeSimpleSettings() {
        console.log('Closing simple settings...');
        
        // Проверяем, открыто ли меню
        if (!this.gameIsPaused) {
            console.log('Settings not open, ignoring...');
            return;
        }
        
        // Убираем элементы безопасно
        try {
            if (this.simpleOverlay) {
                this.simpleOverlay.destroy();
                this.simpleOverlay = null;
            }
            if (this.simpleTitle) {
                this.simpleTitle.destroy();
                this.simpleTitle = null;
            }
            if (this.simpleContinue) {
                this.simpleContinue.destroy();
                this.simpleContinue = null;
            }
            if (this.simpleExit) {
                this.simpleExit.destroy();
                this.simpleExit = null;
            }
            // Убираем элементы ползунка громкости
            if (this.simpleVolumeLabel) {
                this.simpleVolumeLabel.destroy();
                this.simpleVolumeLabel = null;
            }
            if (this.simpleVolumeSliderBg) {
                this.simpleVolumeSliderBg.destroy();
                this.simpleVolumeSliderBg = null;
            }
            if (this.simpleVolumeHandle) {
                this.simpleVolumeHandle.destroy();
                this.simpleVolumeHandle = null;
            }
            if (this.simpleVolumeValue) {
                this.simpleVolumeValue.destroy();
                this.simpleVolumeValue = null;
            }
        } catch (error) {
            console.warn('Error destroying settings elements:', error);
        }
        
        // Убираем обработчики (once() обработчики удаляются автоматически)
        this.simpleEscHandler = null;
        this.simpleMHandler = null;
        
        // Возобновляем игру
        this.gameIsPaused = false;
        
        // Возобновляем игровые таймеры
        if (this.gameTimer) this.gameTimer.paused = false;
        
        console.log('Simple settings closed successfully');
    }
    
    createFinalVideoDirectly() {
        console.log('=== CREATING FINAL VIDEO DIRECTLY IN GAMESCENE ===');
        
        try {
            // Пробуем создать видео разными способами
            let finalVideo = null;
            
            // Способ 1: Из кэша
            if (this.cache.video.has('final_video')) {
                console.log('Creating final video from cache...');
                finalVideo = this.add.video(
                    this.cameras.main.centerX,
                    this.cameras.main.centerY,
                    'final_video'
                );
            }
            // Способ 2: Динамическая загрузка
            else {
                console.log('Creating final video with dynamic loading...');
                finalVideo = this.add.video(
                    this.cameras.main.centerX,
                    this.cameras.main.centerY
                );
                finalVideo.loadURL('image/final.mp4');
            }
            
            if (finalVideo) {
                console.log('Final video created successfully');
                
                // Настройки видео (как у intro)
                finalVideo.setOrigin(0.5);
                finalVideo.setDepth(20000); // Максимальный depth для гарантии видимости
                
                // Масштабируем видео под экран как intro
                const screenWidth = this.cameras.main.width;
                const screenHeight = this.cameras.main.height;
                const videoWidth = finalVideo.width || 640;
                const videoHeight = finalVideo.height || 480;
                
                const scaleX = screenWidth / videoWidth;
                const scaleY = screenHeight / videoHeight;
                const scale = Math.min(scaleX, scaleY) * 0.5; // Уменьшили с 80% до 50% экрана
                finalVideo.setScale(scale);
                finalVideo.setLoop(false);
                finalVideo.setVisible(true);
                finalVideo.setActive(true);
                finalVideo.setAlpha(1);
                finalVideo.setScrollFactor(0); // Фиксируем к камере
                
                // Запускаем видео
                console.log('Starting final video playback...');
                try {
                    finalVideo.play();
                    console.log('Final video play() called successfully');
                } catch (playError) {
                    console.error('Final video play() failed:', playError);
                }
                
                // Обработчик завершения
                finalVideo.on('complete', () => {
                    console.log('Final video completed');
                    finalVideo.destroy();
                });
                
                // Добавляем возможность пропустить видео клавишами
                const skipHandler = this.input.keyboard.on('keydown', (event) => {
                    if (event.code === 'Space' || event.code === 'Enter' || event.code === 'Escape') {
                        console.log('Skipping final video...');
                        finalVideo.stop();
                        finalVideo.destroy();
                        
                        // Останавливаем аудио
                        if (this.audioManager && this.audioManager.sounds && this.audioManager.sounds.the_end) {
                            this.audioManager.sounds.the_end.stop();
                        }
                        
                        // Убираем обработчик
                        this.input.keyboard.off('keydown', skipHandler);
                    }
                });
                
                // Сохраняем ссылку
                this.finalVideoObject = finalVideo;
                
                console.log('Final video setup completed - should be visible!');
            } else {
                console.error('Failed to create final video object');
            }
            
        } catch (error) {
            console.error('Error creating final video directly:', error);
        }
    }
}
