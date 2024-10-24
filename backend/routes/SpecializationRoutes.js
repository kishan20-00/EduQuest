// routes/specializations.js
const express = require('express');
const Specialization = require('../models/Specialization');
const Course = require('../models/CourseContent'); // Assuming you have a Course model
const router = express.Router();

// Create a new specialization
router.post('/', async (req, res) => {
  const { name, courses } = req.body;
  const newSpecialization = new Specialization({ name, courses });
  
  try {
    await newSpecialization.save();
    res.status(201).json(newSpecialization);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all specializations
router.get('/', async (req, res) => {
  try {
    const specializations = await Specialization.find().populate('courses');
    res.status(200).json(specializations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
