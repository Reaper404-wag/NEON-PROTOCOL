// Camera Management System with Dead Zone for Future Survivors
class CameraManager {
    constructor(scene, config = {}) {
        this.scene = scene;
        this.camera = scene.cameras.main;
        
        // Default configuration
        this.config = {
            deadZone: {
                width: config.deadZoneWidth || 200,
                height: config.deadZoneHeight || 150
            },
            followSpeed: config.followSpeed || 0.08,
            smoothing: config.smoothing !== false,
            bounds: {
                minX: config.minX || 0,
                minY: config.minY || 0,
                maxX: config.maxX || 2048,
                maxY: config.maxY || 1536
            },
            zoom: config.zoom || 1.0
        };
        
        this.target = null;
        this.deadZoneActive = false;
        this.lastTargetPos = { x: 0, y: 0 };
        
        console.log('CameraManager initialized with config:', this.config);
        this.setupCamera();
    }
    
    /**
     * Setup camera with initial configuration
     */
    setupCamera() {
        // Set camera bounds to prevent showing empty space
        this.camera.setBounds(
            this.config.bounds.minX,
            this.config.bounds.minY,
            this.config.bounds.maxX - this.config.bounds.minX,
            this.config.bounds.maxY - this.config.bounds.minY
        );
        
        // Set initial zoom
        this.camera.setZoom(this.config.zoom);
        
        console.log('Camera setup complete with bounds:', this.config.bounds);
    }
    
    /**
     * Setup dead zone for smooth camera following
     * @param {number} centerX - Center X of dead zone
     * @param {number} centerY - Center Y of dead zone
     */
    setupDeadZone(centerX = null, centerY = null) {
        const camera = this.camera;
        
        // Calculate center if not provided
        const dzCenterX = centerX !== null ? centerX : camera.width / 2;
        const dzCenterY = centerY !== null ? centerY : camera.height / 2;
        
        // Set dead zone
        camera.setDeadzone(this.config.deadZone.width, this.config.deadZone.height);
        
        // Set lerp for smooth following
        if (this.config.smoothing) {
            camera.setLerp(this.config.followSpeed, this.config.followSpeed);
        }
        
        this.deadZoneActive = true;
        
        console.log(`Dead zone setup: ${this.config.deadZone.width}x${this.config.deadZone.height} at ${dzCenterX}, ${dzCenterY}`);
    }
    
    /**
     * Start following a target object
     * @param {Phaser.GameObjects.GameObject} target - Target to follow
     * @param {boolean} roundPixels - Whether to round camera position to pixels
     */
    startFollowing(target, roundPixels = true) {
        if (!target) {
            console.warn('Cannot follow null target');
            return;
        }
        
        this.target = target;
        this.camera.startFollow(target, roundPixels);
        
        // Store initial position
        this.lastTargetPos = { x: target.x, y: target.y };
        
        console.log('Camera now following target at:', target.x, target.y);
    }
    
    /**
     * Stop following current target
     */
    stopFollowing() {
        this.camera.stopFollow();
        this.target = null;
        console.log('Camera stopped following');
    }
    
    /**
     * Update camera position manually (for custom following logic)
     * @param {number} targetX - Target X position
     * @param {number} targetY - Target Y position
     */
    updateCamera(targetX, targetY) {
        if (!this.deadZoneActive) {
            return;
        }
        
        // Check if target is outside dead zone
        if (!this.isInDeadZone(targetX, targetY)) {
            this.smoothFollow(targetX, targetY);
        }
        
        // Update last known position
        this.lastTargetPos = { x: targetX, y: targetY };
    }
    
