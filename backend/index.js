const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require("cors");
const fs = require('fs');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Create uploads directory if it doesn't exist
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

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

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
