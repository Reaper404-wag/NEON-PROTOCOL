// Audio Management System for Future Survivors
class AudioManager {
    constructor(scene) {
        this.scene = scene;
        this.sounds = {};
        this.videos = {};
        this.currentTrack = null;
        this.currentTrackIndex = 0;
        this.gameTrackNames = ['track1', 'track2', 'track3'];
        
        // Настройки звука (сохраняются в localStorage)
        this.settings = {
            masterVolume: this.loadVolumeFromStorage() || 0.5, // 50% по умолчанию
            musicVolume: 1.0,
            effectsVolume: 1.0
        };
        
        console.log('AudioManager initialized with volume:', this.settings.masterVolume);
    }
    
    /**
     * Загрузка аудио файлов
     */
    preloadAudio() {
        console.log('Preloading audio files...');
        
        // Интро
        this.scene.load.audio('first_audio', 'image/first.mp3');
        this.scene.load.video('first_video', 'image/first.mp4');
        
        // Игровые треки
        this.scene.load.audio('track1', 'image/track1.mp3');
        this.scene.load.audio('track2', 'image/track2.mp3');
        this.scene.load.audio('track3', 'image/track3.mp3');
        
        // Финал
        this.scene.load.audio('the_end', 'image/the_end.mp3');
        this.scene.load.video('final_video', 'image/final.mp4');
        
        console.log('Audio preload initiated');
    }
    
    /**
     * Создание аудио объектов после загрузки
     */
    createAudioObjects() {
        console.log('Creating audio objects...');
        
        try {
            // Создаем аудио объекты только если они загружены
            if (this.scene.cache.audio.has('first_audio')) {
                this.sounds.first_audio = this.scene.sound.add('first_audio', { volume: this.getEffectiveVolume() });
            }
            
            if (this.scene.cache.audio.has('track1')) {
                this.sounds.track1 = this.scene.sound.add('track1', { 
                    volume: this.getEffectiveVolume('music') * 0.3,
                    loop: false 
                });
            }
            
            if (this.scene.cache.audio.has('track2')) {
                this.sounds.track2 = this.scene.sound.add('track2', { 
                    volume: this.getEffectiveVolume('music') * 0.3,
                    loop: false 
                });
            }
            
            if (this.scene.cache.audio.has('track3')) {
                this.sounds.track3 = this.scene.sound.add('track3', { 
                    volume: this.getEffectiveVolume('music') * 0.3,
                    loop: false 
                });
            }
            
            if (this.scene.cache.audio.has('the_end')) {
                this.sounds.the_end = this.scene.sound.add('the_end', { volume: this.getEffectiveVolume() });
            }
            
            // Звуки стрельбы (30% громкость)
            if (this.scene.cache.audio.has('shoot_player')) {
                this.sounds.shoot_player = this.scene.sound.add('shoot_player', { 
                    volume: this.getEffectiveVolume('effects') * 0.5 
                });
            }
            
            if (this.scene.cache.audio.has('shoot_assault')) {
                this.sounds.shoot_assault = this.scene.sound.add('shoot_assault', { 
                    volume: this.getEffectiveVolume('effects') * 0.5 
                });
            }
            
            if (this.scene.cache.audio.has('shoot_tank')) {
                this.sounds.shoot_tank = this.scene.sound.add('shoot_tank', { 
                    volume: this.getEffectiveVolume('effects') * 0.5 
                });
            }
            
            if (this.scene.cache.audio.has('shoot_mage')) {
                this.sounds.shoot_mage = this.scene.sound.add('shoot_mage', { 
                    volume: this.getEffectiveVolume('effects') * 0.5 
                });
            }
            
            // Звук получения урона (60% громкость)
            if (this.scene.cache.audio.has('damage_sound')) {
                this.sounds.damage_sound = this.scene.sound.add('damage_sound', { 
                    volume: this.getEffectiveVolume('effects') * 0.6 
                });
            }
            
            // Тревожная музыка при низком HP (80% громкость, цикл)
            if (this.scene.cache.audio.has('low_hp')) {
                this.sounds.low_hp = this.scene.sound.add('low_hp', { 
                    volume: this.getEffectiveVolume('music') * 0.8,
                    loop: true
                });
            }
            
            console.log('Audio objects created:', Object.keys(this.sounds));
            
        } catch (error) {
            console.error('Error creating audio objects:', error);
        }
    }
    
