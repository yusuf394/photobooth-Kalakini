# KalaKini Booth ✨

Website Photobooth dengan desain hangat & blucu untuk menangkap kenangan masa kini.

## Fitur

- 📸 Akses kamera (laptop & HP)
- 🎨 Filter animasi bergerak (Hearts, Stars, Sparkles)
- 💅 Beauty filters (Vintage, Bright, Smooth)
- 📷 Generate 3-strip photo (3 foto vertikal dalam 1 file)
- 💾 Download hasil langsung
- 🌐 Responsive design (desktop & mobile)
- 🇮🇩 UI Bahasa Indonesia

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Node.js dengan Express.js
- **Image Processing**: Canvas API (browser-side)
- **Python**: Script opsional untuk offline processing (Pillow)

## Instalasi

### 1. Install Dependencies

```bash
npm install
```

### 2. Jalankan Server

```bash
npm start
```

Atau untuk development dengan auto-reload:

```bash
npm run dev
```

### 3. Buka Browser

Buka browser dan kunjungi: `http://localhost:3000`

## Cara Menggunakan

1. Klik tombol "🎥 Mulai Kamera" untuk mengaktifkan kamera
2. Pilih filter yang diinginkan (jika ada)
3. Klik "📸 Ambil Foto" sebanyak 3 kali
4. Hasil 3-strip photo akan otomatis di-generate
5. Klik "💾 Download Photo Strip" untuk mengunduh hasil
6. Klik "📷 Foto Baru" untuk mengambil foto baru

## Filter yang Tersedia

### Animasi Bergerak:
- 💕 **Hearts**: Animasi hati berjatuhan
- ⭐ **Stars**: Animasi bintang berjatuhan
- ✨ **Sparkles**: Animasi kilauan

### Beauty Filters:
- 📷 **Vintage**: Efek sepia/vintage
- ☀️ **Bright**: Peningkatan kecerahan
- 🌸 **Smooth**: Efek halus/smooth skin

## Python Script (Opsional)

Script Python tersedia untuk pemrosesan gambar offline:

### Install Dependencies Python:

```bash
pip install Pillow
```

### Usage:

```bash
# Apply vintage filter
python python/image_processor.py vintage input.jpg output.jpg

# Apply bright filter
python python/image_processor.py bright input.jpg output.jpg

# Apply smooth filter
python python/image_processor.py smooth input.jpg output.jpg

# Generate 3-strip photo
python python/image_processor.py strip img1.jpg img2.jpg img3.jpg output.png
```

## Browser Compatibility

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari (iOS 11+)
- ✅ Opera

**Note**: Pastikan browser mendukung:
- MediaDevices API (untuk akses kamera)
- Canvas API (untuk image processing)

## Struktur Proyek

```
Web Photobooth/
├── public/
│   ├── index.html              # Halaman utama
│   ├── css/
│   │   ├── style.css          # Styling utama
│   │   └── animations.css     # Animasi filter
│   ├── js/
│   │   ├── app.js             # Controller utama
│   │   ├── camera.js          # Module kamera
│   │   ├── filters.js         # Module filter
│   │   └── photostrip.js      # Module photo strip
│   └── assets/                # Assets (optional)
├── server/
│   └── server.js              # Express server
├── python/
│   └── image_processor.py     # Python image processor
├── package.json
└── README.md
```

## Troubleshooting

### Kamera tidak bisa diakses
- Pastikan browser memiliki izin akses kamera
- Pastikan kamera tidak sedang digunakan aplikasi lain
- Coba refresh halaman dan izinkan akses kamera

### Filter tidak muncul
- Pastikan browser mendukung CSS animations
- Cek console browser untuk error messages

### Download tidak bekerja
- Pastikan browser mengizinkan download
- Cek pop-up blocker settings

## License

ISC

## Dibuat dengan ❤️

Untuk kenangan hangatmu di masa kini ✨
