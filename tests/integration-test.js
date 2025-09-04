// Integration Testing Module
class IntegrationTest {
    constructor() {
        this.results = [];
        this.scene = null;
    }
    
    setScene(scene) {
        this.scene = scene;
    }
    
    async runAllTests() {
        this.results = [];
        
        await this.testSystemIntegration();
        await this.testPlayerMovement();
        await this.testBackgroundBoundaryIntegration();
        await this.testPerformance();
        
        return this.results;
    }
    
    async testSystemIntegration() {
        console.log('Testing system integration...');
        
        if (!this.scene) {
            this.results.push({ test: 'System Integration', status: 'FAIL', message: 'Test scene not available' });
            return;
        }
        
        // Check if all required systems are present
        const requiredSystems = [
            { name: 'backgroundManager', system: this.scene.backgroundManager },
            { name: 'boundarySystem', system: this.scene.boundarySystem },
            { name: 'player', system: this.scene.player }
        ];
        
        let systemsPresent = 0;
        const systemResults = [];
        
        requiredSystems.forEach(sys => {
            if (sys.system) {
                systemsPresent++;
                systemResults.push(`✓ ${sys.name}`);
            } else {
                systemResults.push(`✗ ${sys.name}`);
            }
        });
        
        if (systemsPresent === requiredSystems.length) {
            this.results.push({ 
                test: 'System Integration', 
                status: 'PASS', 
                message: `All ${systemsPresent} systems present` 
            });
        } else {
            this.results.push({ 
                test: 'System Integration', 
                status: 'FAIL', 
                message: `${systemsPresent}/${requiredSystems.length} systems present` 
            });
        }
        
        this.results.push({ 
            test: 'System Details', 
            status: 'INFO', 
            message: systemResults.join(', ') 
        });
    }
    
    async testPlayerMovement() {
        console.log('Testing player movement integration...');
        
        if (!this.scene || !this.scene.player) {
            this.results.push({ test: 'Player Movement', status: 'FAIL', message: 'Player not available' });
            return;
        }
        
        const player = this.scene.player;
        const initialX = player.x;
        const initialY = player.y;
        
        // Test if player can move (has velocity capability)
        if (player.body) {
            this.results.push({ 
                test: 'Player Movement', 
                status: 'PASS', 
                message: 'Player has physics body for movement' 
            });
            
            // Test boundary constraints
            if (this.scene.boundarySystem) {
                const bounds = this.scene.boundarySystem.getBounds();
                const isWithinBounds = this.scene.boundarySystem.isWithinBounds(player.x, player.y);
                
                if (isWithinBounds) {
                    this.results.push({ 
                        test: 'Player Position', 
                        status: 'PASS', 
                        message: `Player within bounds at (${Math.round(player.x)}, ${Math.round(player.y)})` 
                    });
                } else {
                    this.results.push({ 
                        test: 'Player Position', 
                        status: 'WARN', 
                        message: `Player outside bounds at (${Math.round(player.x)}, ${Math.round(player.y)})` 
                    });
                }
            }
        } else {
            this.results.push({ 
                test: 'Player Movement', 
                status: 'FAIL', 
                message: 'Player has no physics body' 
            });
        }
    }
    
    async testBackgroundBoundaryIntegration() {
        console.log('Testing background-boundary integration...');
        
        if (!this.scene || !this.scene.backgroundManager || !this.scene.boundarySystem) {
            this.results.push({ 
                test: 'Background-Boundary Integration', 
                status: 'FAIL', 
                message: 'Required systems not available' 
            });
            return;
        }
        
        // Test if background analysis influenced boundary creation
        const backgroundAnalysis = this.scene.backgroundManager.getAnalysis();
        const boundaries = this.scene.boundarySystem.getBoundaries();
        
        if (backgroundAnalysis && boundaries) {
            this.results.push({ 
                test: 'Background-Boundary Integration', 
                status: 'PASS', 
                message: `Background analyzed, ${boundaries.length} boundaries created` 
            });
            
            // Check if visual boundaries were integrated
            const visualBoundaries = this.scene.backgroundManager.getVisualBoundaries();
            const barrierCount = boundaries.filter(b => b.type === 'barrier').length;
            
            if (visualBoundaries && visualBoundaries.length > 0) {
                this.results.push({ 
                    test: 'Visual Boundary Integration', 
                    status: 'PASS', 
                    message: `${visualBoundaries.length} visual boundaries, ${barrierCount} barriers created` 
                });
            } else {
                this.results.push({ 
                    test: 'Visual Boundary Integration', 
                    status: 'INFO', 
                    message: 'No visual boundaries found in background' 
                });
            }
        } else {
            this.results.push({ 
                test: 'Background-Boundary Integration', 
                status: 'FAIL', 
                message: 'Background analysis or boundaries missing' 
            });
        }
    }
    
    async testPerformance() {
        console.log('Testing performance...');
        
        if (!testGame) {
            this.results.push({ test: 'Performance', status: 'FAIL', message: 'Test game not available' });
            return;
        }
        
        // Get current FPS
        const fps = testGame.loop.actualFps;
        const targetFPS = 30;
        
        if (fps >= targetFPS) {
            this.results.push({ 
                test: 'Performance', 
                status: 'PASS', 
                message: `Good performance: ${Math.round(fps)} FPS` 
            });
        } else if (fps >= targetFPS * 0.8) {
            this.results.push({ 
                test: 'Performance', 
                status: 'WARN', 
                message: `Acceptable performance: ${Math.round(fps)} FPS` 
            });
        } else {
            this.results.push({ 
                test: 'Performance', 
                status: 'FAIL', 
                message: `Poor performance: ${Math.round(fps)} FPS` 
            });
        }
        
        // Test memory usage (basic check)
        if (this.scene) {
            const objectCount = this.scene.children.list.length;
            if (objectCount < 100) {
                this.results.push({ 
                    test: 'Memory Usage', 
                    status: 'PASS', 
                    message: `${objectCount} game objects` 
                });
            } else if (objectCount < 500) {
                this.results.push({ 
                    test: 'Memory Usage', 
                    status: 'WARN', 
                    message: `${objectCount} game objects (high)` 
                });
            } else {
                this.results.push({ 
                    test: 'Memory Usage', 
                    status: 'FAIL', 
                    message: `${objectCount} game objects (too many)` 
                });
            }
        }
    }
    
    generateReport() {
        let report = 'INTEGRATION TEST REPORT\n';
        report += '='.repeat(35) + '\n\n';
        
        let passed = 0, failed = 0, warnings = 0, info = 0;
        
        this.results.forEach(result => {
            const status = result.status.padEnd(4);
            report += `[${status}] ${result.test}: ${result.message}\n`;
            
            if (result.status === 'PASS') passed++;
            else if (result.status === 'FAIL') failed++;
            else if (result.status === 'WARN') warnings++;
            else if (result.status === 'INFO') info++;
        });
        
        report += '\n' + '='.repeat(35) + '\n';
        report += `Summary: ${passed} passed, ${failed} failed, ${warnings} warnings, ${info} info\n`;
        
        // Overall assessment
        if (failed === 0 && warnings <= 1) {
            report += 'Overall: EXCELLENT - System ready for production\n';
        } else if (failed === 0) {
            report += 'Overall: GOOD - Minor issues to address\n';
        } else if (failed <= 2) {
            report += 'Overall: NEEDS WORK - Some critical issues\n';
        } else {
            report += 'Overall: CRITICAL - Major issues need fixing\n';
        }
        
        return report;
    }
}

// Global instance
window.integrationTest = new IntegrationTest();