    /**
     * Воспроизведение интро видео с аудио
     */
    playIntro(onComplete) {
        console.log('Playing intro...');
        
        // Проверяем доступность видео и аудио
        const hasVideo = this.scene.cache.video.has('first_video');
        const hasAudio = this.scene.cache.audio.has('first_audio');
        
        console.log('Intro assets available - Video:', hasVideo, 'Audio:', hasAudio);
        
        if (hasVideo && this.scene.cameras && this.scene.cameras.main) {
            // Создаем видео в центре экрана
            const camera = this.scene.cameras.main;
            const video = this.scene.add.video(
                camera.centerX,
                camera.centerY,
                'first_video'
            );
            
            video.setOrigin(0.5);
            video.setDepth(5000);
            
            // Масштабируем видео под экран, сохраняя пропорции
            const scaleX = camera.width / video.width;
            const scaleY = camera.height / video.height;
            const scale = Math.min(scaleX, scaleY) * 0.4; // Уменьшаем еще больше
            video.setScale(scale);
            
            console.log(`Intro video scaled: ${scale.toFixed(2)}x (original: ${video.width}x${video.height}, screen: ${camera.width}x${camera.height})`);
            
            // Отключаем зацикливание - видео должно проиграть только один раз
            video.setLoop(false);
            
            // Запускаем видео с детальным логированием
            console.log('🎬 Starting video playback...');
            try {
                const playPromise = video.play();
                if (playPromise && typeof playPromise.then === 'function') {
                    playPromise.then(() => {
                        console.log('✅ Video play() promise resolved successfully');
                    }).catch((error) => {
                        console.error('❌ Video play() promise rejected:', error);
                    });
                } else {
                    console.log('✅ Video play() called (no promise returned)');
                }
            } catch (error) {
                console.error('❌ Video play() threw error:', error);
            }
            
            console.log('✅ INTRO VIDEO STARTED - Will play for EXACTLY 10 seconds (ignoring natural end)');
            
            // Дополнительная информация о видео
            console.log('📊 Video info:', {
                duration: video.video ? video.video.duration : 'unknown',
                readyState: video.video ? video.video.readyState : 'unknown',
                paused: video.video ? video.video.paused : 'unknown',
                ended: video.video ? video.video.ended : 'unknown'
            });
            
            // Обрабатываем завершение видео БЕЗ закрытия сцены
            video.on('complete', () => {
                console.log('📺 Video playback completed naturally - but staying on screen until 10s timer');
                // НЕ уничтожаем видео и НЕ вызываем onComplete
                // Видео останется на последнем кадре до срабатывания таймера
            });
            
            // Защита от зацикливания (не должно срабатывать при setLoop(false))
            video.on('loop', () => {
                console.log('⚠️ Unexpected video loop detected');
            });
            
            console.log('🎬 Video will play once, then wait until 10 seconds total');
            
            // ПРИНУДИТЕЛЬНОЕ завершение ТОЛЬКО через 10 секунд
            let timeoutTriggered = false;
            this.scene.time.delayedCall(10000, () => {
                timeoutTriggered = true;
                if (video && video.active) {
                    console.log('🎬 INTRO VIDEO - 10 SECONDS COMPLETED! Finishing now...');
                    video.stop();
                    video.destroy();
                    if (onComplete) onComplete();
                } else {
                    console.log('Video already destroyed before timeout');
                    if (onComplete) onComplete();
                }
            });
            
            // Счетчик секунд для отладки И принудительная проверка
            let secondsPlayed = 0;
            const progressTimer = this.scene.time.addEvent({
                delay: 1000,
                callback: () => {
                    secondsPlayed++;
                    
                    // ВАЖНО: проверяем состояние видео каждую секунду
                    if (video && video.active) {
                        const isPlaying = video.isPlaying && video.isPlaying();
                        console.log(`🎬 Intro video: ${secondsPlayed}/10 seconds - Playing: ${isPlaying}`);
                        
                        // Если видео НЕ играет, но должно - принудительно запускаем
                        if (!isPlaying && secondsPlayed < 10) {
                            console.log('⚠️ Video stopped unexpectedly - restarting!');
                            try {
                                video.play();
                            } catch (e) {
                                console.warn('Failed to restart video:', e);
                            }
                        }
                    } else {
                        console.log(`🎬 Intro video: ${secondsPlayed}/10 seconds - Video inactive`);
                    }
                    
                    if (secondsPlayed >= 10 || timeoutTriggered) {
                        progressTimer.destroy();
                    }
                },
                repeat: 9 // Повторить 10 раз (0-9)
            });
            
            this.videos.intro = video;
        }
        
        if (hasAudio && this.sounds.first_audio) {
            // Воспроизводим аудио синхронно с видео
            this.sounds.first_audio.play();
        }
        
        // Если ни видео, ни аудио не доступны - сразу завершаем
        if (!hasVideo && !hasAudio) {
            console.log('No intro assets available, skipping...');
            if (onComplete) onComplete();
            return;
        }
        
        // Если видео не может быть создано, но есть аудио
        if (!hasVideo && hasAudio && this.sounds.first_audio) {
            console.log('Playing intro audio only...');
            this.sounds.first_audio.play();
            this.sounds.first_audio.once('complete', () => {
                if (onComplete) onComplete();
            });
        }
    }
    
