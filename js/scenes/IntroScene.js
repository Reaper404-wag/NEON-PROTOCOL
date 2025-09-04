// Intro Scene - показывает первоначальный ролик
class IntroScene extends Phaser.Scene {
    constructor() {
        super({ key: 'IntroScene' });
    }

    create() {
        console.log('IntroScene started');
        
        // Инициализируем AudioManager
        this.audioManager = new AudioManager(this);
        this.audioManager.createAudioObjects();
        
        // Создаем черный фон
        this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            this.cameras.main.width,
            this.cameras.main.height,
            0x000000
        );
        
        // Показываем заставку
        const startText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 50,
            'FUTURE SURVIVORS\n\nЗагрузка...',
            {
                fontSize: '32px',
                fill: '#00ff00',
                fontFamily: 'Sansation',
                align: 'center'
            }
        );
        startText.setOrigin(0.5);
        
        // Инструкция
        const skipText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 100,
            'ПРОБЕЛ - Пропустить интро\nНажмите на экран чтобы начать',
            {
                fontSize: '18px',
                fill: '#ffff00',
                fontFamily: 'Sansation',
                align: 'center'
            }
        );
        skipText.setOrigin(0.5);
        
        // Обработчик пропуска
        this.input.keyboard.on('keydown-SPACE', () => {
            this.skipIntro();
        });
        
        // Флаг для предотвращения двойного запуска
        this.introStarted = false;
        
        // Обработчик клика для запуска интро
        this.input.once('pointerdown', () => {
            if (!this.introStarted) {
                console.log('User clicked - starting intro');
                this.introStarted = true;
                this.startIntro();
            }
        });
        
        // Автозапуск немедленно после создания сцены
        this.time.delayedCall(100, () => {
            if (!this.introStarted) {
                console.log('Auto-starting intro immediately');
                this.introStarted = true;
                // Принудительно возобновляем AudioContext
                if (this.sound.context.state === 'suspended') {
                    this.sound.context.resume().then(() => {
                        this.startIntro();
                    }).catch(() => {
                        this.startIntro();
                    });
                } else {
                    this.startIntro();
                }
            }
        });
    }
    
    startIntro() {
        // Возобновляем AudioContext если нужно
        if (this.sound.context.state === 'suspended') {
            this.sound.context.resume().then(() => {
                console.log('AudioContext resumed');
                this.playIntro();
            });
        } else {
            this.playIntro();
        }
    }
    
    playIntro() {
        console.log('Playing intro video and audio...');
        
        this.audioManager.playIntro(() => {
            console.log('Intro completed, transitioning to menu...');
            this.goToMenu();
        });
    }
    
    skipIntro() {
        console.log('Intro skipped by user');
        if (this.audioManager) {
            this.audioManager.stopAll();
        }
        this.goToMenu();
    }
    
    goToMenu() {
        console.log('Transitioning to menu...');
        
        // Обязательно передаем AudioManager в registry
        if (this.audioManager) {
            this.registry.set('audioManager', this.audioManager);
            console.log('AudioManager passed to registry');
        } else {
            console.warn('AudioManager is null, creating fallback');
            const fallbackAudioManager = new AudioManager(this);
            fallbackAudioManager.createAudioObjects();
            this.registry.set('audioManager', fallbackAudioManager);
        }
        
        // Переходим к главному меню
        this.scene.start('MenuScene');
    }
}
