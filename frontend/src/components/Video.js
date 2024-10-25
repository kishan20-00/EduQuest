import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

function EyeTrackingVideo({ isPlaying }) {
  const videoRef = useRef(null);
  const [predictions, setPredictions] = useState('');
  const [sendingInterval, setSendingInterval] = useState(null);
  const [nonFocusCount, setNonFocusCount] = useState(0);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    if (isPlaying) {
      startVideo();
      startSendingFrames();
    } else {
      stopVideo();
    }

    // Clean up the interval on unmount or when isPlaying changes
    return () => {
      stopVideo();
      clearInterval(sendingInterval);
    };
  }, [isPlaying]);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        videoRef.current.srcObject = stream;
      })
      .catch(err => console.error('Error accessing webcam:', err));
  };

  const stopVideo = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    clearInterval(sendingInterval);
  };

  const startSendingFrames = () => {
    clearInterval(sendingInterval);

    const intervalId = setInterval(() => {
      sendFrameToServer();
    }, 1000);
    setSendingInterval(intervalId);
  };

  const sendFrameToServer = () => {
    if (!videoRef.current || !videoRef.current.srcObject) return;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(blob => {
      const formData = new FormData();
      formData.append('image_data', blob, 'image.jpg');

      axios.post('http://127.0.0.1:5000/predict', formData)
        .then(response => {
          const prediction = response.data.prediction;
          setPredictions(prediction > 0.6 ? 'Focus' : 'Non Focus');

          // Update the nonFocusCount and counter
          if (prediction <= 0.6) {
            setNonFocusCount(prevCount => {
              const newCount = prevCount + 1;
              if (newCount >= 10) {
                setCounter(prevCounter => prevCounter - 0.5);
                return 0; // Reset count after hitting 10
              }
              return newCount;
            });
          } else {
            setNonFocusCount(0); // Reset count if Focus is received
          }
        })
        .catch(error => console.error('Error sending frame to server:', error));
    }, 'image/jpeg');
  };

  return (
    <div>
      <video 
        ref={videoRef} 
        width="320" 
        height="240" 
        autoPlay 
        style={{ display: isPlaying ? 'block' : 'none' }} 
      />
      <p>Predictions: {predictions}</p>
      <p>Counter: {counter.toFixed(1)}</p>
    </div>
  );
}

export default EyeTrackingVideo;