    /**
     * Check if position is within dead zone
     * @param {number} x - X position
     * @param {number} y - Y position
     * @returns {boolean} - True if position is in dead zone
     */
    isInDeadZone(x, y) {
        const camera = this.camera;
        const centerX = camera.scrollX + camera.width / 2;
        const centerY = camera.scrollY + camera.height / 2;
        
        const dzHalfWidth = this.config.deadZone.width / 2;
        const dzHalfHeight = this.config.deadZone.height / 2;
        
        return (
            x >= centerX - dzHalfWidth &&
            x <= centerX + dzHalfWidth &&
            y >= centerY - dzHalfHeight &&
            y <= centerY + dzHalfHeight
        );
    }
    
    /**
     * Smooth camera following with custom speed
     * @param {number} targetX - Target X position
     * @param {number} targetY - Target Y position
     */
    smoothFollow(targetX, targetY) {
        const camera = this.camera;
        const speed = this.config.followSpeed;
        
        // Calculate desired camera position (center target on screen)
        const desiredX = targetX - camera.width / 2;
        const desiredY = targetY - camera.height / 2;
        
        // Apply bounds constraints
        const constrainedX = Math.max(
            this.config.bounds.minX,
            Math.min(this.config.bounds.maxX - camera.width, desiredX)
        );
        const constrainedY = Math.max(
            this.config.bounds.minY,
            Math.min(this.config.bounds.maxY - camera.height, desiredY)
        );
        
        // Smooth interpolation
        const currentX = camera.scrollX;
        const currentY = camera.scrollY;
        
        const newX = currentX + (constrainedX - currentX) * speed;
        const newY = currentY + (constrainedY - currentY) * speed;
        
        camera.setScroll(newX, newY);
    }
    
    /**
     * Set camera zoom level
     * @param {number} zoom - Zoom level (1.0 = normal, 2.0 = 2x zoom)
     * @param {number} duration - Animation duration in ms (optional)
     */
    setZoom(zoom, duration = 0) {
        if (duration > 0) {
            this.scene.tweens.add({
                targets: this.camera,
                zoom: zoom,
                duration: duration,
                ease: 'Power2'
            });
        } else {
            this.camera.setZoom(zoom);
        }
        
        this.config.zoom = zoom;
        console.log(`Camera zoom set to: ${zoom}`);
    }
    
    /**
     * Shake camera effect
     * @param {number} duration - Shake duration in ms
     * @param {number} intensity - Shake intensity
     */
    shake(duration = 100, intensity = 0.01) {
        this.camera.shake(duration, intensity);
    }
    
    /**
     * Flash camera effect
     * @param {number} duration - Flash duration in ms
     * @param {number} red - Red component (0-255)
     * @param {number} green - Green component (0-255)
     * @param {number} blue - Blue component (0-255)
     */
    flash(duration = 250, red = 255, green = 255, blue = 255) {
        this.camera.flash(duration, red, green, blue);
    }
    
    /**
     * Fade camera effect
     * @param {number} duration - Fade duration in ms
     * @param {number} red - Red component (0-255)
     * @param {number} green - Green component (0-255)
     * @param {number} blue - Blue component (0-255)
     */
    fadeOut(duration = 1000, red = 0, green = 0, blue = 0) {
        return new Promise((resolve) => {
            this.camera.fadeOut(duration, red, green, blue);
            this.camera.once('camerafadeoutcomplete', resolve);
        });
    }
    
    /**
     * Fade in camera effect
     * @param {number} duration - Fade duration in ms
     * @param {number} red - Red component (0-255)
     * @param {number} green - Green component (0-255)
     * @param {number} blue - Blue component (0-255)
     */
    fadeIn(duration = 1000, red = 0, green = 0, blue = 0) {
        return new Promise((resolve) => {
            this.camera.fadeIn(duration, red, green, blue);
            this.camera.once('camerafadeincomplete', resolve);
        });
    }
    
    /**
     * Pan camera to specific position
     * @param {number} x - Target X position
     * @param {number} y - Target Y position
     * @param {number} duration - Pan duration in ms
     */
    panTo(x, y, duration = 1000) {
        return new Promise((resolve) => {
            this.camera.pan(x, y, duration, 'Power2');
            this.camera.once('camerapancomplete', resolve);
        });
    }
    
