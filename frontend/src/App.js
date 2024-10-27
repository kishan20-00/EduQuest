import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './components/Signin';
import SignUp from './components/Signup';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import HomePage from './components/HomePage';
import NavBar from './components/Navbar';
import ProfilePage from './components/Profile';
import EyeTrackingVideo from './components/Video';
import AddCoursePage from './components/AddCourse';
import ViewCoursesPage from './components/AllCourses';
import AboutUsPage from './components/About';
import CourseDetailsPage from './components/CourseDetailsPage';
import AddSpecialization from './components/AddSpecialization';
import SpecializationDetail from './components/SpecializationDetail';
import { Box } from '@mui/material';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const lightTheme = createTheme({
    palette: {
      mode: 'light',
    },
  });

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  return (
    <Router>
      <AuthProvider>
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
          <CssBaseline />
          <NavBar darkMode={darkMode} setDarkMode={setDarkMode} />
          
          
          <Box sx={{ mt: 4 }}> 
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/video" element={<EyeTrackingVideo />} />
              <Route path="/addcourse" element={<AddCoursePage />} />
              <Route path="/course" element={<ViewCoursesPage />} />
              <Route path="/about" element={<AboutUsPage />} />
              <Route path="/course/:id" element={<CourseDetailsPage />} />
              <Route path="addspecial" element={<AddSpecialization />} />
              <Route path="/specialization/:specializationId" element={<SpecializationDetail />} />
            </Routes>
          </Box>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
