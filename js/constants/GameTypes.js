// Константы типов врагов
const EnemyTypes = {
    BASIC: {
        key: 'enemy_basic',
        name: 'Базовый враг',
        health: 50,
        speed: 80,
        damage: 20,
        score: 100,
        size: 24
    },
    FAST: {
        key: 'enemy_fast',
        name: 'Быстрый враг',
        health: 30,
        speed: 150,
        damage: 15,
        score: 150,
        size: 20
    },
    TANK: {
        key: 'enemy_tank',
        name: 'Танк',
        health: 150,
        speed: 50,
        damage: 40,
        score: 300,
        size: 32
    },
    BOSS: {
        key: 'enemy_boss',
        name: 'Босс',
        health: 500,
        speed: 60,
        damage: 80,
        score: 1000,
        size: 48
    }
};

// Константы типов оружия
const WeaponTypes = {
    BASIC_LASER: {
        key: 'projectile_basic',
        name: 'Базовый лазер',
        damage: 25,
        fireRate: 300,
        projectileSpeed: 400,
        projectileSize: 8,
        color: 0x00ff00,
        description: 'Стандартное оружие'
    },
    PLASMA_CANNON: {
        key: 'projectile_plasma',
        name: 'Плазменная пушка',
        damage: 50,
        fireRate: 500,
        projectileSpeed: 300,
        projectileSize: 12,
        color: 0x0088ff,
        description: 'Мощное оружие с медленной скорострельностью'
    },
    RAPID_FIRE: {
        key: 'projectile_rapid',
        name: 'Быстрая стрельба',
        damage: 15,
        fireRate: 150,
        projectileSpeed: 350,
        projectileSize: 6,
        color: 0xff8800,
        description: 'Быстрая стрельба с низким уроном'
    },
    EXPLOSIVE: {
        key: 'projectile_explosive',
        name: 'Взрывной снаряд',
        damage: 80,
        fireRate: 800,
        projectileSpeed: 250,
        projectileSize: 16,
        color: 0xff0000,
        description: 'Взрывное оружие с большой задержкой'
    },
    HOMING_MISSILE: {
        key: 'projectile_homing',
        name: 'Самонаводящаяся ракета',
        damage: 60,
        fireRate: 600,
        projectileSpeed: 200,
        projectileSize: 10,
        color: 0xff00ff,
        description: 'Ракета, которая следует за целью'
    }
};

// Константы типов усилений
const PowerUpTypes = {
    HEALTH: {
        key: 'powerup_health',
        name: 'Здоровье',
        effect: 'health',
        value: 20,
        duration: 0,
        color: 0x00ff00,
        description: 'Восстанавливает здоровье'
    },
    SPEED: {
        key: 'powerup_speed',
        name: 'Скорость',
        effect: 'speed',
        value: 1.5,
        duration: 10000,
        color: 0x0088ff,
        description: 'Увеличивает скорость движения'
    },
    DAMAGE: {
        key: 'powerup_damage',
        name: 'Урон',
        effect: 'damage',
        value: 2.0,
        duration: 15000,
        color: 0xff0000,
        description: 'Увеличивает урон оружия'
    },
    FIRE_RATE: {
        key: 'powerup_fire_rate',
        name: 'Скорострельность',
        effect: 'fireRate',
        value: 2.0,
        duration: 12000,
        color: 0xff8800,
        description: 'Увеличивает скорость стрельбы'
    },
    SHIELD: {
        key: 'powerup_shield',
        name: 'Щит',
        effect: 'shield',
        value: 50,
        duration: 8000,
        color: 0x00ffff,
        description: 'Создает временный щит'
    },
    MULTI_SHOT: {
        key: 'powerup_multi_shot',
        name: 'Множественный выстрел',
        effect: 'multiShot',
        value: 3,
        duration: 20000,
        color: 0xff00ff,
        description: 'Стреляет несколькими снарядами'
    }
};

// Константы типов эффектов
const EffectTypes = {
    SPEED_BOOST: {
        name: 'Ускорение',
        description: 'Увеличивает скорость движения',
        icon: '⚡',
        color: 0x0088ff
    },
    DAMAGE_BOOST: {
        name: 'Усиление урона',
        description: 'Увеличивает урон оружия',
        icon: '💥',
        color: 0xff0000
    },
    FIRE_RATE_BOOST: {
        name: 'Ускорение стрельбы',
        description: 'Увеличивает скорость стрельбы',
        icon: '🔫',
        color: 0xff8800
    },
    SHIELD: {
        name: 'Щит',
        description: 'Защищает от урона',
        icon: '🛡️',
        color: 0x00ffff
    },
    INVINCIBILITY: {
        name: 'Неуязвимость',
        description: 'Делает неуязвимым на время',
        icon: '✨',
        color: 0xffff00
    }
};

