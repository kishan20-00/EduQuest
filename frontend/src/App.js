import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './components/Signin';
import SignUp from './components/Signup';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <Router>
    <AuthProvider>
 
      <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
      </Routes>
  
    </AuthProvider>
    </Router>
  );
}

export default App;
