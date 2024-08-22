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
}, { timestamps: true });

module.exports = mongoose.model('EduUsers', UserSchema);
