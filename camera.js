// Camera Module
class CameraManager {
    constructor() {
        this.videoElement = document.getElementById('videoElement');
        this.previewCanvas = document.getElementById('previewCanvas');
        this.stream = null;
        this.isCameraActive = false;
    }

    // Initialize camera
    async initCamera() {
        try {
            // Request camera access
            const constraints = {
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'user' // Front camera on mobile
                }
            };

            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.videoElement.srcObject = this.stream;
            this.isCameraActive = true;

            // Set canvas size to match video
            this.videoElement.addEventListener('loadedmetadata', () => {
                this.previewCanvas.width = this.videoElement.videoWidth;
                this.previewCanvas.height = this.videoElement.videoHeight;
            });

            return true;
        } catch (error) {
            console.error('Error accessing camera:', error);
            this.handleCameraError(error);
            return false;
        }
    }

    // Handle camera errors
    handleCameraError(error) {
        let errorMessage = 'Tidak dapat mengakses kamera. ';

        if (error.name === 'NotAllowedError') {
            errorMessage += 'Silakan izinkan akses kamera di pengaturan browser.';
        } else if (error.name === 'NotFoundError') {
            errorMessage += 'Kamera tidak ditemukan.';
        } else if (error.name === 'NotReadableError') {
            errorMessage += 'Kamera sedang digunakan oleh aplikasi lain.';
        } else {
            errorMessage += 'Terjadi kesalahan: ' + error.message;
        }

        alert(errorMessage);
    }

    // Capture photo from video
    capturePhoto() {
        if (!this.isCameraActive || !this.videoElement.readyState) {
            console.error('Camera not ready');
            return null;
        }

        const ctx = this.previewCanvas.getContext('2d');
        
        // Draw current video frame to canvas
        ctx.drawImage(this.videoElement, 0, 0, this.previewCanvas.width, this.previewCanvas.height);
        
        // Convert canvas to image data URL
        return this.previewCanvas.toDataURL('image/jpeg', 0.95);
    }

    // Stop camera
    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
            this.videoElement.srcObject = null;
            this.isCameraActive = false;
        }
    }

    // Switch camera (front/back on mobile)
    async switchCamera() {
        if (!this.stream) return false;

        const currentFacingMode = this.stream.getVideoTracks()[0].getSettings().facingMode;
        const newFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';

        this.stopCamera();

        try {
            const constraints = {
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: newFacingMode
                }
            };

            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.videoElement.srcObject = this.stream;
            this.isCameraActive = true;

            return true;
        } catch (error) {
            console.error('Error switching camera:', error);
            return false;
        }
    }

    // Check if camera is supported
    static isSupported() {
        return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CameraManager;
}