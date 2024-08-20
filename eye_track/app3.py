from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np
import io
import base64

app = Flask(__name__)

# Load the pre-trained Keras model
best_model = load_model('detection.h5')  # Replace 'detection.h5' with the path to your .h5 file

# Function to preprocess the input image
def preprocess_image(image_data):
    image = Image.open(io.BytesIO(image_data))
    # Resize the image to match the size used during training (64x64)
    resized_img = image.resize((64, 64))
    # Convert image to RGB (in case it's not already in RGB)
    rgb_img = resized_img.convert('RGB')
    # Convert image to numpy array
    np_img = np.array(rgb_img)
    # Normalize pixel values
    normalized_img = np_img / 255.0
    return normalized_img

# Function to predict using the loaded model
def predict_image(image_data):
    preprocessed_img = preprocess_image(image_data)
    # Add batch dimension
    preprocessed_img = np.expand_dims(preprocessed_img, axis=0)
    # Reshape to match model input shape (1, 64, 64, 3)
    preprocessed_img = preprocessed_img.reshape(1, 64, 64, 3)
    result = best_model.predict(preprocessed_img)
    return result[0][0]  # Return the probability of being open

@app.route('/predict', methods=['POST'])
def predict():
    image_data = request.json['image_data'].split(',')[1]  # Extract base64 image data
    image_data = base64.b64decode(image_data)  # Decode the base64 string
    prediction = predict_image(image_data)
    return jsonify({'prediction': float(prediction)})

if __name__ == '__main__':
    app.run(debug=True)
