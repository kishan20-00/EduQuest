import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, Avatar, TextField, Button, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import GaugeChart from 'react-gauge-chart';
import { School, BarChart, LibraryBooks, EmojiObjects } from '@mui/icons-material'; // Icons for recommendation sections

const ProfilePage = () => {
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    age: '',
    contactNumber: '',
    profilePhoto: '',
    profession: '',
    interestedSubject: '',
    scores: '',
    focus: '',
    performance: '',
    progress: '',
    courseScore: 0,
    learningScore: 100,
    quizScore: 0,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [courseScore, setCourseScore] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [learningScore, setLearningScore] = useState(0);
  const [interestedSubject, setInterestedSubject] = useState("");
  const [recommendedSub, setRecommendedSub] = useState("");
  const [recommendedComplex, setRecommendedComplex] = useState("");
  const [recommendedContent, setRecommendedContent] = useState("");
  const [preferredStudyTime, setPreferredStudyTime] = useState("");
  const [goal, setGoal] = useState("");
  const [curriculumStructure, setCurriculumStructure] = useState("");
  const [externalFactor, setExternalFactor] = useState("");
  const [timeSpentOnContent, setTimeSpentOnContent] = useState("");
  const [proficiencyLevel, setProficiencyLevel] = useState("");
  const [preferredSubject, setPreferredSubject] = useState("");
  const [availableContent, setAvailableContent] = useState("");
  const [completeRates, setCompletionRates] = useState("");
  const [learningStyle, setLearningStyle] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
          const response = await axios.get(`https://edu-quest-hfoq.vercel.app/api/auth/user/${storedUser._id}`);
          setUserDetails(response.data);
          const userData = response.data;

          setCourseScore(userData.courseScore);
          setQuizScore(userData.quizScore);
          setLearningScore(userData.learningScore);
          setInterestedSubject(userData.interestedSubject);
          setPreferredStudyTime(userData.preferredStudyTime);
          setGoal(userData.goal);
          setCurriculumStructure(userData.curriculumStructure);
          setExternalFactor(userData.externalFactor);
          setTimeSpentOnContent(userData.timeSpentOnContent);
          setPreferredSubject(userData.interestedSubject);
          setCompletionRates(userData.learningScore);

          // Fetch recommendations in sequence
          await handlePathwayInput(userData.courseScore, userData.quizScore, userData.learningScore, userData.interestedSubject);
          await handleRecommendInput(userData.courseScore, userData.quizScore, userData.learningScore, userData.interestedSubject);
          await handleLearningInput(userData.quizScore, userData.preferredStudyTime, userData.goal, userData.curriculumStructure, userData.externalFactor, userData.timeSpentOnContent, userData.recommendedComplex, userData.interestedSubject, userData.recommendedContent, userData.learningScore);
        }
      } catch (error) {
        console.error('Error fetching user details:', error.response?.data || error.message);
      }
    };

    fetchUserDetails();
  }, []);

  const updateUserDetails = async (userDetails) => {
    try {
      const response = await axios.put(`https://edu-quest-hfoq.vercel.app/api/auth/update/${userDetails._id}`, userDetails);
      console.log('User details updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating user details:', error.response?.data || error.message);
      throw error;
    }
  };

  const handleUpdate = async () => {
    try {
      await updateUserDetails(userDetails);
      alert('User details updated successfully!');
      localStorage.setItem('user', JSON.stringify(userDetails));
      setIsEditing(false);
    } catch (error) {
      alert('Failed to update user details.');
    }
  };

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  //Kavindu
  const handleLearningInput = async (quizScore, preferredStudyTime, goal, curriculumStructure, externalFactor, timeSpentOnContent, proficiencyLevel, preferredSubject, availableContent, completeRates) => {
    try {
      const response = await axios.post("http://127.0.0.1:5002/predict", {
        quizScore,
        preferredStudyTime, 
        goal, 
        curriculumStructure, 
        externalFactor, 
        timeSpentOnContent, 
        proficiencyLevel, 
        preferredSubject, 
        availableContent, 
        completeRates
      });

      const learningStyle = response.data.predicted_class;

      setLearningStyle(learningStyle);
      await axios.put(`https://edu-quest-hfoq.vercel.app/api/auth/update/${userDetails._id}`, {
        learningStyle: learningStyle
      });
    } catch (error) {
      console.error("Error fetching recommendation:", error);
    }
  };

  //Pasindu
  const handlePathwayInput = async (courseScore, quizScore, learningScore, interestedSubject) => {
    try {
      const response = await axios.post("http://127.0.0.1:5001/predict", {
        courseScore,
        quizScore,
        learningScore,
        interestedSubject
      });

      const recommendedComplex = response.data.Predicted_Complexity;
      const recommendedContent = response.data.Predicted_Learning_Content;

      setRecommendedComplex(recommendedComplex);
      setRecommendedContent(recommendedContent);
      await axios.put(`https://edu-quest-hfoq.vercel.app/api/auth/update/${userDetails._id}`, {
        recommendedComplex: recommendedComplex,
        recommendedContent: recommendedContent
      });
    } catch (error) {
      console.error("Error fetching recommendation:", error);
    }
  };


  //Sachitha
  const handleRecommendInput = async (courseScore, quizScore, learningScore, interestedSubject) => {
    try {
      const response = await axios.post("http://127.0.0.1:5003/predict", {
        courseScore,
        quizScore,
        learningScore,
        interestedSubject
      });

      const recommendedSubject = response.data.recommendation;

      setRecommendedSub(recommendedSubject);
      await axios.put(`https://edu-quest-hfoq.vercel.app/api/auth/update/${userDetails._id}`, {
        recommendedSub: recommendedSubject
      });
    } catch (error) {
      console.error("Error fetching recommendation:", error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        paddingTop: 8,
        paddingBottom: 4,
      }}
    >
      <Container>
        {/* User Details */}
        <Card sx={{ marginBottom: 4 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Avatar
                  sx={{ width: 56, height: 56 }}
                  src={userDetails.profilePhoto} // Display profile photo if available
                />
              </Grid>
              <Grid item>
                <Typography variant="h5">{userDetails.name}</Typography>
                <Typography variant="body1">{userDetails.email}</Typography>
                <Typography variant="body2">Age: {userDetails.age}</Typography>
                <Typography variant="body2">Contact Number: {userDetails.contactNumber}</Typography>
                <Typography variant="body2">Profession: {userDetails.profession}</Typography>
                <Typography variant="body2">Interested Subject: {userDetails.interestedSubject}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, padding: 2, border: '1px solid', borderRadius: 2, borderColor: 'grey.300' }}>
          <EmojiObjects sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Box>
            <Typography variant="h6">Learning Style</Typography>
            <Typography color="textSecondary">{userDetails.learningStyle || 'Not Available'}</Typography>
          </Box>
        </Box>

        {/* User Metrics */}
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  Scores
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="body1">Course Score</Typography>
                    <GaugeChart 
                      id="gauge-course-score"
                      nrOfLevels={5}
                      arcsLength={[0.2, 0.4, 0.4]}
                      colors={['#FF0000', '#FFFF00', '#00FF00']}
                      percent={userDetails.courseScore / 100} // Normalize score to a percentage
                      style={{ width: '100%' }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body1">Learning Score</Typography>
                    <GaugeChart 
                      id="gauge-learning-score"
                      nrOfLevels={5}
                      arcsLength={[0.2, 0.4, 0.4]}
                      colors={['#FF0000', '#FFFF00', '#00FF00']}
                      percent={userDetails.learningScore / 100} // Normalize score to a percentage
                      style={{ width: '100%' }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body1">Quiz Score</Typography>
                    <GaugeChart 
                      id="gauge-quiz-score"
                      nrOfLevels={5}
                      arcsLength={[0.2, 0.4, 0.4]}
                      colors={['#FF0000', '#FFFF00', '#00FF00']}
                      percent={userDetails.quizScore / 100} // Normalize score to a percentage
                      style={{ width: '100%' }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Recommendation Boxes */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Box sx={{ border: 1, borderRadius: 2, padding: 2, textAlign: 'center' }}>
              <School sx={{ fontSize: 40, color: 'primary.main' }} />
              <Typography variant="h6">Recommended Subject</Typography>
              <Typography variant="body1" color="textSecondary">{recommendedSub || 'Not Available'}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ border: 1, borderRadius: 2, padding: 2, textAlign: 'center' }}>
              <BarChart sx={{ fontSize: 40, color: 'secondary.main' }} />
              <Typography variant="h6">Recommended Complexity</Typography>
              <Typography variant="body1" color="textSecondary">{recommendedComplex || 'Not Available'}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ border: 1, borderRadius: 2, padding: 2, textAlign: 'center' }}>
              <LibraryBooks sx={{ fontSize: 40, color: 'info.main' }} />
              <Typography variant="h6">Recommended Content</Typography>
              <Typography variant="body1" color="textSecondary">{recommendedContent || 'Not Available'}</Typography>
            </Box>
          </Grid>
        </Grid>
        {/* Edit and Update Profile */}
        <Box mt={4}>
          {isEditing ? (
            <Box component="form">
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Name" name="name" value={userDetails.name} onChange={handleChange} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Email" name="email" value={userDetails.email} onChange={handleChange} disabled />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Age" name="age" value={userDetails.age} onChange={handleChange} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Contact Number" name="contactNumber" value={userDetails.contactNumber} onChange={handleChange} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Profession" name="profession" value={userDetails.profession} onChange={handleChange} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Select
                    fullWidth
                    label="Interested Subject"
                    name="interestedSubject"
                    value={userDetails.interestedSubject}
                    onChange={handleChange}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      Select Interested Subject
                    </MenuItem>
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
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Profile Photo URL"
                    name="profilePhoto"
                    value={userDetails.profilePhoto}
                    onChange={handleChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" onClick={handleUpdate}>
                    Update Profile
                  </Button>
                </Grid>
              </Grid>
            </Box>
          ) : (
            <Button variant="contained" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default ProfilePage;
