import os
from PIL import Image

gallery_dir = '/Users/thomas/HobbyProject/Yankeeverse/kbtc-lwanwadi.github.io/assets/images/gallery'
count = 0
for root, dirs, files in os.walk(gallery_dir):
    for filename in files:
        if filename.endswith(".png"):
            filepath = os.path.join(root, filename)
            try:
                with Image.open(filepath) as img:
                    # Convert to RGB if necessary
                    if img.mode in ("RGBA", "P"):
                        img = img.convert("RGB")
                    # Resize if width > 1200
                    if img.width > 1200:
                        ratio = 1200 / img.width
                        new_size = (1200, int(img.height * ratio))
                        img = img.resize(new_size, Image.Resampling.LANCZOS)
                    # Save as JPEG
                    new_filepath = filepath[:-4] + ".jpg"
                    img.save(new_filepath, "JPEG", quality=80, optimize=True)
                # Remove original png
                os.remove(filepath)
                count += 1
            except Exception as e:
                print(f"Error processing {filepath}: {e}")

print(f"Optimized {count} images.")
