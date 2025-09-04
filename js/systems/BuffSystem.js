// Система баффов для Future Survivors
class BuffSystem {
    constructor(scene) {
        this.scene = scene;
        this.activeBuffs = {};
        this.buffDefinitions = this.createBuffDefinitions();
        
        console.log('BuffSystem initialized with', Object.keys(this.buffDefinitions).length, 'buff types');
    }
    
    createBuffDefinitions() {
        return {
            // Базовые баффы
            health_boost: {
                name: 'Дополнительное здоровье',
                description: '+20 к максимальному здоровью',
                icon: '❤️',
                effect: (player) => {
                    player.maxHealth = (player.maxHealth || 100) + 20;
                    player.health = Math.min(player.health + 20, player.maxHealth);
                    return `Максимальное здоровье: ${player.maxHealth}`;
                }
            },
            
            heal: {
                name: 'Исцеление',
                description: 'Восстанавливает 50 здоровья',
                icon: '🏥',
                effect: (player) => {
                    const oldHealth = player.health;
                    player.health = Math.min(player.health + 50, player.maxHealth || 100);
                    return `Восстановлено ${player.health - oldHealth} здоровья`;
                }
            },
            
            damage_boost: {
                name: 'Увеличение урона',
                description: '+25% к урону оружия',
                icon: '⚡',
                effect: (player) => {
                    player.damageMultiplier = (player.damageMultiplier || 1) * 1.25;
                    return `Урон: x${player.damageMultiplier.toFixed(2)}`;
                }
            },
            
            armor: {
                name: 'Бронежилет',
                description: 'Уменьшает входящий урон на 15%',
                icon: '🛡️',
                effect: (player) => {
                    player.armorReduction = (player.armorReduction || 0) + 0.15;
                    return `Защита: ${Math.round(player.armorReduction * 100)}%`;
                }
            },
            
            speed_boost: {
                name: 'Ускорение',
                description: '+30% к скорости движения',
                icon: '💨',
                effect: (player) => {
                    player.speedMultiplier = (player.speedMultiplier || 1) * 1.3;
                    return `Скорость: x${player.speedMultiplier.toFixed(2)}`;
                }
            },
            
            // Продвинутые баффы
            drone: {
                name: 'Боевой дрон',
                description: 'Дрон атакует ближайших врагов',
                icon: '🤖',
                effect: (player) => {
                    player.hasDrone = true;
                    player.droneLevel = (player.droneLevel || 0) + 1;
                    return `Дрон уровень ${player.droneLevel}`;
                }
            },
            
            fire_rate: {
                name: 'Скорострельность',
                description: '+40% к скорости стрельбы',
                icon: '🔥',
                effect: (player) => {
                    player.fireRateMultiplier = (player.fireRateMultiplier || 1) * 1.4;
                    return `Скорость стрельбы: x${player.fireRateMultiplier.toFixed(2)}`;
                }
            },
            
            penetration: {
                name: 'Пробивание',
                description: 'Пули проходят через врагов',
                icon: '🎯',
                effect: (player) => {
                    player.bulletPenetration = (player.bulletPenetration || 0) + 1;
                    return `Пробивание: ${player.bulletPenetration} врага(ов)`;
                }
            },
            
            explosion: {
                name: 'Взрывные пули',
                description: 'Пули взрываются при попадании',
                icon: '💥',
                effect: (player) => {
                    player.explosiveBullets = true;
                    player.explosionRadius = (player.explosionRadius || 50) + 25;
                    return `Радиус взрыва: ${player.explosionRadius}px`;
                }
            },
            
            magnetic: {
                name: 'Магнетизм',
                description: 'Притягивает предметы и опыт',
                icon: '🧲',
                effect: (player) => {
                    player.magneticRange = (player.magneticRange || 0) + 100;
                    return `Радиус притяжения: ${player.magneticRange}px`;
                }
            },
            
            // Уникальные баффы
            regeneration: {
                name: 'Регенерация',
                description: '+1 здоровье каждые 5 секунд',
                icon: '🌿',
                effect: (player) => {
                    player.regenerationRate = (player.regenerationRate || 0) + 1;
                    return `Регенерация: ${player.regenerationRate} хп/5сек`;
                }
            },
            
            time_slow: {
                name: 'Замедление времени',
                description: 'Враги двигаются на 20% медленнее',
                icon: '⏰',
                effect: (player) => {
                    player.timeSlowEffect = (player.timeSlowEffect || 0) + 0.2;
                    return `Замедление врагов: ${Math.round(player.timeSlowEffect * 100)}%`;
                }
            },
            
            luck: {
                name: 'Удача',
                description: '+15% шанс критического урона (x2)',
                icon: '🍀',
                effect: (player) => {
                    player.criticalChance = (player.criticalChance || 0) + 0.15;
                    return `Шанс крита: ${Math.round(player.criticalChance * 100)}%`;
                }
            },
            
            // Новые боевые баффы
            drone: {
                name: 'Боевой дрон',
                description: 'Дрон кружит вокруг и стреляет по врагам',
                icon: '🚁',
                effect: (player) => {
                    player.hasDrone = true;
                    player.droneCount = (player.droneCount || 0) + 1;
                    return `Дронов: ${player.droneCount}`;
                }
            },
            
            auto_targeting: {
                name: 'Автонаведение',
                description: 'Ваши снаряды автоматически ищут врагов',
                icon: '🎯',
                effect: (player) => {
                    player.autoTargeting = true;
                    return 'Автонаведение активировано';
                }
            },
            
            rapid_fire: {
                name: 'Скорострельность',
                description: 'Можете стрелять в 2 раза чаще',
                icon: '⚡',
                effect: (player) => {
                    player.fireRateMultiplier = (player.fireRateMultiplier || 1) * 0.5; // Меньше = быстрее
                    return `Скорострельность: x${(2 / player.fireRateMultiplier).toFixed(1)}`;
                }
            },
            
            piercing_shots: {
                name: 'Пробивные снаряды',
                description: 'Снаряды проходят сквозь врагов',
                icon: '🏹',
                effect: (player) => {
                    player.piercing = (player.piercing || 0) + 2;
                    return `Пробивание: ${player.piercing} врагов`;
                }
            },
            
            multi_shot: {
                name: 'Тройной выстрел',
                description: 'Стреляете тремя снарядами одновременно',
                icon: '🔱',
                effect: (player) => {
                    player.multiShot = (player.multiShot || 1) + 2;
                    return `Снарядов за выстрел: ${player.multiShot}`;
                }
            },
            
            explosive_rounds: {
                name: 'Разрывные снаряды',
                description: 'Снаряды взрываются при попадании',
                icon: '💥',
                effect: (player) => {
                    player.explosiveShots = true;
                    player.explosionRadius = (player.explosionRadius || 0) + 50;
                    return `Радиус взрыва: ${player.explosionRadius}px`;
                }
            },
            
            energy_shield: {
                name: 'Энергощит',
                description: 'Блокирует следующие 3 атаки',
                icon: '🛡️',
                effect: (player) => {
                    player.shieldCharges = (player.shieldCharges || 0) + 3;
                    return `Зарядов щита: ${player.shieldCharges}`;
                }
            },
            
            vampire: {
                name: 'Вампиризм',
                description: 'Восстанавливает 2 HP за убийство',
                icon: '🧛',
                effect: (player) => {
                    player.vampirism = (player.vampirism || 0) + 2;
                    return `Вампиризм: +${player.vampirism} HP за убийство`;
                }
            },
            
            berserker: {
                name: 'Берсерк',
                description: 'Чем меньше HP, тем больше урон',
                icon: '😡',
                effect: (player) => {
                    player.berserkerMode = true;
                    return 'Режим берсерка активирован';
                }
            }
        };
    }
    
