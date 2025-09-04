// Основная конфигурация игры
const GameConfig = {
    // Конфигурация Phaser
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container',
    backgroundColor: '#000011',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
        BootScene,
        PreloadScene,
        IntroScene,
        MenuScene,
        GameScene,
        GameOverScene
    ]
};

// Игровые константы
const GameConstants = {
    // Игрок
    PLAYER_SPEED: 200,
    PLAYER_HEALTH: 100,
    PLAYER_SIZE: 32,
    
    // Оружие
    BASIC_WEAPON_DAMAGE: 25,
    BASIC_WEAPON_FIRE_RATE: 300, // мс между выстрелами
    BASIC_WEAPON_SPEED: 400,
    
    // Враги
    ENEMY_SPEED: 80,
    ENEMY_HEALTH: 50,
    ENEMY_SIZE: 24,
    ENEMY_SPAWN_RATE: 1000, // мс между спавном врагов
    
    // Системы
    POWERUP_DURATION: 10000, // 10 секунд
    SCORE_PER_ENEMY: 100,
    HEALTH_PICKUP_AMOUNT: 20,
    
    // UI
    UI_FONT_SIZE: '24px',
    UI_COLOR: '#00ff00',
    UI_BACKGROUND_COLOR: 'rgba(0, 0, 0, 0.7)'
};

// Типы врагов
const EnemyTypes = {
    BASIC: {
        key: 'enemy_basic',
        health: 50,
        speed: 80,
        damage: 20,
        score: 100,
        size: 24
    },
    FAST: {
        key: 'enemy_fast',
        health: 30,
        speed: 150,
        damage: 15,
        score: 150,
        size: 20
    },
    TANK: {
        key: 'enemy_tank',
        health: 100,
        speed: 50,
        damage: 30,
        score: 200,
        size: 32
    }
};

// Типы оружия
const WeaponTypes = {
    BASIC_LASER: {
        key: 'weapon_basic',
        damage: 25,
        fireRate: 300,
        projectileSpeed: 400,
        projectileSize: 8,
        color: 0x00ff00
    },
    PLASMA_CANNON: {
        key: 'weapon_plasma',
        damage: 40,
        fireRate: 500,
        projectileSpeed: 350,
        projectileSize: 12,
        color: 0x0088ff
    },
    QUANTUM_BLASTER: {
        key: 'weapon_quantum',
        damage: 60,
        fireRate: 800,
        projectileSpeed: 300,
        projectileSize: 16,
        color: 0xff00ff
    }
};

// Типы усилений
const PowerUpTypes = {
    HEALTH: {
        key: 'powerup_health',
        effect: 'health',
        value: 20,
        duration: 0,
        color: 0xff0000
    },
    SPEED: {
        key: 'powerup_speed',
        effect: 'speed',
        value: 1.5,
        duration: 10000,
        color: 0x00ffff
    },
    DAMAGE: {
        key: 'powerup_damage',
        effect: 'damage',
        value: 2.0,
        duration: 10000,
        color: 0xff8800
    },
    FIRE_RATE: {
        key: 'powerup_fire_rate',
        effect: 'fireRate',
        value: 0.5,
        duration: 10000,
        color: 0xffff00
    }
};
