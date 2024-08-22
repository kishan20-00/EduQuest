import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, Avatar, TextField, Button } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';

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
