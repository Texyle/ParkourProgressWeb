from PIL import Image
import os

def create_smaller_copies(folder_path: str) -> None:
    # Ensure the output directory exists
    output_folder = os.path.join(folder_path, 'small_copies')
    os.makedirs(output_folder, exist_ok=True)

    # Loop through all files in the folder
    for filename in os.listdir(folder_path):
        # Check if the file is an image
        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.gif')):
            # Open the image file
            img_path = os.path.join(folder_path, filename)
            with Image.open(img_path) as img:
                # Calculate the new size (half of the original dimensions)
                width, height = img.size
                new_size = (width // 4, height // 4)
                # Resize the image
                img_small = img.resize(new_size, Image.ANTIALIAS)
                # Convert to RGB if the image has an alpha channel
                if img_small.mode == 'RGBA':
                    img_small = img_small.convert('RGB')
                # Create the new filename
                name, ext = os.path.splitext(filename)
                new_filename = f"{name}_small{ext}"
                # Save the smaller image in the output folder
                output_path = os.path.join(output_folder, new_filename)
                if os.path.exists(output_path):
                    os.remove(output_path)  # Remove existing file if it exists
                img_small.save(output_path)
                print(f"Created smaller copy: {new_filename}")

# Relative path from the script to the images folder
relative_path_to_images = os.path.join('..', 'app', 'static', 'images', 'maps')
folder_path = os.path.abspath(os.path.join(os.path.dirname(__file__), relative_path_to_images))

# Example usage
create_smaller_copies(folder_path)