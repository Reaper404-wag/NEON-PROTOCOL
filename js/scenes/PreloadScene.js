// Сцена предзагрузки ресурсов
class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        // Создаем экран загрузки
        this.createLoadingScreen();
        
        // Загружаем дополнительные ресурсы (звуки, фоны и т.д.)
        this.loadAdditionalResources();
        
        // Имитируем загрузку дополнительных ресурсов
        this.simulateResourceLoading();
    }

    create() {
        // Переходим к интро сцене
        this.scene.start('IntroScene');
    }

    createLoadingScreen() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        // Заголовок
        this.add.text(centerX, centerY - 100, 'Загрузка ресурсов', {
            fontSize: '36px',
            fill: '#00ff00',
            fontFamily: 'Sansation'
        }).setOrigin(0.5);

        // Прогресс-бар
        const barWidth = 400;
        const barHeight = 20;
        const barX = centerX - barWidth / 2;
        const barY = centerY;

        // Фон прогресс-бара
        this.add.rectangle(barX + barWidth / 2, barY + barHeight / 2, barWidth, barHeight, 0x333333);

        // Прогресс-бар
        this.progressBar = this.add.rectangle(barX + barHeight / 2, barY + barHeight / 2, barHeight, barHeight, 0x00ff00);

        // Текст прогресса
        this.progressText = this.add.text(centerX, barY + 40, '0%', {
            fontSize: '18px',
            fill: '#00ff00',
            fontFamily: 'Sansation'
        }).setOrigin(0.5);

        // Текст статуса
        this.statusText = this.add.text(centerX, barY + 70, 'Подготовка игровых ресурсов...', {
            fontSize: '16px',
            fill: '#00ffff',
            fontFamily: 'Sansation'
        }).setOrigin(0.5);

        // Список загружаемых ресурсов
        this.resourceList = this.add.text(centerX, barY + 120, '', {
            fontSize: '14px',
            fill: '#00ff88',
            fontFamily: 'Sansation'
        }).setOrigin(0.5);
    }

    loadAdditionalResources() {
        // Загружаем реальный фон с принудительным обновлением кэша
        // Добавляем временную метку для обхода кэша
        const timestamp = Date.now();
        this.load.image('background', `image/bg.png?v=${timestamp}`);
            
            // Добавляем обработчики событий загрузки
            this.load.on('filecomplete-image-background', () => {
                console.log('Background image loaded successfully');
                this.statusText.setText('Фоновое изображение загружено');
            });
            
                    this.load.on('loaderror', (file) => {
            if (file.key === 'background') {
                console.warn('Failed to load background image, will use fallback');
                this.statusText.setText('Создание резервного фона...');
            }
        });
        
        // Загружаем видео персонажа
        this.loadPlayerVideo();
        
        // Загружаем аудио и видео файлы
        this.loadAudioFiles();
        
        // Создаем дополнительные геометрические спрайты
        this.createAdditionalSprites();
    }

    loadPlayerVideo() {
        // Загружаем видео персонажа с временной меткой для обхода кэша
        const timestamp = Date.now();
        this.load.video('player_video', `image/player.webm?v=${timestamp}`);
        console.log('Loading player video: image/player.webm with timestamp:', timestamp);
        
        // Добавляем обработчики событий загрузки видео
        this.load.on('filecomplete-video-player_video', () => {
            console.log('Player video loaded successfully');
            this.statusText.setText('Видео персонажа загружено');
        });
        
        this.load.on('loaderror', (file) => {
            if (file.key === 'player_video') {
                console.warn('Failed to load player video');
                this.statusText.setText('Видео персонажа не загружено');
            }
        });
    }

    loadAudioFiles() {
        console.log('Loading audio and video files...');
        
        // Интро (с принудительным обновлением кэша)
        const timestamp = Date.now();
        this.load.audio('first_audio', `image/first.mp3?v=${timestamp}`);
        this.load.video('first_video', `image/first.mp4?v=${timestamp}`);
        
        // Игровые треки
        this.load.audio('track1', 'image/track1.mp3');
        this.load.audio('track2', 'image/track2.mp3');
        this.load.audio('track3', 'image/track3.mp3');
        this.load.audio('low_hp', 'image/low_hp.mp3');
        
        // Финал
        this.load.audio('the_end', 'image/the_end.mp3');
        this.load.video('final_video', 'image/final.mp4');
        
        // Звуки стрельбы (30% громкость)
        this.load.audio('shoot_player', 'image/weapon/player.mp3');
        this.load.audio('shoot_assault', 'image/weapon/shturm.mp3');
        this.load.audio('shoot_tank', 'image/weapon/tank.mp3');
        this.load.audio('shoot_mage', 'image/weapon/mag.mp3');
        
        // Звук получения урона (60% громкость)
        this.load.audio('damage_sound', 'image/damage.mp3');
        
        // Обработчик для low_hp аудио
        this.load.on('filecomplete-audio-low_hp', () => {
            console.log('Low HP music loaded');
            this.statusText.setText('Тревожная музыка загружена');
        });
        
        // Анимации персонажей
        this.load.image('assault_sprite', 'image/character/shturm.gif');
        this.load.image('tank_sprite', 'image/character/tank.gif');
        this.load.image('mage_sprite', 'image/character/mag.gif');
        this.load.image('player_sprite', 'image/character/gg.gif');
        
        // Хилка
        this.load.image('heal_item', 'image/character/heal.png');
        
        // Обработчики загрузки аудио
        this.load.on('filecomplete-audio-first_audio', () => {
            console.log('First audio loaded');
        });
        
        this.load.on('filecomplete-audio-track1', () => {
            console.log('Track 1 loaded');
        });
        
        this.load.on('filecomplete-audio-track2', () => {
            console.log('Track 2 loaded');
        });
        
        this.load.on('filecomplete-audio-track3', () => {
            console.log('Track 3 loaded');
        });
        
        this.load.on('filecomplete-audio-the_end', () => {
            console.log('The end audio loaded');
        });
        
        // Обработчики загрузки звуков стрельбы
        this.load.on('filecomplete-audio-shoot_player', () => {
            console.log('Player shoot sound loaded');
        });
        
        this.load.on('filecomplete-audio-shoot_assault', () => {
            console.log('Assault shoot sound loaded');
        });
        
        this.load.on('filecomplete-audio-shoot_tank', () => {
            console.log('Tank shoot sound loaded');
        });
        
        this.load.on('filecomplete-audio-shoot_mage', () => {
            console.log('Mage shoot sound loaded');
        });
        
        this.load.on('filecomplete-audio-damage_sound', () => {
            console.log('Damage sound loaded');
        });
        
        // Обработчики загрузки спрайтов персонажей
        this.load.on('filecomplete-image-assault_sprite', () => {
            console.log('Assault sprite (GIF) loaded successfully!');
        });
        
        this.load.on('filecomplete-image-tank_sprite', () => {
            console.log('Tank sprite (GIF) loaded successfully!');
        });
        
        this.load.on('filecomplete-image-mage_sprite', () => {
            console.log('Mage sprite (GIF) loaded successfully!');
        });
        
        this.load.on('filecomplete-image-player_sprite', () => {
            console.log('Player sprite (GIF) loaded successfully!');
        });
        
        this.load.on('filecomplete-image-heal_item', () => {
            console.log('Heal item loaded successfully!');
        });
        
        // Обработчики загрузки видео
        this.load.on('filecomplete-video-first_video', () => {
            console.log('First video loaded');
        });
        
        this.load.on('filecomplete-video-final_video', () => {
            console.log('Final video loaded');
        });
        
        // Обработчики ошибок
        this.load.on('loaderror', (file) => {
            if (file.type === 'audio' || file.type === 'video') {
                console.warn(`Failed to load ${file.type}: ${file.key}`);
            }
        });
    }

    createAdditionalSprites() {
        // Используем динамические размеры экрана
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        
        // Создаем спрайт для резервного фона (только если основной не загрузился)
        const backgroundGraphics = this.add.graphics();
        backgroundGraphics.fillStyle(0x001122);
        backgroundGraphics.fillRect(0, 0, screenWidth, screenHeight);
        backgroundGraphics.generateTexture('fallback_background', screenWidth, screenHeight);
        backgroundGraphics.destroy();

        // Создаем спрайт для взрыва
        const explosionGraphics = this.add.graphics();
        explosionGraphics.fillStyle(0xffaa00);
        explosionGraphics.fillCircle(16, 16, 16);
        explosionGraphics.generateTexture('explosion', 32, 32);
        explosionGraphics.destroy();
        
        // Создаем fallback спрайты для врагов (пока нет анимации)
        const assaultGraphics = this.add.graphics();
        assaultGraphics.fillStyle(0x00ff00);
        assaultGraphics.fillRect(0, 0, 32, 32);
        assaultGraphics.generateTexture('assault', 32, 32);
        assaultGraphics.destroy();
        console.log('Created assault fallback sprite (green)');
        
        const tankGraphics = this.add.graphics();
        tankGraphics.fillStyle(0xff0000);
        tankGraphics.fillRect(0, 0, 48, 48);
        tankGraphics.generateTexture('tank', 48, 48);
        tankGraphics.destroy();
        console.log('Created tank fallback sprite (red)');
        
        const mageGraphics = this.add.graphics();
        mageGraphics.fillStyle(0x0000ff);
        mageGraphics.fillRect(0, 0, 32, 32);
        mageGraphics.generateTexture('mage', 32, 32);
        mageGraphics.destroy();
        console.log('Created mage fallback sprite (blue)');

        // Создаем спрайт для звездного поля
        const starsGraphics = this.add.graphics();
        starsGraphics.fillStyle(0xffffff);
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * screenWidth;
            const y = Math.random() * screenHeight;
            const size = Math.random() * 2 + 1;
            starsGraphics.fillCircle(x, y, size);
        }
        starsGraphics.generateTexture('stars', screenWidth, screenHeight);
        starsGraphics.destroy();

        // Создаем спрайт для UI панели
        const uiPanelGraphics = this.add.graphics();
        uiPanelGraphics.fillStyle(0x000000);
        uiPanelGraphics.fillRect(0, 0, 300, 200);
        uiPanelGraphics.lineStyle(2, 0x00ff00);
        uiPanelGraphics.strokeRect(0, 0, 300, 200);
        uiPanelGraphics.generateTexture('ui_panel', 300, 200);
        uiPanelGraphics.destroy();
    }

    simulateResourceLoading() {
        let progress = 0;
        const loadingSteps = [
            'Создание игровых спрайтов...',
            'Подготовка звуковых эффектов...',
            'Загрузка фоновых изображений...',
            'Инициализация UI элементов...',
            'Подготовка игровых механик...',
            'Загрузка завершена!'
        ];
        let currentStep = 0;

        const loadingTimer = this.time.addEvent({
            delay: 150,
            callback: () => {
                progress += 1.5;
                if (progress > 100) progress = 100;

                // Обновляем прогресс-бар
                const barWidth = 400;
                const barHeight = 20;
                const centerX = this.cameras.main.centerX;
                const barX = centerX - barWidth / 2;
                const barY = this.cameras.main.centerY;

                this.progressBar.width = (progress / 100) * barWidth;
                this.progressBar.x = barX + (this.progressBar.width / 2);

                // Обновляем текст прогресса
                this.progressText.setText(`${Math.floor(progress)}%`);

                // Обновляем статус
                if (progress >= (currentStep + 1) * 16.67 && currentStep < loadingSteps.length - 1) {
                    currentStep++;
                    this.statusText.setText(loadingSteps[currentStep]);
                }

                // Обновляем список ресурсов
                this.updateResourceList(progress);

                // Завершаем загрузку
                if (progress >= 100) {
                    this.statusText.setText(loadingSteps[loadingSteps.length - 1]);
                    this.time.delayedCall(1000, () => {
                        this.scene.start('MenuScene');
                    });
                }
            },
            loop: true
        });
    }

    updateResourceList(progress) {
        const resources = [
            '✓ Игровые спрайты',
            '✓ Физические системы',
            '✓ Звуковые эффекты',
            '✓ UI элементы',
            '✓ Игровые механики',
            '✓ Системы частиц'
        ];

        let completedCount = Math.floor((progress / 100) * resources.length);
        if (completedCount > resources.length) completedCount = resources.length;

        let resourceText = '';
        for (let i = 0; i < resources.length; i++) {
            if (i < completedCount) {
                resourceText += resources[i] + '\n';
            } else {
                resourceText += '○ ' + resources[i].substring(2) + '\n';
            }
        }

        this.resourceList.setText(resourceText);
    }
}
