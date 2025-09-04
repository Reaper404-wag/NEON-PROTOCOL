// Базовый класс врага
class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        
        this.scene = scene;
        this.enemyType = 'enemy'; // Добавляем тип врага для логирования
        
        // Добавляем в сцену и физику
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Базовые параметры (переопределяются в подклассах)
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.damage = 10;
        this.speed = 100;
        this.fireRate = 1000; // Милисекунды между выстрелами
        this.lastShot = 0;
        this.score = 10;
        
        // Настройки физики
        this.body.setCollideWorldBounds(true);
        
        // AI состояние
        this.target = null;
        this.attackRange = 200;
        this.detectionRange = 300;
        
        console.log(`Created ${this.enemyType} enemy at ${x}, ${y}`);
    }
    
    takeDamage(damage) {
        this.health -= damage;
        console.log(`${this.enemyType} took ${damage} damage, health: ${this.health}`);
        
        // Эффект получения урона
        this.tint = 0xff0000;
        this.scene.time.delayedCall(100, () => {
            this.tint = 0xffffff;
        });
        
        if (this.health <= 0) {
            this.die();
        }
    }
    
    die() {
        console.log(`${this.enemyType} enemy died`);
        
        // Эмитим событие смерти с данными врага
        this.scene.events.emit('enemyKilled', { 
            score: this.score,
            x: this.x,
            y: this.y,
            type: this.enemyType
        });
        
        // Уничтожаем врага
        this.destroy();
    }
    
    update(time, delta) {
        if (!this.active) return;
        
        // Обновляем AI
        this.updateAI(time, delta);
        
        // Обновляем специфичную для типа логику
        this.updateType(time, delta);
    }
    
    updateAI(time, delta) {
        // Всегда устанавливаем игрока как цель
        if (this.scene.player && this.scene.player.active) {
            this.target = this.scene.player;
        }
        
        // ВСЕГДА двигаемся к игроку если он есть
        if (this.target && this.target.active) {
            this.moveToTarget();
            
            // Стреляем если в радиусе атаки
            const distance = Phaser.Math.Distance.Between(
                this.x, this.y,
                this.target.x, this.target.y
            );
            
            if (distance < this.attackRange && time - this.lastShot > this.fireRate) {
                this.shoot();
                this.lastShot = time;
            }
        }
    }
    
    moveToTarget() {
        if (!this.target) return;
        
        const angle = Phaser.Math.Angle.Between(
            this.x, this.y,
            this.target.x, this.target.y
        );
        
        this.body.setVelocity(
            Math.cos(angle) * this.speed,
            Math.sin(angle) * this.speed
        );
        
        // Поворачиваем спрайт к цели
        this.rotation = angle;
    }
    
    shoot() {
        // Переопределяется в подклассах
        console.log(`${this.enemyType} is shooting!`);
    }
    
    updateType(time, delta) {
        // Переопределяется в подклассах для специфичного поведения
    }
}