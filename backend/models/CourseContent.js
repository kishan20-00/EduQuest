const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  contentName: { type: String, required: true },
  subject: { type: String, required: true },
  complexity: { type: String, required: true },
  image: { type: String, required: true },
  learningMaterial: { type: String, required: true },
  source: { type: mongoose.Schema.Types.Mixed, required: true }, // Allow different types (string, object, etc.)
  description: { type: String, required: true },
  reviews: { type: String }
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
