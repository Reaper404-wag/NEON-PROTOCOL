// Танк - медленный, много HP, сильный урон по площади
class TankEnemy extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y, 'tank');
        
        // Тип врага для логирования
        this.enemyType = 'tank';
        
        // Параметры танка
        this.maxHealth = 100; // Много HP - 10 попаданий
        this.health = this.maxHealth;
        this.damage = 15;
        this.speed = 80; // Медленный
        this.fireRate = 2000; // Медленно стреляет
        this.score = 30;
        this.attackRange = 220;
        
        // Внешний вид
        this.setScale(1.8); // Уменьшили в 2 раза (3.6 / 2 = 1.8)
        // Цвет уже встроен в fallback спрайт, тинт не нужен
        
        // Простой внешний вид без лишних эффектов
        
        console.log('Created Tank Enemy with rotation animation');
    }
    
    shoot() {
        if (!this.target) return;
        
        // Создаем несколько снарядов (дробовик эффект)
        const angles = [-0.3, 0, 0.3]; // Разброс
        
        angles.forEach(angleOffset => {
            const baseAngle = Phaser.Math.Angle.Between(
                this.x, this.y,
                this.target.x, this.target.y
            );
            
            const finalAngle = baseAngle + angleOffset;
            const targetX = this.x + Math.cos(finalAngle) * 300;
            const targetY = this.y + Math.sin(finalAngle) * 300;
            
            const projectile = this.scene.createEnemyProjectile(
                this.x, this.y,
                targetX, targetY,
                200, // Средняя скорость снаряда
                this.damage,
                0xff0000 // Красный снаряд
            );
        });
        
        // Воспроизводим звук стрельбы танка
        if (this.scene.audioManager && this.scene.audioManager.playTankShoot) {
            this.scene.audioManager.playTankShoot();
        }
        
        console.log('Tank enemy shot spread!');
    }
    
    updateType(time, delta) {
        // Танк иногда останавливается для более точной стрельбы
        if (this.target && Math.random() < 0.005) { // 0.5% шанс
            this.body.setVelocity(0, 0); // Останавливается
            this.scene.time.delayedCall(1000, () => {
                // Возобновляет движение через секунду
            });
        }
    }
}
