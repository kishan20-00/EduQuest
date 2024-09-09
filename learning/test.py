import requests

# Define the URL of the Flask app
url = 'http://127.0.0.1:5002/predict'

# Example input data
input_data = {
    'Proficiency level': 'Medium',
    'Preferred subjects': 'Cloud Computing',
    'Preferred study times': 'Morning',
    'Goals': 'Short-term',
    'Curriculum structure': 'Exam',
    'Available content': 'Lectures',
    'External factors': 'Time Constraints',
    'Time spent on different types of content': '10',
    'Completion rates': '7',
    'Quiz scores': '80'
}

# Send a POST request with JSON data to the Flask app
response = requests.post(url, json=input_data)

# Check if the request was successful
if response.status_code == 200:
    # Get the predicted class from the response
    predicted_class = response.json()['predicted_class']
    print('Predicted class:', predicted_class)
else:
    print('Error:', response.status_code)

