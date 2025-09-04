// Штурмовик с HTML GIF анимацией
class GifAssaultEnemy extends Enemy {
    constructor(scene, x, y) {
        // Используем fallback спрайт для физики
        super(scene, x, y, 'assault');
        
        this.scene = scene;
        this.enemyType = 'assault';
        
        // Параметры штурмовика
        this.maxHealth = 30;
        this.health = this.maxHealth;
        this.damage = 5;
        this.speed = 150;
        this.fireRate = 800;
        this.score = 10;
        this.attackRange = 270; // Увеличено в 1.5 раза (180 * 1.5)
        
        // Делаем базовый спрайт невидимым
        this.setAlpha(0);
        this.setScale(4.5); // Увеличили хитбокс под GIF 120px
        
        // Создаем HTML img элемент для GIF анимации
        this.createGifElement();
        
        console.log('Created GIF Assault Enemy with HTML animation');
    }
    
    createGifElement() {
        // Создаем img элемент
        this.gifElement = document.createElement('img');
        this.gifElement.src = 'image/character/shturm.gif';
        this.gifElement.style.position = 'absolute';
        this.gifElement.style.width = '120px'; // Увеличили в 2.5 раза (48 * 2.5 = 120)
        this.gifElement.style.height = '120px';
        this.gifElement.style.pointerEvents = 'none'; // Отключаем взаимодействие с мышью
        this.gifElement.style.zIndex = '1'; // ПОВЕРХ CANVAS, НО ПОД ИГРОКОМ И UI
        
        // Добавляем в DOM
        document.body.appendChild(this.gifElement);
        
        console.log('GIF element created and added to DOM');
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
        
        // Позиционируем GIF элемент (центрируем с учетом нового размера)
        this.gifElement.style.left = (screenX - 60) + 'px'; // Центрируем (120/2 = 60)
        this.gifElement.style.top = (screenY - 60) + 'px';
        
        // НЕ поворачиваем - штурмовик всегда остается вертикальным
        // this.gifElement.style.transform = 'none'; // Убираем любые повороты
    }
    
    shoot() {
        if (!this.target) return;
        
        console.log('GifAssaultEnemy shooting burst!');
        
        // Стреляем очередью по 3 шарика с небольшой задержкой
        for (let i = 0; i < 3; i++) {
            this.scene.time.delayedCall(i * 150, () => {
                if (!this.active || !this.target) return;
                
                const projectile = this.scene.add.circle(this.x, this.y, 3, 0xff0000);
                this.scene.physics.add.existing(projectile);
                this.scene.enemyProjectileGroup.add(projectile);
                
                const angle = Phaser.Math.Angle.Between(
                    this.x, this.y,
                    this.target.x, this.target.y
                );
                
                // Добавляем небольшой разброс для очереди
                const spread = (i - 1) * 0.1; // -0.1, 0, 0.1 радиан
                const finalAngle = angle + spread;
                
                const speed = 300;
                projectile.body.setVelocity(
                    Math.cos(finalAngle) * speed,
                    Math.sin(finalAngle) * speed
                );
                
                projectile.damage = this.damage;
                
                // Коллизия обрабатывается глобально в GameScene
                
                // Звук выстрела только для первого шарика
                if (i === 0 && this.scene.audioManager && this.scene.audioManager.playAssaultShoot) {
                    this.scene.audioManager.playAssaultShoot();
                }
            });
        }
        
        console.log('GifAssaultEnemy burst fired!');
    }
    
    destroy() {
        // Удаляем GIF элемент из DOM
        if (this.gifElement && this.gifElement.parentNode) {
            this.gifElement.parentNode.removeChild(this.gifElement);
            console.log('GIF element removed from DOM');
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
