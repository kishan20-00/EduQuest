import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const history = useNavigate ();

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
      const response = await axios.post('http://localhost:7000/api/auth/login', userData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      setUser(response.data.user);
      history('/');
    } catch (error) {
      console.error('Error logging in:', error);
      // Handle specific error messages if needed
    }
  };
  
  const signup = async (userData) => {
    try {
      const response = await axios.post('http://localhost:7000/api/auth/signup', userData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      setUser(response.data.user);
      history('/');
    } catch (error) {
      console.error('Error signing up:', error);
      // Handle specific error messages if needed
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    history('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
