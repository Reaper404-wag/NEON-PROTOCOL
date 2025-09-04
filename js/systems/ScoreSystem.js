// Система счета
class ScoreSystem {
    constructor(scene) {
        this.scene = scene;
        this.currentScore = 0;
        this.highScore = this.loadHighScore();
        this.scoreMultiplier = 1.0;
        this.comboMultiplier = 1.0;
        this.comboTimer = null;
        this.comboDuration = 3000; // 3 секунды
        
        // Статистика
        this.stats = {
            enemiesKilled: 0,
            powerUpsCollected: 0,
            timeAlive: 0,
            damageDealt: 0,
            damageTaken: 0,
            shotsFired: 0,
            shotsHit: 0,
            accuracy: 0,
            maxCombo: 0,
            currentCombo: 0
        };
        
        // Достижения
        this.achievements = new Map();
        this.initAchievements();
        
        // События
        this.setupEventListeners();
    }

    initAchievements() {
        // Инициализируем достижения
        this.achievements.set('first_kill', {
            id: 'first_kill',
            name: 'Первый шаг',
            description: 'Уничтожьте первого врага',
            icon: '🎯',
            unlocked: false,
            score: 100
        });
        
        this.achievements.set('killer', {
            id: 'killer',
            name: 'Убийца',
            description: 'Уничтожьте 100 врагов',
            icon: '💀',
            unlocked: false,
            score: 500
        });
        
        this.achievements.set('exterminator', {
            id: 'exterminator',
            name: 'Истребитель',
            description: 'Уничтожьте 500 врагов',
            icon: '☠️',
            unlocked: false,
            score: 1000
        });
        
        this.achievements.set('survivor', {
            id: 'survivor',
            name: 'Выживший',
            description: 'Проживите 5 минут',
            icon: '⏰',
            unlocked: false,
            score: 300
        });
        
        this.achievements.set('veteran', {
            id: 'veteran',
            name: 'Ветеран',
            description: 'Проживите 15 минут',
            icon: '🏆',
            unlocked: false,
            score: 800
        });
        
        this.achievements.set('marksman', {
            id: 'marksman',
            name: 'Снайпер',
            description: 'Достигните точности 80%',
            icon: '🎯',
            unlocked: false,
            score: 400
        });
        
        this.achievements.set('combo_master', {
            id: 'combo_master',
            name: 'Мастер комбо',
            description: 'Достигните комбо 20',
            icon: '🔥',
            unlocked: false,
            score: 600
        });
        
        this.achievements.set('power_collector', {
            id: 'power_collector',
            name: 'Собиратель',
            description: 'Соберите 50 усилений',
            icon: '⭐',
            unlocked: false,
            score: 400
        });
        
        this.achievements.set('speed_demon', {
            id: 'speed_demon',
            name: 'Демон скорости',
            description: 'Двигайтесь на максимальной скорости 30 секунд',
            icon: '⚡',
            unlocked: false,
            score: 500
        });
        
        this.achievements.set('tank', {
            id: 'tank',
            name: 'Танк',
            description: 'Получите 1000 урона и выживите',
            icon: '🛡️',
            unlocked: false,
            score: 700
        });
    }

    setupEventListeners() {
        // Слушаем события игры
        this.scene.events.on('enemyKilled', this.onEnemyKilled.bind(this));
        this.scene.events.on('powerUpCollected', this.onPowerUpCollected.bind(this));
        this.scene.events.on('playerDamaged', this.onPlayerDamaged.bind(this));
        this.scene.events.on('shotFired', this.onShotFired.bind(this));
        this.scene.events.on('shotHit', this.onShotHit.bind(this));
    }

    addScore(amount, reason = '') {
        // Вычисляем итоговый счет с учетом множителей
        const finalScore = Math.floor(amount * this.scoreMultiplier * this.comboMultiplier);
        
        // Добавляем к текущему счету
        this.currentScore += finalScore;
        
        // Обновляем комбо
        this.updateCombo();
        
        // Проверяем достижения
        this.checkAchievements();
        
        // Показываем уведомление о получении очков
        this.showScoreNotification(finalScore, reason);
        
        // Обновляем UI
        this.updateScoreUI();
        
        // Сохраняем высокий счет, если нужно
        if (this.currentScore > this.highScore) {
            this.highScore = this.currentScore;
            this.saveHighScore();
        }
    }

