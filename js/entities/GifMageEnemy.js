// Маг с HTML GIF анимацией
class GifMageEnemy extends Enemy {
    constructor(scene, x, y) {
        // Используем fallback спрайт для физики
        super(scene, x, y, 'mage');
        
        this.scene = scene;
        this.enemyType = 'mage';
        
        // Параметры мага
        this.maxHealth = 60; // Средние HP - 6 попаданий
        this.health = this.maxHealth;
        this.damage = 12;
        this.speed = 110; // Средняя скорость
        this.fireRate = 1200; // Средняя скорость стрельбы
        this.score = 20;
        this.attackRange = 300; // Увеличено в 1.5 раза (200 * 1.5)
        
        // Специальные способности мага
        this.teleportCooldown = 5000; // Телепорт каждые 5 секунд
        this.lastTeleport = 0;
        
        // Делаем базовый спрайт невидимым
        this.setAlpha(0);
        this.setScale(6.0); // Увеличили хитбокс под GIF 180px
        
        // Создаем HTML img элемент для GIF анимации
        this.createGifElement();
        
        console.log('Created GIF Mage Enemy with HTML animation');
    }
    
    createGifElement() {
        // Создаем img элемент
        this.gifElement = document.createElement('img');
        this.gifElement.src = 'image/character/mag.gif';
        this.gifElement.style.position = 'absolute';
        this.gifElement.style.width = '180px'; // Среднее между штурмовиком (120px) и танком (240px)
        this.gifElement.style.height = '180px';
        this.gifElement.style.pointerEvents = 'none'; // Отключаем взаимодействие с мышью
        this.gifElement.style.zIndex = '1'; // ПОВЕРХ CANVAS, НО ПОД ИГРОКОМ И UI
        
        // Добавляем в DOM
        document.body.appendChild(this.gifElement);
        
        console.log('Mage GIF element created and added to DOM');
    }
    
    update(time, delta) {
        // Обновляем логику врага
        super.update(time, delta);
        
        // Обновляем позицию GIF элемента
        if (this.gifElement && this.active) {
            this.updateGifPosition();
        }
        
        // Проверяем телепорт
        if (time - this.lastTeleport > this.teleportCooldown) {
            this.teleport();
            this.lastTeleport = time;
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
        
        // Позиционируем GIF элемент (центрируем с учетом размера мага)
        this.gifElement.style.left = (screenX - 90) + 'px'; // Центрируем (180/2 = 90)
        this.gifElement.style.top = (screenY - 90) + 'px';
        
        // НЕ поворачиваем - маг всегда остается вертикальным
    }
    

    
    teleport() {
        if (!this.scene.player || !this.scene.player.active) return;
        
        // Телепортируемся в случайную точку вокруг игрока
        const distance = 150 + Math.random() * 100;
        const angle = Math.random() * Math.PI * 2;
        
        const newX = this.scene.player.x + Math.cos(angle) * distance;
        const newY = this.scene.player.y + Math.sin(angle) * distance;
        
        // Ограничиваем границами мира
        const clampedX = Phaser.Math.Clamp(newX, 50, this.scene.sys.canvas.width - 50);
        const clampedY = Phaser.Math.Clamp(newY, 50, this.scene.sys.canvas.height - 50);
        
        this.setPosition(clampedX, clampedY);
        
        console.log('Mage teleported to:', clampedX, clampedY);
    }
    
    shoot() {
        if (!this.target) return;
        
        // Маг стреляет ОДНИМ самонаводящимся снарядом
        const projectile = this.scene.add.circle(this.x, this.y, 4, 0x8000ff); // Фиолетовый
        this.scene.physics.add.existing(projectile);
        this.scene.enemyProjectileGroup.add(projectile);
        
        // Начальное направление к игроку
        const angle = Phaser.Math.Angle.Between(
            this.x, this.y,
            this.target.x, this.target.y
        );
        
        const speed = 180; // Медленнее чем обычные снаряды
        projectile.body.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );
        
        projectile.damage = this.damage;
        
        // САМОНАВЕДЕНИЕ - это то что отличает мага!
        projectile.isHoming = true;
        projectile.homingTarget = this.target;
        projectile.homingStrength = 0.03;
        projectile.maxSpeed = 250;
        
        // Добавляем эффект мерцания магическому снаряду
        this.scene.tweens.add({
            targets: projectile,
            alpha: 0.3,
            duration: 200,
            yoyo: true,
            repeat: -1
        });
        
        // Коллизия обрабатывается глобально в GameScene
        
        // Звук выстрела мага
        if (this.scene.audioManager && this.scene.audioManager.playMageShoot) {
            this.scene.audioManager.playMageShoot();
        }
        
        console.log('GifMageEnemy homing shot fired!');
    }
    
    destroy() {
        // Удаляем GIF элемент из DOM
        if (this.gifElement && this.gifElement.parentNode) {
            this.gifElement.parentNode.removeChild(this.gifElement);
            console.log('Mage GIF element removed from DOM');
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
