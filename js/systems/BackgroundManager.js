// Background Management System for Future Survivors
class BackgroundManager {
    constructor(scene) {
        this.scene = scene;
        this.background = null;
        this.config = {
            key: 'background',
            path: 'image/bg.png',
            scale: 1.0,
            parallax: false,
            centerX: true,
            centerY: true
        };
        
        // Background analysis data (will be filled after loading)
        this.analysis = {
            width: 0,
            height: 0,
            aspectRatio: 0,
            recommendedScale: 1.0,
            visualBoundaries: [],
            safeArea: { x: 0, y: 0, width: 0, height: 0 }
        };
        
        console.log('BackgroundManager initialized');
    }
    
    /**
     * Load background image
     * @param {string} key - Asset key
     * @param {string} path - Path to image
     */
    loadBackground(key = null, path = null) {
        const assetKey = key || this.config.key;
        const assetPath = path || this.config.path;
        
        console.log(`Loading background: ${assetKey} from ${assetPath}`);
        
        if (this.scene.load) {
            this.scene.load.image(assetKey, assetPath);
            
            // Add load event listeners
            this.scene.load.on('filecomplete-image-' + assetKey, () => {
                console.log(`Background loaded: ${assetKey}`);
                this.analyzeBackground(assetKey);
            });
            
            this.scene.load.on('loaderror', (file) => {
                if (file.key === assetKey) {
                    console.error(`Failed to load background: ${assetPath}`);
                    this.createFallbackBackground();
                }
            });
        }
    }
    
    /**
     * Create background sprite in the scene
     * @param {number} x - X position (optional)
     * @param {number} y - Y position (optional)
     * @param {number} scale - Scale factor (optional)
     */
    createBackground(x = null, y = null, scale = null) {
        if (!this.scene.add) {
            console.error('Scene not ready for background creation');
            return null;
        }
        
        const assetKey = this.config.key;
        
        // Сначала анализируем фон, чтобы получить правильный масштаб
        if (this.scene.textures.exists(assetKey)) {
            this.analyzeBackground(assetKey);
        }
        
        // Check if texture exists
        if (!this.scene.textures.exists(assetKey)) {
            console.warn(`Background texture '${assetKey}' not found, trying fallback`);
            // Try fallback background first
            if (this.scene.textures.exists('fallback_background')) {
                console.log('Using fallback_background texture');
                this.background = this.scene.add.image(0, 0, 'fallback_background');
                this.background.setOrigin(0, 0);
            } else {
                console.log('Creating new fallback background');
                this.createFallbackBackground();
            }
            return this.background;
        }
        
        // Получаем размеры экрана
        const screenWidth = this.scene.cameras.main.width;
        const screenHeight = this.scene.cameras.main.height;
        
        // Создаем фон как обычное изображение, НЕ tileSprite
        // Это позволит нам точно контролировать его размеры
        this.background = this.scene.add.image(
            0, 0,  // Левый верхний угол
            assetKey
        );
        
        // Устанавливаем origin в 0,0 чтобы изображение начиналось с левого верхнего угла
        this.background.setOrigin(0, 0);
        
        // Масштабируем карту чтобы она была достаточно большой для игры
        const minScale = Math.max(
            screenWidth * 2 / this.background.width,   // Карта должна быть минимум в 2 раза больше экрана
            screenHeight * 2 / this.background.height
        );
        
        // Применяем масштаб но не меньше 2.0 для нормального размера игрового мира
        const gameScale = Math.max(minScale, 2.0);
        this.background.setScale(gameScale);
        
        console.log(`Background scaled by ${gameScale} (min required: ${minScale})`);
        console.log('Background real size:', this.background.width * gameScale, 'x', this.background.height * gameScale);
        
        // Обновляем анализ с учетом масштаба
        this.analysis.worldWidth = this.background.width * gameScale;
        this.analysis.worldHeight = this.background.height * gameScale;
        this.analysis.recommendedScale = gameScale;
        
        // Set depth to ensure it's behind everything
        this.background.setDepth(-1000);
        
        console.log('Updated world boundaries:', this.analysis.worldWidth, 'x', this.analysis.worldHeight);
        
        return this.background;
    }
    
