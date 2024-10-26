import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Button } from '@mui/material';
import EyeTrackingVideo from './Video';
import AuthContext from '../contexts/AuthContext';

const CourseDetailsPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [course, setCourse] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [points, setPoints] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const eyeTrackingRef = useRef(null); // Create a ref for EyeTrackingVideo

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`https://edu-quest-hfoq.vercel.app/api/content/${id}`);
        setCourse(response.data);
        if (response.data.learningMaterial === 'video') {
          setIsPlaying(true);
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      }
    };

    fetchCourse();
  }, [id]);

  const handleCourseVideoPlay = () => setIsPlaying(true);
  const handleCourseVideoPause = () => setIsPlaying(false);

  const handleCompleted = () => {
    if (!isCompleted) {
      if (course.learningMaterial === 'video') {
        setIsPlaying(false);
      }
      setPoints(points + 10);
      setIsCompleted(true);
    }
  };

  const handleCompleteClick = async () => {
    if (!user) {
      console.error('User is not authenticated.');
      return;
    }
  
    let counterValue = 0; // Default value for counter
  
    // Get the counter value from EyeTrackingVideo only if it's rendered
    if (eyeTrackingRef.current) {
      counterValue = eyeTrackingRef.current.getCounter();
    }
  
    try {
      const response = await fetch(`https://edu-quest-hfoq.vercel.app/api/auth/updateCourseScore/${user._id}`, {
        method: 'PUT',
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Course score updated:', data.msg);
        // Now send counterValue to update learningScore
        await axios.put(`https://edu-quest-hfoq.vercel.app/api/auth/updateLearningScore/${user._id}`, {
          decrementValue: counterValue,
        });
      } else {
        console.error('Failed to update course score:', data.msg);
      }
    } catch (error) {
      console.error('Error updating course score:', error);
    }
  };
  

  if (!course) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Typography variant="h4">{course.contentName}</Typography>
      <Typography variant="h6">Description:</Typography>
      <Typography>{course.description}</Typography>

      {/* Video Playback */}
      {course.learningMaterial === 'video' && (
        <>
          <iframe
            width="100%"
            height="315"
            src={`https://www.youtube.com/embed/${course.source.split('/').pop()}`}
            title="Course Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onPlay={handleCourseVideoPlay}
            onPause={handleCourseVideoPause}
            onEnded={handleCourseVideoPause}
          />
          <EyeTrackingVideo ref={eyeTrackingRef} isPlaying={isPlaying} isCompleted={isCompleted} userId={user?._id} />
        </>
      )}

      {/* Audio Playback */}
      {course.learningMaterial === 'audio' && (
        <audio controls style={{ width: '100%' }}>
          <source src={course.source} type="audio/mpeg" />
          <source src={course.source} type="audio/ogg" />
          Your browser does not support the audio element.
        </audio>
      )}

      {/* PDF Display */}
      {course.learningMaterial === 'pdf' && (
        <iframe src={course.source} width="100%" height="600px" />
      )}

      {/* Text Content */}
      {course.learningMaterial === 'text' && (
        <>
          <Typography variant="h6">Heading:</Typography>
          <Typography>{course.heading}</Typography>
          <Typography variant="h6">Content:</Typography>
          <Typography>{course.textContent}</Typography>
        </>
      )}

      {/* Assignment */}
      {course.learningMaterial === 'assignment' && (
        <Typography variant="h6">Assignment Content: {course.assignmentContent}</Typography>
      )}

      {/* Quiz */}
      {course.learningMaterial === 'quiz' && course.quizQuestions && (
        <>
          <Typography variant="h6">Quiz Questions:</Typography>
          {course.quizQuestions.map((question, index) => (
            <Box key={index} sx={{ marginBottom: 2 }}>
              <Typography>{index + 1}. {question}</Typography>
              <input type="text" placeholder="Your answer" />
            </Box>
          ))}
        </>
      )}

      {/* Complete Button */}
      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          handleCompleted();
          handleCompleteClick();
        }}
        disabled={isCompleted}
      >
        Complete
      </Button>
      {isCompleted && <Typography>Points: {points}</Typography>}
    </Box>
  );
};

export default CourseDetailsPage;
