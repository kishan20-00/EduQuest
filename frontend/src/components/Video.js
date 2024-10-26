import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';

const EyeTrackingVideo = forwardRef(({ isPlaying, isCompleted, userId }, ref) => {
  const videoRef = useRef(null);
  const [predictions, setPredictions] = useState('');
  const [sendingInterval, setSendingInterval] = useState(null);
  const [nonFocusCount, setNonFocusCount] = useState(0);
  const [counter, setCounter] = useState(0);

  useImperativeHandle(ref, () => ({
    getCounter: () => counter,  // Expose getCounter method to parent component
  }));

  useEffect(() => {
    if (isPlaying && !isCompleted) {
      startVideo();
      startSendingFrames();
    } else {
      stopVideo();
    }

    return () => {
      stopVideo();
      clearInterval(sendingInterval);
    };
  }, [isPlaying, isCompleted]);

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
      if (!isCompleted) sendFrameToServer(); // Only send if not completed
    }, 1000);
    setSendingInterval(intervalId);
  };

  const sendFrameToServer = () => {
    if (!videoRef.current || !videoRef.current.srcObject || isCompleted) return;

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

          if (prediction <= 0.6) {
            setNonFocusCount(prevCount => {
              const newCount = prevCount + 1;
              if (newCount >= 10) {
                setCounter(prevCounter => prevCounter - 0.5);
                return 0;  // Reset nonFocusCount after reaching 10
              }
              return newCount;
            });
          } else {
            setNonFocusCount(0);
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
});

export default EyeTrackingVideo;
