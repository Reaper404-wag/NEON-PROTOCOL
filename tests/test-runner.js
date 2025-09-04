// Test Runner for Future Survivors
let testGame = null;

// Initialize test environment
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        console.log('Initializing test environment...');
        testGame = new Phaser.Game(TestConfig);
        
        testGame.events.on('ready', () => {
            console.log('Test game ready');
            updateTestResults('Test environment initialized successfully');
        });
        
        testGame.events.on('error', (error) => {
            console.error('Test game error:', error);
            updateTestResults('Error: ' + error.message, 'error');
        });
    }, 100);
});

// Test control functions
function runBackgroundTest() {
    console.log('Running background test...');
    updateTestResults('Testing background...', 'info');
    
    if (!window.testScene) {
        updateTestResults('Test scene not ready', 'error');
        return;
    }
    
    const scene = window.testScene;
    const results = [];
    
    // Test 1: Background exists
    if (scene.background) {
        results.push('✓ Background sprite created');
        window.testState.backgroundLoaded = true;
    } else {
        results.push('✗ Background sprite missing');
    }
    
    // Test 2: Background dimensions
    if (scene.background && scene.background.width > 0 && scene.background.height > 0) {
        results.push(`✓ Background size: ${scene.background.width}x${scene.background.height}`);
    } else {
        results.push('✗ Invalid background dimensions');
    }
    
    // Test 3: Background scaling
    if (scene.background && scene.background.scaleX > 0 && scene.background.scaleY > 0) {
        results.push(`✓ Background scale: ${scene.background.scaleX.toFixed(2)}x${scene.background.scaleY.toFixed(2)}`);
    } else {
        results.push('✗ Invalid background scaling');
    }
    
    updateTestResults('Background Test Results:\n' + results.join('\n'));
}

async function runBoundaryTest() {
    console.log('Running boundary test...');
    updateTestResults('Testing boundaries...', 'info');
    
    if (!window.testScene) {
        updateTestResults('Test scene not ready', 'error');
        return;
    }
    
    if (window.boundaryTest) {
        window.boundaryTest.setScene(window.testScene);
        const results = await window.boundaryTest.runAllTests();
        const report = window.boundaryTest.generateReport();
        updateTestResults(report);
    } else {
        // Fallback to simple test
        const scene = window.testScene;
        const results = [];
        
        // Test 1: Boundaries defined
        if (scene.boundaries) {
            results.push('✓ Boundaries object exists');
            results.push(`  Left: ${scene.boundaries.left}, Right: ${scene.boundaries.right}`);
            results.push(`  Top: ${scene.boundaries.top}, Bottom: ${scene.boundaries.bottom}`);
        } else {
            results.push('✗ Boundaries not defined');
        }
        
        // Test 2: Player physics
        if (scene.player && scene.player.body) {
            results.push('✓ Player physics enabled');
            results.push(`  World bounds: ${scene.player.body.world.bounds.width}x${scene.player.body.world.bounds.height}`);
        } else {
            results.push('✗ Player physics missing');
        }
        
        // Test 3: Collision detection
        if (scene.player && scene.player.body && scene.player.body.collideWorldBounds) {
            results.push('✓ World bounds collision enabled');
            window.testState.boundariesActive = true;
        } else {
            results.push('✗ World bounds collision disabled');
        }
        
        updateTestResults('Boundary Test Results:\n' + results.join('\n'));
    }
}

async function runIntegrationTest() {
    console.log('Running integration test...');
    updateTestResults('Running integration test...', 'info');
    
    if (!window.testScene) {
        updateTestResults('Test scene not ready', 'error');
        return;
    }
    
    if (window.integrationTest) {
        window.integrationTest.setScene(window.testScene);
        const results = await window.integrationTest.runAllTests();
        const report = window.integrationTest.generateReport();
        updateTestResults(report);
    } else {
        // Fallback to simple test
        const results = [];
        
        // Test 1: All systems loaded
        if (window.testState.backgroundLoaded && window.testState.boundariesActive) {
            results.push('✓ All core systems operational');
        } else {
            results.push('✗ Some systems not working');
        }
        
        // Test 2: Player movement
        const scene = window.testScene;
        if (scene.player && scene.cursors) {
            results.push('✓ Player movement system ready');
        } else {
            results.push('✗ Player movement system not ready');
        }
        
        // Test 3: Performance check
        const fps = testGame.loop.actualFps;
        if (fps > 30) {
            results.push(`✓ Performance good: ${Math.round(fps)} FPS`);
        } else {
            results.push(`⚠ Performance warning: ${Math.round(fps)} FPS`);
        }
        
        updateTestResults('Integration Test Results:\n' + results.join('\n'));
    }
}

function toggleDebug() {
    if (!window.testScene) {
        updateTestResults('Test scene not ready', 'error');
        return;
    }
    
    window.testState.debugMode = !window.testState.debugMode;
    
    if (window.testScene.physics && window.testScene.physics.world) {
        window.testScene.physics.world.debugGraphic.visible = window.testState.debugMode;
    }
    
    updateTestResults(`Debug mode: ${window.testState.debugMode ? 'ON' : 'OFF'}`, 'info');
}

function updateTestResults(message, type = 'success') {
    const resultsDiv = document.getElementById('test-results');
    if (resultsDiv) {
        const color = type === 'error' ? '#ff4444' : type === 'info' ? '#ffaa00' : '#44ff44';
        resultsDiv.innerHTML = `<div style="color: ${color}; font-size: 12px; margin-top: 10px; white-space: pre-line;">${message}</div>`;
    }
    console.log('Test Result:', message);
}

// Global functions for debugging
window.getTestScene = () => window.testScene;
window.getTestState = () => window.testState;
window.resetTest = () => {
    if (testGame) {
        testGame.destroy(true);
        setTimeout(() => {
            testGame = new Phaser.Game(TestConfig);
        }, 100);
    }
};