// Главный герой с HTML GIF анимацией
class GifPlayer extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y) {
        // Создаем невидимый прямоугольник для физики
        super(scene, x, y, 120, 120, 0x00ff00); // Увеличили хитбокс под размер GIF (160px)
        
        this.scene = scene;
        
        // Добавляем в сцену и физику
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Делаем базовый прямоугольник невидимым
        this.setAlpha(0);
        
        // Создаем HTML img элемент для GIF анимации
        this.createGifElement();
        
        // Инициализируем статы игрока
        this.initPlayerStats();
        
        console.log('Created GIF Player with HTML animation at:', x, y);
    }
    
    createGifElement() {
        // Создаем img элемент
        this.gifElement = document.createElement('img');
        this.gifElement.src = 'image/character/gg.gif';
        this.gifElement.style.position = 'absolute';
        this.gifElement.style.width = '160px'; // Среднее между штурмовиком (120px) и танком (240px)
        this.gifElement.style.height = '160px';
        this.gifElement.style.pointerEvents = 'none'; // Отключаем взаимодействие с мышью
        this.gifElement.style.zIndex = '2'; // ПОВЕРХ CANVAS, НО ПОД UI
        
        // Добавляем в DOM
        document.body.appendChild(this.gifElement);
        
        console.log('Player GIF element created and added to DOM');
    }
    
    initPlayerStats() {
        // Базовые характеристики игрока
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.speed = 200;
        this.damage = 15;
        this.fireRate = 500;
        this.armor = 0;
        this.criticalChance = 0;
        this.regen = 0;
        this.magnetRadius = 0;
        this.experience = 0;
        this.level = 1;
        
        // Дополнительные характеристики
        this.projectileCount = 1;
        this.piercing = 0;
        this.explosiveShots = false;
        this.shield = 0;
        this.vampirism = 0;
        this.berserker = 0;
        
        // Дрон
        this.hasDrone = false;
        this.droneCount = 0;
        
        console.log('Player stats initialized');
    }
    
    update() {
        // Обновляем позицию GIF элемента
        if (this.gifElement && this.active) {
            this.updateGifPosition();
        }
    }
    
    updateGifPosition() {
        // Получаем canvas элемент
        const canvas = this.scene.sys.canvas;
        const canvasRect = canvas.getBoundingClientRect();
        
        // Конвертируем игровые координаты в экранные
        const camera = this.scene.cameras.main;
        const screenX = (this.x - camera.scrollX) * camera.zoom + canvasRect.left;
        const screenY = (this.y - camera.scrollY) * camera.zoom + canvasRect.top;
        
        // Позиционируем GIF элемент (центрируем с учетом размера героя)
        this.gifElement.style.left = (screenX - 80) + 'px'; // Центрируем (160/2 = 80)
        this.gifElement.style.top = (screenY - 80) + 'px';
        
        // НЕ поворачиваем - герой всегда остается вертикальным
    }
    
    takeDamage(damage) {
        try {
            // Применяем броню
            const actualDamage = Math.max(1, damage - this.armor);
            this.health -= actualDamage;
            
            console.log(`GifPlayer took ${actualDamage} damage, health: ${this.health}/${this.maxHealth}`);
            
            // Безопасный эффект получения урона - красный оттенок
            try {
                if (this.gifElement) {
                    this.gifElement.style.filter = 'hue-rotate(0deg) brightness(1.5) saturate(2) sepia(1)';
                    setTimeout(() => {
                        if (this.gifElement) {
                            this.gifElement.style.filter = 'none';
                        }
                    }, 300);
                }
            } catch (filterError) {
                console.error('Error applying damage filter:', filterError);
            }
            
            if (this.health <= 0) {
                try {
                    this.die();
                } catch (dieError) {
                    console.error('Error in player die():', dieError);
                }
            }
            
            return actualDamage;
        } catch (error) {
            console.error('Critical error in GifPlayer takeDamage:', error);
            return 0;
        }
    }
    
    heal(amount) {
        const oldHealth = this.health;
        this.health = Math.min(this.maxHealth, this.health + amount);
        const actualHeal = this.health - oldHealth;
        
        if (actualHeal > 0) {
            console.log(`Player healed ${actualHeal}, health: ${this.health}/${this.maxHealth}`);
        }
        
        return actualHeal;
    }
    
    die() {
        console.log('Player died!');
        
        // Удаляем GIF элемент
        if (this.gifElement && this.gifElement.parentNode) {
            this.gifElement.parentNode.removeChild(this.gifElement);
        }
        
        // Эмитим событие смерти
        this.scene.events.emit('playerDied');
        
        // Деактивируем игрока
        this.setActive(false);
        this.setVisible(false);
    }
    
    destroy() {
        // Удаляем GIF элемент из DOM
        if (this.gifElement && this.gifElement.parentNode) {
            this.gifElement.parentNode.removeChild(this.gifElement);
            console.log('Player GIF element removed from DOM');
        }
        
        // Вызываем родительский метод
        super.destroy();
    }
}
