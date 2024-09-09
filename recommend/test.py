import requests

# Define the URL of the Flask API
url = 'http://127.0.0.1:5003/predict'

# Define the input data
input_data = {
    'subject': 'Database Management',
    'course_score': 75,
    'learning_score': 80,
    'quiz_score': 85
}

# Send a POST request to the API
response = requests.post(url, json=input_data)

# Check the response
if response.status_code == 200:
    # Print the JSON response from the API
    print("Recommendation:", response.json()['recommendation'])
else:
    # Print the error message if the request failed
    print("Error:", response.json().get('error', 'Unknown error occurred'))
