import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext'; // Make sure the path is correct
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
import StarRating from './StarRating';

const HomePage = () => {
  const { user } = useContext(AuthContext); // Access the user from the AuthContext
  const [courses, setCourses] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [complexityFilters, setComplexityFilters] = useState({
    beginner: false,
    intermediate: false,
    advanced: false,
  });
  const [learningMaterialFilters, setLearningMaterialFilters] = useState({
    video: false,
    audio: false,
    pdf: false,
    text: false,
    assignment: false,
    quiz: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
    fetchSpecializations();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('https://edu-quest-hfoq.vercel.app/api/content');
      // Assuming each course object includes an 'averageRating' field from the API response
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchSpecializations = async () => {
    try {
      const response = await axios.get('https://edu-quest-hfoq.vercel.app/api/specializations');
      setSpecializations(response.data);
    } catch (error) {
      console.error('Error fetching specializations:', error);
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

  const filterByComplexity = (item) => {
    const itemComplexity = item.complexity.toLowerCase();
    return (
      Object.keys(complexityFilters).some((key) => complexityFilters[key] && itemComplexity === key) ||
      Object.values(complexityFilters).every((value) => !value)
    );
  };

  const filterByLearningMaterial = (item) => {
    const itemLearningMaterial = item.learningMaterial;
    return (
      Object.keys(learningMaterialFilters).some(
        (key) => learningMaterialFilters[key] && itemLearningMaterial === key
      ) || Object.values(learningMaterialFilters).every((value) => !value)
    );
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.contentName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      filterByComplexity(course) &&
      filterByLearningMaterial(course)
  );

  const filteredSpecializations = specializations.filter(
    (spec) =>
      spec.name.toLowerCase().includes(searchTerm.toLowerCase()) && filterByComplexity(spec)
  );

  const handleCardClick = (id, isSpecialization) => {
    if (!user) {
      alert("Please sign in to view this content."); // Alert the user
      return; // Prevent navigation
    }
    navigate(isSpecialization ? `/specialization/${id}` : `/course/${id}`);
  };

  return (
    <Box sx={{ minHeight: '100vh', paddingTop: 8, paddingBottom: 4 }}>
      <Container>
        <Typography variant="h5" component="h2" gutterBottom>
          Explore our courses and specializations in different areas of Information Technology
        </Typography>

        <Box sx={{ mb: 4 }}>
          <TextField
            label="Search by Name"
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
          <Typography variant="h6" sx={{ mt: 4 }}>
            Filter by Learning Material
          </Typography>
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

        {/* Specializations Section */}
        <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
          Specializations
        </Typography>
        <Grid container spacing={4}>
          {filteredSpecializations.map((specialization) => (
            <Grid item key={specialization._id} xs={12} sm={6} md={4}>
              <Card
                onClick={() => handleCardClick(specialization._id, true)}
                sx={{ cursor: 'pointer' }}
              >
                {specialization.image && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={specialization.image}
                    alt={specialization.name}
                  />
                )}
                <CardContent>
                  <Typography variant="h6">{specialization.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Courses: {specialization.courses.length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Complexity: {specialization.complexity}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Courses Section */}
        <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
          Courses
        </Typography>
        <Grid container spacing={4}>
          {filteredCourses.map((course) => (
            <Grid item key={course._id} xs={12} sm={6} md={4}>
              <Card
                onClick={() => handleCardClick(course._id, false)}
                sx={{ cursor: 'pointer', height: '350px', display: 'flex', flexDirection: 'column' }}
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
                  <Typography
                    variant="body1"
                    sx={{
                      mt: 2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 3,
                    }}
                  >
                    {course.description}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Learning Material: {course.learningMaterial}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Complexity: {course.complexity}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <StarRating rating={course.averageRating || 0} /> {/* Displaying average rating */}
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
