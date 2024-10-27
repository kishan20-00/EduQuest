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

# Mapping from frontend variable names to model variable names
variable_mapping = {
    'quizScore': 'Quiz scores',  # If quizScore should be used for another variable, change accordingly
    'preferredStudyTime': 'Preferred study times',
    'goal': 'Goals',
    'curriculumStructure': 'Curriculum structure',
    'externalFactor': 'External factors',
    'timeSpentOnContent': 'Time spent on different types of content',
    'proficiencyLevel': 'Proficiency level',
    'preferredSubject': 'Preferred subjects',  # Assuming this is similar to interestedSubject
    'availableContent': 'Available content',
    'completeRates': 'Completion rates'
}

def preprocess_input(input_data):
    encoded_input = []
    for key, value in input_data.items():
        # Map the frontend variable names to model variable names
        model_variable = variable_mapping.get(key)
        if model_variable:
            # Use the corresponding LabelEncoder to transform feature variables
            label_encoder = label_encoder_X_classes.get(model_variable)
            if label_encoder:
                try:
                    encoded_value = label_encoder.transform([value])[0]
                    encoded_input.append(encoded_value)
                except KeyError:
                    print(f"Unseen label '{value}' for feature '{model_variable}'")
                    encoded_input.append(-1)  # Default for unseen labels
            else:
                # If the variable does not require encoding, append the numeric value
                encoded_input.append(float(value))
        else:
            print(f"No mapping found for variable '{key}'")

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
    app.run(debug=True, host='0.0.0.0', port=5002)
