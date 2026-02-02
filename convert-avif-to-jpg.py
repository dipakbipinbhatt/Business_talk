"""
Script to convert AVIF images to JPG format for upcoming podcast thumbnails.
This script:
1. Reads all AVIF images from "New folder (7)"
2. Converts them to JPG format
3. Saves them to frontend/public/uploads with sanitized filenames
"""

import os
import re
from pathlib import Path

try:
    import pillow_avif  # This registers AVIF support with PIL
except ImportError:
    print("Installing pillow-avif-plugin...")
    os.system("pip install pillow-avif-plugin")
    import pillow_avif

from PIL import Image

# Paths
SOURCE_DIR = Path(r"c:\Users\vrajr\Desktop\Dipak-bhatt\New folder (7)")
DEST_DIR = Path(r"c:\Users\vrajr\Desktop\Dipak-bhatt\frontend\public\uploads")

# Ensure destination exists
DEST_DIR.mkdir(parents=True, exist_ok=True)

def sanitize_filename(name):
    """Convert filename to a clean, web-safe format."""
    # Remove file extension
    name = os.path.splitext(name)[0]
    
    # Remove common suffixes
    name = re.sub(r'\s*-\s*YouTube\s*&\s*Website.*$', '', name, flags=re.IGNORECASE)
    name = re.sub(r'\s*\(\d+\)$', '', name)  # Remove (1), (2), etc.
    
    # Clean up special characters
    name = name.replace('_', ' ').strip()
    
    # Convert to lowercase and replace spaces with hyphens
    name = name.lower().replace(' ', '-')
    
    # Remove any remaining special characters
    name = re.sub(r'[^a-z0-9\-]', '', name)
    
    # Remove multiple hyphens
    name = re.sub(r'-+', '-', name)
    
    return name.strip('-')

def convert_avif_to_jpg(source_path, dest_path):
    """Convert an AVIF image to JPG format."""
    try:
        with Image.open(source_path) as img:
            # Convert to RGB if necessary (AVIF might be RGBA)
            if img.mode in ('RGBA', 'LA', 'P'):
                # Create white background
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = background
            elif img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Save as JPG with high quality
            img.save(dest_path, 'JPEG', quality=90, optimize=True)
            return True
    except Exception as e:
        print(f"Error converting {source_path}: {e}")
        return False

def main():
    """Main conversion function."""
    print("=" * 60)
    print("AVIF to JPG Converter for Upcoming Podcast Images")
    print("=" * 60)
    
    # Get all AVIF files
    avif_files = list(SOURCE_DIR.glob("*.avif"))
    print(f"\nFound {len(avif_files)} AVIF files in source directory")
    
    # Track conversions
    converted = []
    skipped = []
    failed = []
    
    for avif_file in avif_files:
        # Generate clean filename
        clean_name = sanitize_filename(avif_file.name)
        if not clean_name:
            clean_name = "unknown-guest"
        
        dest_filename = f"{clean_name}.jpg"
        dest_path = DEST_DIR / dest_filename
        
        # Handle duplicates by adding a number
        counter = 1
        while dest_path.exists():
            dest_filename = f"{clean_name}-{counter}.jpg"
            dest_path = DEST_DIR / dest_filename
            counter += 1
        
        print(f"\nConverting: {avif_file.name}")
        print(f"  -> {dest_filename}")
        
        if convert_avif_to_jpg(avif_file, dest_path):
            converted.append({
                'original': avif_file.name,
                'new_file': dest_filename,
                'path': str(dest_path)
            })
            print(f"  [OK] Success")
        else:
            failed.append(avif_file.name)
            print(f"  [FAIL] Error")
    
    # Summary
    print("\n" + "=" * 60)
    print("CONVERSION SUMMARY")
    print("=" * 60)
    print(f"Total AVIF files: {len(avif_files)}")
    print(f"Successfully converted: {len(converted)}")
    print(f"Failed: {len(failed)}")
    
    if converted:
        print("\nConverted files saved to:", DEST_DIR)
        print("\nFile mapping (for updating podcast data):")
        for item in converted:
            # Extract guest name for display
            guest_name = item['original'].replace('_', ' ').replace(' - YouTube & Website.avif', '')
            print(f"  {guest_name}")
            print(f"    -> /uploads/{item['new_file']}")
    
    if failed:
        print("\nFailed conversions:")
        for f in failed:
            print(f"  - {f}")
    
    return converted

if __name__ == "__main__":
    converted_files = main()
