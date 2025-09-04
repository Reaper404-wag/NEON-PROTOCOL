// Основные игровые константы
const GameConstants = {
    // Игрок
    PLAYER_SPEED: 200,
    PLAYER_HEALTH: 100,
    PLAYER_SIZE: 32,
    PLAYER_INVULNERABILITY_TIME: 1000,
    
    // Оружие
    BASIC_WEAPON_DAMAGE: 25,
    BASIC_WEAPON_FIRE_RATE: 300,
    BASIC_WEAPON_SPEED: 400,
    BASIC_WEAPON_SIZE: 8,
    
    // Враги
    ENEMY_SPAWN_RATE: 2000,
    ENEMY_MAX_COUNT: 50,
    ENEMY_BASIC_HEALTH: 50,
    ENEMY_BASIC_SPEED: 80,
    ENEMY_BASIC_DAMAGE: 20,
    ENEMY_BASIC_SCORE: 100,
    
    // Снаряды
    PROJECTILE_LIFESPAN: 5000,
    PROJECTILE_BOUNCE: 0.1,
    PROJECTILE_FRICTION: 0.98,
    
    // Усиления
    POWERUP_SPAWN_RATE: 10000,
    POWERUP_MAX_COUNT: 5,
    POWERUP_LIFESPAN: 15000,
    
    // Физика
    GRAVITY: 0,
    WORLD_BOUNCE: 0.1,
    COLLISION_OFFSET: 0.8,
    
    // UI
    UI_MARGIN: 20,
    UI_PANEL_ALPHA: 0.8,
    UI_TEXT_SIZE: 16,
    UI_BUTTON_HEIGHT: 40,
    
    // Эффекты
    PARTICLE_LIFESPAN: 1000,
    PARTICLE_FREQUENCY: 50,
    SHAKE_INTENSITY: 0.01,
    SHAKE_DURATION: 200,
    
    // Игровые настройки
    GAME_TICK_RATE: 60,
    DIFFICULTY_INCREASE_RATE: 0.1,
    SCORE_MULTIPLIER: 1.0,
    COMBO_DURATION: 3000,
    
    // Размеры экрана
    SCREEN_WIDTH: 1280,
    SCREEN_HEIGHT: 720,
    
    // Размеры мира
    WORLD_WIDTH: 2000,
    WORLD_HEIGHT: 2000,
    
    // Настройки камеры
    CAMERA_ZOOM: 1.0,
    CAMERA_LERP: 0.1,
    CAMERA_DEADZONE: 50,
    
    // Настройки частиц
    MAX_PARTICLES: 1000,
    PARTICLE_POOL_SIZE: 100,
    
    // Настройки звука
    SOUND_VOLUME: 0.7,
    MUSIC_VOLUME: 0.5,
    MASTER_VOLUME: 1.0,
    
    // Настройки сохранения
    SAVE_INTERVAL: 30000,
    AUTO_SAVE: true,
    
    // Настройки отладки
    DEBUG_MODE: false,
    SHOW_FPS: false,
    SHOW_COLLIDERS: false,
    SHOW_PARTICLES: true
};

// Константы для очков
const ScoreConstants = {
    SCORE_PER_ENEMY: 100,
    SCORE_PER_POWERUP: 50,
    SCORE_PER_MINUTE: 10,
    SCORE_MULTIPLIER_BASE: 1.0,
    SCORE_MULTIPLIER_INCREMENT: 0.1,
    MAX_SCORE_MULTIPLIER: 5.0,
    
    // Бонусы за достижения
    ACHIEVEMENT_BONUS: {
        FIRST_KILL: 100,
        KILLER: 500,
        EXTERMINATOR: 1000,
        SURVIVOR: 300,
        VETERAN: 800,
        MARKSMAN: 400,
        COMBO_MASTER: 600,
        POWER_COLLECTOR: 400,
        SPEED_DEMON: 500,
        TANK: 700
    }
};

// Константы для уровней
const LevelConstants = {
    LEVEL_DURATION: 300000, // 5 минут
    DIFFICULTY_SCALING: 0.2,
    ENEMY_SPAWN_INCREASE: 0.1,
    ENEMY_HEALTH_INCREASE: 0.15,
    ENEMY_SPEED_INCREASE: 0.05,
    ENEMY_DAMAGE_INCREASE: 0.1,
    
    // Пороги сложности
    DIFFICULTY_THRESHOLDS: {
        EASY: 1.0,
        NORMAL: 1.5,
        HARD: 2.0,
        EXTREME: 3.0,
        IMPOSSIBLE: 5.0
    }
};

// Константы для оружия
const WeaponConstants = {
    UPGRADE_COST_MULTIPLIER: 1.5,
    MAX_WEAPON_LEVEL: 10,
    WEAPON_UPGRADE_BONUS: 0.2,
    
    // Модификаторы
    DAMAGE_MODIFIERS: {
        BASIC: 1.0,
        ENHANCED: 1.5,
        ADVANCED: 2.0,
        ULTIMATE: 3.0
    },
    
    FIRE_RATE_MODIFIERS: {
        BASIC: 1.0,
        ENHANCED: 0.8,
        ADVANCED: 0.6,
        ULTIMATE: 0.4
    }
};

