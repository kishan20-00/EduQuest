import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Card, CardContent, Grid, Avatar, LinearProgress } from '@mui/material';
import axios from 'axios';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarIcon from '@mui/icons-material/Star';
import SubjectIcon from '@mui/icons-material/Subject';
import BarChartIcon from '@mui/icons-material/BarChart';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import NightsStayIcon from '@mui/icons-material/NightsStay';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import StyleIcon from '@mui/icons-material/Style';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import SportsIcon from '@mui/icons-material/Sports';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import GroupIcon from '@mui/icons-material/Group';
import ScoreIcon from '@mui/icons-material/Score';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import QuizIcon from '@mui/icons-material/Quiz';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const ProfilePage = () => {
  const [userDetails, setUserDetails] = useState({
    name: '',
    age: '',
    profession: '',
    learningStyle: '',
    interestedSubject: '',
    quizScore: '',
    preferredStudyTime: '',
    goal: '',
    curriculumStructure: '',
    externalFactor: '',
    timeSpentOnContent: '',
    proficiencyLevel: '',
    availableContent: '',
    completionRates: '',
    courseScore: 0,
    learningScore: 100,
    quizScore: 0,
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
          const response = await axios.get(`https://edu-quest-hfoq.vercel.app/api/auth/user/${storedUser._id}`);
          setUserDetails(response.data);

          // Fetch recommendations with user data
          await handleLearningInput(response.data);
          await handlePathwayInput(response.data);
          await handleRecommendInput(response.data);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleLearningInput = async (userData) => {
    try {
      const response = await axios.post("http://127.0.0.1:5002/predict", userData);
      setUserDetails(prevState => ({
        ...prevState,
        learningStyle: response.data.predicted_class,
      }));
    } catch (error) {
      console.error("Error fetching learning recommendation:", error);
    }
  };

  const handlePathwayInput = async (userData) => {
    try {
      const response = await axios.post("http://127.0.0.1:5001/predict", userData);
      setUserDetails(prevState => ({
        ...prevState,
        proficiencyLevel: response.data.Predicted_Complexity,
        availableContent: response.data.Predicted_Learning_Content,
      }));
    } catch (error) {
      console.error("Error fetching pathway recommendation:", error);
    }
  };

  const handleRecommendInput = async (userData) => {
    try {
      const response = await axios.post("http://127.0.0.1:5003/predict", userData);
      setUserDetails(prevState => ({
        ...prevState,
        interestedSubject: response.data.recommendation,
      }));
    } catch (error) {
      console.error("Error fetching subject recommendation:", error);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', paddingTop: 8, paddingBottom: 1 }}>
  <Container>
    <Box display="flex" alignItems="center">
    <SchoolIcon sx={{ fontSize: 32, marginRight: 1 }} />
    <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Personalized Pathway Analysis
    </Typography>
    </Box>

    <Card sx={{ marginTop: 2 }}>
  <CardContent>
    <Typography sx={{ paddingBottom: 2 }} variant="h6" gutterBottom>Personalized Details and Predicted Results :</Typography>

    {/* Create a grid layout for each card */}
    <Grid container spacing={2}>

      {/* Name Card */}
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
          <Avatar sx={{ bgcolor: '#1976d2', marginRight: 2 }}>
            <PersonIcon />
          </Avatar>
          <Typography variant="body1"><strong>Name:</strong> {userDetails.name}</Typography>
        </Card>
      </Grid>

      {/* Age Card */}
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
          <Avatar sx={{ bgcolor: '#0288d1', marginRight: 2 }}>
            <SchoolIcon />
          </Avatar>
          <Typography variant="body1"><strong>Age:</strong> {userDetails.age}</Typography>
        </Card>
      </Grid>

      {/* Profession Card */}
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
          <Avatar sx={{ bgcolor: '#388e3c', marginRight: 2 }}>
            <WorkIcon />
          </Avatar>
          <Typography variant="body1"><strong>Profession:</strong> {userDetails.profession}</Typography>
        </Card>
      </Grid>

      {/* Learning Style Card */}
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
          <Avatar sx={{ bgcolor: '#8e24aa', marginRight: 2 }}>
            <FitnessCenterIcon />
          </Avatar>
          <Typography variant="body1"><strong>Learning Style:</strong> {userDetails.learningStyle}</Typography>
        </Card>
      </Grid>

      {/* Preferred Subject Card */}
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
          <Avatar sx={{ bgcolor: '#d32f2f', marginRight: 2 }}>
            <SubjectIcon />
          </Avatar>
          <Typography variant="body1"><strong>Preferred Subject:</strong> {userDetails.interestedSubject}</Typography>
        </Card>
      </Grid>

      {/* Proficiency Level Card */}
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
          <Avatar sx={{ bgcolor: '#ff5722', marginRight: 2 }}>
            <StarIcon />
          </Avatar>
          <Typography variant="body1"><strong>Proficiency Level:</strong> {userDetails.proficiencyLevel}</Typography>
        </Card>
      </Grid>

      {/* Preferred Study Time Card */}
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
          <Avatar sx={{ bgcolor: '#7b1fa2', marginRight: 2 }}>
            <AccessTimeIcon />
          </Avatar>
          <Typography variant="body1"><strong>Preferred Study Time:</strong> {userDetails.preferredStudyTime}</Typography>
        </Card>
      </Grid>

       {/* Time spent on different types of content */}
       <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
          <Avatar sx={{ bgcolor: '#003366', marginRight: 2 }}>
            <AccessTimeIcon />
          </Avatar>
          <Typography variant="body1"><strong>Time spent on different types of content:</strong> {userDetails.timeSpentOnContent} min</Typography>
        </Card>
      </Grid>

      {/* Goal Card */}
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
          <Avatar sx={{ bgcolor: '#ff8f00', marginRight: 2 }}>
            <BarChartIcon />
          </Avatar>
          <Typography variant="body1"><strong>Goal:</strong> {userDetails.goal}</Typography>
        </Card>
      </Grid>

      {/* Other Details Card */}
      <Grid item xs={12}>
  <Card sx={{ padding: 2 }}>
    <Typography variant="h5" gutterBottom>Performance Metrics</Typography>
    <Grid container spacing={2}>

      {/* Completion Rates */}
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ display: 'flex', alignItems: 'center', padding: 1 }}>
          <Avatar sx={{ bgcolor: '#1976d2', marginRight: 1 }}>
            <CheckCircleIcon />
          </Avatar>
          <div>
            <Typography variant="body1"><strong>Completion Rates</strong></Typography>
            <Typography variant="body2" color="textSecondary">{userDetails.completionRates}% completed</Typography>
            <LinearProgress variant="determinate" value={userDetails.completionRates} />
          </div>
        </Card>
      </Grid>

      {/* Course Score */}
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ display: 'flex', alignItems: 'center', padding: 1 }}>
          <Avatar sx={{ bgcolor: userDetails.courseScore > 80 ? '#4caf50' : userDetails.courseScore >= 50 ? '#ffb300' : '#d32f2f', marginRight: 1 }}>
            <SchoolIcon />
          </Avatar>
          <div>
            <Typography variant="body1"><strong>Course Score</strong></Typography>
            <Typography variant="body2" color="textSecondary">{userDetails.courseScore}%</Typography>
            <LinearProgress variant="determinate" value={userDetails.courseScore} />
          </div>
        </Card>
      </Grid>

      {/* Learning Score */}
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ display: 'flex', alignItems: 'center', padding: 1 }}>
          <Avatar sx={{ bgcolor: '#00796b', marginRight: 1 }}>
            <EmojiEventsIcon />
          </Avatar>
          <div>
            <Typography variant="body1"><strong>Learning Score</strong></Typography>
            <Typography variant="body2" color="textSecondary">{userDetails.learningScore}%</Typography>
            <LinearProgress variant="determinate" value={userDetails.learningScore} />
          </div>
        </Card>
      </Grid>

      {/* Quiz Score */}
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ display: 'flex', alignItems: 'center', padding: 1 }}>
          <Avatar sx={{ bgcolor: '#ef6c00', marginRight: 1 }}>
            <QuizIcon />
          </Avatar>
          <div>
            <Typography variant="body1"><strong>Quiz Score</strong></Typography>
            <Typography variant="body2" color="textSecondary">{userDetails.quizScore}%</Typography>
            <LinearProgress variant="determinate" value={userDetails.quizScore} />
          </div>
        </Card>
      </Grid>

    </Grid>
  </Card>
