// Начальная сцена загрузки
class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Создаем простые геометрические спрайты для начала
        this.createBasicSprites();
        
        // Создаем прогресс-бар
        this.createProgressBar();
        
        // Имитируем загрузку ресурсов
        this.simulateLoading();
    }

    create() {
        // Переходим к следующей сцене
        this.scene.start('PreloadScene');
    }

    createBasicSprites() {
        // Создаем базовые спрайты для игрока
        const playerGraphics = this.add.graphics();
        playerGraphics.fillStyle(0x00ff00);
        playerGraphics.fillRect(0, 0, 32, 32);
        playerGraphics.generateTexture('player', 32, 32);
        playerGraphics.destroy();

        // Создаем спрайты для разных типов врагов (увеличены в 3 раза)
        // Штурмовик (зеленый, маленький)
        const assaultGraphics = this.add.graphics();
        assaultGraphics.fillStyle(0x00ff00);
        assaultGraphics.fillRect(0, 0, 54, 54); // 18*3 = 54
        assaultGraphics.generateTexture('enemy_assault', 54, 54);
        assaultGraphics.destroy();
        
        // Танк (красный, большой)
        const tankGraphics = this.add.graphics();
        tankGraphics.fillStyle(0xff0000);
        tankGraphics.fillRect(0, 0, 84, 84); // 28*3 = 84
        tankGraphics.generateTexture('enemy_tank', 84, 84);
        tankGraphics.destroy();
        
        // Маг (синий, средний)
        const mageGraphics = this.add.graphics();
        mageGraphics.fillStyle(0x0000ff);
        mageGraphics.fillRect(0, 0, 66, 66); // 22*3 = 66
        mageGraphics.generateTexture('enemy_mage', 66, 66);
        mageGraphics.destroy();

        // Создаем спрайт для быстрого врага
        const fastEnemyGraphics = this.add.graphics();
        fastEnemyGraphics.fillStyle(0xff8800);
        fastEnemyGraphics.fillRect(0, 0, 20, 20);
        fastEnemyGraphics.generateTexture('enemy_fast', 20, 20);
        fastEnemyGraphics.destroy();

        // Создаем спрайт для танка врага
        const tankEnemyGraphics = this.add.graphics();
        tankEnemyGraphics.fillStyle(0x880000);
        tankEnemyGraphics.fillRect(0, 0, 32, 32);
        tankEnemyGraphics.generateTexture('enemy_tank', 32, 32);
        tankEnemyGraphics.destroy();

        // Создаем спрайты для снарядов
        const projectileGraphics = this.add.graphics();
        projectileGraphics.fillStyle(0x00ff00);
        projectileGraphics.fillCircle(4, 4, 4);
        projectileGraphics.generateTexture('projectile_basic', 8, 8);
        projectileGraphics.destroy();

        // Создаем спрайты для усилений
        const powerUpGraphics = this.add.graphics();
        powerUpGraphics.fillStyle(0xffff00);
        powerUpGraphics.fillRect(0, 0, 16, 16);
        powerUpGraphics.generateTexture('powerup_health', 16, 16);
        powerUpGraphics.destroy();
    }

    createProgressBar() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        // Заголовок
        this.add.text(centerX, centerY - 100, 'FUTURE SURVIVORS', {
            fontSize: '48px',
            fill: '#00ff00',
            fontFamily: 'Sansation'
        }).setOrigin(0.5);

        // Подзаголовок
        this.add.text(centerX, centerY - 50, 'Футуристическая игра выживания', {
            fontSize: '24px',
            fill: '#00ffff',
            fontFamily: 'Sansation'
        }).setOrigin(0.5);

        // Прогресс-бар
        const barWidth = 400;
        const barHeight = 20;
        const barX = centerX - barWidth / 2;
        const barY = centerY + 50;

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
        this.statusText = this.add.text(centerX, barY + 70, 'Инициализация...', {
            fontSize: '16px',
            fill: '#00ffff',
            fontFamily: 'Sansation'
        }).setOrigin(0.5);
    }

    simulateLoading() {
        let progress = 0;
        const loadingSteps = [
            'Загрузка игровых систем...',
            'Инициализация физики...',
            'Создание игровых объектов...',
            'Подготовка сцен...',
            'Загрузка завершена!'
        ];
        let currentStep = 0;

        const loadingTimer = this.time.addEvent({
            delay: 100,
            callback: () => {
                progress += 2;
                if (progress > 100) progress = 100;

                // Обновляем прогресс-бар
                const barWidth = 400;
                const barHeight = 20;
                const centerX = this.cameras.main.centerX;
                const barX = centerX - barWidth / 2;
                const barY = this.cameras.main.centerY + 50;

                this.progressBar.width = (progress / 100) * barWidth;
                this.progressBar.x = barX + (this.progressBar.width / 2);

                // Обновляем текст прогресса
                this.progressText.setText(`${Math.floor(progress)}%`);

                // Обновляем статус
                if (progress >= (currentStep + 1) * 20 && currentStep < loadingSteps.length - 1) {
                    currentStep++;
                    this.statusText.setText(loadingSteps[currentStep]);
                }

                // Завершаем загрузку
                if (progress >= 100) {
                    this.statusText.setText(loadingSteps[loadingSteps.length - 1]);
                    this.time.delayedCall(1000, () => {
                        this.scene.start('PreloadScene');
                    });
                }
            },
            loop: true
        });
    }
}
