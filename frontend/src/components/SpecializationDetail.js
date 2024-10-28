import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
} from '@mui/material';

const SpecializationDetail = () => {
  const { specializationId } = useParams(); // Retrieve specializationId from URL
  const [specialization, setSpecialization] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSpecialization();
  }, [specializationId]);

  const fetchSpecialization = async () => {
    try {
      const response = await axios.get(`https://edu-quest-hfoq.vercel.app/api/specializations/${specializationId}`);
      setSpecialization(response.data);
    } catch (error) {
      console.error('Error fetching specialization details:', error);
    }
  };

  if (!specialization) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  return (
    <Box sx={{ minHeight: '100vh', paddingTop: 8, paddingBottom: 4, backgroundColor: '#f9f9f9' }}>
      <Container>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          {specialization.name}
        </Typography>
        
        {specialization.image && (
          <CardMedia
            component="img"
            height="300"
            image={specialization.image}
            alt={specialization.name}
            sx={{ borderRadius: 2, mb: 4 }}
          />
        )}

        <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
          Courses in this Specialization:
        </Typography>

        <Grid container spacing={4}>
          {specialization.courses.map((course) => (
            <Grid item key={course._id} xs={12} sm={6} md={4}>
              <Card
                onClick={() => handleCourseClick(course._id)}
                sx={{
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 3,
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'scale(1.02)',
                    transition: '0.3s',
                  },
                }}
              >
                {course.image && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={course.image}
                    alt={course.contentName}
                    sx={{ borderRadius: '2px 2px 0 0' }}
                  />
                )}
                <CardContent>
                  <Typography variant="h6" noWrap sx={{ fontWeight: 'bold' }}>
                    {course.contentName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Complexity: {course.complexity}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Learning Material: {course.learningMaterial}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default SpecializationDetail;
