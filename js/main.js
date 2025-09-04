// Основной файл игры
class FutureSurvivors {
    constructor() {
        this.game = null;
        this.init();
    }

    init() {
        try {
            // Создаем экземпляр игры Phaser
            this.game = new Phaser.Game(GameConfig);
            
            // Добавляем обработчики событий
            this.game.events.on('ready', this.onGameReady.bind(this));
            this.game.events.on('error', this.onGameError.bind(this));
            
            console.log('Игра Future Survivors инициализирована');
        } catch (error) {
            console.error('Ошибка инициализации игры:', error);
            this.showErrorMessage('Ошибка загрузки игры. Проверьте консоль для деталей.');
        }
    }

    onGameReady() {
        console.log('Игра готова к запуску');
        // Убираем сообщение о загрузке
        const loadingElement = document.querySelector('.loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }

    onGameError(error) {
        console.error('Ошибка в игре:', error);
        this.showErrorMessage('Произошла ошибка в игре. Попробуйте перезагрузить страницу.');
    }

    showErrorMessage(message) {
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            gameContainer.innerHTML = `
                <div style="color: #ff0000; text-align: center; padding: 20px;">
                    <h3>Ошибка</h3>
                    <p>${message}</p>
                    <button onclick="location.reload()" style="padding: 10px 20px; background: #ff0000; color: white; border: none; cursor: pointer;">
                        Перезагрузить
                    </button>
                </div>
            `;
        }
    }

    // Методы для управления игрой
    pause() {
        if (this.game && this.game.scene.isActive('GameScene')) {
            this.game.scene.pause('GameScene');
        }
    }

    resume() {
        if (this.game && this.game.scene.isPaused('GameScene')) {
            this.game.scene.resume('GameScene');
        }
    }

    restart() {
        if (this.game) {
            this.game.scene.start('GameScene');
        }
    }
}

// Инициализация игры при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Небольшая задержка для корректной загрузки всех скриптов
    setTimeout(() => {
        window.gameInstance = new FutureSurvivors();
    }, 100);
});

// Глобальные функции для отладки
window.debugGame = () => {
    if (window.gameInstance && window.gameInstance.game) {
        console.log('Состояние игры:', window.gameInstance.game);
        console.log('Активная сцена:', window.gameInstance.game.scene.getActiveScene());
    }
};

window.restartGame = () => {
    if (window.gameInstance) {
        window.gameInstance.restart();
    }
};
