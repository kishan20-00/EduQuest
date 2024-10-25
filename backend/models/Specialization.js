// models/Specialization.js
const mongoose = require('mongoose');

const SpecializationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: {type: String, required: true},
  image: { type: String, required: true },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
});

const Specialization = mongoose.model('Specialization', SpecializationSchema);

module.exports = Specialization;
