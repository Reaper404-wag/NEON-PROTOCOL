// Штурмовик с Canvas GIF анимацией
class CanvasGifAssaultEnemy extends Enemy {
    constructor(scene, x, y) {
        // Используем fallback спрайт для физики
        super(scene, x, y, 'assault');
        
        this.scene = scene;
        this.enemyType = 'assault';
        
        // Параметры штурмовика
        this.maxHealth = 30;
        this.health = this.maxHealth;
        this.damage = 5;
        this.speed = 150;
        this.fireRate = 800;
        this.score = 10;
        this.attackRange = 270; // Увеличено в 1.5 раза для соответствия другим классам штурмовика
        
        // Делаем базовый спрайт невидимым
        this.setAlpha(0);
        this.setScale(1.2);
        
        // Создаем img элемент для загрузки GIF
        this.gifImage = new Image();
        this.gifImage.crossOrigin = "anonymous";
        this.gifLoaded = false;
        
        this.gifImage.onload = () => {
            console.log('GIF loaded for canvas rendering');
            this.gifLoaded = true;
        };
        
        this.gifImage.onerror = (error) => {
            console.error('Failed to load GIF:', error);
        };
        
        // Загружаем GIF
        this.gifImage.src = 'image/character/shturm.gif';
        
        console.log('Created Canvas GIF Assault Enemy');
    }
    
    // Переопределяем метод отрисовки
    renderWebGL(renderer, src, camera, parentMatrix) {
        // Если GIF не загружен, используем стандартную отрисовку
        if (!this.gifLoaded) {
            super.renderWebGL(renderer, src, camera, parentMatrix);
            return;
        }
        
        // Получаем контекст canvas
        const canvas = renderer.canvas;
        const context = canvas.getContext('2d');
        
        if (context && this.active && this.visible) {
            // Сохраняем состояние контекста
            context.save();
            
            // Применяем трансформации камеры
            const tx = this.x - camera.scrollX;
            const ty = this.y - camera.scrollY;
            
            // Позиционируем и масштабируем
            context.translate(tx, ty);
            context.scale(this.scaleX, this.scaleY);
            context.rotate(this.rotation);
            
            // Рисуем GIF (он будет анимированным автоматически)
            const width = 48;
            const height = 48;
            context.drawImage(this.gifImage, -width/2, -height/2, width, height);
            
            // Восстанавливаем состояние контекста
            context.restore();
        }
    }
    
    // Для Canvas renderer
    renderCanvas(renderer, src, camera, parentMatrix) {
        this.renderWebGL(renderer, src, camera, parentMatrix);
    }
}
