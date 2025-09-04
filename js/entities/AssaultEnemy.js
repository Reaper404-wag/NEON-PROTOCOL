// Штурмовик - быстрый, мало HP, быстро стреляет
class AssaultEnemy extends Enemy {
    constructor(scene, x, y) {
        // Используем настоящую анимацию штурмовика
        super(scene, x, y, 'assault_sprite');
        
        // Тип врага для логирования
        this.enemyType = 'assault';
        
        // Параметры штурмовика
        this.maxHealth = 30; // Мало HP - 3 попадания
        this.health = this.maxHealth;
        this.damage = 5;
        this.speed = 150; // Быстрый
        this.fireRate = 800; // Быстро стреляет
        this.score = 10;
        this.attackRange = 270; // Увеличено в 1.5 раза для соответствия GifAssaultEnemy
        
        // Внешний вид
        this.setScale(1.2); // Уменьшили в 2 раза (2.4 / 2 = 1.2)
        // Убираем тинт чтобы видеть оригинальные цвета GIF анимации
        
        console.log('Created Assault Enemy with REAL GIF animation!');
    }
    
    shoot() {
        if (!this.target) return;
        
        // Создаем быстрый снаряд
        const projectile = this.scene.createEnemyProjectile(
            this.x, this.y,
            this.target.x, this.target.y,
            300, // Быстрая скорость снаряда
            this.damage,
            0x00ff00 // Зеленый снаряд
        );
        
        // Воспроизводим звук стрельбы штурмовика
        if (this.scene.audioManager && this.scene.audioManager.playAssaultShoot) {
            this.scene.audioManager.playAssaultShoot();
        }
        
        console.log('Assault enemy shot!');
    }
    
    updateType(time, delta) {
        // Штурмовик иногда делает рывки к игроку
        if (Math.random() < 0.01) { // 1% шанс каждый кадр
            this.speed = 200; // Временно ускоряется
            this.scene.time.delayedCall(500, () => {
                this.speed = 150; // Возвращается к нормальной скорости
            });
        }
    }
}
