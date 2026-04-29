#!/usr/bin/env python3
"""
Organize Yankeeverse portfolio images into themed folders.
Images were downloaded sequentially from Facebook (most recent first).
Groups of ~15 consecutive images share similar themes/posting periods.
"""

import os
import shutil

SRC_DIR = "assets/images/portfolio"
DST_DIR = "assets/images/gallery"

# Define folder groupings: (folder_name, start_num, end_num)
# "image copy.png" = most recent (2026), "image copy 297.png" = oldest (2022)
# We also have "image.png" as the very first one
GROUPS = [
    # 2026 — Latest works (most recent posts)
    ("01-latest-visual-art", None, 8),        # image copy, image copy 2..8
    ("02-collage-and-surreal", 9, 22),         # Surreal collage art series
    ("03-music-cover-art", 23, 37),            # Music/album cover designs
    ("04-brand-mockups", 38, 52),              # Brand mockups and advertising
    ("05-typography-and-posters", 53, 67),     # Typography-focused posters
    ("06-merchandise-design", 68, 82),         # T-shirt and merch designs
    ("07-digital-illustrations", 83, 97),      # Digital illustration work
    ("08-hip-hop-covers", 98, 112),            # Hip hop album art
    ("09-creative-composites", 113, 127),      # Creative photo composites
    ("10-brand-identity", 128, 142),           # Brand identity projects
    ("11-album-artwork", 143, 157),            # Album artwork series
    ("12-concept-art", 158, 172),              # Concept art pieces
    ("13-cultural-art", 173, 187),             # Myanmar cultural themed art
    ("14-poster-design", 188, 202),            # Poster design collection
    ("15-visual-collage", 203, 217),           # Visual collage art
    ("16-graphic-art", 218, 232),              # Graphic art pieces
    ("17-music-industry", 233, 247),           # Music industry designs
    ("18-minimalist-art", 248, 262),           # Minimalist compositions
    ("19-early-digital-art", 263, 277),        # Earlier digital art
    ("20-foundation-works", 278, 297),         # Earliest works (2022)
]

def get_source_filename(num):
    """Get the original filename for a given number."""
    if num is None:
        return "image copy.png"
    return f"image copy {num}.png"

def organize_images():
    """Organize images into themed folders."""
    os.makedirs(DST_DIR, exist_ok=True)
    
    total_moved = 0
    
    # Handle "image.png" (the very first downloaded, put in latest)
    src_image = os.path.join(SRC_DIR, "image.png")
    if os.path.exists(src_image):
        first_folder = os.path.join(DST_DIR, "01-latest-visual-art")
        os.makedirs(first_folder, exist_ok=True)
        dst = os.path.join(first_folder, "art_001.png")
        shutil.copy2(src_image, dst)
        print(f"  Copied: image.png -> {dst}")
        total_moved += 1
    
    for folder_name, start, end in GROUPS:
        folder_path = os.path.join(DST_DIR, folder_name)
        os.makedirs(folder_path, exist_ok=True)
        
        count = 0
        if start is None:
            # Handle "image copy.png" (no number)
            src_file = os.path.join(SRC_DIR, "image copy.png")
            if os.path.exists(src_file):
                idx = 2  # art_002 since art_001 is image.png
                dst_file = os.path.join(folder_path, f"art_{idx:03d}.png")
                shutil.copy2(src_file, dst_file)
                print(f"  Copied: image copy.png -> {dst_file}")
                count += 1
                total_moved += 1
            
            # Then image copy 2..end
            for num in range(2, end + 1):
                src_name = get_source_filename(num)
                src_file = os.path.join(SRC_DIR, src_name)
                if os.path.exists(src_file):
                    idx = num + 1  # offset by 1 since art_001 and art_002 are taken
                    dst_file = os.path.join(folder_path, f"art_{idx:03d}.png")
                    shutil.copy2(src_file, dst_file)
                    count += 1
                    total_moved += 1
                else:
                    print(f"  WARNING: {src_name} not found")
        else:
            for num in range(start, end + 1):
                src_name = get_source_filename(num)
                src_file = os.path.join(SRC_DIR, src_name)
                if os.path.exists(src_file):
                    local_idx = num - start + 1
                    dst_file = os.path.join(folder_path, f"art_{local_idx:03d}.png")
                    shutil.copy2(src_file, dst_file)
                    count += 1
                    total_moved += 1
                else:
                    print(f"  WARNING: {src_name} not found")
        
        print(f"📁 {folder_name}: {count} images")
    
    print(f"\n✅ Total organized: {total_moved} images into {len(GROUPS)} folders")

if __name__ == "__main__":
    organize_images()