    /**
     * Запуск фоновой музыки игры
     */
    startGameMusic() {
        console.log('Starting game music...');
        this.currentTrackIndex = 0;
        this.playNextTrack();
    }
    
    /**
     * Воспроизведение следующего трека
     */
    playNextTrack() {
        if (this.currentTrack && this.currentTrack.isPlaying) {
            this.currentTrack.stop();
        }
        
        const trackName = this.gameTrackNames[this.currentTrackIndex];
        console.log(`Playing track: ${trackName} (${this.currentTrackIndex + 1}/${this.gameTrackNames.length})`);
        
        if (this.sounds[trackName]) {
            this.currentTrack = this.sounds[trackName];
            
            // Обработчик завершения трека
            this.currentTrack.once('complete', () => {
                console.log(`Track ${trackName} completed`);
                this.currentTrackIndex = (this.currentTrackIndex + 1) % this.gameTrackNames.length;
                
                // Небольшая задержка перед следующим треком
                this.scene.time.delayedCall(500, () => {
                    this.playNextTrack();
                });
            });
            
            this.currentTrack.play();
        } else {
            console.warn(`Track ${trackName} not available`);
        }
    }
    
    /**
     * Остановка игровой музыки
     */
    stopGameMusic() {
        console.log('Stopping game music...');
        if (this.currentTrack && this.currentTrack.isPlaying) {
            this.currentTrack.stop();
        }
        this.currentTrack = null;
    }
    
