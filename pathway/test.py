import requests

# URL of the Flask API
url = 'http://127.0.0.1:5001/predict'

# Example input data
data = {
    'Subject': 'Artificial Intelligence and Machine Learning',
    'Course Score': 85,
    'Learning Score': 78,
    'Quiz Score': 90
}

# Send a POST request with the input data
response = requests.post(url, json=data)

# Print the response from the API
print(response.json())
