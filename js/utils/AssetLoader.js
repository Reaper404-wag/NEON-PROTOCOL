/**
 * AssetLoader.js - Загрузчик игровых ресурсов
 */

class AssetLoader {
    constructor(scene) {
        this.scene = scene;
        this.loadedAssets = new Map();
        this.loadingPromises = new Map();
        this.assetTypes = {
            IMAGE: 'image',
            AUDIO: 'audio',
            SPRITESHEET: 'spritesheet',
            ATLAS: 'atlas',
            TILEMAP: 'tilemap',
            FONT: 'font'
        };
    }

    /**
     * Загружает изображение
     */
    loadImage(key, url, options = {}) {
        if (this.loadedAssets.has(key)) {
            return Promise.resolve(this.loadedAssets.get(key));
        }

        if (this.loadingPromises.has(key)) {
            return this.loadingPromises.get(key);
        }

        const promise = new Promise((resolve, reject) => {
            try {
                this.scene.load.image(key, url);
                this.scene.load.once('complete', () => {
                    const texture = this.scene.textures.get(key);
                    this.loadedAssets.set(key, texture);
                    this.loadingPromises.delete(key);
                    resolve(texture);
                });
                this.scene.load.once('loaderror', (file) => {
                    this.loadingPromises.delete(key);
                    reject(new Error(`Failed to load image: ${key} from ${url}`));
                });
                this.scene.load.start();
            } catch (error) {
                reject(error);
            }
        });

        this.loadingPromises.set(key, promise);
        return promise;
    }

    /**
     * Загружает спрайтшит
     */
    loadSpritesheet(key, url, frameConfig, options = {}) {
        if (this.loadedAssets.has(key)) {
            return Promise.resolve(this.loadedAssets.get(key));
        }

        if (this.loadingPromises.has(key)) {
            return this.loadingPromises.get(key);
        }

        const promise = new Promise((resolve, reject) => {
            try {
                this.scene.load.spritesheet(key, url, frameConfig);
                this.scene.load.once('complete', () => {
                    const texture = this.scene.textures.get(key);
                    this.loadedAssets.set(key, texture);
                    this.loadingPromises.delete(key);
                    resolve(texture);
                });
                this.scene.load.once('loaderror', (file) => {
                    this.loadingPromises.delete(key);
                    reject(new Error(`Failed to load spritesheet: ${key} from ${url}`));
                });
                this.scene.load.start();
            } catch (error) {
                reject(error);
            }
        });

        this.loadingPromises.set(key, promise);
        return promise;
    }

    /**
     * Загружает аудио
     */
    loadAudio(key, url, options = {}) {
        if (this.loadedAssets.has(key)) {
            return Promise.resolve(this.loadedAssets.get(key));
        }

        if (this.loadingPromises.has(key)) {
            return this.loadingPromises.get(key);
        }

        const promise = new Promise((resolve, reject) => {
            try {
                this.scene.load.audio(key, url);
                this.scene.load.once('complete', () => {
                    const sound = this.scene.sound.get(key);
                    this.loadedAssets.set(key, sound);
                    this.loadingPromises.delete(key);
                    resolve(sound);
                });
                this.scene.load.once('loaderror', (file) => {
                    this.loadingPromises.delete(key);
                    reject(new Error(`Failed to load audio: ${key} from ${url}`));
                });
                this.scene.load.start();
            } catch (error) {
                reject(error);
            }
        });

        this.loadingPromises.set(key, promise);
        return promise;
    }

    /**
     * Загружает атлас (JSON + изображение)
     */
    loadAtlas(key, textureURL, atlasURL, options = {}) {
        if (this.loadedAssets.has(key)) {
            return Promise.resolve(this.loadedAssets.get(key));
        }

        if (this.loadingPromises.has(key)) {
            return this.loadingPromises.get(key);
        }

        const promise = new Promise((resolve, reject) => {
            try {
                this.scene.load.atlas(key, textureURL, atlasURL);
                this.scene.load.once('complete', () => {
                    const texture = this.scene.textures.get(key);
                    this.loadedAssets.set(key, texture);
                    this.loadingPromises.delete(key);
                    resolve(texture);
                });
                this.scene.load.once('loaderror', (file) => {
                    this.loadingPromises.delete(key);
                    reject(new Error(`Failed to load atlas: ${key}`));
                });
                this.scene.load.start();
            } catch (error) {
                reject(error);
            }
        });

        this.loadingPromises.set(key, promise);
        return promise;
    }

    /**
     * Загружает тайлмап
     */
    loadTilemap(key, url, options = {}) {
        if (this.loadedAssets.has(key)) {
            return Promise.resolve(this.loadedAssets.get(key));
        }

        if (this.loadingPromises.has(key)) {
            return this.loadingPromises.get(key);
        }

        const promise = new Promise((resolve, reject) => {
            try {
                this.scene.load.tilemapTiledJSON(key, url);
                this.scene.load.once('complete', () => {
                    const tilemap = this.scene.make.tilemap({ key: key });
                    this.loadedAssets.set(key, tilemap);
                    this.loadingPromises.delete(key);
                    resolve(tilemap);
                });
                this.scene.load.once('loaderror', (file) => {
                    this.loadingPromises.delete(key);
                    reject(new Error(`Failed to load tilemap: ${key} from ${url}`));
                });
                this.scene.load.start();
            } catch (error) {
                reject(error);
            }
        });

        this.loadingPromises.set(key, promise);
        return promise;
    }