    updateCombo() {
        // Сбрасываем предыдущий таймер комбо
        if (this.comboTimer) {
            this.comboTimer.destroy();
        }
        
        // Увеличиваем комбо
        this.stats.currentCombo++;
        
        // Обновляем максимальное комбо
        if (this.stats.currentCombo > this.stats.maxCombo) {
            this.stats.maxCombo = this.stats.currentCombo;
        }
        
        // Вычисляем множитель комбо
        this.comboMultiplier = 1 + (this.stats.currentCombo - 1) * 0.1;
        
        // Запускаем таймер сброса комбо
        this.comboTimer = this.scene.time.delayedCall(this.comboDuration, () => {
            this.resetCombo();
        });
        
        // Показываем комбо, если оно больше 1
        if (this.stats.currentCombo > 1) {
            this.showComboNotification();
        }
    }

    resetCombo() {
        this.stats.currentCombo = 0;
        this.comboMultiplier = 1.0;
        
        if (this.comboTimer) {
            this.comboTimer.destroy();
            this.comboTimer = null;
        }
    }

    onEnemyKilled(enemy) {
        // Добавляем очки за убийство врага
        const baseScore = enemy.score || GameConstants.SCORE_PER_ENEMY;
        this.addScore(baseScore, 'Убийство врага');
        
        // Обновляем статистику
        this.stats.enemiesKilled++;
        
        // Проверяем достижения
        this.checkKillAchievements();
    }

    onPowerUpCollected(powerUpType) {
        // Добавляем очки за сбор усиления
        this.addScore(50, 'Сбор усиления');
        
        // Обновляем статистику
        this.stats.powerUpsCollected++;
        
        // Проверяем достижения
        this.checkPowerUpAchievements();
    }

    onPlayerDamaged(health) {
        // Обновляем статистику урона
        this.stats.damageTaken += 20; // Примерный урон
        
        // Проверяем достижения
        this.checkDamageAchievements();
    }

    onShotFired() {
        // Обновляем статистику выстрелов
        this.stats.shotsFired++;
        this.updateAccuracy();
    }

    onShotHit() {
        // Обновляем статистику попаданий
        this.stats.shotsHit++;
        this.updateAccuracy();
    }

    updateAccuracy() {
        if (this.stats.shotsFired > 0) {
            this.stats.accuracy = (this.stats.shotsHit / this.stats.shotsFired) * 100;
        }
    }

    checkAchievements() {
        // Проверяем все достижения
        this.checkKillAchievements();
        this.checkTimeAchievements();
        this.checkAccuracyAchievements();
        this.checkComboAchievements();
        this.checkPowerUpAchievements();
        this.checkDamageAchievements();
    }

    checkKillAchievements() {
        const killCount = this.stats.enemiesKilled;
        
        if (killCount >= 1 && !this.achievements.get('first_kill').unlocked) {
            this.unlockAchievement('first_kill');
        }
        
        if (killCount >= 100 && !this.achievements.get('killer').unlocked) {
            this.unlockAchievement('killer');
        }
        
        if (killCount >= 500 && !this.achievements.get('exterminator').unlocked) {
            this.unlockAchievement('exterminator');
        }
    }

    checkTimeAchievements() {
        const timeAlive = this.stats.timeAlive;
        
        if (timeAlive >= 300 && !this.achievements.get('survivor').unlocked) {
            this.unlockAchievement('survivor');
        }
        
        if (timeAlive >= 900 && !this.achievements.get('veteran').unlocked) {
            this.unlockAchievement('veteran');
        }
    }

    checkAccuracyAchievements() {
        const accuracy = this.stats.accuracy;
        
        if (accuracy >= 80 && !this.achievements.get('marksman').unlocked) {
            this.unlockAchievement('marksman');
        }
    }