    /**
     * Get current camera position
     * @returns {Object} - Camera position {x, y}
     */
    getPosition() {
        return {
            x: this.camera.scrollX,
            y: this.camera.scrollY
        };
    }
    
    /**
     * Get camera center position
     * @returns {Object} - Camera center {x, y}
     */
    getCenter() {
        return {
            x: this.camera.scrollX + this.camera.width / 2,
            y: this.camera.scrollY + this.camera.height / 2
        };
    }
    
    /**
     * Convert world coordinates to screen coordinates
     * @param {number} worldX - World X coordinate
     * @param {number} worldY - World Y coordinate
     * @returns {Object} - Screen coordinates {x, y}
     */
    worldToScreen(worldX, worldY) {
        return {
            x: (worldX - this.camera.scrollX) * this.camera.zoom,
            y: (worldY - this.camera.scrollY) * this.camera.zoom
        };
    }
    
    /**
     * Convert screen coordinates to world coordinates
     * @param {number} screenX - Screen X coordinate
     * @param {number} screenY - Screen Y coordinate
     * @returns {Object} - World coordinates {x, y}
     */
    screenToWorld(screenX, screenY) {
        return {
            x: (screenX / this.camera.zoom) + this.camera.scrollX,
            y: (screenY / this.camera.zoom) + this.camera.scrollY
        };
    }
    
    /**
     * Update camera bounds
     * @param {number} minX - Minimum X bound
     * @param {number} minY - Minimum Y bound
     * @param {number} maxX - Maximum X bound
     * @param {number} maxY - Maximum Y bound
     */
    setBounds(minX, minY, maxX, maxY) {
        this.config.bounds = { minX, minY, maxX, maxY };
        
        this.camera.setBounds(
            minX,
            minY,
            maxX - minX,
            maxY - minY
        );
        
        console.log('Camera bounds updated:', this.config.bounds);
    }
    
    /**
     * Update dead zone configuration
     * @param {number} width - Dead zone width
     * @param {number} height - Dead zone height
     */
    setDeadZone(width, height) {
        this.config.deadZone.width = width;
        this.config.deadZone.height = height;
        
        if (this.deadZoneActive) {
            this.camera.setDeadzone(width, height);
        }
        
        console.log(`Dead zone updated: ${width}x${height}`);
    }
    
    /**
     * Update follow speed
     * @param {number} speed - Follow speed (0.0 to 1.0)
     */
    setFollowSpeed(speed) {
        this.config.followSpeed = Math.max(0, Math.min(1, speed));
        
        if (this.config.smoothing) {
            this.camera.setLerp(this.config.followSpeed, this.config.followSpeed);
        }
        
        console.log(`Follow speed updated: ${this.config.followSpeed}`);
    }
    
    /**
     * Enable or disable camera smoothing
     * @param {boolean} enabled - Whether smoothing is enabled
     */
    setSmoothing(enabled) {
        this.config.smoothing = enabled;
        
        if (enabled) {
            this.camera.setLerp(this.config.followSpeed, this.config.followSpeed);
        } else {
            this.camera.setLerp(1, 1); // Instant following
        }
        
        console.log(`Camera smoothing: ${enabled ? 'ON' : 'OFF'}`);
    }
    
    /**
     * Get current configuration
     * @returns {Object} - Current camera configuration
     */
    getConfig() {
        return { ...this.config };
    }
    
    /**
     * Debug information
     */
    debugInfo() {
        console.log('=== CAMERA MANAGER DEBUG ===');
        console.log('Config:', this.config);
        console.log('Target:', this.target);
        console.log('Dead zone active:', this.deadZoneActive);
        console.log('Camera position:', this.getPosition());
        console.log('Camera center:', this.getCenter());
        console.log('Last target pos:', this.lastTargetPos);
        console.log('============================');
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CameraManager;
}