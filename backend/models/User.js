const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  contactNumber: {
    type: String,
  },
  profilePhoto: {
    type: String, // URL of the profile photo
  },
  profession: {
    type: String,
  },
  interestedSubject: {
    type: String,
  },
  courseScore: {
    type: String,
  },
  learningScore: {
    type: String,
    default: '100',
  },
  quizScore: {
    type: String,
  },
  recommendedSub: {
    type: String,
  },
  recommendedComplex: {
    type: String,
  },
  recommendedContent: {
    type: String,
  },
  preferredStudyTime: { type: String },
  goal: { type: String },
  curriculumStructure: { type: String },
  externalFactor: { type: String },
  timeSpentOnContent: { type: Number }, 
}, { timestamps: true });

module.exports = mongoose.model('EduUsers', UserSchema);