    checkComboAchievements() {
        const currentCombo = this.stats.currentCombo;
        
        if (currentCombo >= 20 && !this.achievements.get('combo_master').unlocked) {
            this.unlockAchievement('combo_master');
        }
    }

    checkPowerUpAchievements() {
        const powerUpCount = this.stats.powerUpsCollected;
        
        if (powerUpCount >= 50 && !this.achievements.get('power_collector').unlocked) {
            this.unlockAchievement('power_collector');
        }
    }

    checkDamageAchievements() {
        const damageTaken = this.stats.damageTaken;
        
        if (damageTaken >= 1000 && !this.achievements.get('tank').unlocked) {
            this.unlockAchievement('tank');
        }
    }

    unlockAchievement(achievementId) {
        const achievement = this.achievements.get(achievementId);
        if (!achievement || achievement.unlocked) return;
        
        // Разблокируем достижение
        achievement.unlocked = true;
        
        // Добавляем очки за достижение
        this.addScore(achievement.score, `Достижение: ${achievement.name}`);
        
        // Показываем уведомление о достижении
        this.showAchievementNotification(achievement);
        
        // Сохраняем прогресс
        this.saveAchievements();
    }

    showScoreNotification(score, reason) {
        // Создаем уведомление о получении очков
        const notification = this.scene.add.text(
            this.scene.cameras.main.centerX,
            this.scene.cameras.main.centerY - 150,
            `+${score}`,
            {
                fontSize: '32px',
                fill: '#ffff00',
                fontFamily: 'Arial',
                stroke: '#ff8800',
                strokeThickness: 3
            }
        ).setOrigin(0.5);
        
        // Анимация уведомления
        this.scene.tweens.add({
            targets: notification,
            y: notification.y - 50,
            alpha: 0,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                notification.destroy();
            }
        });
    }

    showComboNotification() {
        // Создаем уведомление о комбо
        const comboText = this.scene.add.text(
            this.scene.cameras.main.centerX,
            this.scene.cameras.main.centerY + 150,
            `КОМБО x${this.stats.currentCombo}`,
            {
                fontSize: '28px',
                fill: '#ff0000',
                fontFamily: 'Arial',
                stroke: '#660000',
                strokeThickness: 3
            }
        ).setOrigin(0.5);
        
        // Анимация комбо
        this.scene.tweens.add({
            targets: comboText,
            scaleX: 1.3,
            scaleY: 1.3,
            duration: 200,
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                comboText.destroy();
            }
        });
    }

    showAchievementNotification(achievement) {
        // Создаем уведомление о достижении
        const achievementContainer = this.scene.add.container(
            this.scene.cameras.main.width + 300,
            this.scene.cameras.main.centerY
        );
        
        // Фон достижения
        const bg = this.scene.add.rectangle(0, 0, 300, 80, 0x000000, 0.9);
        bg.setStrokeStyle(2, 0x00ff00);
        
        // Иконка достижения
        const icon = this.scene.add.text(-120, 0, achievement.icon, {
            fontSize: '32px'
        }).setOrigin(0.5);
        
        // Название достижения
        const name = this.scene.add.text(-80, -15, achievement.name, {
            fontSize: '16px',
            fill: '#00ff00',
            fontFamily: 'Arial'
        }).setOrigin(0, 0.5);
        
        // Описание достижения
        const description = this.scene.add.text(-80, 15, achievement.description, {
            fontSize: '12px',
            fill: '#00ffff',
            fontFamily: 'Arial'
        }).setOrigin(0, 0.5);
        
        // Добавляем элементы в контейнер
        achievementContainer.add([bg, icon, name, description]);
        
        // Анимация появления
        this.scene.tweens.add({
            targets: achievementContainer,
            x: this.scene.cameras.main.width - 300,
            duration: 500,
            ease: 'Back.easeOut',
            onComplete: () => {
                // Убираем через 3 секунды
                this.scene.time.delayedCall(3000, () => {
                    this.scene.tweens.add({
                        targets: achievementContainer,
                        x: this.scene.cameras.main.width + 300,
                        duration: 500,
                        ease: 'Back.easeIn',
                        onComplete: () => {
                            achievementContainer.destroy();
                        }
                    });
                });
            }
        });
    }

    updateScoreUI() {
        // Обновляем UI счета
        this.scene.events.emit('scoreUpdated', {
            currentScore: this.currentScore,
            highScore: this.highScore,
            combo: this.stats.currentCombo,
            comboMultiplier: this.comboMultiplier
        });
    }

    updateTimeAlive(time) {
        this.stats.timeAlive = time;
        this.checkTimeAchievements();
    }

    // Методы для получения информации
    getCurrentScore() {
        return this.currentScore;
    }

    getHighScore() {
        return this.highScore;
    }

    getStats() {
        return { ...this.stats };
    }

    getAchievements() {
        return Array.from(this.achievements.values());
    }

    getUnlockedAchievements() {
        return Array.from(this.achievements.values())
            .filter(achievement => achievement.unlocked);
    }

    getAchievementProgress() {
        const total = this.achievements.size;
        const unlocked = this.getUnlockedAchievements().length;
        return {
            total,
            unlocked,
            percentage: (unlocked / total) * 100
        };
    }

    // Методы для управления системой
    setScoreMultiplier(multiplier) {
        this.scoreMultiplier = multiplier;
    }

    resetScore() {
        this.currentScore = 0;
        this.updateScoreUI();
    }

    resetStats() {
        this.stats = {
            enemiesKilled: 0,
            powerUpsCollected: 0,
            timeAlive: 0,
            damageDealt: 0,
            damageTaken: 0,
            shotsFired: 0,
            shotsHit: 0,
            accuracy: 0,
            maxCombo: 0,
            currentCombo: 0
        };
        this.updateScoreUI();
    }

    // Методы для сохранения/загрузки
    saveHighScore() {
        try {
            localStorage.setItem('futureSurvivors_highScore', this.highScore.toString());
        } catch (error) {
            console.error('Ошибка сохранения высокого счета:', error);
        }
    }

    loadHighScore() {
        try {
            const saved = localStorage.getItem('futureSurvivors_highScore');
            return saved ? parseInt(saved) : 0;
        } catch (error) {
            console.error('Ошибка загрузки высокого счета:', error);
            return 0;
        }
    }

    saveAchievements() {
        try {
            const achievementData = Array.from(this.achievements.values())
                .map(achievement => ({
                    id: achievement.id,
                    unlocked: achievement.unlocked
                }));
            localStorage.setItem('futureSurvivors_achievements', JSON.stringify(achievementData));
        } catch (error) {
            console.error('Ошибка сохранения достижений:', error);
        }
    }

    loadAchievements() {
        try {
            const saved = localStorage.getItem('futureSurvivors_achievements');
            if (saved) {
                const achievementData = JSON.parse(saved);
                achievementData.forEach(data => {
                    const achievement = this.achievements.get(data.id);
                    if (achievement) {
                        achievement.unlocked = data.unlocked;
                    }
                });
            }
        } catch (error) {
            console.error('Ошибка загрузки достижений:', error);
        }
    }

    // Методы для отладки
    debugScoreInfo() {
        console.log('=== Score System Debug Info ===');
        console.log('Current Score:', this.currentScore);
        console.log('High Score:', this.highScore);
        console.log('Score Multiplier:', this.scoreMultiplier);
        console.log('Combo Multiplier:', this.comboMultiplier);
        console.log('Current Combo:', this.stats.currentCombo);
        console.log('Stats:', this.stats);
        console.log('Achievements Progress:', this.getAchievementProgress());
        console.log('================================');
    }

    // Методы для очистки
    cleanup() {
        if (this.comboTimer) {
            this.comboTimer.destroy();
        }
        
        // Сохраняем данные
        this.saveHighScore();
        this.saveAchievements();
    }
}
