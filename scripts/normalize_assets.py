import os
import sys
from PIL import Image

def process_logo(input_path, output_path):
    try:
        with Image.open(input_path) as img:
            # Convert to RGBA if not already
            img = img.convert("RGBA")
            # Resize to 512x512, keeping aspect ratio and padding with transparent background
            img.thumbnail((512, 512), Image.Resampling.LANCZOS)
            
            new_img = Image.new("RGBA", (512, 512), (255, 255, 255, 0))
            # Paste the resized image into the center of the new 512x512 image
            new_img.paste(img, ((512 - img.width) // 2, (512 - img.height) // 2))
            
            new_img.save(output_path, "WEBP", quality=90)
            print(f"Processed logo: {output_path}")
    except Exception as e:
        print(f"Error processing logo {input_path}: {e}")

def process_hero(input_path, output_path):
    try:
        with Image.open(input_path) as img:
            # Convert to RGB
            img = img.convert("RGB")
            # Resize to 1920x1080 (1080p), cropping if necessary to fill the aspect ratio
            target_ratio = 1920 / 1080
            img_ratio = img.width / img.height
            
            if img_ratio > target_ratio:
                # Image is wider than target, crop width
                new_width = int(target_ratio * img.height)
                offset = (img.width - new_width) // 2
                img = img.crop((offset, 0, offset + new_width, img.height))
            elif img_ratio < target_ratio:
                # Image is taller than target, crop height
                new_height = int(img.width / target_ratio)
                offset = (img.height - new_height) // 2
                img = img.crop((0, offset, img.width, offset + new_height))
                
            img = img.resize((1920, 1080), Image.Resampling.LANCZOS)
            img.save(output_path, "WEBP", quality=85)
            print(f"Processed hero: {output_path}")
    except Exception as e:
        print(f"Error processing hero {input_path}: {e}")

def main():
    if len(sys.argv) != 3:
        print("Usage: python normalize_assets.py <input_dir> <output_dir>")
        sys.exit(1)
        
    input_dir = sys.argv[1]
    output_dir = sys.argv[2]
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    for filename in os.listdir(input_dir):
        if not filename.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
            continue
            
        input_path = os.path.join(input_dir, filename)
        output_filename = os.path.splitext(filename)[0] + '.webp'
        output_path = os.path.join(output_dir, output_filename)
        
        if 'logo' in filename.lower():
            process_logo(input_path, output_path)
        elif 'hero' in filename.lower():
            process_hero(input_path, output_path)
        else:
            print(f"Skipping {filename} - must contain 'logo' or 'hero' in filename")

if __name__ == "__main__":
    main()
