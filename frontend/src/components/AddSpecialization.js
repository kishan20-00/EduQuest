// AddSpecialization.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, TextField, Button, MenuItem, Select, Typography } from '@mui/material';

const AddSpecialization = () => {
  const [name, setName] = useState('');
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState(Array(5).fill(''));

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('https://edu-quest-hfoq.vercel.app/api/content'); // Adjust endpoint as needed
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    
    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://edu-quest-hfoq.vercel.app/api/specializations', { name, courses: selectedCourses });
      // Reset the form or show a success message
    } catch (error) {
      console.error('Error adding specialization:', error);
    }
  };

  const handleCourseChange = (index, value) => {
    const updatedCourses = [...selectedCourses];
    updatedCourses[index] = value;
    setSelectedCourses(updatedCourses);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', maxWidth: '400px', mx: 'auto' }}>
      <Typography variant="h4">Add Specialization</Typography>
      <TextField
        label="Specialization Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        sx={{ mb: 2 }}
      />
      {[...Array(5)].map((_, index) => (
        <Select
          key={index}
          value={selectedCourses[index]}
          onChange={(e) => handleCourseChange(index, e.target.value)}
          displayEmpty
          sx={{ mb: 2 }}
        >
          <MenuItem value="" disabled>
            Learning Material {index + 1}
          </MenuItem>
          {courses.map((course) => (
            <MenuItem key={course._id} value={course._id}>
              {course.contentName}
            </MenuItem>
          ))}
        </Select>
      ))}
      <Button type="submit" variant="contained">Add Specialization</Button>
    </Box>
  );
};

export default AddSpecialization;
