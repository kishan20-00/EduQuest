import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Button } from '@mui/material';
import EyeTrackingVideo from './Video';

const CourseDetailsPage = () => {
  const { id } = useParams(); // Get the course ID from the URL
  const [course, setCourse] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [finalCounter, setFinalCounter] = useState(0);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`https://edu-quest-hfoq.vercel.app/api/content/${id}`);
        setCourse(response.data);
        // Start eye-tracking automatically if learning material is a video
        if (response.data.learningMaterial === 'video') {
          setIsPlaying(true); // Autoplay eye-tracking video
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      }
    };

    fetchCourse();
  }, [id]);

  const handleCourseVideoPlay = () => setIsPlaying(true); // Start eye-tracking when video plays
  const handleCourseVideoPause = () => setIsPlaying(false); // Stop eye-tracking when video pauses or ends

  const handleCompleted = () => {
    setIsPlaying(false); // Stop eye-tracking when completed
  };

  if (!course) return <Typography>Loading...</Typography>; // Display loading text while fetching

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
            onEnded={handleCourseVideoPause} // Stop tracking on video end
          />
          {/* Eye Tracking Video component */}
          <EyeTrackingVideo isPlaying={isPlaying} />
          <Button variant="contained" color="secondary" onClick={handleCompleted}>
            Complete
          </Button>
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

      {/* Handling Assignments */}
      {course.learningMaterial === 'assignment' && (
        <Typography variant="h6">Assignment Content: {course.assignmentContent}</Typography>
      )}

      {/* Handling Quizzes */}
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
    </Box>
  );
};

export default CourseDetailsPage;
