#!/usr/bin/env python3
"""
KalaKini Booth - Image Processor (Optional Offline Processing)
Script Python untuk pemrosesan gambar offline menggunakan Pillow
"""

from PIL import Image, ImageFilter, ImageEnhance
import sys
import os


def apply_vintage_filter(image_path):
    """Apply vintage/sepia filter to image"""
    img = Image.open(image_path)
    
    # Convert to RGB if necessary
    if img.mode != 'RGB':
        img = img.convert('RGB')
    
    # Apply sepia tone
    width, height = img.size
    pixels = img.load()
    
    for y in range(height):
        for x in range(width):
            r, g, b = pixels[x, y]
            
            # Sepia transformation
            tr = int(0.393 * r + 0.769 * g + 0.189 * b)
            tg = int(0.349 * r + 0.686 * g + 0.168 * b)
            tb = int(0.272 * r + 0.534 * g + 0.131 * b)
            
            pixels[x, y] = (min(255, tr), min(255, tg), min(255, tb))
    
    # Enhance contrast slightly
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(1.1)
    
    return img


def apply_bright_filter(image_path):
    """Apply bright filter to image"""
    img = Image.open(image_path)
    
    if img.mode != 'RGB':
        img = img.convert('RGB')
    
    # Increase brightness
    enhancer = ImageEnhance.Brightness(img)
    img = enhancer.enhance(1.3)
    
    # Increase contrast slightly
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(1.1)
    
    return img


def apply_smooth_filter(image_path):
    """Apply smooth/beauty filter to image"""
    img = Image.open(image_path)
    
    if img.mode != 'RGB':
        img = img.convert('RGB')
    
    # Apply slight blur for smoothing
    img = img.filter(ImageFilter.GaussianBlur(radius=0.5))
    
    # Increase brightness slightly
    enhancer = ImageEnhance.Brightness(img)
    img = enhancer.enhance(1.1)
    
    return img


def generate_strip(image_paths, output_path, strip_width=600, photo_height=400, border=5):
    """Generate 3-strip photo layout from 3 images"""
    if len(image_paths) != 3:
        raise ValueError("Need exactly 3 images for strip")
    
    # Load and process images
    images = []
    for path in image_paths:
        img = Image.open(path)
        
        # Convert to RGB if necessary
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Resize maintaining aspect ratio
        aspect_ratio = img.width / img.height
        new_width = strip_width - (border * 2)
        new_height = new_width / aspect_ratio
        
        if new_height > photo_height:
            new_height = photo_height
            new_width = new_height * aspect_ratio
        
        img = img.resize((int(new_width), int(new_height)), Image.Resampling.LANCZOS)
        images.append(img)
    
    # Calculate strip dimensions
    strip_height = (photo_height * 3) + (border * 4)
    
    # Create strip canvas
    strip = Image.new('RGB', (strip_width, strip_height), 'white')
    
    # Paste images
    current_y = border
    for img in images:
        x = (strip_width - img.width) // 2
        y = current_y + (photo_height - img.height) // 2
        strip.paste(img, (x, y))
        current_y += photo_height + border
    
    # Save strip
    strip.save(output_path, 'PNG', quality=95)
    print(f"Photo strip saved to: {output_path}")
    
    return strip


def main():
    """Main function for command line usage"""
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python image_processor.py vintage <input> <output>")
        print("  python image_processor.py bright <input> <output>")
        print("  python image_processor.py smooth <input> <output>")
        print("  python image_processor.py strip <img1> <img2> <img3> <output>")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == 'vintage':
        if len(sys.argv) != 4:
            print("Usage: python image_processor.py vintage <input> <output>")
            sys.exit(1)
        img = apply_vintage_filter(sys.argv[2])
        img.save(sys.argv[3], 'PNG')
        print(f"Vintage filter applied. Saved to: {sys.argv[3]}")
    
    elif command == 'bright':
        if len(sys.argv) != 4:
            print("Usage: python image_processor.py bright <input> <output>")
            sys.exit(1)
        img = apply_bright_filter(sys.argv[2])
        img.save(sys.argv[3], 'PNG')
        print(f"Bright filter applied. Saved to: {sys.argv[3]}")
    
    elif command == 'smooth':
        if len(sys.argv) != 4:
            print("Usage: python image_processor.py smooth <input> <output>")
            sys.exit(1)
        img = apply_smooth_filter(sys.argv[2])
        img.save(sys.argv[3], 'PNG')
        print(f"Smooth filter applied. Saved to: {sys.argv[3]}")
    
    elif command == 'strip':
        if len(sys.argv) != 6:
            print("Usage: python image_processor.py strip <img1> <img2> <img3> <output>")
            sys.exit(1)
        generate_strip(sys.argv[2:5], sys.argv[5])
    
    else:
        print(f"Unknown command: {command}")
        sys.exit(1)


if __name__ == '__main__':
    main()