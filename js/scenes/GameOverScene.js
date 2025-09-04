// Сцена окончания игры
class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this.gameData = data || {
            score: 0,
            time: 0,
            level: 1,
            kills: 0
        };
    }

    create() {
        // Создаем фон
        this.createBackground();
        
        // Создаем заголовок
        this.createGameOverTitle();
        
        // Показываем результаты
        this.showResults();
        
        // Создаем кнопки
        this.createButtons();
        
        // Добавляем анимации
        this.createAnimations();
        
        // Настраиваем управление
        this.setupControls();
    }

    createBackground() {
        // Создаем темный фон
        this.add.rectangle(0, 0, 1280, 720, 0x000000, 0.9).setOrigin(0, 0);
        
        // Добавляем звездный фон
        this.stars = this.add.tileSprite(0, 0, 1280, 720, 'stars');
        this.stars.setOrigin(0, 0);
        
        // Медленная анимация звезд
        this.tweens.add({
            targets: this.stars,
            tilePositionX: { from: 0, to: -1280 },
            duration: 60000,
            repeat: -1,
            ease: 'Linear'
        });
    }

    createGameOverTitle() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY - 200;

        // Основной заголовок
        this.gameOverText = this.add.text(centerX, centerY, 'ИГРА ОКОНЧЕНА', {
            fontSize: '72px',
            fill: '#ff0000',
            fontFamily: 'Sansation',
            stroke: '#660000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Подзаголовок
        this.subtitleText = this.add.text(centerX, centerY + 80, 'Ваше путешествие в будущем завершено', {
            fontSize: '24px',
            fill: '#ff6666',
            fontFamily: 'Sansation',
            stroke: '#330000',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Анимация появления заголовка
        this.gameOverText.setScale(0);
        this.subtitleText.setScale(0);
        
        this.tweens.add({
            targets: this.gameOverText,
            scaleX: 1,
            scaleY: 1,
            duration: 1000,
            ease: 'Back.easeOut'
        });

        this.tweens.add({
            targets: this.subtitleText,
            scaleX: 1,
            scaleY: 1,
            duration: 1000,
            delay: 300,
            ease: 'Back.easeOut'
        });
    }

    showResults() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY - 50;

        // Создаем панель результатов
        const resultsPanel = this.add.graphics();
        resultsPanel.fillStyle(0x000000, 0.8);
        resultsPanel.lineStyle(3, 0xff0000);
        resultsPanel.fillRoundedRect(centerX - 200, centerY - 100, 400, 200, 20);
        resultsPanel.strokeRoundedRect(centerX - 200, centerY - 100, 400, 200, 20);

        // Заголовок панели
        this.add.text(centerX, centerY - 80, 'ВАШИ РЕЗУЛЬТАТЫ', {
            fontSize: '24px',
            fill: '#ff0000',
            fontFamily: 'Sansation',
            stroke: '#660000',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Результаты
        const results = [
            `СЧЕТ: ${this.gameData.score.toLocaleString()}`,
            `ВРЕМЯ: ${this.formatTime(this.gameData.time)}`,
            `УРОВЕНЬ: ${this.gameData.level}`,
            `УБИТО ВРАГОВ: ${this.gameData.kills}`
        ];

        results.forEach((result, index) => {
            const text = this.add.text(centerX, centerY - 30 + (index * 30), result, {
                fontSize: '18px',
                fill: '#ffffff',
                fontFamily: 'Sansation',
                stroke: '#000000',
                strokeThickness: 1
            }).setOrigin(0.5);
            
            // Анимация появления результатов
            text.setAlpha(0);
            this.tweens.add({
                targets: text,
                alpha: 1,
                duration: 500,
                delay: 1000 + (index * 200)
            });
        });

        // Оценка результата
        this.showRating();
    }

    showRating() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY + 100;

        let rating, color;
        const score = this.gameData.score;
        const time = this.gameData.time;

        if (score >= 50000 && time >= 300) {
            rating = 'ЛЕГЕНДА БУДУЩЕГО';
            color = '#ffd700';
        } else if (score >= 25000 && time >= 180) {
            rating = 'ГЕРОЙ ВРЕМЕНИ';
            color = '#c0c0c0';
        } else if (score >= 10000 && time >= 120) {
            rating = 'ВЫЖИВШИЙ';
            color = '#cd7f32';
        } else if (score >= 5000 && time >= 60) {
            rating = 'НОВИЧОК';
            color = '#00ff00';
        } else {
            rating = 'ПОТЕРПЕВШИЙ';
            color = '#ff6666';
        }

        const ratingText = this.add.text(centerX, centerY, rating, {
            fontSize: '32px',
            fill: color,
            fontFamily: 'Sansation',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        // Анимация рейтинга
        ratingText.setScale(0);
        this.tweens.add({
            targets: ratingText,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 800,
            delay: 2000,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.tweens.add({
                    targets: ratingText,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 300
                });
            }
        });
    }

    createButtons() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY + 200;
        const buttonSpacing = 80;

        // Кнопка "Играть снова"
        this.restartButton = this.createButton(centerX, centerY, 'ИГРАТЬ СНОВА', () => {
            this.scene.start('GameScene');
        });

        // Кнопка "Главное меню"
        this.menuButton = this.createButton(centerX, centerY + buttonSpacing, 'ГЛАВНОЕ МЕНЮ', () => {
            this.scene.start('MenuScene');
        });

        // Кнопка "Выход"
        this.exitButton = this.createButton(centerX, centerY + buttonSpacing * 2, 'ВЫХОД', () => {
            this.exitGame();
        });
    }

    createButton(x, y, text, callback) {
        // Создаем фон кнопки
        const button = this.add.graphics();
        button.fillStyle(0x000000, 0.8);
        button.lineStyle(2, 0xff0000);
        button.fillRoundedRect(-120, -30, 240, 60, 15);
        button.strokeRoundedRect(-120, -30, 240, 60, 15);
        button.setPosition(x, y);

        // Создаем текст кнопки
        const buttonText = this.add.text(x, y, text, {
            fontSize: '20px',
            fill: '#ff0000',
            fontFamily: 'Sansation'
        }).setOrigin(0.5);

        // Делаем кнопку интерактивной
        button.setInteractive(new Phaser.Geom.Rectangle(-120, -30, 240, 60), Phaser.Geom.Rectangle.Contains);
        buttonText.setInteractive(new Phaser.Geom.Rectangle(-120, -30, 240, 60), Phaser.Geom.Rectangle.Contains);

        // Обработчики событий
        button.on('pointerover', () => {
            button.clear();
            button.fillStyle(0x330000, 0.9);
            button.lineStyle(3, 0xff0000);
            button.fillRoundedRect(-120, -30, 240, 60, 15);
            button.strokeRoundedRect(-120, -30, 240, 60, 15);
            buttonText.setStyle({ fill: '#ff6666' });
        });

        button.on('pointerout', () => {
            button.clear();
            button.fillStyle(0x000000, 0.8);
            button.lineStyle(2, 0xff0000);
            button.fillRoundedRect(-120, -30, 240, 60, 15);
            button.strokeRoundedRect(-120, -30, 240, 60, 15);
            buttonText.setStyle({ fill: '#ff0000' });
        });

        button.on('pointerdown', () => {
            button.clear();
            button.fillStyle(0x660000, 0.9);
            button.lineStyle(2, 0xff0000);
            button.fillRoundedRect(-120, -30, 240, 60, 15);
            button.strokeRoundedRect(-120, -30, 240, 60, 15);
        });

        button.on('pointerup', () => {
            callback();
        });

        // Аналогичные обработчики для текста
        buttonText.on('pointerover', () => button.emit('pointerover'));
        buttonText.on('pointerout', () => button.emit('pointerout'));
        buttonText.on('pointerdown', () => button.emit('pointerdown'));
        buttonText.on('pointerup', () => button.emit('pointerup'));

        // Анимация появления кнопок
        button.setScale(0);
        buttonText.setScale(0);
        
        this.tweens.add({
            targets: [button, buttonText],
            scaleX: 1,
            scaleY: 1,
            duration: 500,
            delay: 2500,
            ease: 'Back.easeOut'
        });

        return { button, text: buttonText };
    }

    createAnimations() {
        // Создаем эффект частиц для футуристического вида
        const particles = this.add.particles('projectile_basic');
        
        this.emitter = particles.createEmitter({
            x: { min: 0, max: 1280 },
            y: -50,
            speedY: { min: 30, max: 100 },
            speedX: { min: -15, max: 15 },
            scale: { start: 0.3, end: 0 },
            alpha: { start: 0.7, end: 0 },
            lifespan: 4000,
            frequency: 150
        });
    }

    setupControls() {
        // Управление с клавиатуры
        this.input.keyboard.on('keydown-R', () => {
            this.scene.start('GameScene');
        });

        this.input.keyboard.on('keydown-M', () => {
            this.scene.start('MenuScene');
        });

        this.input.keyboard.on('keydown-ESC', () => {
            this.exitGame();
        });

        // Показываем подсказки
        this.showControlsHint();
    }

    showControlsHint() {
        const hintText = [
            'УПРАВЛЕНИЕ:',
            'R - Играть снова',
            'M - Главное меню',
            'ESC - Выход'
        ].join('\n');

        const hint = this.add.text(20, 20, hintText, {
            fontSize: '16px',
            fill: '#666666',
            fontFamily: 'Sansation'
        });

        // Анимация появления подсказки
        hint.setAlpha(0);
        this.tweens.add({
            targets: hint,
            alpha: 1,
            duration: 1000,
            delay: 3000
        });
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    exitGame() {
        if (confirm('Вы уверены, что хотите выйти из игры?')) {
            window.close();
        }
    }
}
