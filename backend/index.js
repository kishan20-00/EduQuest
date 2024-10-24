const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require("cors");
const fs = require('fs');

dotenv.config();

const app = express();
app.use(express.json());

// Configure CORS to allow requests from your frontend
const corsOptions = {
  origin: 'http://localhost:3000', // Change this to the appropriate origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'], // Add any additional headers you expect
};

app.use(cors(corsOptions)); // Use the CORS middleware with options

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

// Root Route
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
