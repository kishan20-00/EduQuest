import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './Video.css'; // Import CSS file for styling

function Video() {
  const videoRef = useRef(null);
  const [predictions, setPredictions] = useState('');
  const [sendingInterval, setSendingInterval] = useState(null);
  const [isVideoStarted, setIsVideoStarted] = useState(false);

  useEffect(() => {
    return () => {
      // Clear the interval when the component unmounts
      clearInterval(sendingInterval);
    };
  }, [sendingInterval]);

  const toggleVideoAndSendFrames = () => {
    if (!isVideoStarted) {
      // Start video and send frames
      startVideo();
      startSendingFrames();
    } else {
      // Stop video
      stopVideo();
    }
  };

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        videoRef.current.srcObject = stream;
        setIsVideoStarted(true);
      })
      .catch(err => console.error('Error accessing webcam:', err));
  };

  const stopVideo = () => {
    const stream = videoRef.current.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      setIsVideoStarted(false);
    }
    // Clear the sending interval
    clearInterval(sendingInterval);
  };

  const startSendingFrames = () => {
    // Set up interval to send frames every 1 second
    const intervalId = setInterval(() => {
      sendFrameToServer();
    }, 1000); // Send every 1 second
    setSendingInterval(intervalId);
  };

  const sendFrameToServer = () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(blob => {
      const formData = new FormData();
      formData.append('image_data', blob, 'image.jpg'); // Append the image blob as a file

      axios.post('http://127.0.0.1:5000/predict', formData)
        .then(response => {
          const prediction = response.data.prediction;
          setPredictions(prediction > 0.6 ? 'Focus' : 'Non Focus');
        })
        .catch(error => {
          console.error('Error sending frame to server:', error);
        });
    }, 'image/jpeg');
  };

  return (
    <div className="container">
      <div className="video-container">
        <video className='detect' ref={videoRef} width="640" height="480" autoPlay></video>
      </div>
      <div className="buttons-container">
        <button onClick={toggleVideoAndSendFrames}>
          {isVideoStarted ? 'Video Started' : 'Start Video'}
        </button>
        <button onClick={stopVideo}>Stop Video</button>
      </div>
      <p>Predictions: {predictions}</p>
    </div>
  );
}

export default Video;
