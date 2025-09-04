// Boundary System for Future Survivors
class BoundarySystem {
    constructor(scene, bounds = null) {
        this.scene = scene;
        this.boundaries = [];
        this.invisibleWalls = null;
        
        // Default bounds based on camera size
        this.bounds = bounds || {
            left: 50,
            right: this.scene.cameras.main.width - 50,
            top: 50,
            bottom: this.scene.cameras.main.height - 50
        };
        
        // Получаем размеры мира из BackgroundManager, если доступен
        if (this.scene.backgroundManager && this.scene.backgroundManager.analysis) {
            const worldWidth = this.scene.backgroundManager.analysis.worldWidth;
            const worldHeight = this.scene.backgroundManager.analysis.worldHeight;
            
            if (worldWidth && worldHeight) {
                this.bounds = {
                    left: 25,
                    right: worldWidth - 25,
                    top: 25,
                    bottom: worldHeight - 25
                };
                console.log('Using world bounds from background:', this.bounds);
            }
        }
        
        console.log('BoundarySystem initialized with bounds:', this.bounds);
    }
    
    /**
     * Create invisible boundaries around the game area
     * @param {number} width - Game area width
     * @param {number} height - Game area height
     * @param {number} wallThickness - Thickness of boundary walls
     */
    createBoundaries(width = null, height = null, wallThickness = 50) {
        // Используем размеры увеличенного фона для создания барьеров
        const gameWidth = width || 3200;  // Размер увеличенной карты
        const gameHeight = height || 1800; // Размер увеличенной карты
        
        console.log(`Creating boundaries for enlarged map: ${gameWidth}x${gameHeight}`);
        
        // Create physics group for walls
        this.invisibleWalls = this.scene.physics.add.staticGroup();
        
        // Создаем НЕВИДИМЫЕ барьеры по краям увеличенной карты
        // Top wall - верхний барьер  
        const topWall = this.scene.add.rectangle(
            gameWidth / 2, 
            -wallThickness / 2, // За пределами карты
            gameWidth + wallThickness * 2, 
            wallThickness, 
            0x000000, // Черный цвет
            0 // Полностью прозрачный (невидимый)
        );
        this.scene.physics.add.existing(topWall, true);
        this.invisibleWalls.add(topWall);
        
        // Bottom wall - нижний барьер
        const bottomWall = this.scene.add.rectangle(
            gameWidth / 2, 
            gameHeight + wallThickness / 2, // За пределами карты
            gameWidth + wallThickness * 2, 
            wallThickness, 
            0x000000, // Черный цвет
            0 // Полностью прозрачный (невидимый)
        );
        this.scene.physics.add.existing(bottomWall, true);
        this.invisibleWalls.add(bottomWall);
        
        // Left wall - левый барьер
        const leftWall = this.scene.add.rectangle(
            -wallThickness / 2, // За пределами карты
            gameHeight / 2, 
            wallThickness, 
            gameHeight + wallThickness * 2, 
            0x000000, // Черный цвет
            0 // Полностью прозрачный (невидимый)
        );
        this.scene.physics.add.existing(leftWall, true);
        this.invisibleWalls.add(leftWall);
        
        // Right wall - правый барьер
        const rightWall = this.scene.add.rectangle(
            gameWidth + wallThickness / 2, // За пределами карты
            gameHeight / 2, 
            wallThickness, 
            gameHeight + wallThickness * 2, 
            0x000000, // Черный цвет
            0 // Полностью прозрачный (невидимый)
        );
        this.scene.physics.add.existing(rightWall, true);
        this.invisibleWalls.add(rightWall);
        
        // Store boundary data
        this.boundaries = [
            { type: 'wall', name: 'top', x: gameWidth / 2, y: 0, width: gameWidth, height: wallThickness },
            { type: 'wall', name: 'bottom', x: gameWidth / 2, y: gameHeight, width: gameWidth, height: wallThickness },
            { type: 'wall', name: 'left', x: 0, y: gameHeight / 2, width: wallThickness, height: gameHeight },
            { type: 'wall', name: 'right', x: gameWidth, y: gameHeight / 2, width: wallThickness, height: gameHeight }
        ];
        
        console.log(`Created ${this.boundaries.length} boundary walls at correct positions`);
        return this.invisibleWalls;
    }
    
    /**
     * Add collision detection between player and boundaries
     * @param {Phaser.GameObjects.GameObject} player - Player object
     * @param {Function} onCollision - Callback function for collision
     */
    addPlayerCollision(player, onCollision = null) {
        if (!this.invisibleWalls || !player) {
            console.warn('Cannot add player collision - walls or player not available');
            return;
        }
        
        const collisionCallback = onCollision || this.defaultPlayerCollision.bind(this);
        
        this.scene.physics.add.collider(player, this.invisibleWalls, collisionCallback);
        console.log('Player collision with boundaries enabled');
    }
    
    /**
     * Default collision handler for player-boundary collision
     * @param {Phaser.GameObjects.GameObject} player - Player object
     * @param {Phaser.GameObjects.GameObject} wall - Wall object
     */
    defaultPlayerCollision(player, wall) {
        // Simple collision - just stop the player
        // The physics system handles the actual collision response
        console.log('Player hit boundary');
        
        // Optional: Add visual feedback
        this.createBoundaryHitEffect(player.x, player.y);
    }
    
