// Сцена главного меню
class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        // Получаем AudioManager из registry
        this.audioManager = this.registry.get('audioManager');
        if (!this.audioManager) {
            console.warn('AudioManager not found in registry, creating new one');
            this.audioManager = new AudioManager(this);
            this.audioManager.createAudioObjects();
        }
        
        // Создаем анимированный фон
        this.createAnimatedBackground();
        
        // Создаем эффект виньетки (временно отключен)
        //this.createVignetteEffect();
        
        // Создаем заголовок игры
        this.createGameTitle();
        
        // Создаем кнопки меню
        this.createMenuButtons();
        
        // Создаем анимацию частиц
        this.createParticleEffects();
        
        // Добавляем управление клавиатурой
        this.setupKeyboardControls();
    }

    createAnimatedBackground() {
        // Добавляем звездный фон
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;
        this.stars = this.add.tileSprite(0, 0, screenWidth, screenHeight, 'stars');
        this.stars.setOrigin(0, 0);
        
        // Анимация движения звезд
        this.tweens.add({
            targets: this.stars,
            tilePositionX: { from: 0, to: -1280 },
            duration: 20000,
            repeat: -1,
            ease: 'Linear'
        });

        // Добавляем градиентный оверлей
        const gradient = this.add.graphics();
        gradient.fillGradientStyle(0x000000, 0x000000, 0x001122, 0x000000, 0.8, 0.6, 0.3, 0.1);
        gradient.fillRect(0, 0, 1280, 720);
    }

    createGameTitle() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY - 150;

        // Основной заголовок
        this.titleText = this.add.text(centerX, centerY, 'FUTURE SURVIVORS', {
            fontSize: '64px',
            fill: '#00ff00',
            fontFamily: 'Sansation',
            stroke: '#003300',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Подзаголовок
        this.subtitleText = this.add.text(centerX, centerY + 80, 'Футуристическая игра выживания', {
            fontSize: '24px',
            fill: '#00ffff',
            fontFamily: 'Sansation',
            stroke: '#003333',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Анимация заголовка
        this.tweens.add({
            targets: this.titleText,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.tweens.add({
            targets: this.subtitleText,
            alpha: 0.7,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    createMenuButtons() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY + 50;
        const buttonSpacing = 80;

        // Кнопка "Начать игру"
        this.startButton = this.createButton(centerX, centerY, 'НАЧАТЬ ИГРУ', () => {
            // Возобновляем AudioContext перед запуском игры
            if (this.sound.context.state === 'suspended') {
                this.sound.context.resume().then(() => {
                    console.log('AudioContext resumed for game');
                    this.scene.start('GameScene');
                });
            } else {
                this.scene.start('GameScene');
            }
        });

        // Кнопка "Настройки"
        this.settingsButton = this.createButton(centerX, centerY + buttonSpacing, 'НАСТРОЙКИ', () => {
            this.showSettings();
        });

        // Кнопка "Об игре"
        this.aboutButton = this.createButton(centerX, centerY + buttonSpacing * 2, 'ОБ ИГРЕ', () => {
            this.showAbout();
        });

        // Кнопка "Выход"
        this.exitButton = this.createButton(centerX, centerY + buttonSpacing * 3, 'ВЫХОД', () => {
            this.exitGame();
        });
    }

    createButton(x, y, text, callback) {
        // Создаем фон кнопки
        const button = this.add.graphics();
        button.fillStyle(0x000000, 0.8);
        button.lineStyle(2, 0x00ff00);
        button.fillRoundedRect(-100, -25, 200, 50, 10);
        button.strokeRoundedRect(-100, -25, 200, 50, 10);
        button.setPosition(x, y);

        // Создаем текст кнопки
        const buttonText = this.add.text(x, y, text, {
            fontSize: '20px',
            fill: '#00ff00',
            fontFamily: 'Sansation'
        }).setOrigin(0.5);

        // Делаем кнопку интерактивной
        button.setInteractive(new Phaser.Geom.Rectangle(-100, -25, 200, 50), Phaser.Geom.Rectangle.Contains);
        buttonText.setInteractive(new Phaser.Geom.Rectangle(-100, -25, 200, 50), Phaser.Geom.Rectangle.Contains);

        // Обработчики событий
        button.on('pointerover', () => {
            button.clear();
            button.fillStyle(0x003300, 0.9);
            button.lineStyle(3, 0x00ff00);
            button.fillRoundedRect(-100, -25, 200, 50, 10);
            button.strokeRoundedRect(-100, -25, 200, 50, 10);
            buttonText.setStyle({ fill: '#00ff88' });
        });

        button.on('pointerout', () => {
            button.clear();
            button.fillStyle(0x000000, 0.8);
            button.lineStyle(2, 0x00ff00);
            button.fillRoundedRect(-100, -25, 200, 50, 10);
            button.strokeRoundedRect(-100, -25, 200, 50, 10);
            buttonText.setStyle({ fill: '#00ff00' });
        });

        button.on('pointerdown', () => {
            button.clear();
            button.fillStyle(0x006600, 0.9);
            button.lineStyle(2, 0x00ff00);
            button.fillRoundedRect(-100, -25, 200, 50, 10);
            button.strokeRoundedRect(-100, -25, 200, 50, 10);
        });

        button.on('pointerup', () => {
            callback();
        });

        // Аналогичные обработчики для текста
        buttonText.on('pointerover', () => button.emit('pointerover'));
        buttonText.on('pointerout', () => button.emit('pointerout'));
        buttonText.on('pointerdown', () => button.emit('pointerdown'));
        buttonText.on('pointerup', () => button.emit('pointerup'));

        return { button, text: buttonText };
    }

    createParticleEffects() {
        // Создаем систему частиц для футуристического эффекта (временно отключено для Phaser 3.70)
        // const particles = this.add.particles('projectile_basic');
        
        // this.emitter = particles.createEmitter({
        //     x: { min: 0, max: 1280 },
        //     y: -50,
        //     speedY: { min: 50, max: 150 },
        //     speedX: { min: -20, max: 20 },
        //     scale: { start: 0.5, end: 0 },
        //     alpha: { start: 1, end: 0 },
        //     lifespan: 3000,
        //     frequency: 100
        // });
        
        // Временная заглушка для эмиттера
        this.emitter = {
            start: () => console.log('Menu particle emitter started'),
            stop: () => console.log('Menu particle emitter stopped'),
            destroy: () => console.log('Menu particle emitter destroyed')
        };
    }

    setupKeyboardControls() {
        // Управление с клавиатуры
        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.start('GameScene');
        });

        this.input.keyboard.on('keydown-ESC', () => {
            this.exitGame();
        });
    }

    showSettings() {
        console.log('Opening settings menu...');
        
        // Создаем оверлей настроек
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;
        const centerX = screenWidth / 2;
        const centerY = screenHeight / 2;
        const overlay = this.add.rectangle(centerX, centerY, screenWidth, screenHeight, 0x000000, 0.8);
        overlay.setInteractive();
        
        // Заголовок
        const title = this.add.text(centerX, centerY - 240, 'НАСТРОЙКИ', {
            fontSize: '48px',
            fill: '#00ff00',
            fontFamily: 'Sansation',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Настройка звука
        const volumeLabel = this.add.text(centerX, centerY - 90, 'ГРОМКОСТЬ ЗВУКА:', {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Sansation'
        }).setOrigin(0.5);
        
        // Получаем текущую громкость
        const currentVolume = this.audioManager ? this.audioManager.getMasterVolume() : 0.5;
        
        // Создаем слайдер громкости
        const sliderBg = this.add.rectangle(centerX, centerY - 15, 400, 20, 0x333333);
        sliderBg.setStrokeStyle(2, 0x00ff00);
        
        const sliderHandle = this.add.rectangle(
            (centerX - 200) + (currentVolume * 400), // позиция зависит от громкости
            centerY - 15, 
            20, 
            30, 
            0x00ff00
        );
        sliderHandle.setInteractive({ draggable: true });
        
        // Текст громкости
        const volumeText = this.add.text(centerX, centerY + 30, `${Math.round(currentVolume * 100)}%`, {
            fontSize: '20px',
            fill: '#ffff00',
            fontFamily: 'Sansation'
        }).setOrigin(0.5);
        
        // Обработчик перетаскивания слайдера
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            if (gameObject === sliderHandle) {
                // Ограничиваем движение слайдера
                const minX = centerX - 200;
                const maxX = centerX + 200;
                const clampedX = Phaser.Math.Clamp(dragX, minX, maxX);
                
                sliderHandle.x = clampedX;
                
                // Вычисляем громкость (0-1)
                const volume = (clampedX - minX) / (maxX - minX);
                
                // Обновляем текст
                volumeText.setText(`${Math.round(volume * 100)}%`);
                
                // Применяем громкость
                if (this.audioManager) {
                    this.audioManager.setMasterVolume(volume);
                }
            }
        });
        
        // Управление
        const controlsText = [
            'УПРАВЛЕНИЕ:',
            'WASD / Стрелки - Движение',
            'ЛКМ - Убить врага (тест)',
            'ESC - Возврат в меню',
            '',
            'Перетащите ползунок для изменения громкости'
        ].join('\n');
        
        const controls = this.add.text(centerX, centerY + 180, controlsText, {
            fontSize: '16px',
            fill: '#cccccc',
            fontFamily: 'Sansation',
            align: 'center'
        }).setOrigin(0.5);
        
        // Кнопка возврата
        const backButton = this.add.text(centerX, centerY + 360, 'НАЗАД', {
            fontSize: '32px',
            fill: '#ffff00',
            fontFamily: 'Sansation',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        backButton.setInteractive();
        backButton.on('pointerdown', () => {
            this.closeSettings([overlay, title, volumeLabel, sliderBg, sliderHandle, volumeText, controls, backButton]);
        });
        
        backButton.on('pointerover', () => {
            backButton.setTint(0x00ff00);
        });
        
        backButton.on('pointerout', () => {
            backButton.clearTint();
        });
        
        // ESC для закрытия
        this.input.keyboard.once('keydown-ESC', () => {
            this.closeSettings([overlay, title, volumeLabel, sliderBg, sliderHandle, volumeText, controls, backButton]);
        });
    }
    
    closeSettings(elements) {
        console.log('Closing settings menu...');
        elements.forEach(element => {
            if (element && element.destroy) {
                element.destroy();
            }
        });
        
        // Убираем обработчики drag
        this.input.off('drag');
    }

    showAbout() {
        const aboutText = [
            'ОБ ИГРЕ:',
            '',
            'Future Survivors - это футуристическая',
            'игра в стиле Vampire Survivors.',
            '',
            'Выживайте как можно дольше,',
            'уничтожая врагов и собирая усиления.',
            '',
            'Нажмите любую клавишу для возврата'
        ].join('\n');

        const aboutOverlay = this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.8);
        const aboutTextObj = this.add.text(640, 360, aboutText, {
            fontSize: '20px',
            fill: '#00ff00',
            fontFamily: 'Sansation'
        }).setOrigin(0.5);

        this.input.keyboard.once('keydown', () => {
            aboutOverlay.destroy();
            aboutTextObj.destroy();
        });
    }

    exitGame() {
        // Простой выход из игры
        if (confirm('Вы уверены, что хотите выйти из игры?')) {
            window.close();
        }
    }

    createVignetteEffect() {
        console.log('Creating menu vignette effect...');
        
        // Создаем более мягкий эффект виньетки для меню
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;
        
        const vignetteGraphics = this.add.graphics();
        
        const centerX = screenWidth / 2;
        const centerY = screenHeight / 2;
        const maxRadius = Math.max(screenWidth, screenHeight) * 0.9;
        const innerRadius = Math.min(screenWidth, screenHeight) * 0.4;
        
        // Очень мягкая виньетка для меню
        for (let i = 0; i <= 20; i++) {
            const radius = innerRadius + (maxRadius - innerRadius) * (i / 20);
            const alpha = Math.pow(i / 20, 4) * 0.1; // Очень слабая - максимум 10%
            
            vignetteGraphics.fillStyle(0x000000, alpha);
            vignetteGraphics.fillCircle(centerX, centerY, radius);
        }
        
        // Создаем текстуру
        vignetteGraphics.generateTexture('menu_vignette', screenWidth, screenHeight);
        vignetteGraphics.destroy();
        
        // Создаем оверлей
        this.vignetteOverlay = this.add.image(centerX, centerY, 'menu_vignette');
        this.vignetteOverlay.setOrigin(0.5);
        this.vignetteOverlay.setDepth(100); // Над фоном, но под UI
        this.vignetteOverlay.setBlendMode(Phaser.BlendModes.MULTIPLY);
        
        console.log('Menu vignette effect created');
    }
}
