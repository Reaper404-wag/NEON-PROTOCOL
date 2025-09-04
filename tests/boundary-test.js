// Boundary Testing Module
class BoundaryTest {
    constructor() {
        this.results = [];
        this.scene = null;
    }
    
    setScene(scene) {
        this.scene = scene;
    }
    
    async runAllTests() {
        this.results = [];
        
        await this.testBoundaryCreation();
        await this.testPlayerCollision();
        await this.testBoundaryConstraints();
        await this.testVisualBarriers();
        
        return this.results;
    }
    
    async testBoundaryCreation() {
        console.log('Testing boundary creation...');
        
        if (!this.scene || !this.scene.boundarySystem) {
            this.results.push({ test: 'Boundary Creation', status: 'FAIL', message: 'BoundarySystem not available' });
            return;
        }
        
        const boundarySystem = this.scene.boundarySystem;
        const boundaries = boundarySystem.getBoundaries();
        
        if (boundaries && boundaries.length > 0) {
            this.results.push({ 
                test: 'Boundary Creation', 
                status: 'PASS', 
                message: `Created ${boundaries.length} boundaries` 
            });
            
            // Check for basic walls (top, bottom, left, right)
            const wallTypes = boundaries.map(b => b.name);
            const expectedWalls = ['top', 'bottom', 'left', 'right'];
            const hasAllWalls = expectedWalls.every(wall => wallTypes.includes(wall));
            
            if (hasAllWalls) {
                this.results.push({ 
                    test: 'Basic Walls', 
                    status: 'PASS', 
                    message: 'All basic walls created' 
                });
            } else {
                this.results.push({ 
                    test: 'Basic Walls', 
                    status: 'FAIL', 
                    message: `Missing walls: ${expectedWalls.filter(w => !wallTypes.includes(w)).join(', ')}` 
                });
            }
        } else {
            this.results.push({ 
                test: 'Boundary Creation', 
                status: 'FAIL', 
                message: 'No boundaries created' 
            });
        }
    }
    
    async testPlayerCollision() {
        console.log('Testing player collision...');
        
        if (!this.scene || !this.scene.player || !this.scene.boundarySystem) {
            this.results.push({ test: 'Player Collision', status: 'FAIL', message: 'Player or BoundarySystem not available' });
            return;
        }
        
        const player = this.scene.player;
        
        // Check if player has physics body
        if (player.body) {
            this.results.push({ 
                test: 'Player Physics', 
                status: 'PASS', 
                message: 'Player has physics body' 
            });
            
            // Check world bounds collision
            if (player.body.collideWorldBounds) {
                this.results.push({ 
                    test: 'World Bounds Collision', 
                    status: 'PASS', 
                    message: 'World bounds collision enabled' 
                });
            } else {
                this.results.push({ 
                    test: 'World Bounds Collision', 
                    status: 'WARN', 
                    message: 'World bounds collision disabled' 
                });
            }
        } else {
            this.results.push({ 
                test: 'Player Physics', 
                status: 'FAIL', 
                message: 'Player has no physics body' 
            });
        }
    }
    
    async testBoundaryConstraints() {
        console.log('Testing boundary constraints...');
        
        if (!this.scene || !this.scene.boundarySystem) {
            this.results.push({ test: 'Boundary Constraints', status: 'FAIL', message: 'BoundarySystem not available' });
            return;
        }
        
        const boundarySystem = this.scene.boundarySystem;
        const bounds = boundarySystem.getBounds();
        
        // Test constraint function
        const testPositions = [
            { x: -100, y: 300, expected: 'constrained' },
            { x: 1500, y: 300, expected: 'constrained' },
            { x: 400, y: -100, expected: 'constrained' },
            { x: 400, y: 1000, expected: 'constrained' },
            { x: 400, y: 300, expected: 'within bounds' }
        ];
        
        let constraintTests = 0;
        let constraintPassed = 0;
        
        testPositions.forEach(pos => {
            constraintTests++;
            const constrained = boundarySystem.constrainPosition(pos.x, pos.y);
            const isWithinBounds = boundarySystem.isWithinBounds(constrained.x, constrained.y);
            
            if (pos.expected === 'within bounds' && isWithinBounds) {
                constraintPassed++;
            } else if (pos.expected === 'constrained' && isWithinBounds) {
                constraintPassed++;
            }
        });
        
        if (constraintPassed === constraintTests) {
            this.results.push({ 
                test: 'Boundary Constraints', 
                status: 'PASS', 
                message: `All ${constraintTests} constraint tests passed` 
            });
        } else {
            this.results.push({ 
                test: 'Boundary Constraints', 
                status: 'FAIL', 
                message: `${constraintPassed}/${constraintTests} constraint tests passed` 
            });
        }
    }
    
    async testVisualBarriers() {
        console.log('Testing visual barriers...');
        
        if (!this.scene || !this.scene.boundarySystem) {
            this.results.push({ test: 'Visual Barriers', status: 'FAIL', message: 'BoundarySystem not available' });
            return;
        }
        
        const boundarySystem = this.scene.boundarySystem;
        const boundaries = boundarySystem.getBoundaries();
        
        // Count different types of boundaries
        const wallCount = boundaries.filter(b => b.type === 'wall').length;
        const barrierCount = boundaries.filter(b => b.type === 'barrier').length;
        
        this.results.push({ 
            test: 'Visual Barriers', 
            status: 'PASS', 
            message: `Found ${wallCount} walls and ${barrierCount} barriers` 
        });
        
        // Test if barriers have valid dimensions
        const invalidBarriers = boundaries.filter(b => 
            b.width <= 0 || b.height <= 0 || 
            isNaN(b.x) || isNaN(b.y)
        );
        
        if (invalidBarriers.length === 0) {
            this.results.push({ 
                test: 'Barrier Validity', 
                status: 'PASS', 
                message: 'All barriers have valid dimensions' 
            });
        } else {
            this.results.push({ 
                test: 'Barrier Validity', 
                status: 'WARN', 
                message: `${invalidBarriers.length} barriers have invalid dimensions` 
            });
        }
    }
    
    generateReport() {
        let report = 'BOUNDARY TEST REPORT\n';
        report += '='.repeat(30) + '\n\n';
        
        let passed = 0, failed = 0, warnings = 0;
        
        this.results.forEach(result => {
            const status = result.status.padEnd(4);
            report += `[${status}] ${result.test}: ${result.message}\n`;
            
            if (result.status === 'PASS') passed++;
            else if (result.status === 'FAIL') failed++;
            else if (result.status === 'WARN') warnings++;
        });
        
        report += '\n' + '='.repeat(30) + '\n';
        report += `Summary: ${passed} passed, ${failed} failed, ${warnings} warnings\n`;
        
        return report;
    }
}

// Global instance
window.boundaryTest = new BoundaryTest();