    /**
     * Check if a position is within the game boundaries
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {boolean} - True if position is within bounds
     */
    isWithinBounds(x, y) {
        return x >= this.bounds.left && 
               x <= this.bounds.right && 
               y >= this.bounds.top && 
               y <= this.bounds.bottom;
    }
    
    /**
     * Constrain a position to stay within boundaries
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {Object} - Constrained coordinates {x, y}
     */
    constrainPosition(x, y) {
        return {
            x: Math.max(this.bounds.left, Math.min(this.bounds.right, x)),
            y: Math.max(this.bounds.top, Math.min(this.bounds.bottom, y))
        };
    }
    
    /**
     * Check if player is near a boundary
     * @param {Phaser.GameObjects.GameObject} player - Player object
     * @param {number} threshold - Distance threshold
     * @returns {Object} - Information about nearby boundaries
     */
    checkPlayerBounds(player, threshold = 100) {
        if (!player) return null;
        
        const result = {
            nearBoundary: false,
            boundaries: [],
            distance: {
                left: player.x - this.bounds.left,
                right: this.bounds.right - player.x,
                top: player.y - this.bounds.top,
                bottom: this.bounds.bottom - player.y
            }
        };
        
        // Check each boundary
        if (result.distance.left < threshold) {
            result.nearBoundary = true;
            result.boundaries.push('left');
        }
        if (result.distance.right < threshold) {
            result.nearBoundary = true;
            result.boundaries.push('right');
        }
        if (result.distance.top < threshold) {
            result.nearBoundary = true;
            result.boundaries.push('top');
        }
        if (result.distance.bottom < threshold) {
            result.nearBoundary = true;
            result.boundaries.push('bottom');
        }
        
        return result;
    }
    
    /**
     * Create visual barriers based on background analysis
     * @param {Array} visualBoundaries - Array of boundary definitions
     */
    createVisualBarriers(visualBoundaries) {
        if (!visualBoundaries || visualBoundaries.length === 0) {
            console.log('No visual boundaries to create');
            return;
        }
        
        console.log(`Creating ${visualBoundaries.length} visual barriers`);
        
        visualBoundaries.forEach((barrier, index) => {
            if (barrier.type === 'barrier') {
                const barrierObj = this.scene.add.rectangle(
                    (barrier.x1 + barrier.x2) / 2,
                    (barrier.y1 + barrier.y2) / 2,
                    Math.abs(barrier.x2 - barrier.x1),
                    Math.abs(barrier.y2 - barrier.y1),
                    0x000000,
                    0 // Invisible
                );
                
                this.scene.physics.add.existing(barrierObj, true);
                
                if (this.invisibleWalls) {
                    this.invisibleWalls.add(barrierObj);
                }
                
                this.boundaries.push({
                    type: 'barrier',
                    name: `barrier_${index}`,
                    x: (barrier.x1 + barrier.x2) / 2,
                    y: (barrier.y1 + barrier.y2) / 2,
                    width: Math.abs(barrier.x2 - barrier.x1),
                    height: Math.abs(barrier.y2 - barrier.y1)
                });
            }
        });
    }
    
    /**
     * Create visual effect when player hits boundary
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     */
    createBoundaryHitEffect(x, y) {
        // Create a simple flash effect
        const effect = this.scene.add.circle(x, y, 20, 0xff0000, 0.5);
        
        this.scene.tweens.add({
            targets: effect,
            scaleX: 2,
            scaleY: 2,
            alpha: 0,
            duration: 300,
            onComplete: () => {
                effect.destroy();
            }
        });
    }
    
    /**
     * Enable debug visualization of boundaries
     * @param {boolean} enable - Whether to show debug boundaries
     */
    setDebugMode(enable = true) {
        if (!this.invisibleWalls) return;
        
        this.invisibleWalls.children.entries.forEach(wall => {
            if (enable) {
                wall.setAlpha(0.3);
                wall.setFillStyle(0xff0000);
            } else {
                wall.setAlpha(0);
            }
        });
        
        console.log(`Boundary debug mode: ${enable ? 'ON' : 'OFF'}`);
    }
    
    /**
     * Get all boundary information
     * @returns {Array} - Array of boundary objects
     */
    getBoundaries() {
        return this.boundaries;
    }
    
    /**
     * Get bounds configuration
     * @returns {Object} - Bounds object
     */
    getBounds() {
        return this.bounds;
    }
    
    /**
     * Update bounds configuration
     * @param {Object} newBounds - New bounds object
     */
    setBounds(newBounds) {
        this.bounds = { ...this.bounds, ...newBounds };
        console.log('Bounds updated:', this.bounds);
    }
    
    /**
     * Destroy all boundaries
     */
    destroy() {
        if (this.invisibleWalls) {
            this.invisibleWalls.clear(true, true);
            this.invisibleWalls = null;
        }
        this.boundaries = [];
        console.log('BoundarySystem destroyed');
    }
    
    /**
     * Debug information
     */
    debugInfo() {
        console.log('=== BOUNDARY SYSTEM DEBUG ===');
        console.log('Bounds:', this.bounds);
        console.log('Boundaries:', this.boundaries);
        console.log('Invisible walls:', this.invisibleWalls);
        console.log('==============================');
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BoundarySystem;
}