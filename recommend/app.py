from flask import Flask, request, jsonify
import joblib
import pandas as pd
from flask_cors import CORS

# Define CORS
app = Flask(__name__)
CORS(app)

# Load the saved model, encoders, and scaler
model = joblib.load('classification_model.pkl')
label_encoder_subject = joblib.load('label_encoder_subject.pkl')
label_encoder_recommendation = joblib.load('label_encoder_recommendation.pkl')
scaler = joblib.load('scaler.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get the data from the request
        data = request.json
        subject = data['interestedSubject']
        course_score = data['courseScore']
        learning_score = data['learningScore']
        quiz_score = data['quizScore']

        # Transform the categorical input
        subject_encoded = label_encoder_subject.transform([subject])[0]

        # Create DataFrame for the new data
        new_data = pd.DataFrame([[subject_encoded, course_score, learning_score, quiz_score]],
                                columns=['Subject', 'Course Score', 'Learning Score', 'Quiz Score'])

        # Scale the features
        new_data[['Course Score', 'Learning Score', 'Quiz Score']] = scaler.transform(new_data[['Course Score', 'Learning Score', 'Quiz Score']])

        # Make prediction
        prediction_encoded = model.predict(new_data)

        # Transform the prediction back to text
        recommendation = label_encoder_recommendation.inverse_transform(prediction_encoded)

        return jsonify({'recommendation': recommendation[0]})

    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5003)
