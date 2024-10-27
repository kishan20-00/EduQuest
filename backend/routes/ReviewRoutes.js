// routes/review.js
const express = require('express');
const Review = require('../models/Review');
const router = express.Router();

// Create a new review
router.post('/', async (req, res) => {
  try {
    const { userId, courseId, rating, comment } = req.body;
    const review = new Review({ userId, courseId, rating, comment });
    await review.save();
    res.status(201).json({ message: 'Review added successfully', review });
  } catch (error) {
    res.status(400).json({ message: 'Error adding review', error });
  }
});

// Get reviews for a specific course
router.get('/:courseId', async (req, res) => {
  try {
    const reviews = await Review.find({ courseId: req.params.courseId }).populate('userId', 'name');
    res.status(200).json(reviews);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching reviews', error });
  }
});

module.exports = router;
