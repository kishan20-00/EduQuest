import React, { useState } from 'react';
import { Box, Typography, Container, TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';

const AddCoursePage = () => {
  const [courseContent, setCourseContent] = useState({
    contentName: '',
    subject: '',
    complexity: '',
    image: '',
    learningMaterial: '',
    source: '', // For video, audio, pdf links
    heading: '', // For text heading
    textContent: '', // For text content
    assignmentContent: '', // For assignment
    quizQuestions: ['', '', '', '', ''], // For 5 quiz questions
    quizAnswers: ['', '', '', '', ''], // For 5 quiz answers
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseContent({ ...courseContent, [name]: value });
  };

  const handleQuizChange = (index, field, value) => {
    const updatedQuiz = [...courseContent[field]];
    updatedQuiz[index] = value;
    setCourseContent({ ...courseContent, [field]: updatedQuiz });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://edu-quest-hfoq.vercel.app/api/content/add', courseContent);
      console.log('Course content added successfully:', response.data);
      alert('Course content added successfully!');
      setCourseContent({
        contentName: '',
        learningMaterial: '',
        source: '',
        heading: '',
        textContent: '',
        assignmentContent: '',
        quizQuestions: ['', '', '', '', ''],
        quizAnswers: ['', '', '', '', ''],
        description: '',
      });
    } catch (error) {
      console.error('Error adding course content:', error.response?.data || error.message);
      alert('Failed to add course content.');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', paddingTop: 8, paddingBottom: 4 }}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Add Course Content
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
          <Grid container spacing={2}>
            {/* Common Input Fields */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Content Name"
                name="contentName"
                value={courseContent.contentName}
                onChange={handleChange}
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Subject</InputLabel>
                <Select
                  name="subject"
                  value={courseContent.subject}
                  onChange={handleChange}
                  label="Subject"
                >
                  <MenuItem value="Artificial Intelligence and Machine Learning">Artificial Intelligence and Machine Learning</MenuItem>
                  <MenuItem value="Cloud Computing">Cloud Computing</MenuItem>
                  <MenuItem value="CyberSecurity">CyberSecurity</MenuItem>
                  <MenuItem value="Data Science and Analytics">Data Science and Analytics</MenuItem>
                  <MenuItem value="Database Management">Database Management</MenuItem>
                  <MenuItem value="Devops and Systems Integration">Devops and Systems Integration</MenuItem>
                  <MenuItem value="IT Project Management">IT Project Management</MenuItem>
                  <MenuItem value="Network and System Administration">Network and System Administration</MenuItem>
                  <MenuItem value="Software Engineering and Development">Software Engineering and Development</MenuItem>
                  <MenuItem value="Web Development">Web Development</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Complexity</InputLabel>
                <Select
                  name="complexity"
                  value={courseContent.complexity}
                  onChange={handleChange}
                  label="Complexity"
                >
                  <MenuItem value="beginner">Beginner</MenuItem>
                  <MenuItem value="intermediate">Intermediate</MenuItem>
                  <MenuItem value="advanced">Advanced</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image"
                name="image"
                value={courseContent.image}
                onChange={handleChange}
                margin="normal"
                required
              />
            </Grid>

            {/* Dynamic Fields based on Learning Material */}
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Learning Material</InputLabel>
                <Select
                  name="learningMaterial"
                  value={courseContent.learningMaterial}
                  onChange={handleChange}
                  label="Learning Material"
                >
                  <MenuItem value="video">Video</MenuItem>
                  <MenuItem value="audio">Audio</MenuItem>
                  <MenuItem value="pdf">PDF</MenuItem>
                  <MenuItem value="text">Text</MenuItem>
                  <MenuItem value="assignment">Assignment</MenuItem>
                  <MenuItem value="quiz">Quiz</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Conditional Fields */}
            {courseContent.learningMaterial === 'video' || courseContent.learningMaterial === 'audio' || courseContent.learningMaterial === 'pdf' ? (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Source Link"
                  name="source"
                  value={courseContent.source}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
              </Grid>
            ) : courseContent.learningMaterial === 'text' ? (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Heading"
                    name="heading"
                    value={courseContent.heading}
                    onChange={handleChange}
                    margin="normal"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Content"
                    name="textContent"
                    value={courseContent.textContent}
                    onChange={handleChange}
                    margin="normal"
                    required
                    multiline
                    rows={4}
                  />
                </Grid>
              </>
            ) : courseContent.learningMaterial === 'assignment' ? (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Assignment Content"
                  name="assignmentContent"
                  value={courseContent.assignmentContent}
                  onChange={handleChange}
                  margin="normal"
                  required
                  multiline
                  rows={6}
                />
              </Grid>
            ) : courseContent.learningMaterial === 'quiz' ? (
              <>
                {[...Array(5)].map((_, i) => (
                  <Grid container spacing={2} key={i}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label={`Question ${i + 1}`}
                        value={courseContent.quizQuestions[i]}
                        onChange={(e) => handleQuizChange(i, 'quizQuestions', e.target.value)}
                        margin="normal"
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label={`Answer ${i + 1}`}
                        value={courseContent.quizAnswers[i]}
                        onChange={(e) => handleQuizChange(i, 'quizAnswers', e.target.value)}
                        margin="normal"
                        required
                      />
                    </Grid>
                  </Grid>
                ))}
              </>
            ) : null}

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={courseContent.description}
                onChange={handleChange}
                margin="normal"
                required
                multiline
                rows={4}
              />
            </Grid>

            <Grid item xs={12}>
              <Button variant="contained" type="submit">
                Add Course Content
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default AddCoursePage;
