// Танк с HTML GIF анимацией
class GifTankEnemy extends Enemy {
    constructor(scene, x, y) {
        // Используем fallback спрайт для физики
        super(scene, x, y, 'tank');
        
        this.scene = scene;
        this.enemyType = 'tank';
        
        // Параметры танка
        this.maxHealth = 100; // Много HP - 10 попаданий
        this.health = this.maxHealth;
        this.damage = 15;
        this.speed = 80; // Медленный
        this.fireRate = 2000; // Медленно стреляет
        this.score = 30;
        this.attackRange = 220;
        
        // Делаем базовый спрайт невидимым
        this.setAlpha(0);
        this.setScale(6.5); // Хитбокс под GIF 240px, но не слишком большой
        
        // Создаем HTML img элемент для GIF анимации
        this.createGifElement();
        
        console.log('Created GIF Tank Enemy with HTML animation');
    }
    
    createGifElement() {
        // Создаем img элемент
        this.gifElement = document.createElement('img');
        this.gifElement.src = 'image/character/tank.gif';
        this.gifElement.style.position = 'absolute';
        this.gifElement.style.width = '240px'; // В 2 раза больше штурмовика (120px * 2)
        this.gifElement.style.height = '240px';
        this.gifElement.style.pointerEvents = 'none'; // Отключаем взаимодействие с мышью
        this.gifElement.style.zIndex = '1'; // ПОВЕРХ CANVAS, НО ПОД ИГРОКОМ И UI
        
        // Добавляем в DOM
        document.body.appendChild(this.gifElement);
        
        console.log('Tank GIF element created and added to DOM');
    }
    
    update(time, delta) {
        // Обновляем логику врага
        super.update(time, delta);
        
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
        
        // Позиционируем GIF элемент (центрируем с учетом размера танка)
        this.gifElement.style.left = (screenX - 120) + 'px'; // Центрируем (240/2 = 120)
        this.gifElement.style.top = (screenY - 120) + 'px';
        
        // НЕ поворачиваем - танк всегда остается вертикальным
    }
    
    shoot() {
        if (!this.target) return;
        
        console.log('GIF Tank shooting 3 powerful rounds!');
        
        // Танк стреляет тремя мощными снарядами веером
        for (let i = -1; i <= 1; i++) {
            const projectile = this.scene.add.circle(this.x, this.y, 6, 0xff0000); // Больше размер для танка
            this.scene.physics.add.existing(projectile);
            this.scene.enemyProjectileGroup.add(projectile);
            
            const baseAngle = Phaser.Math.Angle.Between(
                this.x, this.y,
                this.target.x, this.target.y
            );
            
            // Разброс веером для танка (больше чем у штурмовика)
            const angle = baseAngle + (i * 0.4); // -0.4, 0, 0.4 радиан
            
            const speed = 280; // Быстрее обычных снарядов
            projectile.body.setVelocity(
                Math.cos(angle) * speed,
                Math.sin(angle) * speed
            );
            
            projectile.damage = this.damage; // Полный урон каждый снаряд
            
            // Коллизия обрабатывается глобально в GameScene
        }
        
        // Звук выстрела танка
        if (this.scene.audioManager && this.scene.audioManager.playTankShoot) {
            this.scene.audioManager.playTankShoot();
        }
        
        console.log('GIF Tank fired 3 powerful rounds!');
    }
    
    destroy() {
        // Удаляем GIF элемент из DOM
        if (this.gifElement && this.gifElement.parentNode) {
            this.gifElement.parentNode.removeChild(this.gifElement);
            console.log('Tank GIF element removed from DOM');
        }
        
        // Вызываем родительский метод
        super.destroy();
    }
    
    die() {
        // Удаляем GIF элемент перед смертью
        if (this.gifElement && this.gifElement.parentNode) {
            this.gifElement.parentNode.removeChild(this.gifElement);
        }
        
        super.die();
    }
}