    /**
     * Воспроизведение финального экрана
     */
    playOutro(onComplete) {
        console.log('Playing outro...');
        
        // Останавливаем игровую музыку
        this.stopGameMusic();
        
        const hasVideo = this.scene.cache.video.has('final_video');
        const hasAudio = this.scene.cache.audio.has('the_end');
        
        console.log('=== OUTRO VIDEO DEBUG ===');
        console.log('Outro assets available - Video:', hasVideo, 'Audio:', hasAudio);
        console.log('Scene cameras:', !!this.scene.cameras);
        console.log('Scene cameras main:', !!this.scene.cameras?.main);
        console.log('All cached videos:', this.scene.cache.video.getKeys());
        
        // Принудительное создание видео - всегда создаем
        const forceCreate = true;
        console.log('Will FORCE create video:', forceCreate);
        console.log('Scene exists:', !!this.scene);
        console.log('Scene add exists:', !!this.scene.add);
        
        if (forceCreate && this.scene && this.scene.add) {
            // Создаем финальное видео с безопасным получением размеров
            const camera = this.scene.cameras && this.scene.cameras.main ? this.scene.cameras.main : null;
            const centerX = camera ? camera.width / 2 : window.innerWidth / 2;
            const centerY = camera ? camera.height / 2 : window.innerHeight / 2;
            
            console.log('Creating outro video at:', centerX, centerY);
            let video;
            
            try {
                console.log('=== TRYING MULTIPLE FINAL VIDEO METHODS ===');
                
                // Способ 1: Кэш ключ (приоритетный)
                try {
                    console.log('Final Method 1: Cache key...');
                    video = this.scene.add.video(centerX, centerY, 'final_video');
                    console.log('Final Method 1: SUCCESS with cache key');
                } catch (e1) {
                    console.log('Final Method 1 failed:', e1.message);
                    
                    // Способ 2: Прямой путь
                    try {
                        console.log('Final Method 2: Direct path...');
                        video = this.scene.add.video(centerX, centerY, 'image/final.mp4');
                        console.log('Final Method 2: SUCCESS with direct path');
                    } catch (e2) {
                        console.log('Final Method 2 failed:', e2.message);
                        
                        // Способ 3: Динамическая загрузка
                        try {
                            console.log('Final Method 3: Dynamic load...');
                            video = this.scene.add.video(centerX, centerY);
                            video.loadURL('image/final.mp4');
                            console.log('Final Method 3: SUCCESS with dynamic load');
                        } catch (e3) {
                            console.log('Final Method 3 failed:', e3.message);
                            console.error('ALL FINAL VIDEO METHODS FAILED');
                            return; // Выходим если видео не создалось
                        }
                    }
                }
            } catch (error) {
                console.error('Fatal error creating final video:', error);
                return;
            }
            
            video.setOrigin(0.5);
            video.setDepth(15000); // Увеличиваем depth чтобы видео было поверх Game Over экрана
            
            // Масштабируем видео под экран (безопасно)
            try {
                const screenWidth = camera ? camera.width : window.innerWidth;
                const screenHeight = camera ? camera.height : window.innerHeight;
                const videoWidth = video.width || 640;
                const videoHeight = video.height || 480;
                
                const scaleX = screenWidth / videoWidth;
                const scaleY = screenHeight / videoHeight;
                const scale = Math.min(scaleX, scaleY) * 0.8; // Увеличиваем видео чтобы его было видно
                video.setScale(scale);
                
                console.log(`Final video scaled: ${scale.toFixed(2)}x`);
            } catch (scaleError) {
                console.warn('Scale error, using default:', scaleError);
                video.setScale(0.8); // Увеличенный масштаб по умолчанию для видимости
            }
            
            // Отключаем зацикливание
            video.setLoop(false);
            
            // НЕМЕДЛЕННЫЙ запуск финального видео
            console.log('Attempting immediate final video start...');
            try {
                const playResult = video.play();
                if (playResult && typeof playResult.then === 'function') {
                    // Если play() возвращает Promise
                    playResult.then(() => {
                        console.log('Final video started immediately!');
                    }).catch(e => {
                        console.warn('Immediate final play failed:', e);
                    });
                } else {
                    // Если play() не возвращает Promise
                    console.log('Final video started immediately (no promise)!');
                }
            } catch (e) {
                console.warn('Immediate final play error:', e);
            }
            
            console.log(`Outro video scaled successfully`);
            
            // Устанавливаем максимальную видимость и активность
            video.setVisible(true);
            video.setActive(true);
            video.setAlpha(1);
            
            // Принудительное воспроизведение с несколькими попытками
            console.log('Starting final video playback...');
            
            const tryPlay = () => {
                try {
                    const playResult = video.play();
                    if (playResult && typeof playResult.then === 'function') {
                        // Если play() возвращает Promise
                        playResult.then(() => {
                            console.log('Final video started successfully');
                        }).catch((error) => {
                            console.warn('Final video play failed:', error);
                        });
                    } else {
                        // Если play() не возвращает Promise
                        console.log('Final video started successfully (no promise)');
                    }
                } catch (error) {
                    console.warn('Final video play error:', error);
                }
            };
            
            tryPlay();
            
            video.on('complete', () => {
                console.log('Outro video completed');
                video.destroy();
                if (onComplete) onComplete();
            });
            
            // Дополнительная защита от зацикливания
            video.on('loop', () => {
                console.log('Preventing outro video loop');
                video.stop();
                video.destroy();
                if (onComplete) onComplete();
            });
            
            this.videos.outro = video;
        }
        
        if (hasAudio && this.sounds.the_end) {
            this.sounds.the_end.play();
        }
        
        // Если ни видео, ни аудио не доступны - сразу завершаем
        if (!hasVideo && !hasAudio) {
            console.log('No outro assets available, skipping...');
            if (onComplete) onComplete();
            return;
        }
        
        // Если видео не может быть создано, но есть аудио
        if (!hasVideo && hasAudio && this.sounds.the_end) {
            console.log('Playing outro audio only...');
            this.sounds.the_end.play();
            this.sounds.the_end.once('complete', () => {
                if (onComplete) onComplete();
            });
        }
    }
    
