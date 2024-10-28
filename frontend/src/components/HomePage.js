import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
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
  CardActions,
  Button,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList'; 
import AssessmentIcon from '@mui/icons-material/Assessment'; 
import StarRating from './StarRating';
import SearchIcon from '@mui/icons-material/Search';
import { keyframes } from '@mui/system';
import Logo from '../assets/logo.png'
import { Explore, Assessment, School, EmojiObjects, Dashboard, Login  } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
import BookIcon from '@mui/icons-material/Book';

const HomePage = () => {
  const { user } = useContext(AuthContext);
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
      alert("Please sign in to view this content.");
      return;
    }
    navigate(isSpecialization ? `/specialization/${id}` : `/course/${id}`);
  };

  const bounceAnimation = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const discoverRef = useRef(null);

// Function to scroll to the discover section with an offset
const scrollToDiscover = () => {
  const offset = 100; // Adjust this value based on your navbar height
  const topPosition = discoverRef.current.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: topPosition, behavior: 'smooth' });
};

const CustomButton = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px 22px',
        backgroundColor: '#3e2b71', // Custom color
        color: '#fff',
        borderRadius: '5px',
        cursor: 'pointer',
        textDecoration: 'none',
        transition: 'background-color 0.3s ease, transform 0.2s ease',
        '&:hover': {
          backgroundColor: '#5a4485', // Lighter shade for hover effect
          transform: 'scale(1.05)', // Slightly enlarge on hover
        },
        '&:active': {
          transform: 'scale(0.95)', // Shrink on click
        },
      }}
    >
      <Typography variant="button" sx={{ fontWeight: 'bold' }}>
        {children}
      </Typography>
    </Box>
  );
};

  return (
    <Box sx={{ minHeight: '100vh', paddingTop: 8, paddingBottom: 4, bgcolor: '#f9f9f9' }}>
      <Container>

      <Box sx={{ position: 'relative', height: 'auto', bgcolor: '#fff', color: '#fff' }}>
      <Box
        component="img"
        src="https://www.wiley.com/learn/jossey-bass/images/what-every-teacher-should-know-about-the-science-of-learning.jpg" // Replace with your logo path
        alt="Background"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'brightness(0.4)',
          borderRadius: '10px'
        }}
      />
      <Container sx={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: 4, marginBottom: '30px' }}>
        {/* Logo with animation */}
        <Box
          component="img"
          src={Logo} // Replace with your actual logo path
          alt="LearnPath+ Logo"
          sx={{
            mb: 2,
            animation: `${bounceAnimation} 2s infinite`, // Apply bounce animation
            width: '170px', // Adjust logo size
          }}
        />
        <Typography variant="h2" component="h1" sx={{ mb: 2, fontWeight: 'bold' }}>
          Welcome to LearnPath+
        </Typography>
        {user ? (<>
        <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
          Experience a new dimension of education at your fingertips.!
        </Typography>
        <Button variant="contained" sx={{ bgcolor: '#fff', color: 'rgb(5, 40, 53)', marginBottom: 2 }} startIcon={<Explore />} onClick={scrollToDiscover}>
          Explore Courses
        </Button>
        <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
          Know Your Learning Goals
        </Typography>
        <Button variant="outlined" sx={{ borderColor: '#fff', color: '#fff', marginBottom: 2 }} startIcon={<Assessment />}>
          Learn More
        </Button>
        <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
          Make the Best Personalized Learning Pathway For You
        </Typography>
        <Button variant="outlined" sx={{ borderColor: '#fff', color: '#fff', marginBottom: 2 }} startIcon={<School />}>
          Get Started
        </Button>
        <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
          Use Our Personalized Recommendations
        </Typography>
        <Button variant="outlined" sx={{ borderColor: '#fff', color: '#fff', marginBottom: 2 }} startIcon={<EmojiObjects  />}>
          Explore Now
        </Button>
        <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
          View Your Analysis Profile
        </Typography>
        <Button variant="outlined" sx={{ borderColor: '#fff', color: '#fff', marginBottom: 2 }} startIcon={<Dashboard />} component={RouterLink} to="/profile">
          Visit Dashboard
        </Button>
        </>
        ) : (
          <>
          <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
          Experience a new dimension of education at your fingertips.!
        </Typography>
        <Button variant="outlined" sx={{ borderColor: '#fff', color: '#fff', marginBottom: 2 }} startIcon={<Login />} component={RouterLink} to="/signin">
         Sign In Now.!
        </Button>
        </>
        )}
      </Container>
    </Box>

        <div ref={discoverRef}>
        <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold', color: '#37474f' }}>
        Discover Courses & Specializations <School />
        </Typography>
        </div>

        <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
          <TextField
            label="Search anything here.."
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearch}
            sx={{ bgcolor: '#ffffff', borderRadius: 1 }}
          />
          <Button
          variant="contained"
          size="large"
          startIcon={<SearchIcon />}
          sx={{
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            color: '#fff',
            paddingX: 3,
            paddingY: 1.5,
            boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.3)',
            transition: 'background 0.3s ease, box-shadow 0.3s ease', // Smooth transition
            '&:hover': {
              background: 'linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)',
              boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.4)',
            },
          }}
        >
          Search
        </Button>
        </Box>

        {/* Filters Section */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
      {/* Complexity Filter Card */}
      <Grid item xs={12} md={6}>
        <Card sx={{ bgcolor: '#e8ebce', boxShadow: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <FilterListIcon color="rgb(5, 40, 53)" sx={{ mr: 1 }} />
              <Typography variant="h6" color="rgb(5, 40, 53)" fontWeight="600">Filter by Complexity</Typography>
            </Box>
            <FormGroup row>
              {Object.keys(complexityFilters).map((key) => (
                <FormControlLabel
                  key={key}
                  control={
                    <Checkbox
                      name={key}
                      checked={complexityFilters[key]}
                      onChange={handleComplexityFilterChange}
                      sx={{ '&.Mui-checked': { color: '#4A90a1' } }} // Custom checked color
                    />
                  }
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  sx={{ '& .MuiFormControlLabel-label': { fontWeight: 'bold' } }} // Bold label
                />
              ))}
            </FormGroup>
          </CardContent>
        </Card>
      </Grid>

      {/* Learning Material Filter Card */}
      <Grid item xs={12} md={6}>
        <Card sx={{ bgcolor: '#d5dcf3', boxShadow: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <AssessmentIcon color="rgb(5, 40, 53)" sx={{ mr: 1 }} />
              <Typography variant="h6" color="rgb(5, 40, 53)" fontWeight="600">Filter by Learning Material</Typography>
            </Box>
            <FormGroup row>
              {Object.keys(learningMaterialFilters).map((key) => (
                <FormControlLabel
                  key={key}
                  control={
                    <Checkbox
                      name={key}
                      checked={learningMaterialFilters[key]}
                      onChange={handleLearningMaterialFilterChange}
                      sx={{ '&.Mui-checked': { color: '#4A90a1' } }} // Custom checked color
                    />
                  }
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  sx={{ '& .MuiFormControlLabel-label': { fontWeight: 'bold' } }} // Bold label
                />
              ))}
            </FormGroup>
          </CardContent>
        </Card>
      </Grid>
    </Grid>

        {/* Specializations Section */}
    <Box display="flex" alignItems="center" sx={{ mt: 4, mb: 2 }}>
      <StarIcon color="primary" sx={{ mr: 1, color: 'rgb(5, 40, 53)' }} /> {/* Icon with margin */}
      <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: 'rgb(5, 40, 53)' }}>
        Specializations
      </Typography>
    </Box>
        <Grid container spacing={4}>
          {filteredSpecializations.map((specialization) => (
            <Grid item key={specialization._id} xs={12} sm={6} md={4}>
              <Card
                onClick={() => handleCardClick(specialization._id, true)}
                sx={{ cursor: 'pointer', boxShadow: 3, '&:hover': { boxShadow: 6 } }}
              >
                {specialization.image && (
                  <CardMedia
                    component="img"
                    height="160"
                    image={specialization.image}
                    alt={specialization.name}
                    sx={{ filter: 'brightness(85%)' }}
                  />
                )}
                <CardContent>
                  <Typography variant="h6" gutterBottom>{specialization.name}</Typography>
                  <Typography variant="body2" color="textSecondary">Courses: {specialization.courses.length}</Typography>
                  <Typography variant="body2" color="textSecondary">Complexity: {specialization.complexity}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Courses Section */}
    <Box display="flex" alignItems="center" sx={{ mt: 4, mb: 2 }}>
      <BookIcon color="primary" sx={{ mr: 1, color: 'rgb(5, 40, 53)'}} /> {/* Icon with margin */}
      <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: 'rgb(5, 40, 53)' }}>
        Courses
      </Typography>
    </Box>
        <Grid container spacing={4}>
          {filteredCourses.map((course) => (
            <Grid item key={course._id} xs={12} sm={6} md={4}>
              <Card
                onClick={() => handleCardClick(course._id, false)}
                sx={{ cursor: 'pointer', height: '400px', display: 'flex', flexDirection: 'column', boxShadow: 3, '&:hover': { boxShadow: 6 } }}
              >
                {course.image && (
                  <CardMedia
                    component="img"
                    height="160"
                    image={course.image}
                    alt={course.contentName}
                    sx={{ filter: 'brightness(85%)' }}
                  />
                )}
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>{course.contentName}</Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3 }}
                  >
                    {course.description}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">Learning Material: {course.learningMaterial}</Typography>
                  <Typography variant="body2" color="textSecondary">Complexity: {course.complexity}</Typography>
                </CardContent>
                <CardActions sx={{ padding: 2, justifyContent: 'space-between' }}>
                  <StarRating rating={course.averageRating || 0} />
                  <CustomButton>
                    Enroll Now
                  </CustomButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;
