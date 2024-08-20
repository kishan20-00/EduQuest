import os
import shutil
import random

def move_random_images(source_folder, destination_folder, num_images):
    # Ensure destination folder exists
    if not os.path.exists(destination_folder):
        os.makedirs(destination_folder)

    # Get a list of all image files in the source folder
    images = [f for f in os.listdir(source_folder) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp'))]

    # If the number of images requested is greater than available, adjust to available number
    num_images = min(num_images, len(images))

    # Randomly select the specified number of images
    selected_images = random.sample(images, num_images)

    # Move the selected images to the destination folder
    for image in selected_images:
        src_path = os.path.join(source_folder, image)
        dest_path = os.path.join(destination_folder, image)
        shutil.move(src_path, dest_path)
        print(f"Moved: {image} -> {destination_folder}")

if __name__ == "__main__":
    source_folder = "C:\\Users\\Kishan raj\\Documents\\GitHub\\EduQuest\\eye_track\\unfocus"  # Update this path to your source folder
    destination_folder = "C:\\Users\\Kishan raj\\Documents\\GitHub\\EduQuest\\eye_track\\test\\unfocus"  # Update this path to your destination folder
    num_images = 79  # Specify the number of images to move

    move_random_images(source_folder, destination_folder, num_images)
