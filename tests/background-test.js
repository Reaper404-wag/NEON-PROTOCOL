// Background Testing Module
class BackgroundTest {
    constructor() {
        this.results = [];
        this.scene = null;
    }
    
    setScene(scene) {
        this.scene = scene;
    }
    
    async runAllTests() {
        this.results = [];
        
        await this.testBackgroundLoading();
        await this.testBackgroundDisplay();
        await this.testBackgroundScaling();
        await this.testBackgroundPosition();
        
        return this.results;
    }
    
    async testBackgroundLoading() {
        console.log('Testing background loading...');
        
        if (!this.scene) {
            this.results.push({ test: 'Background Loading', status: 'FAIL', message: 'No scene available' });
            return;
        }
        
        // Check if background texture is loaded
        const texture = this.scene.textures.get('background');
        if (texture && texture.source && texture.source.length > 0) {
            const source = texture.source[0];
            this.results.push({ 
                test: 'Background Loading', 
                status: 'PASS', 
                message: `Loaded: ${source.width}x${source.height}px` 
            });
        } else {
            this.results.push({ 
                test: 'Background Loading', 
                status: 'FAIL', 
                message: 'Background texture not loaded' 
            });
        }
    }
    
    async testBackgroundDisplay() {
        console.log('Testing background display...');
        
        if (!this.scene || !this.scene.background) {
            this.results.push({ test: 'Background Display', status: 'FAIL', message: 'Background sprite not created' });
            return;
        }
        
        const bg = this.scene.background;
        
        // Check visibility
        if (bg.visible) {
            this.results.push({ test: 'Background Display', status: 'PASS', message: 'Background is visible' });
        } else {
            this.results.push({ test: 'Background Display', status: 'FAIL', message: 'Background is not visible' });
        }
        
        // Check alpha
        if (bg.alpha > 0) {
            this.results.push({ test: 'Background Alpha', status: 'PASS', message: `Alpha: ${bg.alpha}` });
        } else {
            this.results.push({ test: 'Background Alpha', status: 'FAIL', message: 'Background is transparent' });
        }
    }
    
    async testBackgroundScaling() {
        console.log('Testing background scaling...');
        
        if (!this.scene || !this.scene.background) {
            this.results.push({ test: 'Background Scaling', status: 'FAIL', message: 'Background sprite not available' });
            return;
        }
        
        const bg = this.scene.background;
        const camera = this.scene.cameras.main;
        
        // Check if background covers the screen
        const bgWidth = bg.width * bg.scaleX;
        const bgHeight = bg.height * bg.scaleY;
        
        if (bgWidth >= camera.width && bgHeight >= camera.height) {
            this.results.push({ 
                test: 'Background Scaling', 
                status: 'PASS', 
                message: `Covers screen: ${Math.round(bgWidth)}x${Math.round(bgHeight)}` 
            });
        } else {
            this.results.push({ 
                test: 'Background Scaling', 
                status: 'WARN', 
                message: `May not cover screen: ${Math.round(bgWidth)}x${Math.round(bgHeight)}` 
            });
        }
    }
    
    async testBackgroundPosition() {
        console.log('Testing background position...');
        
        if (!this.scene || !this.scene.background) {
            this.results.push({ test: 'Background Position', status: 'FAIL', message: 'Background sprite not available' });
            return;
        }
        
        const bg = this.scene.background;
        const camera = this.scene.cameras.main;
        
        // Check if background is centered
        const centerX = camera.width / 2;
        const centerY = camera.height / 2;
        
        const deltaX = Math.abs(bg.x - centerX);
        const deltaY = Math.abs(bg.y - centerY);
        
        if (deltaX < 10 && deltaY < 10) {
            this.results.push({ 
                test: 'Background Position', 
                status: 'PASS', 
                message: `Centered at ${Math.round(bg.x)}, ${Math.round(bg.y)}` 
            });
        } else {
            this.results.push({ 
                test: 'Background Position', 
                status: 'WARN', 
                message: `Off-center: ${Math.round(bg.x)}, ${Math.round(bg.y)}` 
            });
        }
    }
    
    generateReport() {
        let report = 'BACKGROUND TEST REPORT\n';
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
window.backgroundTest = new BackgroundTest();