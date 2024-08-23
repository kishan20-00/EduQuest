import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, Avatar, TextField, Button } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import axios from 'axios';

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
  });

  const [isEditing, setIsEditing] = useState(false);
  
  // State for prediction inputs and results
  const [predictionInputs, setPredictionInputs] = useState({
    "Proficiency level": '',
    "Preferred subjects": '',
    "Preferred study times": '',
    "Goals": '',
    "Curriculum structure": '',
    "Available content": '',
    "External factors": '',
    'Time spent on different types of content': '',
    'Completion rates': '',
    'Quiz scores': ''
  });

  const [pathwayInputs, setPathwayInputs] = useState({
    "Subject": '',
    "Course Score": '',
    "Learning Score": '',
    "Quiz Score": ''
  });

  const [recommendInputs, setRecommendInputs] = useState({
    'subject': '',
    'course_score': '',
    'learning_score': '',
    'quiz_score': ''
  });
  
  const [predictionResult, setPredictionResult] = useState('');
  const [predictionComplexity, setPredictionComplexity] = useState('');
  const [predictionLearningContent, setPredictionLearningContent] = useState('');
  const [predictionRecommendation, setPredictionRecommendation] = useState('');

  useEffect(() => {
    // Fetch user data from localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUserDetails(storedUser);
    }
  }, []);

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserDetails({ ...userDetails, profilePhoto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = () => {
    // Update user data in localStorage
    localStorage.setItem('user', JSON.stringify(userDetails));
    setIsEditing(false);
  };

  // Handle input change for prediction form
  const handlePredictionChange = (e) => {
    const { name, value } = e.target;
  
    // Convert specific fields to numbers
    if (
      name === 'Time spent on different types of content' ||
      name === 'Completion rates' ||
      name === 'Quiz scores'
    ) {
      setPredictionInputs({ ...predictionInputs, [name]: Number(value) });
    } else {
      setPredictionInputs({ ...predictionInputs, [name]: value });
    }
  };

  // Handle input change for prediction form
  const handlePathwayChange = (e) => {
    const { name, value } = e.target;
  
    // Convert specific fields to numbers
    if (
      name === 'Course Score' ||
      name === 'Learning Score' ||
      name === 'Quiz Score'
    ) {
      setPathwayInputs({ ...pathwayInputs, [name]: Number(value) });
    } else {
      setPathwayInputs({ ...pathwayInputs, [name]: value });
    }
  };

  // Handle input change for prediction form
  const handleRecommendChange = (e) => {
    const { name, value } = e.target;
  
    // Convert specific fields to numbers
    if (
      name === 'course_score' ||
      name === 'learning_score' ||
      name === 'quiz_score'
    ) {
      setRecommendInputs({ ...recommendInputs, [name]: Number(value) });
    } else {
      setRecommendInputs({ ...recommendInputs, [name]: value });
    }
  };

  // Handle form submission for prediction
  const handlePredictionSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', predictionInputs);
      setPredictionResult(response.data.predicted_class);
    } catch (error) {
      console.error('Error making prediction:', error);
    }
  };

  // Handle form submission for prediction
  const handlePathwaySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', pathwayInputs);
      setPredictionComplexity(response.data.Predicted_Complexity);
      setPredictionLearningContent(response.data.Predicted_Learning_Content);
    } catch (error) {
      console.error('Error making prediction:', error);
    }
  };

  // Handle form submission for prediction
  const handleRecommendSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', recommendInputs);
      setPredictionRecommendation(response.data.recommendation);
    } catch (error) {
      console.error('Error making prediction:', error);
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
        
        {/* User Metrics */}
        <Grid container spacing={4}>
          {/* Display user metrics (Scores, Focus, Performance, Progress) */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  Scores
                </Typography>
                <Typography variant="body1">
                  {userDetails.scores}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  Focus
                </Typography>
                <Typography variant="body1">
                  {userDetails.focus}
                </Typography>

                <form onSubmit={handlePathwaySubmit}>
                  {Object.keys(pathwayInputs).map((key) => (
                    <div key={key}>
                      <TextField
                        fullWidth
                        label={key}
                        name={key}
                        value={pathwayInputs[key]}
                        onChange={handlePathwayChange}
                        margin="normal"
                      />
                    </div>
                  ))}
                  <Button variant="contained" type="submit">Predict</Button>
                </form>

                {/* Display Prediction Result */}
                {predictionComplexity && (
                  <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                    Predicted Complexity: {predictionComplexity}
                  </Typography>
                )}
                {predictionLearningContent && (
                  <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                    Predicted Learning Content: {predictionLearningContent}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  Performance
                </Typography>
                <Typography variant="body1">
                  {userDetails.performance}
                </Typography>
                <form onSubmit={handleRecommendSubmit}>
                  {Object.keys(recommendInputs).map((key) => (
                    <div key={key}>
                      <TextField
                        fullWidth
                        label={key}
                        name={key}
                        value={recommendInputs[key]}
                        onChange={handleRecommendChange}
                        margin="normal"
                      />
                    </div>
                  ))}
                  <Button variant="contained" type="submit">Predict</Button>
                </form>

                {/* Display Prediction Result */}
                {predictionRecommendation && (
                  <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                    Predicted Recommendation: {predictionRecommendation}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  Progress
                </Typography>
                <Typography variant="body1">
                  {userDetails.progress}
                </Typography>

                {/* Prediction Form */}
                <form onSubmit={handlePredictionSubmit}>
                  {Object.keys(predictionInputs).map((key) => (
                    <div key={key}>
                      <TextField
                        fullWidth
                        label={key}
                        name={key}
                        value={predictionInputs[key]}
                        onChange={handlePredictionChange}
                        margin="normal"
                      />
                    </div>
                  ))}
                  <Button variant="contained" type="submit">Predict</Button>
                </form>

                {/* Display Prediction Result */}
                {predictionResult && (
                  <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                    Predicted Class: {predictionResult}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Edit and Update Profile */}
        <Box mt={4}>
          {isEditing ? (
            <Box component="form">
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={userDetails.name}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={userDetails.email}
                    onChange={handleChange}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Age"
                    name="age"
                    value={userDetails.age}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Contact Number"
                    name="contactNumber"
                    value={userDetails.contactNumber}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Profession"
                    name="profession"
                    value={userDetails.profession}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Interested Subject"
                    name="interestedSubject"
                    value={userDetails.interestedSubject}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<PhotoCamera />}
                  >
                    Upload Profile Photo
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handlePhotoUpload}
                    />
                  </Button>
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