// Константы для усилений
const PowerUpConstants = {
    EFFECT_DURATION: {
        SPEED: 10000,
        DAMAGE: 15000,
        FIRE_RATE: 12000,
        SHIELD: 8000,
        MULTI_SHOT: 20000
    },
    
    EFFECT_VALUES: {
        SPEED: 1.5,
        DAMAGE: 2.0,
        FIRE_RATE: 2.0,
        SHIELD: 50,
        MULTI_SHOT: 3
    },
    
    RARITY_WEIGHTS: {
        COMMON: 0.5,
        UNCOMMON: 0.3,
        RARE: 0.15,
        EPIC: 0.04,
        LEGENDARY: 0.01
    }
};

// Константы для врагов
const EnemyConstants = {
    AI_UPDATE_RATE: 100,
    PATHFINDING_UPDATE_RATE: 500,
    VISION_RANGE: 300,
    ATTACK_RANGE: 50,
    RETREAT_HEALTH_THRESHOLD: 0.3,
    
    // Поведение
    BEHAVIOR_TYPES: {
        AGGRESSIVE: 'aggressive',
        DEFENSIVE: 'defensive',
        CAUTIOUS: 'cautious',
        BERSERK: 'berserk',
        SUPPORT: 'support'
    },
    
    // Состояния
    STATES: {
        IDLE: 'idle',
        PATROL: 'patrol',
        CHASE: 'chase',
        ATTACK: 'attack',
        RETREAT: 'retreat',
        STUNNED: 'stunned'
    }
};

// Константы для физики
const PhysicsConstants = {
    VELOCITY_DAMPING: 0.98,
    ANGULAR_DAMPING: 0.95,
    MAX_VELOCITY: 500,
    MAX_ANGULAR_VELOCITY: 10,
    
    // Коллизии
    COLLISION_GROUPS: {
        PLAYER: 1,
        ENEMY: 2,
        PROJECTILE: 4,
        POWERUP: 8,
        WORLD: 16
    },
    
    // Материалы
    MATERIALS: {
        DEFAULT: { friction: 0.3, restitution: 0.1 },
        ICE: { friction: 0.1, restitution: 0.2 },
        RUBBER: { friction: 0.8, restitution: 0.8 },
        METAL: { friction: 0.2, restitution: 0.05 }
    }
};

// Константы для UI
const UIConstants = {
    COLORS: {
        PRIMARY: 0x00ff00,
        SECONDARY: 0x0088ff,
        ACCENT: 0xff8800,
        SUCCESS: 0x00ff00,
        WARNING: 0xffff00,
        ERROR: 0xff0000,
        INFO: 0x00ffff
    },
    
    FONTS: {
        SMALL: '12px Arial',
        MEDIUM: '16px Arial',
        LARGE: '24px Arial',
        TITLE: '32px Arial',
        HEADER: '48px Arial'
    },
    
    ANIMATIONS: {
        FADE_IN: 300,
        FADE_OUT: 300,
        SLIDE_IN: 500,
        SLIDE_OUT: 500,
        SCALE_IN: 400,
        SCALE_OUT: 400
    }
};

// Константы для эффектов
const EffectConstants = {
    PARTICLE_LIMITS: {
        EXPLOSION: 50,
        TRAIL: 100,
        IMPACT: 30,
        SPAWN: 20
    },
    
    VISUAL_EFFECTS: {
        SCREEN_SHAKE: true,
        PARTICLE_SYSTEMS: true,
        LIGHTING_EFFECTS: true,
        POST_PROCESSING: false
    },
    
    PERFORMANCE: {
        MAX_PARTICLES_PER_FRAME: 200,
        PARTICLE_CULLING_DISTANCE: 1000,
        EFFECT_QUALITY: 'medium' // low, medium, high
    }
};

// Константы для сохранения
const SaveConstants = {
    SAVE_SLOTS: 3,
    AUTO_SAVE_INTERVAL: 30000,
    SAVE_DATA_VERSION: '1.0.0',
    
    // Ключи для localStorage
    STORAGE_KEYS: {
        HIGH_SCORE: 'futureSurvivors_highScore',
        ACHIEVEMENTS: 'futureSurvivors_achievements',
        SETTINGS: 'futureSurvivors_settings',
        AUDIO_SETTINGS: 'futureSurvivors_audioSettings',
        GAME_STATE: 'futureSurvivors_gameState'
    }
};

// Константы для отладки
const DebugConstants = {
    LOG_LEVELS: {
        ERROR: 0,
        WARN: 1,
        INFO: 2,
        DEBUG: 3,
        VERBOSE: 4
    },
    
    CURRENT_LOG_LEVEL: 2,
    
    DEBUG_FEATURES: {
        SHOW_FPS: false,
        SHOW_COLLIDERS: false,
        SHOW_PARTICLES: true,
        SHOW_AI_PATH: false,
        SHOW_DEBUG_INFO: false
    }
};

// Экспортируем все константы
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        GameConstants,
        ScoreConstants,
        LevelConstants,
        WeaponConstants,
        PowerUpConstants,
        EnemyConstants,
        PhysicsConstants,
        UIConstants,
        EffectConstants,
        SaveConstants,
        DebugConstants
    };
}
