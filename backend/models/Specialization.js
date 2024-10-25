// models/Specialization.js
const mongoose = require('mongoose');

const SpecializationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
});

const Specialization = mongoose.model('Specialization', SpecializationSchema);

module.exports = Specialization;
