// Filters Module
class FilterManager {
    constructor() {
        this.currentFilter = 'none';
        this.filterOverlay = document.getElementById('filterOverlay');
        this.animationInterval = null;
    }

    // Apply filter to image (for beauty filters)
    applyImageFilter(imageData, filterType) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        return new Promise((resolve) => {
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                const imageDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageDataObj.data;

                switch (filterType) {
                    case 'vintage':
                        this.applyVintageFilter(data);
                        break;
                    case 'bright':
                        this.applyBrightFilter(data);
                        break;
                    case 'smooth':
                        this.applySmoothFilter(ctx, canvas.width, canvas.height);
                        break;
                }

                if (filterType !== 'smooth') {
                    ctx.putImageData(imageDataObj, 0, 0);
                }

                resolve(canvas.toDataURL('image/jpeg', 0.95));
            };
            img.src = imageData;
        });
    }

    // Apply vintage/sepia filter
    applyVintageFilter(data) {
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // Sepia tone
            data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
            data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
            data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));

            // Add slight contrast
            data[i] = Math.min(255, data[i] * 1.1);
            data[i + 1] = Math.min(255, data[i + 1] * 1.05);
            data[i + 2] = Math.min(255, data[i + 2] * 0.9);
        }
    }

    // Apply bright filter
    applyBrightFilter(data) {
        for (let i = 0; i < data.length; i += 4) {
            // Increase brightness
            data[i] = Math.min(255, data[i] * 1.3);     // Red
            data[i + 1] = Math.min(255, data[i + 1] * 1.3); // Green
            data[i + 2] = Math.min(255, data[i + 2] * 1.3); // Blue
        }
    }

    // Apply smooth/beauty filter (blur effect)
    applySmoothFilter(ctx, width, height) {
        ctx.filter = 'blur(0.5px)';
        ctx.globalAlpha = 0.7;
        ctx.drawImage(ctx.canvas, 0, 0);
        ctx.filter = 'none';
        ctx.globalAlpha = 1.0;

        // Add slight brightness
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * 1.1);
            data[i + 1] = Math.min(255, data[i + 1] * 1.1);
            data[i + 2] = Math.min(255, data[i + 2] * 1.1);
        }
        ctx.putImageData(imageData, 0, 0);
    }

    // Start animated overlay filter
    startAnimatedFilter(filterType) {
        this.stopAnimatedFilter();
        this.currentFilter = filterType;

        if (filterType === 'none') {
            return;
        }

        switch (filterType) {
            case 'hearts':
                this.startHeartsAnimation();
                break;
            case 'stars':
                this.startStarsAnimation();
                break;
            case 'sparkles':
                this.startSparklesAnimation();
                break;
        }
    }

    // Hearts animation
    startHeartsAnimation() {
        const createHeart = () => {
            const heart = document.createElement('div');
            heart.className = 'heart-animation';
            heart.textContent = '💕';
            heart.style.left = Math.random() * 100 + '%';
            heart.style.animationDuration = (Math.random() * 2 + 2) + 's';
            this.filterOverlay.appendChild(heart);

            setTimeout(() => {
                heart.remove();
            }, 4000);
        };

        // Create hearts periodically
        this.animationInterval = setInterval(createHeart, 300);
        createHeart(); // Initial heart
    }

    // Stars animation
    startStarsAnimation() {
        const createStar = () => {
            const star = document.createElement('div');
            star.className = 'star-animation';
            star.textContent = '⭐';
            star.style.left = Math.random() * 100 + '%';
            star.style.animationDuration = (Math.random() * 2 + 3) + 's';
            this.filterOverlay.appendChild(star);

            setTimeout(() => {
                star.remove();
            }, 5000);
        };

        this.animationInterval = setInterval(createStar, 400);
        createStar();
    }

    // Sparkles animation
    startSparklesAnimation() {
        const createSparkle = () => {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle-animation';
            sparkle.classList.add('sparkle-' + (Math.floor(Math.random() * 4) + 1));
            sparkle.textContent = '✨';
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.top = Math.random() * 100 + '%';
            sparkle.style.animationDuration = (Math.random() * 1 + 1.5) + 's';
            this.filterOverlay.appendChild(sparkle);

            setTimeout(() => {
                sparkle.remove();
            }, 3000);
        };

        this.animationInterval = setInterval(createSparkle, 200);
        
        // Create multiple sparkles
        for (let i = 0; i < 5; i++) {
            setTimeout(createSparkle, i * 200);
        }
    }

    // Stop animated filter
    stopAnimatedFilter() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
        this.filterOverlay.innerHTML = '';
    }

    // Get current filter type
    getCurrentFilter() {
        return this.currentFilter;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FilterManager;
}