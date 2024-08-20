import React from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, Avatar } from '@mui/material';

const ProfilePage = () => {
  const userDetails = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    scores: '85%',
    focus: 'High',
    performance: 'Good',
    progress: '75%'
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
                <Avatar sx={{ width: 56, height: 56 }}>JD</Avatar>
              </Grid>
              <Grid item>
                <Typography variant="h5">{userDetails.name}</Typography>
                <Typography variant="body1">{userDetails.email}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        {/* User Metrics */}
        <Grid container spacing={4}>
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
      </Container>
    </Box>
  );
};

export default ProfilePage;
