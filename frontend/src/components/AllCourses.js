import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import StarRating from './StarRating';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import BookIcon from '@mui/icons-material/Book'; 

const ViewCoursesPage = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [recommendedSubjects, setRecommendedSubjects] = useState([]);
  const [recommendedComplex, setRecommendedComplex] = useState([]);
  const [recommendedMaterials, setRecommendedMaterials] = useState([]);
  const [filteredMaterialsCourses, setFilteredMaterialsCourses] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
          const response = await axios.get(`https://edu-quest-hfoq.vercel.app/api/auth/user/${storedUser._id}`);

          const recommendedSub = response.data.recommendedSub;
          const recommendedComplex = response.data.recommendedComplex;
          const recommendedMaterial = response.data.recommendedContent;

          // Set recommended subjects
          if (typeof recommendedSub === 'string') {
            setRecommendedSubjects(recommendedSub.split(',').map(subject => subject.trim()));
          } else if (Array.isArray(recommendedSub)) {
            setRecommendedSubjects(recommendedSub);
          } else {
            setRecommendedSubjects([]);
          }

          // Set recommended complexity
          setRecommendedComplex(recommendedComplex || []);

          // Set recommended materials, ensuring it's an array
          if (Array.isArray(recommendedMaterial)) {
            setRecommendedMaterials(recommendedMaterial);
          } else if (typeof recommendedMaterial === 'string') {
            setRecommendedMaterials(recommendedMaterial.split(',').map(material => material.trim()));
          } else {
            setRecommendedMaterials([]);
          }
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch courses and specializations based on recommended subjects
      await fetchFilteredCourses(recommendedSubjects);
      await fetchFilteredSpecializations(recommendedSubjects);
      await fetchFilteredMaterialsCourses(recommendedComplex, recommendedMaterials);
    };

    // Only fetch data if recommended values are set
    if (recommendedSubjects.length > 0 || recommendedMaterials.length > 0) {
      fetchData();
    }
  }, [recommendedSubjects, recommendedComplex, recommendedMaterials]);

  // Fetch courses based on recommended subjects
  const fetchFilteredCourses = async (subjects) => {
    try {
      if (Array.isArray(subjects) && subjects.length > 0) {
        const coursePromises = subjects.map(subject =>
          axios.get(`https://edu-quest-hfoq.vercel.app/api/content/filter/${subject}`)
        );
        const responses = await Promise.all(coursePromises);
        const allCourses = responses.flatMap(response => response.data);
        setCourses(allCourses);
      }
    } catch (error) {
      console.error('Error fetching filtered courses:', error);
    }
  };

  // Fetch specializations based on recommended subjects
  const fetchFilteredSpecializations = async (subjects) => {
    try {
      if (Array.isArray(subjects) && subjects.length > 0) {
        const specializationPromises = subjects.map(subject =>
          axios.get(`https://edu-quest-hfoq.vercel.app/api/specializations/filter/${subject}`)
        );
        const responses = await Promise.all(specializationPromises);
        const allSpecializations = responses.flatMap(response => response.data);
        setSpecializations(allSpecializations);
      }
    } catch (error) {
      console.error('Error fetching filtered specializations:', error);
    }
  };

  // Fetch courses based on recommended complexity and material
 // Fetch courses based on recommended complexity and a single material
const fetchFilteredMaterialsCourses = async (complexities, material) => {
  try {
      // Ensure complexities is an array
      const complexityArray = Array.isArray(complexities) ? complexities : [complexities];

      if (material) { // Check if material is not null
          const materialPromises = complexityArray.map(complexity => {
              const url = `https://edu-quest-hfoq.vercel.app/api/content/filter/${complexity}/${material}`;
              console.log('Fetching from URL:', url); // Debugging line
              return axios.get(url);
          });
          const responses = await Promise.all(materialPromises);
          const allFilteredCourses = responses.flatMap(response => response.data);
          setFilteredMaterialsCourses(allFilteredCourses);
          console.log('Filtered materials courses:', allFilteredCourses); // Debugging line
      }
  } catch (error) {
      console.error('Error fetching filtered materials courses:', error);
  }
};


const handleCardClick = (id, isSpecialization) => {
  if (!user) {
    alert("Please sign in to view this content."); // Alert the user
    return; // Prevent navigation
  }
  navigate(isSpecialization ? `/specialization/${id}` : `/course/${id}`);
};

  return (
    <Container >
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 11, mb: 2 }}>
      <BookIcon sx={{ mr: 1, fontWeight: '600' }} /> {/* Adjust margin for spacing */}
      <Typography variant="h4" gutterBottom sx={{ fontWeight: '600' }}>
        Recommendation Engine Personalized Predictions
      </Typography>
      
    </Box>

      <Typography variant="h5" gutterBottom>
        Recommended Courses
      </Typography>
      <Grid container spacing={2}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course._id}>
            <Card
              onClick={() => handleCardClick(course._id, false)}
              sx={{
                cursor: 'pointer',
                height: '340px',
                display: 'flex',
                flexDirection: 'column',
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
                <Typography variant="body1" sx={{
                  mt: 2, overflow: 'hidden', textOverflow: 'ellipsis',
                  display: '-webkit-box', WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 3 }}>
                  {course.description}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Subject: {course.subject}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <StarRating rating={parseFloat(course.reviews) || 0} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Recommended Specializations
      </Typography>
      <Grid container spacing={2}>
        {specializations.map((specialization) => (
          <Grid item xs={12} sm={6} md={4} key={specialization._id}>
            <Card
              onClick={() => handleCardClick(specialization._id, true)}
              sx={{
                cursor: 'pointer',
                height: '280px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {specialization.image && (
                <CardMedia
                  component="img"
                  height="140"
                  image={specialization.image}
                  alt={specialization.name}
                />
              )}
              <CardContent sx={{ flex: 1, overflow: 'hidden' }}>
                <Typography variant="h6" noWrap>
                  {specialization.name}
                </Typography>
                <Typography variant="body1" sx={{
                  mt: 2, overflow: 'hidden', textOverflow: 'ellipsis',
                  display: '-webkit-box', WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 3 }}>
                  {specialization.description}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Subject: {specialization.subject}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <StarRating rating={parseFloat(specialization.reviews) || 0} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Recommended Materials
      </Typography>
      <Grid container spacing={2}>
        {filteredMaterialsCourses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course._id}>
            <Card
              onClick={() => handleCardClick(course._id, false)}
              sx={{
                cursor: 'pointer',
                height: '340px',
                display: 'flex',
                flexDirection: 'column',
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
                <Typography variant="body1" sx={{
                  mt: 2, overflow: 'hidden', textOverflow: 'ellipsis',
                  display: '-webkit-box', WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 3 }}>
                  {course.description}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Subject: {course.subject}
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
  );
};

export default ViewCoursesPage;
