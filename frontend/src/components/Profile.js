import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, Avatar, TextField, Button, Select, MenuItem, Paper,InputLabel, FormControl } from '@mui/material';
import axios from 'axios';
import GaugeChart from 'react-gauge-chart';
import { School, BarChart, LibraryBooks, EmojiObjects } from '@mui/icons-material'; // Icons for recommendation sections
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import SchoolIcon from '@mui/icons-material/School';
import SubjectIcon from '@mui/icons-material/Subject';
import { styled } from '@mui/system';
import EditIcon from '@mui/icons-material/Edit';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FlagIcon from '@mui/icons-material/Flag';
import PublicIcon from '@mui/icons-material/Public';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useNavigate } from 'react-router-dom';

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
    courseScore: 0,
    learningScore: 100,
    quizScore: 0,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [courseScore, setCourseScore] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [learningScore, setLearningScore] = useState(0);
  const [interestedSubject, setInterestedSubject] = useState("");
  const [recommendedSub, setRecommendedSub] = useState("");
  const [recommendedComplex, setRecommendedComplex] = useState("");
  const [recommendedContent, setRecommendedContent] = useState("");
  const [preferredStudyTime, setPreferredStudyTime] = useState("");
  const [goal, setGoal] = useState("");
  const [curriculumStructure, setCurriculumStructure] = useState("");
  const [externalFactor, setExternalFactor] = useState("");
  const [timeSpentOnContent, setTimeSpentOnContent] = useState("");
  const [proficiencyLevel, setProficiencyLevel] = useState("");
  const [preferredSubject, setPreferredSubject] = useState("");
  const [availableContent, setAvailableContent] = useState("");
  const [completeRates, setCompletionRates] = useState("");
  const [learningStyle, setLearningStyle] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
          const response = await axios.get(`https://edu-quest-hfoq.vercel.app/api/auth/user/${storedUser._id}`);
          setUserDetails(response.data);
          const userData = response.data;

          setCourseScore(userData.courseScore);
          setQuizScore(userData.quizScore);
          setLearningScore(userData.learningScore);
          setInterestedSubject(userData.interestedSubject);
          setPreferredStudyTime(userData.preferredStudyTime);
          setGoal(userData.goal);
          setCurriculumStructure(userData.curriculumStructure);
          setExternalFactor(userData.externalFactor);
          setTimeSpentOnContent(userData.timeSpentOnContent);
          setPreferredSubject(userData.interestedSubject);
          setCompletionRates(userData.learningScore);

          // Fetch recommendations in sequence
          await handlePathwayInput(userData.courseScore, userData.quizScore, userData.learningScore, userData.interestedSubject);
          await handleRecommendInput(userData.courseScore, userData.quizScore, userData.learningScore, userData.interestedSubject);
          await handleLearningInput(userData.quizScore, userData.preferredStudyTime, userData.goal, userData.curriculumStructure, userData.externalFactor, userData.timeSpentOnContent, userData.recommendedComplex, userData.interestedSubject, userData.recommendedContent, userData.learningScore);
        }
      } catch (error) {
        console.error('Error fetching user details:', error.response?.data || error.message);
      }
    };

    fetchUserDetails();
  }, []);

  const updateUserDetails = async (userDetails) => {
    try {
      const response = await axios.put(`https://edu-quest-hfoq.vercel.app/api/auth/update/${userDetails._id}`, userDetails);
      console.log('User details updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating user details:', error.response?.data || error.message);
      throw error;
    }
  };

  const handleUpdate = async () => {
    try {
      await updateUserDetails(userDetails);
      alert('User details updated successfully!');
      localStorage.setItem('user', JSON.stringify(userDetails));
      setIsEditing(false);
    } catch (error) {
      alert('Failed to update user details.');
    }
  };

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  //Kavindu
  const handleLearningInput = async (quizScore, preferredStudyTime, goal, curriculumStructure, externalFactor, timeSpentOnContent, proficiencyLevel, preferredSubject, availableContent, completeRates) => {
    try {
      const response = await axios.post("http://127.0.0.1:5002/predict", {
        quizScore,
        preferredStudyTime, 
        goal, 
        curriculumStructure, 
        externalFactor, 
        timeSpentOnContent, 
        proficiencyLevel, 
        preferredSubject, 
        availableContent, 
        completeRates
      });

      const learningStyle = response.data.predicted_class;

      setLearningStyle(learningStyle);
      await axios.put(`https://edu-quest-hfoq.vercel.app/api/auth/update/${userDetails._id}`, {
        learningStyle: learningStyle
      });
    } catch (error) {
      console.error("Error fetching recommendation:", error);
    }
  };

  //Pasindu
  const handlePathwayInput = async (courseScore, quizScore, learningScore, interestedSubject) => {
    try {
      const response = await axios.post("http://127.0.0.1:5001/predict", {
        courseScore,
        quizScore,
        learningScore,
        interestedSubject
      });

      const recommendedComplex = response.data.Predicted_Complexity;
      const recommendedContent = response.data.Predicted_Learning_Content;

      setRecommendedComplex(recommendedComplex);
      setRecommendedContent(recommendedContent);
      await axios.put(`https://edu-quest-hfoq.vercel.app/api/auth/update/${userDetails._id}`, {
        recommendedComplex: recommendedComplex,
        recommendedContent: recommendedContent
      });
    } catch (error) {
      console.error("Error fetching recommendation:", error);
    }
  };


  //Sachitha
  const handleRecommendInput = async (courseScore, quizScore, learningScore, interestedSubject) => {
    try {
      const response = await axios.post("http://127.0.0.1:5003/predict", {
        courseScore,
        quizScore,
        learningScore,
        interestedSubject
      });

      const recommendedSubject = response.data.recommendation;

      setRecommendedSub(recommendedSubject);
      await axios.put(`https://edu-quest-hfoq.vercel.app/api/auth/update/${userDetails._id}`, {
        recommendedSub: recommendedSubject
      });
    } catch (error) {
      console.error("Error fetching recommendation:", error);
    }
  };

    // Styled components
  const ProfileCard = styled(Card)(({ theme }) => ({
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '24px',
    transition: 'transform 0.3s',
    '&:hover': {
      transform: 'scale(1.02)',
    },
  }));

  const Background = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'url("/path_to_background_image.jpg")', // Add a custom background image
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: 0.2, // Make it subtle
    zIndex: 1,
  }));

  const ContentWrapper = styled(CardContent)(({ theme }) => ({
    position: 'relative',
    zIndex: 2,
    padding: theme.spacing(3),
    backgroundColor: '#e6e1f4', // Semi-transparent background
    borderRadius: '16px',
  }));

  const InfoContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  }));

  const CustomButton = ({ onClick, children }) => {
    return (
      <Button
        onClick={onClick}
        sx={{
          backgroundColor: '#3e2b71', // Custom color
          color: '#fff', // Text color
          '&:hover': {
            backgroundColor: '#5a4f85', // Darker shade on hover
          },
          display: 'flex', // Flexbox for alignment
          alignItems: 'center', // Center items vertically
          padding: '8px 15px', // Padding for the button
          borderRadius: '5px', // Rounded corners
        }}
      >
        <EditIcon sx={{ marginRight: 1 }} /> {/* Icon with right margin */}
        {children}
      </Button>
    );
  };

  const CustomButtonEng = ({ onClick, children, icon: Icon, ...props }) => {
    return (
      <Button
        variant="contained"
        color="primary"
        onClick={onClick}
        sx={{
          backgroundColor: '#3e2b71', // Custom color
          color: '#fff', // Text color
          '&:hover': {
            backgroundColor: '#5a4f85', // Darker shade on hover
          },
          display: 'flex', // Flexbox for alignment
          alignItems: 'center', // Center items vertically
          padding: '8px 15px', // Padding for the button
          borderRadius: '5px', // Rounded corners
        }}
        {...props}
      >
        {Icon && <Icon sx={{ fontSize: 20 }} />} {/* Render icon if provided */}
        {children}
      </Button>
    );
  };

    const handleNavigate = () => {
    navigate('/course'); // Replace with your actual route
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
      <ProfileCard sx={{ marginBottom: 2 }}>
      <Background />
      <ContentWrapper>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar
              sx={{ width: 80, height: 80, border: '3px solid #3e2b71' }} // Adding a border for emphasis
              src={userDetails.profilePhoto}
            />
          </Grid>
          <Grid item xs>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#3e2b71', marginBottom: '20px' }}>
              : {userDetails.name}
            </Typography>
            <InfoContainer>
              <EmailIcon sx={{ color: '#3e2b71', marginRight: 1 }} />
              <Typography variant="body1">{userDetails.email}</Typography>
            </InfoContainer>
            <InfoContainer>
              <PhoneIcon sx={{ color: '#3e2b71', marginRight: 1 }} />
              <Typography variant="body1">{userDetails.contactNumber}</Typography>
            </InfoContainer>
            <InfoContainer>
              <SchoolIcon sx={{ color: '#3e2b71', marginRight: 1 }} />
              <Typography variant="body1"><strong>Age:</strong> {userDetails.age}</Typography>
            </InfoContainer>
            <InfoContainer>
              <SubjectIcon sx={{ color: '#3e2b71', marginRight: 1 }} />
              <Typography variant="body1"><strong>Profession:</strong> {userDetails.profession}</Typography>
            </InfoContainer>
            <InfoContainer>
              <SubjectIcon sx={{ color: '#3e2b71', marginRight: 1 }} />
              <Typography variant="body1"><strong>Interested Subject:</strong> {userDetails.interestedSubject}</Typography>
            </InfoContainer>
          </Grid>
        </Grid>
      </ContentWrapper>
    </ProfileCard>

    {/* Edit and Update Profile */}
        <Box mt={2} sx={{ marginBottom: 2 }}>
          {isEditing ? (
            <Box component="form">
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Name" name="name" value={userDetails.name} onChange={handleChange} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Email" name="email" value={userDetails.email} onChange={handleChange} disabled />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Age" name="age" value={userDetails.age} onChange={handleChange} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Contact Number" name="contactNumber" value={userDetails.contactNumber} onChange={handleChange} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Profession" name="profession" value={userDetails.profession} onChange={handleChange} />
                </Grid>
                <Grid item xs={12} md={6}>
          <FormControl fullWidth variant="outlined" sx={{ bgcolor: '#fff', borderRadius: 1, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
            <InputLabel>Interested Subject</InputLabel>
            <Select
              name="interestedSubject"
              value={userDetails.interestedSubject}
              onChange={handleChange}
              label="Interested Subject"
            >
              <MenuItem value="" disabled>Select Interested Subject</MenuItem>
              <MenuItem value="Artificial Intelligence and Machine Learning">Artificial Intelligence and Machine Learning</MenuItem>
              <MenuItem value="Cloud Computing">Cloud Computing</MenuItem>
              <MenuItem value="CyberSecurity">CyberSecurity</MenuItem>
              <MenuItem value="Data Science and Analytics">Data Science and Analytics</MenuItem>
              <MenuItem value="Database Management">Database Management</MenuItem>
              <MenuItem value="Devops and Systems Integration">Devops and Systems Integration</MenuItem>
              <MenuItem value="IT Project Management">IT Project Management</MenuItem>
              <MenuItem value="Network and System Administration">Network and System Administration</MenuItem>
              <MenuItem value="Software Engineering and Development">Software Engineering and Development</MenuItem>
              <MenuItem value="Web Development">Web Development</MenuItem>
            </Select>
          </FormControl>
        </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Profile Photo URL"
                    name="profilePhoto"
                    value={userDetails.profilePhoto}
                    onChange={handleChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <CustomButton onClick={handleUpdate}>
                    Update Profile
                  </CustomButton>
                </Grid>
              </Grid>
            </Box>
          ) : (
            <CustomButton onClick={() => setIsEditing(true)}>
              Edit Profile
            </CustomButton>
          )}
        </Box>

     {/* Learning Style */}

     <Box sx={{ p: 4, borderRadius: 2, bgcolor: '#f9f9f9', boxShadow: 3, mb: 1 }}>
    <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold', color: '#3e2b71' }}>
      Your Learning Pathway Key Predictors
    </Typography>
    <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
      This information updates in real time based on your behavior in this environment.
    </Typography>

    <Grid container spacing={3}>
      {/* Predicted Learning Style */}
      <Grid item xs={12} sm={6}>
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, border: '1px solid', borderColor: 'grey.300', borderRadius: 2, bgcolor: '#e6e1f4' }}>
          <EmojiObjectsIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Box>
            <Typography variant="h6">Predicted Learning Style</Typography>
            <Typography color="textSecondary">{userDetails.learningStyle || 'Not Available'}</Typography>
          </Box>
        </Box>
      </Grid>

      {/* Preferred Study Time */}
      <Grid item xs={12} sm={6}>
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, border: '1px solid', borderColor: 'grey.300', borderRadius: 2, bgcolor: '#e6e1f4' }}>
          <AccessTimeIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Box>
            <Typography variant="h6">Preferred Study Time (Current Behavior)</Typography>
            <Typography color="textSecondary">{userDetails.preferredStudyTime || 'Not Available'}</Typography>
          </Box>
        </Box>
      </Grid>

      {/* Analyzed Goal Setting */}
      <Grid item xs={12} sm={6}>
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, border: '1px solid', borderColor: 'grey.300', borderRadius: 2, bgcolor: '#e6e1f4' }}>
          <FlagIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Box>
            <Typography variant="h6">Analyzed Goal Setting</Typography>
            <Typography color="textSecondary">{userDetails.goal || 'Not Available'}</Typography>
          </Box>
        </Box>
      </Grid>

      {/* Analyzed Curriculum Structure */}
      <Grid item xs={12} sm={6}>
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, border: '1px solid', borderColor: 'grey.300', borderRadius: 2, bgcolor: '#e6e1f4' }}>
          <SchoolIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Box>
            <Typography variant="h6">Analyzed Curriculum Structure</Typography>
            <Typography color="textSecondary">{userDetails.curriculumStructure || 'Self-learning'} based</Typography>
          </Box>
        </Box>
      </Grid>

      {/* External Factors Affecting Learning */}
      <Grid item xs={12} sm={6}>
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, border: '1px solid', borderColor: 'grey.300', borderRadius: 2, bgcolor: '#e6e1f4' }}>
          <PublicIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Box>
            <Typography variant="h6">External Factors Affecting Learning</Typography>
            <Typography color="textSecondary">{userDetails.externalFactor || 'Not Available'}</Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>

    {/* Summary Section */}
    <Box sx={{ mt: 4, textAlign: 'center', p: 3, borderRadius: 2, bgcolor: '#69559e', color: '#fff' }}>
      <Typography variant="body1" sx={{ mb: 2 }}>
        View Your Predicted and Analyzed Personalized Learning Pathway, which includes details such as quiz scores, learning scores, course scores, predicted proficiency level, preferred subjects, available content, and completion rates based on your current behavior.
      </Typography>
      <Button variant="contained" sx={{ bgcolor: '#ffffff', color: '#3e2b71', fontWeight: 'bold', '&:hover': { bgcolor: '#e6e6ff' } }}>
        View Your Personalized Learning Pathway
      </Button>
    </Box>
  </Box>

        {/* User Metrics */}
  <Grid container spacing={4} sx={{ mt: 1 }}>
  <Grid item xs={12}>
    <Card elevation={3} sx={{ borderRadius: 3, p: 2, backgroundColor: '#f5f7fa' }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom sx={{ fontWeight: 600, color: '#3e2b71', mb: 2 }}>
          User Performance Metrics
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 3 }}>
          An overview of your latest scores across different assessments
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={4} sx={{ textAlign: 'center' }}>
            <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary' }}>Course Score</Typography>
            <GaugeChart 
              id="gauge-course-score"
              nrOfLevels={5}
              arcsLength={[0.2, 0.4, 0.4]}
              colors={['#FF6B6B', '#FFD93D', '#6BCB77']}
              percent={userDetails.courseScore / 100} 
              animate={true}
              needleColor="#3E517A"
              needleBaseColor="#333"
              textColor="#333"
              style={{ width: '80%', marginTop: '8px' }}
            />
          </Grid>
          <Grid item xs={12} sm={4} sx={{ textAlign: 'center' }}>
            <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary' }}>Learning Score</Typography>
            <GaugeChart 
              id="gauge-learning-score"
              nrOfLevels={5}
              arcsLength={[0.2, 0.4, 0.4]}
              colors={['#FF6B6B', '#FFD93D', '#6BCB77']}
              percent={userDetails.learningScore / 100} 
              animate={true}
              needleColor="#3E517A"
              needleBaseColor="#333"
              textColor="#333"
              style={{ width: '80%', marginTop: '8px' }}
            />
          </Grid>
          <Grid item xs={12} sm={4} sx={{ textAlign: 'center' }}>
            <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary' }}>Quiz Score</Typography>
            <GaugeChart 
              id="gauge-quiz-score"
              nrOfLevels={5}
              arcsLength={[0.2, 0.4, 0.4]}
              colors={['#FF6B6B', '#FFD93D', '#6BCB77']}
              percent={userDetails.quizScore / 100} 
              animate={true}
              needleColor="#3E517A"
              needleBaseColor="#333"
              textColor="#333"
              style={{ width: '80%', marginTop: '8px' }}
            />
          </Grid>
        </Grid>
        <Box textAlign="center" sx={{ mt: 4 }}>
        <CustomButtonEng icon={PlayArrowIcon} onClick={handleNavigate}>
          Start Recommendation Engine
        </CustomButtonEng>
        </Box>
      </CardContent>
    </Card>
  </Grid>
</Grid>
        
        {/* Recommendation Boxes */}
        <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ borderRadius: 3, p: 3, textAlign: 'center', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
            <School sx={{ fontSize: 50, color: 'primary.main', mb: 1 }} />
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Recommended Subject
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1rem' }}>
              {recommendedSub || 'Not Available'}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ borderRadius: 3, p: 3, textAlign: 'center', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
            <BarChart sx={{ fontSize: 50, color: 'secondary.main', mb: 1 }} />
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Predicted Complexity Level
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1rem' }}>
              {recommendedComplex || 'Not Available'}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ borderRadius: 3, p: 3, textAlign: 'center', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
            <LibraryBooks sx={{ fontSize: 50, color: 'info.main', mb: 1 }} />
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Recommended Content
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1rem' }}>
              {recommendedContent || 'Not Available'}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
        
      </Container>
    </Box>
  );
};

export default ProfilePage;
