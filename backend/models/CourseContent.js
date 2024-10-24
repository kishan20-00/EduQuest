const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  contentName: { type: String, required: true },
  subject: { type: String, required: true },
  complexity: { type: String, required: true },
  image: { type: String, required: true },
  learningMaterial: { type: String, required: true },
  source: { type: String }, // For video, audio, pdf links
  heading: { type: String }, // For text heading
  textContent: { type: String }, // For text content
  assignmentContent: { type: String }, // For assignment content
  quizQuestions: { type: [String] }, // For quiz questions
  quizAnswers: { type: [String] }, // For quiz answers
  description: { type: String, required: true },
  reviews: { type: String }
}, { timestamps: true });


const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
