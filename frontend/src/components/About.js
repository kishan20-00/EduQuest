import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, Divider } from '@mui/material';
import TeamMember1 from '../images/team-member1.jpg';  // Replace with actual image paths
import TeamMember2 from '../images/team-member2.jpg';
import TeamMember3 from '../images/team-member3.jpg';

const teamMembers = [
  {
    name: 'Alice Johnson',
    role: 'CEO',
    image: TeamMember1,
    bio: 'Alice has over 20 years of experience in the industry and leads our team with passion and dedication.',
  },
  {
    name: 'Bob Smith',
    role: 'CTO',
    image: TeamMember2,
    bio: 'Bob is our technology guru, constantly exploring new tech trends and ensuring we stay ahead in innovation.',
  },
  {
    name: 'Charlie Brown',
    role: 'COO',
    image: TeamMember3,
    bio: 'Charlie manages our operations with a focus on efficiency and excellence, ensuring our projects run smoothly.',
  },
];

const AboutUsPage = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        paddingTop: 8,
        paddingBottom: 4,
        backgroundColor: '#f5f5f5',
      }}
    >
      <Container>
        <Typography variant="h2" component="h1" gutterBottom>
          About Us
        </Typography>
        <Typography variant="h5" paragraph>
          At EduQuest, we are dedicated to revolutionizing the way people learn and grow. Our mission is to provide high-quality, accessible, and engaging educational content that empowers learners to achieve their goals and reach their full potential.
        </Typography>
        
        <Divider sx={{ my: 4 }} />

        <Typography variant="h4" gutterBottom>
          Our Team
        </Typography>
        <Grid container spacing={4}>
          {teamMembers.map((member) => (
            <Grid item xs={12} sm={6} md={4} key={member.name}>
              <Card sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={member.image}
                  alt={member.name}
                />
                <CardContent>
                  <Typography variant="h5" component="div">
                    {member.name}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {member.role}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {member.bio}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h4" gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="body1" paragraph>
          We would love to hear from you! If you have any questions or feedback, feel free to reach out to us.
        </Typography>
        <Typography variant="body1">
          <strong>Email:</strong> support@eduquest.com
        </Typography>
        <Typography variant="body1">
          <strong>Phone:</strong> (123) 456-7890
        </Typography>
      </Container>
    </Box>
  );
};

export default AboutUsPage;