    /**
     * Загружает шрифт
     */
    loadFont(key, url, options = {}) {
        if (this.loadedAssets.has(key)) {
            return Promise.resolve(this.loadedAssets.get(key));
        }

        if (this.loadingPromises.has(key)) {
            return this.loadingPromises.get(key);
        }

        const promise = new Promise((resolve, reject) => {
            try {
                // Создаем элемент link для загрузки шрифта
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = url;
                link.onload = () => {
                    this.loadedAssets.set(key, true);
                    this.loadingPromises.delete(key);
                    resolve(true);
                };
                link.onerror = () => {
                    this.loadingPromises.delete(key);
                    reject(new Error(`Failed to load font: ${key} from ${url}`));
                };
                document.head.appendChild(link);
            } catch (error) {
                reject(error);
            }
        });

        this.loadingPromises.set(key, promise);
        return promise;
    }

    /**
     * Загружает несколько ресурсов одновременно
     */
    loadMultiple(assets) {
        const promises = [];
        
        assets.forEach(asset => {
            switch (asset.type) {
                case this.assetTypes.IMAGE:
                    promises.push(this.loadImage(asset.key, asset.url, asset.options));
                    break;
                case this.assetTypes.SPRITESHEET:
                    promises.push(this.loadSpritesheet(asset.key, asset.url, asset.frameConfig, asset.options));
                    break;
                case this.assetTypes.AUDIO:
                    promises.push(this.loadAudio(asset.key, asset.url, asset.options));
                    break;
                case this.assetTypes.ATLAS:
                    promises.push(this.loadAtlas(asset.key, asset.textureURL, asset.atlasURL, asset.options));
                    break;
                case this.assetTypes.TILEMAP:
                    promises.push(this.loadTilemap(asset.key, asset.url, asset.options));
                    break;
                case this.assetTypes.FONT:
                    promises.push(this.loadFont(asset.key, asset.url, asset.options));
                    break;
            }
        });

        return Promise.all(promises);
    }

    /**
     * Создает временное изображение для тестирования
     */
    createPlaceholderImage(key, width = 64, height = 64, color = '#00ff00') {
        if (this.loadedAssets.has(key)) {
            return Promise.resolve(this.loadedAssets.get(key));
        }

        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            
            // Рисуем фон
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, width, height);
            
            // Рисуем рамку
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.strokeRect(1, 1, width - 2, height - 2);
            
            // Добавляем текст
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(key, width / 2, height / 2);
            
            // Создаем текстуру Phaser
            const texture = this.scene.textures.addCanvas(key, canvas);
            this.loadedAssets.set(key, texture);
            resolve(texture);
        });
    }

    /**
     * Создает временный звук для тестирования
     */
    createPlaceholderSound(key, duration = 0.1, frequency = 440) {
        if (this.loadedAssets.has(key)) {
            return Promise.resolve(this.loadedAssets.get(key));
        }

        return new Promise((resolve) => {
            // Создаем простой звук с помощью Web Audio API
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
            
            // Создаем заглушку для Phaser
            const placeholderSound = {
                key: key,
                play: () => {
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + duration);
                }
            };
            
            this.loadedAssets.set(key, placeholderSound);
            resolve(placeholderSound);
        });
    }

    /**
     * Проверяет, загружен ли ресурс
     */
    isLoaded(key) {
        return this.loadedAssets.has(key);
    }

    /**
     * Получает загруженный ресурс
     */
    getAsset(key) {
        return this.loadedAssets.get(key);
    }

    /**
     * Очищает все загруженные ресурсы
     */
    clear() {
        this.loadedAssets.clear();
        this.loadingPromises.clear();
    }

    /**
     * Получает статистику загрузки
     */
    getStats() {
        return {
            loaded: this.loadedAssets.size,
            loading: this.loadingPromises.size,
            total: this.loadedAssets.size + this.loadingPromises.size
        };
    }

    /**
     * Создает прогресс-бар загрузки
     */
    createProgressBar(x, y, width, height) {
        const progressBar = this.scene.add.graphics();
        const progressText = this.scene.add.text(x + width / 2, y + height + 20, '0%', {
            fontSize: '16px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        const updateProgress = (progress) => {
            progressBar.clear();
            
            // Фон
            progressBar.fillStyle(0x333333);
            progressBar.fillRect(x, y, width, height);
            
            // Прогресс
            progressBar.fillStyle(0x00ff00);
            progressBar.fillRect(x, y, width * progress, height);
            
            // Рамка
            progressBar.lineStyle(2, 0xffffff);
            progressBar.strokeRect(x, y, width, height);
            
            progressText.setText(`${Math.round(progress * 100)}%`);
        };

        return { progressBar, progressText, updateProgress };
    }

    /**
     * Загружает ресурсы с прогресс-баром
     */
    loadWithProgress(assets, progressCallback) {
        let loaded = 0;
        const total = assets.length;
        
        const promises = assets.map(asset => {
            return this.loadAsset(asset).then(() => {
                loaded++;
                if (progressCallback) {
                    progressCallback(loaded / total);
                }
            });
        });

        return Promise.all(promises);
    }

    /**
     * Универсальный метод загрузки ресурса
     */
    loadAsset(asset) {
        switch (asset.type) {
            case this.assetTypes.IMAGE:
                return this.loadImage(asset.key, asset.url, asset.options);
            case this.assetTypes.SPRITESHEET:
                return this.loadSpritesheet(asset.key, asset.url, asset.frameConfig, asset.options);
            case this.assetTypes.AUDIO:
                return this.loadAudio(asset.key, asset.url, asset.options);
            case this.assetTypes.ATLAS:
                return this.loadAtlas(asset.key, asset.textureURL, asset.atlasURL, asset.options);
            case this.assetTypes.TILEMAP:
                return this.loadTilemap(asset.key, asset.url, asset.options);
            case this.assetTypes.FONT:
                return this.loadFont(asset.key, asset.url, asset.options);
            default:
                return Promise.reject(new Error(`Unknown asset type: ${asset.type}`));
        }
    }
}

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AssetLoader;
}