    getRandomBuffs(count = 3) {
        const allBuffs = Object.keys(this.buffDefinitions);
        const selectedBuffs = [];
        
        // Выбираем случайные баффы без повторений
        while (selectedBuffs.length < count && selectedBuffs.length < allBuffs.length) {
            const randomBuff = allBuffs[Math.floor(Math.random() * allBuffs.length)];
            if (!selectedBuffs.includes(randomBuff)) {
                selectedBuffs.push(randomBuff);
            }
        }
        
        return selectedBuffs.map(buffId => ({
            id: buffId,
            ...this.buffDefinitions[buffId]
        }));
    }
    
    applyBuff(buffId, target) {
        const buff = this.buffDefinitions[buffId];
        if (!buff) {
            console.error('Unknown buff:', buffId);
            return;
        }
        
        // Применяем эффект баффа
        const result = buff.effect(target);
        
        // Запоминаем примененный бафф
        if (!this.activeBuffs[buffId]) {
            this.activeBuffs[buffId] = 0;
        }
        this.activeBuffs[buffId]++;
        
        console.log(`Applied buff: ${buff.name} - ${result}`);
        
        return {
            name: buff.name,
            description: result
        };
    }
    
    getActiveBuffs() {
        return this.activeBuffs;
    }
    
    getBuffInfo(buffId) {
        return this.buffDefinitions[buffId];
    }
}

// Export для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BuffSystem;
}
