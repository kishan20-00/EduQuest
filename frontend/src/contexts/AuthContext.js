import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('user');
    if (token && userInfo) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  const login = async (userData) => {
    try {
      const response = await axios.post('https://edu-quest-hfoq.vercel.app/api/auth/login', userData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      setUser({ ...response.data.user, loginTime: new Date() });
      navigate('/');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const signup = async (userData) => {
    try {
      const response = await axios.post('https://edu-quest-hfoq.vercel.app/api/auth/signup', userData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      setUser(response.data.user);
      navigate('/');
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  const getPreferredStudyTime = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) return 'Morning';
    if (currentHour >= 12 && currentHour < 17) return 'Afternoon';
    if (currentHour >= 17 && currentHour < 21) return 'Evening';
    if (currentHour >= 21 && currentHour < 24) return 'Night';
    return 'Midnight';
  };
  
  const updateMonitoringData = async () => {
    if (!user) return;
    const preferredStudyTime = getPreferredStudyTime();
    const goal = user.learningScore > user.courseScore ? 'Long-term' : 'Short-term';
    const curriculumStructure = user.quizScore > user.courseScore ? 'Exam' : 'Knowledge';
  
    const loginDuration = new Date() - new Date(user.loginTime); // in ms
    const externalFactor = loginDuration > 5 * 60 * 1000 ? 'Upcoming Exams' : 'Time Constraints';
  
    const data = {
      userId: user._id,
      preferredStudyTime,
      goal,
      curriculumStructure,
      externalFactor,
      timeSpentOnContent: Math.floor(loginDuration / 60000),
    };
  
    try {
      await axios.put(`https://edu-quest-hfoq.vercel.app/api/auth/update-monitoring/${data.userId}`, data);
      console.log("Monitoring Data Updated Successfully.")
    } catch (error) {
      console.error('Error updating monitoring data:', error);
    }
  };  

  const logout = () => {
    updateMonitoringData().finally(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      navigate('/');
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