// Константы типов частиц
const ParticleTypes = {
    EXPLOSION: {
        key: 'particle_explosion',
        name: 'Взрыв',
        color: 0xff8800,
        size: { min: 2, max: 8 },
        speed: { min: 50, max: 200 },
        lifespan: { min: 500, max: 1000 }
    },
    LASER_TRAIL: {
        key: 'particle_laser_trail',
        name: 'След лазера',
        color: 0x00ff00,
        size: { min: 1, max: 4 },
        speed: { min: 10, max: 50 },
        lifespan: { min: 200, max: 500 }
    },
    POWER_UP_GLOW: {
        key: 'particle_powerup_glow',
        name: 'Свечение усиления',
        color: 0xffff00,
        size: { min: 3, max: 10 },
        speed: { min: 20, max: 80 },
        lifespan: { min: 800, max: 1500 }
    },
    ENEMY_DEATH: {
        key: 'particle_enemy_death',
        name: 'Смерть врага',
        color: 0xff0000,
        size: { min: 2, max: 6 },
        speed: { min: 30, max: 100 },
        lifespan: { min: 400, max: 800 }
    }
};

// Константы типов анимаций
const AnimationTypes = {
    IDLE: {
        name: 'Ожидание',
        frames: [0, 1, 2, 1],
        frameRate: 8,
        repeat: -1
    },
    WALK: {
        name: 'Ходьба',
        frames: [3, 4, 5, 4],
        frameRate: 12,
        repeat: -1
    },
    ATTACK: {
        name: 'Атака',
        frames: [6, 7, 8, 9],
        frameRate: 15,
        repeat: 0
    },
    DEATH: {
        name: 'Смерть',
        frames: [10, 11, 12, 13],
        frameRate: 10,
        repeat: 0
    }
};

// Константы типов уровней
const LevelTypes = {
    FOREST: {
        name: 'Лес',
        background: 'forest_bg',
        music: 'forest_music',
        enemies: ['basic', 'fast'],
        powerUps: ['health', 'speed'],
        difficulty: 1.0
    },
    CITY: {
        name: 'Город',
        background: 'city_bg',
        music: 'city_music',
        enemies: ['basic', 'fast', 'tank'],
        powerUps: ['health', 'speed', 'damage'],
        difficulty: 1.5
    },
    SPACE: {
        name: 'Космос',
        background: 'space_bg',
        music: 'space_music',
        enemies: ['fast', 'tank', 'boss'],
        powerUps: ['speed', 'damage', 'fireRate'],
        difficulty: 2.0
    },
    LABORATORY: {
        name: 'Лаборатория',
        background: 'lab_bg',
        music: 'lab_music',
        enemies: ['basic', 'tank', 'boss'],
        powerUps: ['health', 'shield', 'multiShot'],
        difficulty: 2.5
    }
};

// Константы типов достижений
const AchievementTypes = {
    KILLS: {
        name: 'Убийства',
        icon: '💀',
        color: 0xff0000
    },
    SURVIVAL: {
        name: 'Выживание',
        icon: '⏰',
        color: 0x00ff00
    },
    ACCURACY: {
        name: 'Точность',
        icon: '🎯',
        color: 0x0088ff
    },
    COMBO: {
        name: 'Комбо',
        icon: '🔥',
        color: 0xff8800
    },
    COLLECTION: {
        name: 'Сбор',
        icon: '⭐',
        color: 0xffff00
    }
};

// Константы типов UI элементов
const UITypes = {
    BUTTON: {
        name: 'Кнопка',
        defaultColor: 0x00ff00,
        hoverColor: 0x00cc00,
        pressedColor: 0x008800
    },
    PANEL: {
        name: 'Панель',
        defaultColor: 0x000000,
        borderColor: 0x00ff00,
        alpha: 0.8
    },
    TEXT: {
        name: 'Текст',
        defaultColor: 0xffffff,
        highlightColor: 0x00ff00,
        shadowColor: 0x000000
    },
    PROGRESS_BAR: {
        name: 'Полоса прогресса',
        backgroundColor: 0x333333,
        fillColor: 0x00ff00,
        borderColor: 0x666666
    }
};

// Экспортируем все константы
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        EnemyTypes,
        WeaponTypes,
        PowerUpTypes,
        EffectTypes,
        ParticleTypes,
        AnimationTypes,
        LevelTypes,
        AchievementTypes,
        UITypes
    };
}