</Grid>

    </Grid>
  </CardContent>
</Card>

<Card sx={{ marginTop: 4 }}>
  <CardContent>
  <Box>
  <Box display="flex" alignItems="center">
        <TrendingUpIcon sx={{ fontSize: 28, marginRight: 1 }} />
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Pathway Recommendations
        </Typography>
    </Box>
    <Typography variant="subtitle1" color="textSecondary" marginBottom="10px">
        This recommendation is based on your current behavior
    </Typography>
    </Box>

    <Grid container spacing={2}>

      {/* Proficiency Level Recommendations */}
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
          <Avatar sx={{ bgcolor: '#1976d2', marginRight: 2 }}>
            <SchoolIcon />
          </Avatar>
          <Typography variant="body1">
            {userDetails.proficiencyLevel === 'advanced' ? (
              <><strong>Advanced Pathway:</strong> Engage in specialized projects, peer collaborations, and research articles in {userDetails.interestedSubject}.</>
            ) : (
              <><strong>Beginner Pathway:</strong> Start with foundational courses and interactive resources to build a strong base in {userDetails.interestedSubject}.</>
            )}
          </Typography>
        </Card>
      </Grid>

      {/* Study Time Recommendations */}
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
          <Avatar sx={{ bgcolor: userDetails.preferredStudyTime === 'Night' ? '#8e24aa' : '#fbc02d', marginRight: 2 }}>
            {userDetails.preferredStudyTime === 'Night' ? <NightsStayIcon /> : <WbSunnyIcon />}
          </Avatar>
          <Typography variant="body1">
            {userDetails.preferredStudyTime === 'Night' ? (
              <><strong>Night Study Strategy:</strong> Use recorded lectures and visual summaries to enhance focus at night.</>
            ) : (
              <><strong>Morning Study Strategy:</strong> Start with complex subjects early to maximize morning alertness.</>
            )}
          </Typography>
        </Card>
      </Grid>

      {/* Goal Recommendations */}
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
          <Avatar sx={{ bgcolor: '#388e3c', marginRight: 2 }}>
            <WorkOutlineIcon />
          </Avatar>
          <Typography variant="body1">
            {userDetails.goal === 'Long-term' ? (
              <><strong>Long-term Goal Pathway:</strong> Focus on core topics with project-based assessments for expertise.</>
            ) : (
              <><strong>Short-term Goal Strategy:</strong> Concentrate on high-impact topics with summaries and quick tests.</>
            )}
          </Typography>
        </Card>
      </Grid>

      {/* Curriculum Structure Recommendations */}
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
          <Avatar sx={{ bgcolor: '#ff7043', marginRight: 2 }}>
            <CalendarTodayIcon />
          </Avatar>
          <Typography variant="body1">
            {userDetails.curriculumStructure === 'Exam' ? (
              <><strong>Exam Prep Strategy:</strong> Regular quizzes and flashcards to reinforce memorization.</>
            ) : (
              <><strong>Knowledge Building Pathway:</strong> Dive into in-depth text and videos for thorough understanding.</>
            )}
          </Typography>
        </Card>
      </Grid>

      {/* External Factor Recommendations */}
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
          <Avatar sx={{ bgcolor: '#ff8f00', marginRight: 2 }}>
            <QueryBuilderIcon />
          </Avatar>
          <Typography variant="body1">
            {userDetails.externalFactor === 'Time Constraints' ? (
              <><strong>Time-Saving Tips:</strong> Focus on summaries and concise resources to maximize efficiency.</>
            ) : (
              <><strong>Exam Prep Focus:</strong> Emphasize review quizzes and summaries for consolidation.</>
            )}
          </Typography>
        </Card>
      </Grid>

      {/* Learning Style Recommendations */}
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
          <Avatar sx={{ bgcolor: '#0288d1', marginRight: 2 }}>
            {userDetails.learningStyle === 'Auditory' ? <HeadphonesIcon /> : userDetails.learningStyle === 'Kinesthetic' ? <SportsIcon /> : <VisibilityIcon />}
          </Avatar>
          <Typography variant="body1">
            {userDetails.learningStyle === 'Auditory' ? (
              <><strong>Auditory Learning:</strong> Podcasts and discussions are key to your learning style.</>
            ) : userDetails.learningStyle === 'Kinesthetic' ? (
              <><strong>Kinesthetic Learning:</strong> Hands-on exercises and projects enhance your retention.</>
            ) : (
              <><strong>Visual Learning:</strong> Charts, diagrams, and videos will reinforce understanding.</>
            )}
          </Typography>
        </Card>
      </Grid>

      {/* Age Recommendations */}
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
          <Avatar sx={{ bgcolor: userDetails.age < 18 ? '#7b1fa2' : userDetails.age <= 25 ? '#d32f2f' : '#6d4c41', marginRight: 2 }}>
            {userDetails.age < 18 ? <ChildCareIcon /> : userDetails.age <= 25 ? <GroupIcon /> : <WorkOutlineIcon />}
          </Avatar>
          <Typography variant="body1">
            {userDetails.age < 18 ? (
              <><strong>Young Learner:</strong> Interactive content like animations aid engagement.</>
            ) : userDetails.age <= 25 ? (
              <><strong>College-Age Strategy:</strong> Projects and case studies build practical skills.</>
            ) : (
              <><strong>Adult Learning:</strong> Focus on flexible, self-paced courses.</>
            )}
          </Typography>
        </Card>
      </Grid>

      {/* Score-Based Recommendations */}
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
          <Avatar sx={{ bgcolor: userDetails.courseScore > 80 ? '#009688' : userDetails.courseScore >= 50 ? '#fbc02d' : '#d32f2f', marginRight: 2 }}>
            <ScoreIcon />
          </Avatar>
          <Typography variant="body1">
            {userDetails.courseScore > 80 ? (
              <><strong>High Score Pathway:</strong> Challenge yourself with advanced modules and projects.</>
            ) : userDetails.courseScore >= 50 ? (
              <><strong>Moderate Score Strategy:</strong> Reinforce core concepts with focused practice.</>
            ) : (
              <><strong>Low Score Strategy:</strong> Review foundational content and seek additional resources.</>
            )}
          </Typography>
        </Card>
      </Grid>

    </Grid>
  </CardContent>
</Card>
  </Container>
</Box>

  );
};

export default ProfilePage;
