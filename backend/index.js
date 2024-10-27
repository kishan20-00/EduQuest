const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require("cors");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_CONNECT_URL)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => {
    console.log('MongoDB connection error:', err);
  });

// Root Route - Add this if you want to respond to '/'
app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const courseContentRoutes = require('./routes/CourseController');
app.use('/api/content', courseContentRoutes);

const specializationRoutes = require('./routes/SpecializationRoutes');
app.use('/api/specializations', specializationRoutes);

const reviewRoutes = require('./routes/ReviewRoutes');
app.use('/api/reviews', reviewRoutes);

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
