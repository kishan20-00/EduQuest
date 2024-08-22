const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  contentName: { type: String, required: true },
  learningMaterial: { type: String, required: true },
  source: { type: String, required: true },
  description: { type: String, required: true },
  reviews: { type: String }
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
