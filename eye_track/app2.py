import numpy as np
from tensorflow.keras.models import load_model
from PIL import Image
import cv2

# Load the pre-trained Keras model
best_model = load_model('detection.h5')  # Replace 'detection.h5' with the path to your .h5 file

# Function to preprocess the input image
def preprocess_image(image):
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
def predict_image(image):
    preprocessed_img = preprocess_image(image)
    # Add batch dimension
    preprocessed_img = np.expand_dims(preprocessed_img, axis=0)
    # Reshape to match model input shape (1, 64, 64, 3)
    preprocessed_img = preprocessed_img.reshape(1, 64, 64, 3)
    result = best_model.predict(preprocessed_img)
    return result

# Initialize video capture from webcam
cap = cv2.VideoCapture(0)  # Change the index if you have multiple webcams

while True:
    # Capture frame-by-frame
    ret, frame = cap.read()
    
    # Convert OpenCV image (numpy array) to PIL image
    pil_img = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
    
    # Predict using the loaded model
    prediction = predict_image(pil_img)
    
    # Display the prediction result
    if prediction > 0.5:
        cv2.putText(frame, 'Focus', (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)
    else:
        cv2.putText(frame, 'Non Focus', (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2, cv2.LINE_AA)
    
    # Display the resulting frame
    cv2.imshow('Frame', frame)
    
    # Break the loop when 'q' is pressed
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the capture
cap.release()
cv2.destroyAllWindows()
