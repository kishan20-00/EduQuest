// CourseDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography } from '@mui/material';

const CourseDetailsPage = () => {
  const { id } = useParams(); // Get the course ID from the URL
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`https://edu-quest-hfoq.vercel.app/api/content/${id}`);
        setCourse(response.data);
      } catch (error) {
        console.error('Error fetching course:', error);
      }
    };

    fetchCourse();
  }, [id]);

  if (!course) return <Typography>Loading...</Typography>; // Display loading text while fetching

  return (
    <Box>
      <Typography variant="h4">{course.contentName}</Typography>
      <Typography variant="h6">Description:</Typography>
      <Typography>{course.description}</Typography>

      {/* Video Playback */}
      {course.learningMaterial === 'video' && (
        <iframe
          width="100%"
          height="315"
          src={`https://www.youtube.com/embed/${course.source.split('/').pop()}`} // Embed YouTube
          title="YouTube Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}

      {/* Audio Playback */}
      {course.learningMaterial === 'audio' && (
        <audio controls style={{ width: '100%' }}>
          <source src={course.source} type="audio/mpeg" /> {/* Change the type if needed */}
          <source src={course.source} type="audio/ogg" /> {/* Try additional types */}
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