    /**
     * Analyze background image properties
     * @param {string} key - Asset key
     */
    analyzeBackground(key) {
        console.log('Analyzing background with key:', key);
        
        const texture = this.scene.textures.get(key);
        if (!texture || !texture.source || texture.source.length === 0) {
            console.warn('Cannot analyze background - texture not available');
            // Fallback к размерам экрана
            const screenWidth = this.scene.cameras.main.width;
            const screenHeight = this.scene.cameras.main.height;
            this.analysis.width = screenWidth;
            this.analysis.height = screenHeight;
            this.analysis.worldWidth = screenWidth;
            this.analysis.worldHeight = screenHeight;
            this.analysis.recommendedScale = 1.0;
            console.log(`Using fallback dimensions: ${screenWidth}x${screenHeight}`);
            return;
        }
        
        const source = texture.source[0];
        this.analysis.width = source.width;
        this.analysis.height = source.height;
        this.analysis.aspectRatio = source.width / source.height;
        
        // ВАЖНО: Размеры мира устанавливаются в createBackground() с учетом масштаба
        // Здесь только сохраняем исходные размеры изображения
        // this.analysis.worldWidth и worldHeight будут установлены в createBackground()
        
        // Временные значения (будут обновлены в createBackground)
        this.analysis.worldWidth = source.width;
        this.analysis.worldHeight = source.height;
        this.analysis.recommendedScale = 1.0;
        
        console.log(`Background image size: ${source.width}x${source.height}`);
        console.log(`World boundaries set to image size: ${this.analysis.worldWidth}x${this.analysis.worldHeight}`);
        
        // Define safe area (area where gameplay should happen)
        // Assuming 10% margin from edges
        const margin = 0.1;
        this.analysis.safeArea = {
            x: this.analysis.worldWidth * margin,
            y: this.analysis.worldHeight * margin,
            width: this.analysis.worldWidth * (1 - 2 * margin),
            height: this.analysis.worldHeight * (1 - 2 * margin)
        };
        
        // Analyze visual boundaries (this would need actual image analysis)
        // For now, we'll create reasonable boundaries based on common game backgrounds
        this.analyzeVisualBoundaries();
        
        console.log('Background analysis complete:', this.analysis);
    }

    /**
     * Force update background scale
     * @param {number} newScale - New scale value
     */
        // updateScale функция удалена - теперь размеры мира = размеры изображения