    /**
     * Установка общей громкости
     */
    setMasterVolume(volume) {
        this.settings.masterVolume = Math.max(0, Math.min(1, volume));
        this.saveVolumeToStorage();
        this.updateAllVolumes();
        console.log('Master volume set to:', this.settings.masterVolume);
    }
    
    /**
     * Получение эффективной громкости
     */
    getEffectiveVolume(type = 'effects') {
        const typeVolume = type === 'music' ? this.settings.musicVolume : this.settings.effectsVolume;
        return this.settings.masterVolume * typeVolume;
    }
    
    /**
     * Обновление громкости всех звуков
     */
    updateAllVolumes() {
        Object.values(this.sounds).forEach(sound => {
            if (sound && sound.setVolume) {
                const isMusicTrack = this.gameTrackNames.includes(sound.key);
                const volume = isMusicTrack ? this.getEffectiveVolume('music') : this.getEffectiveVolume();
                sound.setVolume(volume);
            }
        });
    }
    
    /**
     * Сохранение настроек громкости
     */
    saveVolumeToStorage() {
        try {
            localStorage.setItem('futuresurvivors_volume', this.settings.masterVolume.toString());
        } catch (error) {
            console.warn('Could not save volume to localStorage:', error);
        }
    }
    
    /**
     * Загрузка настроек громкости
     */
    loadVolumeFromStorage() {
        try {
            const saved = localStorage.getItem('futuresurvivors_volume');
            return saved ? parseFloat(saved) : null;
        } catch (error) {
            console.warn('Could not load volume from localStorage:', error);
            return null;
        }
    }
    
    /**
     * Получение текущей громкости
     */
    getMasterVolume() {
        return this.settings.masterVolume;
    }
    
    /**
     * Остановка всех звуков
     */
    stopAll() {
        console.log('Stopping all audio...');
        
        Object.values(this.sounds).forEach(sound => {
            if (sound && sound.isPlaying) {
                sound.stop();
            }
        });
        
        Object.values(this.videos).forEach(video => {
            if (video && video.isPlaying) {
                video.stop();
                video.destroy();
            }
        });
        
        this.currentTrack = null;
    }
    
    /**
     * Очистка ресурсов
     */
    destroy() {
        this.stopAll();
        this.sounds = {};
        this.videos = {};
    }
    
    // Методы для воспроизведения звуков стрельбы
    playPlayerShoot() {
        if (this.sounds.shoot_player && !this.sounds.shoot_player.isPlaying) {
            this.sounds.shoot_player.play();
        }
    }
    
    playAssaultShoot() {
        if (this.sounds.shoot_assault && !this.sounds.shoot_assault.isPlaying) {
            this.sounds.shoot_assault.play();
        }
    }
    
    playTankShoot() {
        if (this.sounds.shoot_tank && !this.sounds.shoot_tank.isPlaying) {
            this.sounds.shoot_tank.play();
        }
    }
    
    playMageShoot() {
        if (this.sounds.shoot_mage && !this.sounds.shoot_mage.isPlaying) {
            this.sounds.shoot_mage.play();
        }
    }
    
    playDamageSound() {
        if (this.sounds.damage_sound && !this.sounds.damage_sound.isPlaying) {
            this.sounds.damage_sound.play();
        }
    }
    
    playLowHpMusic() {
        if (this.sounds.low_hp && !this.sounds.low_hp.isPlaying) {
            console.log('Starting low HP music');
            this.sounds.low_hp.play();
        }
    }
    
    stopLowHpMusic() {
        if (this.sounds.low_hp && this.sounds.low_hp.isPlaying) {
            console.log('Stopping low HP music');
            this.sounds.low_hp.stop();
        }
    }
}

// Export для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioManager;
}