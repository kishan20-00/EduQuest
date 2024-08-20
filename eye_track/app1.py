import numpy as np
from tensorflow.keras.models import load_model
from PIL import Image

# Load the pre-trained Keras model
best_model = load_model('detection.h5')  # Replace with the correct path to your .h5 file

# Function to preprocess the input image
def preprocess_image(image):
    # Resize the image to match the size used during training (64x64)
    resized_img = image.resize((64, 64))
    # Convert image to RGB if it is not already
    rgb_img = resized_img.convert('RGB')
    # Convert image to numpy array
    np_img = np.array(rgb_img)
    # Normalize pixel values to the range [0, 1]
    normalized_img = np_img / 255.0
    return normalized_img

# Function to predict using the loaded model
def predict_image(image):
    preprocessed_img = preprocess_image(image)
    # Add batch dimension
    preprocessed_img = np.expand_dims(preprocessed_img, axis=0)
    # Reshape to match model input shape (1, 64, 64, 3)
    preprocessed_img = preprocessed_img.reshape(1, 64, 64, 3)
    # Predict using the model
    result = best_model.predict(preprocessed_img)
    return result

# Load and preprocess the image
image_path = 'unfocus_12.jpg'  # Replace with the path to your image file
image = Image.open(image_path)
prediction = predict_image(image)

# Display the prediction result
if prediction > 0.5:
    print('Focus')
else:
    print('Non Focus')
