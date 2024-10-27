import requests

# Define the endpoint URL
url = "http://127.0.0.1:5002/predict"

# Define the input data according to the expected frontend structure
input_data = {
    'quizScore': 90,    # Example score for the quiz
    'preferredStudyTime': 'Morning',
    'goal': 'Short-term',
    'curriculumStructure': 'Exam',
    'externalFactor': 'Time Constraints',
    'timeSpentOnContent': 10,  # Example time spent
    'proficiencyLevel': 'intermediate',
    'preferredSubject': 'Software Engineering and Development',  # Assuming this is similar to interestedSubject
    'availableContent': 'video',
    'completeRates': 8  # Example completion rates
}

# Send POST request to the Flask app
response = requests.post(url, json=input_data)

# Check the response from the Flask app
if response.status_code == 200:
    # Print the predicted class returned from the server
    print("Response from server:", response.json())
else:
    print("Error:", response.status_code, response.text)
