// Минимальная игровая сцена для тестирования
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.gameTime = 0;
        this.score = 0;
        this.level = 1;
        this.enemiesKilled = 0;
    }

    create() {
        console.log('GameScene: Starting minimal version');
        
        // Устанавливаем размер мира больше экрана
        this.physics.world.setBounds(0, 0, 2000, 2000);
        
        // Инициализируем только основные системы
        this.backgroundManager = new BackgroundManager(this);
        this.boundarySystem = new BoundarySystem(this);
        
        // Создаем фон в центре увеличенного мира
        this.background = this.backgroundManager.createBackground(1000, 1000);
        
        // Масштабируем фон чтобы покрыть больше пространства
        if (this.background) {
            this.background.setScale(1.5);
        }
        
        // Создаем границы карты для увеличенного мира
        this.boundarySystem.createBoundaries(2000, 2000);
        
        // Создаем простого игрока в центре мира
        this.player = this.add.rectangle(1000, 1000, 32, 32, 0x00ff00);
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true);
        
        // Добавляем коллизии с границами
        this.boundarySystem.addPlayerCollision(this.player, (player, wall) => {
            console.log('Player hit boundary wall');
            this.createBoundaryHitEffect(player.x, player.y);
        });
        
        // Инициализируем здоровье игрока
        this.player.health = 100;
        
        // Настраиваем камеру с deadzone
        this.cameras.main.setBounds(0, 0, 2000, 2000);
        this.cameras.main.startFollow(this.player);
        
        // Устанавливаем deadzone - камера будет следовать только когда игрок выходит из этой зоны
        this.cameras.main.setDeadzone(200, 150); // ширина 200px, высота 150px
        
        // Плавность следования камеры
        this.cameras.main.setLerp(0.1, 0.1);
        
        // Создаем UI который будет зафиксирован на экране
        this.healthText = this.add.text(20, 20, `ЗДОРОВЬЕ: 100`, {
            fontSize: '18px',
            fill: '#00ff00',
            fontFamily: 'Sansation'
        }).setScrollFactor(0); // UI не двигается с камерой
        
        this.scoreText = this.add.text(20, 50, `СЧЕТ: ${this.score}`, {
            fontSize: '18px',
            fill: '#00ff00',
            fontFamily: 'Sansation'
        }).setScrollFactor(0);
        
        this.timeText = this.add.text(20, 80, `ВРЕМЯ: 0:00`, {
            fontSize: '18px',
            fill: '#00ff00',
            fontFamily: 'Sansation'
        }).setScrollFactor(0);
        
        // Настраиваем управление
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,S,A,D');
        
        // Обработчик ESC
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('MenuScene');
        });
        
        // Добавляем инструкции (зафиксированы на экране)
        this.add.text(20, 680, 'WASD/Стрелки - движение, ESC - меню', {
            fontSize: '16px',
            fill: '#00ff00',
            fontFamily: 'Sansation'
        }).setScrollFactor(0);
        
        // Запускаем таймер
        this.gameTimer = this.time.addEvent({
            delay: 1000,
            callback: this.updateGameTime,
            callbackScope: this,
            loop: true
        });
        
        console.log('GameScene: Minimal version ready');
    }

    update() {
        this.updatePlayerMovement();
    }
    
    updatePlayerMovement() {
        if (!this.player || !this.player.active) return;
        
        // Сбрасываем скорость
        this.player.body.setVelocity(0, 0);
        
        const speed = 200;
        
        // Стрелки или WASD
        if (this.cursors.left.isDown || this.wasd.A.isDown) {
            this.player.body.setVelocityX(-speed);
        } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
            this.player.body.setVelocityX(speed);
        }
        
        if (this.cursors.up.isDown || this.wasd.W.isDown) {
            this.player.body.setVelocityY(-speed);
        } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
            this.player.body.setVelocityY(speed);
        }
    }

    updateGameTime() {
        this.gameTime++;
        const minutes = Math.floor(this.gameTime / 60);
        const seconds = this.gameTime % 60;
        this.timeText.setText(`ВРЕМЯ: ${minutes}:${seconds.toString().padStart(2, '0')}`);
    }

    createBoundaryHitEffect(x, y) {
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
        
        this.cameras.main.shake(100, 0.01);
    }
}