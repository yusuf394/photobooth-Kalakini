// Photo Strip Module
class PhotoStripManager {
    constructor() {
        this.stripCanvas = document.getElementById('stripCanvas');
        this.photos = [];
    }

    // Add photo to strip
    addPhoto(photoData) {
        this.photos.push(photoData);
    }

    // Clear all photos
    clearPhotos() {
        this.photos = [];
    }

    // Generate 3-strip photo layout
    async generateStrip(filterManager) {
        if (this.photos.length !== 3) {
            console.error('Need exactly 3 photos for strip');
            return null;
        }

        // Process photos with selected filter
        const processedPhotos = [];
        const currentFilter = filterManager.getCurrentFilter();

        for (let i = 0; i < this.photos.length; i++) {
            let processedPhoto = this.photos[i];
            
            // Apply image filter if beauty filter is selected
            if (currentFilter === 'vintage' || currentFilter === 'bright' || currentFilter === 'smooth') {
                processedPhoto = await filterManager.applyImageFilter(this.photos[i], currentFilter);
            }
            
            processedPhotos.push(processedPhoto);
        }

        // Calculate strip dimensions
        const stripWidth = 600; // Standard photobooth strip width
        const photoHeight = 400; // Height of each photo
        const borderWidth = 5; // Border between photos
        const stripHeight = (photoHeight * 3) + (borderWidth * 4); // 3 photos + borders

        // Set canvas size
        this.stripCanvas.width = stripWidth;
        this.stripCanvas.height = stripHeight;

        const ctx = this.stripCanvas.getContext('2d');
        
        // Fill white background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, stripWidth, stripHeight);

        // Draw each photo
        let currentY = borderWidth;

        for (let i = 0; i < processedPhotos.length; i++) {
            const img = await this.loadImage(processedPhotos[i]);
            
            // Calculate dimensions to fit within strip width while maintaining aspect ratio
            const aspectRatio = img.width / img.height;
            let drawWidth = stripWidth - (borderWidth * 2);
            let drawHeight = drawWidth / aspectRatio;

            // If height is too large, scale down
            if (drawHeight > photoHeight) {
                drawHeight = photoHeight;
                drawWidth = drawHeight * aspectRatio;
            }

            // Center horizontally
            const x = (stripWidth - drawWidth) / 2;

            // Draw white border/background for photo
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(borderWidth, currentY, stripWidth - (borderWidth * 2), photoHeight);

            // Draw photo
            ctx.drawImage(img, x, currentY + (photoHeight - drawHeight) / 2, drawWidth, drawHeight);

            // Draw border line
            ctx.strokeStyle = '#FF6B6B';
            ctx.lineWidth = borderWidth;
            ctx.strokeRect(borderWidth, currentY, stripWidth - (borderWidth * 2), photoHeight);

            currentY += photoHeight + borderWidth;
        }

        // Add branding text at the bottom
        ctx.fillStyle = '#FF6B6B';
        ctx.font = 'bold 20px Nunito';
        ctx.textAlign = 'center';
        ctx.fillText('✨ KalaKini Booth ✨', stripWidth / 2, stripHeight - 15);

        return this.stripCanvas.toDataURL('image/png', 1.0);
    }

    // Load image from data URL
    loadImage(dataUrl) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = dataUrl;
        });
    }

    // Download strip as file
    downloadStrip(filename = null) {
        if (!filename) {
            const now = new Date();
            const dateStr = now.toISOString().slice(0, 19).replace(/:/g, '-');
            filename = `kalakini-booth-${dateStr}.png`;
        }

        // Create download link
        const link = document.createElement('a');
        link.download = filename;
        link.href = this.stripCanvas.toDataURL('image/png', 1.0);
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Get strip data URL
    getStripDataURL() {
        return this.stripCanvas.toDataURL('image/png', 1.0);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PhotoStripManager;
}