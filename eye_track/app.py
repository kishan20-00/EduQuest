import cv2
import mediapipe as mp
import numpy as np
import time

mp_face_detection = mp.solutions.face_detection
mp_drawing = mp.solutions.drawing_utils

def detect_face_center_and_rotation(frame, face):
    h, w, _ = frame.shape
    for detection in face.detections:
        bboxC = detection.location_data.relative_bounding_box
        x, y, w_box, h_box = bboxC.xmin, bboxC.ymin, bboxC.width, bboxC.height
        face_center_x = int((x + w_box / 2) * w)
        face_center_y = int((y + h_box / 2) * h)
        
        # Calculate Euler angles to determine face rotation
        euler_y = detection.location_data.relative_keypoints[0].x  # euler_y represents face rotation along the y-axis

        # Draw bounding box around the face
        cv2.rectangle(frame, (int(x * w), int(y * h)), (int((x + w_box) * w), int((y + h_box) * h)), (0, 255, 0), 2)
        return face_center_x, face_center_y, euler_y
    return None, None, None

def is_user_focused(face_center_x, face_center_y, euler_y, frame, focus_threshold=0.4, euler_threshold=0.5, horizontal_move_threshold=0.3):
    h, w, _ = frame.shape
    center_x, center_y = w // 2, h // 2
    if face_center_x and face_center_y:
        # Calculate the distance from the center of the frame
        dist_x = abs(face_center_x - center_x) / w
        dist_y = abs(face_center_y - center_y) / h

        # Check if the face is within the central region of the frame and facing forward
        if dist_y > focus_threshold or abs(euler_y) > euler_threshold:
            return False
        
        # Check horizontal movement within a threshold range
        if abs(face_center_x - center_x) / w > horizontal_move_threshold:
            return False
        
    return True

focus_time = 0
focus_threshold = 0.4  # medium accuracy
euler_threshold = 0.5  # threshold for face rotation detection
horizontal_move_threshold = 0.3  # expanded threshold for horizontal movement

cap = cv2.VideoCapture(0)
with mp_face_detection.FaceDetection(model_selection=0, min_detection_confidence=0.5) as face_detection:
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Convert the BGR image to RGB
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = face_detection.process(rgb_frame)

        if results.detections:
            face_center_x, face_center_y, euler_y = detect_face_center_and_rotation(frame, results)

            if not is_user_focused(face_center_x, face_center_y, euler_y, frame, focus_threshold, euler_threshold, horizontal_move_threshold):
                print("User is not focused on the screen!")

        cv2.imshow('Face Tracking', frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

cap.release()
cv2.destroyAllWindows()
