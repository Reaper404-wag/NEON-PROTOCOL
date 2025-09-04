// Test Configuration for Future Survivors
const TestConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'test-container',
    backgroundColor: '#000000',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        key: 'TestScene',
        preload: preloadTest,
        create: createTest,
        update: updateTest
    }
};

// Test Scene Functions
function preloadTest() {
    console.log('Test Scene: Preload started');
    
    // Load background image
    this.load.image('background', '../image/bg.png');
    
    // Create simple colored rectangles for testing if image fails
    this.load.image('player-placeholder', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
    
    // Progress tracking
    this.load.on('progress', (value) => {
        console.log('Loading progress:', Math.round(value * 100) + '%');
    });
    
    this.load.on('complete', () => {
        console.log('Test Scene: All assets loaded');
        document.querySelector('.test-info').textContent = 'Test Environment Ready';
    });
}

function createTest() {
    console.log('Test Scene: Create started');
    
    // Store scene reference globally for tests
    window.testScene = this;
    
    // Create background
    this.background = this.add.image(400, 300, 'background');
    
    // Scale background to fit screen
    const scaleX = this.cameras.main.width / this.background.width;
    const scaleY = this.cameras.main.height / this.background.height;
    const scale = Math.max(scaleX, scaleY);
    this.background.setScale(scale);
    
    // Create test player (simple rectangle)
    this.player = this.add.rectangle(400, 300, 32, 32, 0x00ff00);
    this.player.setStrokeStyle(2, 0xffffff);
    
    // Add physics to player
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);
    
    // Create cursor keys
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,S,A,D');
    
    // Test boundaries
    this.boundaries = {
        left: 50,
        right: this.cameras.main.width - 50,
        top: 50,
        bottom: this.cameras.main.height - 50
    };
    
    // Debug info
    this.debugText = this.add.text(10, 10, '', {
        fontSize: '14px',
        fill: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 5, y: 5 }
    });
    
    console.log('Test Scene: Create completed');
}

function updateTest() {
    if (!this.player || !this.cursors) return;
    
    const speed = 200;
    
    // Reset velocity
    this.player.body.setVelocity(0);
    
    // Handle input
    if (this.cursors.left.isDown || this.wasd.A.isDown) {
        this.player.body.setVelocityX(-speed);
    } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
        this.player.body.setVelocityX(speed);
    }
    
    if (this.cursors.up.isDown || this.wasd.W.isDown) {
        this.player.body.setVelocityY(-speed);
    } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
        this.player.body.setVelocityY(speed);
    }
    
    // Update debug info
    if (this.debugText) {
        this.debugText.setText([
            `Player: ${Math.round(this.player.x)}, ${Math.round(this.player.y)}`,
            `Boundaries: ${this.boundaries.left}-${this.boundaries.right}, ${this.boundaries.top}-${this.boundaries.bottom}`,
            `Background: ${this.background.width}x${this.background.height}, scale: ${this.background.scaleX.toFixed(2)}`,
            `Controls: WASD or Arrow Keys`
        ]);
    }
}

// Global test state
window.testState = {
    debugMode: false,
    backgroundLoaded: false,
    boundariesActive: false
};