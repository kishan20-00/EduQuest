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
  const [quizScore, setQuizScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]); // Track which answers are correct
  const [isCompleted, setIsCompleted] = useState(false);
  const eyeTrackingRef = useRef(null);

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
  
    let counterValue = 0;
    if (eyeTrackingRef.current) {
      counterValue = eyeTrackingRef.current.getCounter();
    }
  
    try {
      if (course.learningMaterial === 'quiz') {
        checkAnswers(); // Calculate quiz score based on answers
  
        // Fetch the current quiz score
        const userResponse = await axios.get(`https://edu-quest-hfoq.vercel.app/api/auth/user/${user._id}`);
        const currentQuizScore = parseInt(userResponse.data.quizScore) || 0;
  
        // Update quizScore by adding the new score
        const updatedQuizScore = currentQuizScore + quizScore;
        await axios.put(`https://edu-quest-hfoq.vercel.app/api/auth/updateQuizScore/${user._id}`, {
          quizScore: updatedQuizScore,
        });
        console.log(`Quiz score updated to: ${updatedQuizScore}`);
  
        // Update courseScore as well when the material is a quiz
        const courseScoreResponse = await fetch(`https://edu-quest-hfoq.vercel.app/api/auth/updateCourseScore/${user._id}`, {
          method: 'PUT',
        });
        const courseScoreData = await courseScoreResponse.json();
        if (courseScoreResponse.ok) {
          console.log('Course score updated:', courseScoreData.msg);
        } else {
          console.error('Failed to update course score:', courseScoreData.msg);
        }
  
      } else {
        const response = await fetch(`https://edu-quest-hfoq.vercel.app/api/auth/updateCourseScore/${user._id}`, {
          method: 'PUT',
        });
        const data = await response.json();
        if (response.ok) {
          console.log('Course score updated:', data.msg);
          await axios.put(`https://edu-quest-hfoq.vercel.app/api/auth/updateLearningScore/${user._id}`, {
            decrementValue: counterValue,
          });
        } else {
          console.error('Failed to update course score:', data.msg);
        }
      }
    } catch (error) {
      console.error('Error updating scores:', error);
    }
  };  

  const handleAnswerChange = (index, answer) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = answer.toLowerCase();
    setUserAnswers(newAnswers);
  };

  const checkAnswers = () => {
    if (course.quizAnswers && userAnswers.length === course.quizAnswers.length) {
      const results = userAnswers.map((answer, index) => answer === course.quizAnswers[index].toLowerCase());
      setCorrectAnswers(results); // Update correct answers based on user input
      const score = results.reduce((acc, isCorrect) => acc + (isCorrect ? 5 : 0), 0);
      setQuizScore(score);
      console.log(`Your quiz score is: ${score}`);
    }
  };

  if (!course) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Typography variant="h4">{course.contentName}</Typography>
      <Typography variant="h6">Description:</Typography>
      <Typography>{course.description}</Typography>

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

      {course.learningMaterial === 'audio' && (
        <audio controls style={{ width: '100%' }}>
          <source src={course.source} type="audio/mpeg" />
          <source src={course.source} type="audio/ogg" />
          Your browser does not support the audio element.
        </audio>
      )}

      {course.learningMaterial === 'pdf' && (
        <iframe src={course.source} width="100%" height="600px" />
      )}

      {course.learningMaterial === 'text' && (
        <>
          <Typography variant="h6">Heading:</Typography>
          <Typography>{course.heading}</Typography>
          <Typography variant="h6">Content:</Typography>
          <Typography>{course.textContent}</Typography>
        </>
      )}

      {course.learningMaterial === 'assignment' && (
        <Typography variant="h6">Assignment Content: {course.assignmentContent}</Typography>
      )}

      {course.learningMaterial === 'quiz' && course.quizQuestions && (
        <>
          <Typography variant="h6">Quiz Questions:</Typography>
          {course.quizQuestions.map((question, index) => (
            <Box key={index} sx={{ marginBottom: 2 }}>
              <Typography>{index + 1}. {question}</Typography>
              <input
                type="text"
                placeholder="Your answer"
                onChange={(e) => handleAnswerChange(index, e.target.value)}
              />
              {correctAnswers.length > 0 && (
                <Typography
                  variant="body2"
                  color={correctAnswers[index] ? 'green' : 'red'}
                  sx={{ display: 'inline', marginLeft: '8px' }}
                >
                  {correctAnswers[index] ? '✓ Correct' : '✗ Incorrect'}
                </Typography>
              )}
            </Box>
          ))}
          <Button variant="contained" color="primary" onClick={checkAnswers}>
            Submit Answers
          </Button>
          {quizScore > 0 && <Typography>Your Quiz Score: {quizScore}</Typography>}
        </>
      )}

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
