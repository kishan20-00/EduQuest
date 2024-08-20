import React from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, CardMedia, CardActionArea } from '@mui/material';
// import backgroundImage from '../images/your-background-image.jpg';

const courses = [
  {
    id: 1,
    title: 'Cyber Security',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing.',
    image: 'https://www.technologysolutions.net/wp-content/uploads/2023/09/pros-and-cons-scaled-2560x1280.jpeg'
  },
  {
    id: 2,
    title: 'Software Engineering',
    description: 'Quisque nisl eros, pulvinar facilisis justo mollis.',
    image: 'https://www.herzing.edu/sites/default/files/styles/fp_960_480/public/2020-09/how-to-become-software-engineer.jpg.webp?itok=uuamJN8l'
  },
  {
    id: 3,
    title: 'Database Management',
    description: 'Auctor consequat urna. Morbi a bibendum metus.',
    image: 'https://www.exasol.com/app/uploads/2023/12/thumbnail-what-is-a-relational-database.webp'
  },
  {
    id: 4,
    title: 'Machine Learning',
    description: 'Vestibulum ante ipsum primis in faucibus orci luctus.',
    image: 'https://bitrock.it/wp-content/uploads/2023/12/Blog-Post_Visuals-1.png'
  }
];

const HomePage = () => {
  return (
    <Box
      sx={{
        // backgroundImage: `url(${backgroundImage})`,
        // backgroundRepeat: 'no-repeat',
        // backgroundSize: 'cover',
        // backgroundAttachment: 'fixed',
        minHeight: '100vh',
        paddingTop: 8,
        paddingBottom: 4,
      }}
    >
      <Container>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to the EduQuest
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Explore our courses in different areas of Information Technology
        </Typography>
        <Grid container spacing={4}>
          {courses.map((course) => (
            <Grid item key={course.id} xs={12} sm={6} md={4}>
              <Card>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="140"
                    image={course.image}
                    alt={course.title}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {course.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {course.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;
