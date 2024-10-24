import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import StarRating from './StarRating';  // Import the custom StarRating component

const HomePage = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [complexityFilters, setComplexityFilters] = useState({
    beginner: false,
    intermediate: false,
    advanced: false
  });
  const [learningMaterialFilters, setLearningMaterialFilters] = useState({
    video: false,
    audio: false,
    pdf: false,
    text: false,
    assignment: false,
    quiz: false
  });

  const history = useNavigate(); 

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('https://edu-quest-hfoq.vercel.app/api/content');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleComplexityFilterChange = (e) => {
    const { name, checked } = e.target;
    setComplexityFilters({ ...complexityFilters, [name]: checked });
  };

  const handleLearningMaterialFilterChange = (e) => {
    const { name, checked } = e.target;
    setLearningMaterialFilters({ ...learningMaterialFilters, [name]: checked });
  };

  const filteredCourses = courses
    .filter((course) => {
      const matchesSearchTerm = course.contentName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesComplexityFilter = Object.keys(complexityFilters).some(
        (key) => complexityFilters[key] && course.complexity === key
      ) || Object.values(complexityFilters).every(value => !value);
      const matchesLearningMaterialFilter = Object.keys(learningMaterialFilters).some(
        (key) => learningMaterialFilters[key] && course.learningMaterial === key
      ) || Object.values(learningMaterialFilters).every(value => !value);

      return matchesSearchTerm && matchesComplexityFilter && matchesLearningMaterialFilter;
    });

    const handleCardClick = (courseId) => {
      history(`/course/${courseId}`);  // Navigate to the dynamic course details page
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
        <Typography variant="h5" component="h2" gutterBottom>
          Explore our courses in different areas of Information Technology
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <TextField
            label="Search by Content Name"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearch}
            sx={{ mb: 2 }}
          />
          <Typography variant="h6">Filter by Complexity</Typography>
          <FormGroup row>
            {Object.keys(complexityFilters).map((key) => (
              <FormControlLabel
                key={key}
                control={
                  <Checkbox
                    name={key}
                    checked={complexityFilters[key]}
                    onChange={handleComplexityFilterChange}
                  />
                }
                label={key.charAt(0).toUpperCase() + key.slice(1)}
              />
            ))}
          </FormGroup>
          <Typography variant="h6" sx={{ mt: 4 }}>Filter by Learning Material</Typography>
          <FormGroup row>
            {Object.keys(learningMaterialFilters).map((key) => (
              <FormControlLabel
                key={key}
                control={
                  <Checkbox
                    name={key}
                    checked={learningMaterialFilters[key]}
                    onChange={handleLearningMaterialFilterChange}
                  />
                }
                label={key.charAt(0).toUpperCase() + key.slice(1)}
              />
            ))}
          </FormGroup>
        </Box>
        
        <Grid container spacing={4}>
          {filteredCourses.map((course) => (
            <Grid item key={course._id} xs={12} sm={6} md={4}>
              <Card 
                onClick={() => handleCardClick(course._id)} 
                sx={{ 
                  cursor: 'pointer',
                  height: '350px', // Fixed height for the card
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {course.image && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={course.image}
                    alt={course.contentName}
                  />
                )}
                <CardContent sx={{ flex: 1, overflow: 'hidden' }}>
                  <Typography variant="h6" noWrap>
                    {course.contentName}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 2, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3 }}>
                    {course.description}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Learning Material: {course.learningMaterial}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Complexity: {course.complexity}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <StarRating rating={parseFloat(course.reviews) || 0} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;
