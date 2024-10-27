from flask import Flask, request, jsonify
import joblib
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load the pre-trained models and preprocessing objects
model_complexity = joblib.load('model_complexity.pkl')
model_content = joblib.load('model_content.pkl')
label_encoders = joblib.load('label_encoders.pkl')
scaler = joblib.load('scaler.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    # Get the JSON data from the request
    data = request.json

    # Map frontend variable names to backend DataFrame columns
    input_data = pd.DataFrame([{
        'Subject': data['interestedSubject'],
        'Course Score': data['courseScore'],
        'Learning Score': data['learningScore'],
        'quiz Score': data['quizScore']
    }])

    # Encode categorical variables
    categorical_cols = ['Subject']
    for col in categorical_cols:
        input_data[col] = label_encoders[col].transform(input_data[col])

    # Standardize numerical features
    numerical_cols = ['Course Score', 'Learning Score', 'quiz Score']
    input_data[numerical_cols] = scaler.transform(input_data[numerical_cols])
    print(input_data)

    # Predict the Complexity
    complexity_prediction = model_complexity.predict(input_data)

    # Predict the Learning Content
    content_prediction = model_content.predict(input_data)

    # Create the response dictionary
    response = {
        'Predicted_Complexity': complexity_prediction[0],
        'Predicted_Learning_Content': content_prediction[0]
    }

    print(response)

    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