    /**
     * Analyze visual boundaries in the background
     * Based on the cosmic station image, we create barriers around the station structures
     */
    analyzeVisualBoundaries() {
        // For the cosmic station background, we'll create barriers based on the visible structures
        // The image shows a circular space station with extending modules
        
        const centerX = 1000; // Center of our 2000x2000 world
        const centerY = 1000;
        
        this.analysis.visualBoundaries = [
            // Outer space boundaries (edges of the world)
            { type: 'space_barrier', x1: 0, y1: 0, x2: 2000, y2: 100 }, // Top space
            { type: 'space_barrier', x1: 0, y1: 1900, x2: 2000, y2: 2000 }, // Bottom space
            { type: 'space_barrier', x1: 0, y1: 0, x2: 100, y2: 2000 }, // Left space
            { type: 'space_barrier', x1: 1900, y1: 0, x2: 2000, y2: 2000 }, // Right space
            
            // Central station core (circular barrier in the center)
            { type: 'station_core', centerX: centerX, centerY: centerY, radius: 80 },
            
            // Station modules (octagonal structures around the center)
            // Top module
            { type: 'station_module', x1: centerX - 60, y1: centerY - 300, x2: centerX + 60, y2: centerY - 180 },
            // Bottom module  
            { type: 'station_module', x1: centerX - 60, y1: centerY + 180, x2: centerX + 60, y2: centerY + 300 },
            // Left module
            { type: 'station_module', x1: centerX - 300, y1: centerY - 60, x2: centerX - 180, y2: centerY + 60 },
            // Right module
            { type: 'station_module', x1: centerX + 180, y1: centerY - 60, x2: centerX + 300, y2: centerY + 60 },
            
            // Diagonal modules
            { type: 'station_module', x1: centerX - 200, y1: centerY - 200, x2: centerX - 120, y2: centerY - 120 },
            { type: 'station_module', x1: centerX + 120, y1: centerY - 200, x2: centerX + 200, y2: centerY - 120 },
            { type: 'station_module', x1: centerX - 200, y1: centerY + 120, x2: centerX - 120, y2: centerY + 200 },
            { type: 'station_module', x1: centerX + 120, y1: centerY + 120, x2: centerX + 200, y2: centerY + 200 },
            
            // Outer ring structures (larger modules at the edges)
            { type: 'outer_module', x1: centerX - 80, y1: centerY - 500, x2: centerX + 80, y2: centerY - 400 },
            { type: 'outer_module', x1: centerX - 80, y1: centerY + 400, x2: centerX + 80, y2: centerY + 500 },
            { type: 'outer_module', x1: centerX - 500, y1: centerY - 80, x2: centerX - 400, y2: centerY + 80 },
            { type: 'outer_module', x1: centerX + 400, y1: centerY - 80, x2: centerX + 500, y2: centerY + 80 }
        ];
        
        console.log(`Analyzed cosmic station: found ${this.analysis.visualBoundaries.length} structural boundaries`);
    }
    
    /**
     * Create a fallback background when image loading fails
     */
    createFallbackBackground() {
        console.log('Creating fallback background');
        
        // Create a gradient or solid color background
        const camera = this.scene.cameras.main;
        
        // Create a simple colored rectangle as fallback
        this.background = this.scene.add.rectangle(
            camera.width / 2, 
            camera.height / 2, 
            camera.width, 
            camera.height, 
            0x001122 // Dark blue futuristic color
        );
        
        this.background.setDepth(-1000);
        
        // Add some visual elements to make it less boring
        const stars = this.scene.add.group();
        for (let i = 0; i < 50; i++) {
            const star = this.scene.add.circle(
                Math.random() * camera.width,
                Math.random() * camera.height,
                Math.random() * 2 + 1,
                0xffffff,
                Math.random() * 0.8 + 0.2
            );
            star.setDepth(-999);
            stars.add(star);
        }
        
        console.log('Fallback background created');
    }
    
    /**
     * Update background (for parallax or other effects)
     * @param {number} playerX - Player X position
     * @param {number} playerY - Player Y position
     */
    updateBackground(playerX, playerY) {
        if (!this.background || !this.config.parallax) {
            return;
        }
        
        // Simple parallax effect
        const parallaxFactor = 0.1;
        const camera = this.scene.cameras.main;
        
        this.background.x = (camera.width / 2) - (playerX * parallaxFactor);
        this.background.y = (camera.height / 2) - (playerY * parallaxFactor);
    }
    
    /**
     * Get background analysis data
     */
    getAnalysis() {
        return this.analysis;
    }
    
    /**
     * Get visual boundaries for collision detection
     */
    getVisualBoundaries() {
        return this.analysis.visualBoundaries;
    }
    
    /**
     * Get safe area for gameplay
     */
    getSafeArea() {
        return this.analysis.safeArea;
    }
    
    /**
     * Debug information
     */
    debugInfo() {
        console.log('=== BACKGROUND MANAGER DEBUG ===');
        console.log('Config:', this.config);
        console.log('Analysis:', this.analysis);
        console.log('Background sprite:', this.background);
        console.log('================================');
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BackgroundManager;
}