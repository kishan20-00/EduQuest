import requests

# Define the URL of the Flask app
url = 'http://127.0.0.1:5001/predict'  # Adjust if the host or port is different

# Define the test data payload
data = {
    'courseScore': 80,           # Example course score
    'quizScore': 75,             # Example quiz score
    'learningScore': 85,         # Example learning score
    'interestedSubject': 'Artificial Intelligence and Machine Learning'  # Example interested subject (should be one of the subjects the model recognizes)
}

# Make a POST request to the predict endpoint
response = requests.post(url, json=data)

# Check and print the response
if response.status_code == 200:
    print("Response JSON:", response.json())
else:
    print("Failed to get a valid response. Status code:", response.status_code)
    print("Response Text:", response.text)

