// Main Application Controller
class KalaKiniBooth {
    constructor() {
        this.cameraManager = new CameraManager();
        this.filterManager = new FilterManager();
        this.stripManager = new PhotoStripManager();
        
        this.capturedPhotos = [];
        this.captureCount = 0;
        this.maxCaptures = 3;
        
        this.init();
    }

    init() {
        // Check camera support
        if (!CameraManager.isSupported()) {
            alert('Browser Anda tidak mendukung akses kamera. Silakan gunakan browser modern seperti Chrome, Firefox, atau Safari.');
            return;
        }

        // Bind event listeners
        this.bindEvents();
    }

    bindEvents() {
        // Start camera button
        const startBtn = document.getElementById('startBtn');
        startBtn.addEventListener('click', () => this.startCamera());

        // Capture button
        const captureBtn = document.getElementById('captureBtn');
        captureBtn.addEventListener('click', () => this.capturePhoto());

        // Retake button
        const retakeBtn = document.getElementById('retakeBtn');
        retakeBtn.addEventListener('click', () => this.retakePhotos());

        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filterType = e.target.getAttribute('data-filter');
                this.selectFilter(filterType);
            });
        });

        // Download button
        const downloadBtn = document.getElementById('downloadBtn');
        downloadBtn.addEventListener('click', () => this.downloadStrip());

        // New photo button
        const newPhotoBtn = document.getElementById('newPhotoBtn');
        newPhotoBtn.addEventListener('click', () => this.startNewPhoto());
    }

    async startCamera() {
        const startBtn = document.getElementById('startBtn');
        startBtn.disabled = true;
        startBtn.textContent = '⏳ Memuat kamera...';

        const success = await this.cameraManager.initCamera();

        if (success) {
            startBtn.style.display = 'none';
            document.getElementById('captureBtn').style.display = 'block';
            document.getElementById('filterSelection').style.display = 'block';
            this.updateCaptureIndicator();
        } else {
            startBtn.disabled = false;
            startBtn.textContent = '🎥 Mulai Kamera';
        }
    }

    capturePhoto() {
        if (this.captureCount >= this.maxCaptures) {
            return;
        }

        const photoData = this.cameraManager.capturePhoto();
        
        if (photoData) {
            this.capturedPhotos.push(photoData);
            this.captureCount++;
            this.updateCaptureIndicator();
            this.updatePhotoGallery();

            // If we have 3 photos, generate strip
            if (this.captureCount === this.maxCaptures) {
                this.generatePhotoStrip();
            }
        }
    }

    updateCaptureIndicator() {
        const indicator = document.getElementById('captureCount');
        indicator.textContent = `${this.captureCount} / ${this.maxCaptures}`;
    }

    updatePhotoGallery() {
        const gallery = document.getElementById('photoGallery');
        gallery.innerHTML = '';

        this.capturedPhotos.forEach((photoData, index) => {
            const img = document.createElement('img');
            img.src = photoData;
            img.alt = `Foto ${index + 1}`;
            gallery.appendChild(img);
        });

        if (this.capturedPhotos.length > 0) {
            document.getElementById('capturedPhotos').style.display = 'block';
        }
    }

    selectFilter(filterType) {
        // Update active button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-filter') === filterType) {
                btn.classList.add('active');
            }
        });

        // Apply filter
        this.filterManager.startAnimatedFilter(filterType);
    }

    async generatePhotoStrip() {
        // Stop camera
        this.cameraManager.stopCamera();

        // Hide camera section
        document.getElementById('cameraSection').style.display = 'none';

        // Add photos to strip manager
        this.stripManager.clearPhotos();
        this.capturedPhotos.forEach(photo => {
            this.stripManager.addPhoto(photo);
        });

        // Generate strip
        await this.stripManager.generateStrip(this.filterManager);

        // Show strip section
        document.getElementById('stripSection').style.display = 'block';
    }

    downloadStrip() {
        this.stripManager.downloadStrip();
        
        // Show success message
        const downloadBtn = document.getElementById('downloadBtn');
        const originalText = downloadBtn.textContent;
        downloadBtn.textContent = '✅ Terunduh!';
        downloadBtn.disabled = true;
        
        setTimeout(() => {
            downloadBtn.textContent = originalText;
            downloadBtn.disabled = false;
        }, 2000);
    }

    retakePhotos() {
        this.capturedPhotos = [];
        this.captureCount = 0;
        this.stripManager.clearPhotos();
        
        // Hide strip section and photo gallery
        document.getElementById('stripSection').style.display = 'none';
        document.getElementById('capturedPhotos').style.display = 'none';
        
        // Show camera section and restart camera
        document.getElementById('cameraSection').style.display = 'block';
        this.startCamera();
    }

    startNewPhoto() {
        // Reset everything
        this.capturedPhotos = [];
        this.captureCount = 0;
        this.stripManager.clearPhotos();
        this.filterManager.stopAnimatedFilter();
        
        // Hide sections
        document.getElementById('stripSection').style.display = 'none';
        document.getElementById('capturedPhotos').style.display = 'none';
        
        // Reset buttons
        document.getElementById('startBtn').style.display = 'block';
        document.getElementById('startBtn').disabled = false;
        document.getElementById('startBtn').textContent = '🎥 Mulai Kamera';
        document.getElementById('captureBtn').style.display = 'none';
        document.getElementById('filterSelection').style.display = 'none';
        
        // Reset filter selection
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('.filter-btn[data-filter="none"]').classList.add('active');
        
        // Show camera section
        document.getElementById('cameraSection').style.display = 'block';
        
        // Stop camera if running
        this.cameraManager.stopCamera();
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.kalaKiniBooth = new KalaKiniBooth();
});