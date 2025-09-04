// Маг - средние характеристики, магические способности
class MageEnemy extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y, 'mage');
        
        // Тип врага для логирования
        this.enemyType = 'mage';
        
        // Параметры мага
        this.maxHealth = 60; // Средние HP - 6 попаданий
        this.health = this.maxHealth;
        this.damage = 12;
        this.speed = 110; // Средняя скорость
        this.fireRate = 1200; // Средняя скорость стрельбы
        this.score = 20;
        this.attackRange = 300; // Увеличено в 1.5 раза для соответствия GifMageEnemy
        
        // Специальные способности мага
        this.teleportCooldown = 5000; // Телепорт каждые 5 секунд
        this.lastTeleport = 0;
        
        // Внешний вид
        this.setScale(1.5); // Уменьшили в 2 раза (3.0 / 2 = 1.5)
        // Цвет уже встроен в fallback спрайт, тинт не нужен
        
        // Простой внешний вид без лишних эффектов
        
        console.log('Created Mage Enemy with flickering animation');
    }
    
    shoot() {
        if (!this.target) return;
        
        // Создаем магический снаряд с самонаведением
        const projectile = this.scene.createEnemyProjectile(
            this.x, this.y,
            this.target.x, this.target.y,
            250, // Средняя скорость снаряда
            this.damage,
            0x0000ff // Синий магический снаряд
        );
        
        // Добавляем эффект самонаведения
        if (projectile) {
            projectile.isHoming = true;
            projectile.homingTarget = this.target;
            projectile.homingStrength = 0.02;
        }
        
        // Воспроизводим звук стрельбы мага
        if (this.scene.audioManager && this.scene.audioManager.playMageShoot) {
            this.scene.audioManager.playMageShoot();
        }
        
        console.log('Mage enemy shot homing projectile!');
    }
    
    updateType(time, delta) {
        // Телепортация мага
        if (this.target && time - this.lastTeleport > this.teleportCooldown) {
            this.teleport();
            this.lastTeleport = time;
        }
        
        // Маг держит оптимальную дистанцию
        if (this.target) {
            const distance = Phaser.Math.Distance.Between(
                this.x, this.y,
                this.target.x, this.target.y
            );
            
            if (distance < 120) { // Если игрок слишком близко - отступаем
                const angle = Phaser.Math.Angle.Between(
                    this.target.x, this.target.y,
                    this.x, this.y
                );
                
                this.body.setVelocity(
                    Math.cos(angle) * this.speed * 1.2, // Отступаем, но не слишком быстро
                    Math.sin(angle) * this.speed * 1.2
                );
            } else if (distance > 300) { // Если слишком далеко - приближаемся
                const angle = Phaser.Math.Angle.Between(
                    this.x, this.y,
                    this.target.x, this.target.y
                );
                
                this.body.setVelocity(
                    Math.cos(angle) * this.speed,
                    Math.sin(angle) * this.speed
                );
            }
            // Если дистанция 120-300 - идеальная, обычный AI берет верх
        }
    }
    
    teleport() {
        if (!this.target) return;
        
        // Эффект исчезновения
        this.setAlpha(0.3);
        
        // Телепортируемся на случайную позицию вокруг игрока
        const angle = Math.random() * Math.PI * 2;
        const distance = 200 + Math.random() * 100; // 200-300 пикселей от игрока
        
        const newX = this.target.x + Math.cos(angle) * distance;
        const newY = this.target.y + Math.sin(angle) * distance;
        
        // Ограничиваем границами мира
        const worldBounds = this.scene.physics.world.bounds;
        const clampedX = Phaser.Math.Clamp(newX, 50, worldBounds.width - 50);
        const clampedY = Phaser.Math.Clamp(newY, 50, worldBounds.height - 50);
        
        this.setPosition(clampedX, clampedY);
        
        // Эффект появления
        this.scene.time.delayedCall(100, () => {
            this.setAlpha(1);
        });
        
        console.log('Mage teleported!');
    }
}
