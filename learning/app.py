from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
from joblib import load
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load the trained model
model = tf.keras.models.load_model('prediction.h5')

label_encoder_X_classes = {}
for col in ['Proficiency level', 'Preferred subjects', 'Preferred study times', 'Goals', 'Curriculum structure', 'Available content', 'External factors']:
    label_encoder_X_classes[col] = load(f'label_encoder_{col}_classes.joblib')
label_encoder_Y_classes = load('label_encoder_Y_classes.joblib')

def preprocess_input(input_data):
    encoded_input = []
    for col, value in input_data.items():
        if col in label_encoder_X_classes:
            # Use the corresponding LabelEncoder to transform feature variables
            label_encoder = label_encoder_X_classes[col]
            try:
                encoded_value = label_encoder.transform([value])[0]
                encoded_input.append(encoded_value)
            except KeyError:
                print(f"Unseen label '{value}' for feature '{col}'")
                # Handle unseen labels by replacing them with a default value or -1
                encoded_input.append(-1)
        else:
            # Convert last three variables to numbers
            try:
                numeric_value = float(value)
                encoded_input.append(numeric_value)
            except ValueError:
                print(f"Invalid numeric input '{value}' for feature '{col}'")
                encoded_input.append(0)  # Handle invalid numeric input by defaulting to 0 or any desired fallback

    print("Encoded input:", encoded_input)
    return np.array(encoded_input).reshape(1, -1)

# Define a route for prediction
@app.route('/predict', methods=['POST'])
def predict():
    # Get data from the request
    input_data = request.json

    print(input_data)
    
    # Preprocess input data for testing
    preprocessed_input = preprocess_input(input_data)
    
    # Make predictions using the trained model
    predictions = model.predict(preprocessed_input)
    
    # Get the predicted class
    predicted_class_index = np.argmax(predictions)
    predicted_class = label_encoder_Y_classes.classes_[predicted_class_index]
    
    # Return the predicted class
    return jsonify({'predicted_class': predicted_class})

if __name__ == '__main__':
    app.run(debug=True)
