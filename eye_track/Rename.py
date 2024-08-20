import os

def rename_images(folder_path, prefix):
    # Get a list of all image files in the folder
    images = [f for f in os.listdir(folder_path) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp'))]

    # Sort the images by their current name (optional)
    images.sort()

    # Loop through the images and rename them sequentially
    for i, image in enumerate(images, start=1):
        old_path = os.path.join(folder_path, image)
        new_name = f"{prefix}_{i}{os.path.splitext(image)[1]}"  # Keeps the original file extension
        new_path = os.path.join(folder_path, new_name)

        os.rename(old_path, new_path)
        print(f"Renamed: {image} -> {new_name}")

if __name__ == "__main__":
    folder_path = "C:\\Users\\Kishan raj\\Documents\\GitHub\\EduQuest\\eye_track\\unfocus"  # Update this path to your folder
    prefix = "unfocus"  # Update this to the desired prefix
    rename_images(folder_path, prefix)
