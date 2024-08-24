const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({
        msg: 'User created successfully',
        token,
        user,
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({
        msg: "Logged In Successfully !!",
        token,
        user,
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get User Details by ID
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update User Details by ID
router.put('/update/:id', async (req, res) => {
  const { id } = req.params; // Get the user ID from the URL parameters
  const { name, age, contactNumber, profilePhoto, profession, interestedSubject } = req.body;

  // Basic validation
  if (!id) {
    return res.status(400).json({ msg: 'User ID is required' });
  }

  try {
    // Find the user by ID
    let user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update the user's details
    user.name = name !== undefined ? name : user.name;
    user.age = age !== undefined ? age : user.age;
    user.contactNumber = contactNumber !== undefined ? contactNumber : user.contactNumber;
    user.profilePhoto = profilePhoto !== undefined ? profilePhoto : user.profilePhoto;
    user.profession = profession !== undefined ? profession : user.profession;
    user.interestedSubject = interestedSubject !== undefined ? interestedSubject : user.interestedSubject;

    // Save the updated user
    await user.save();

    // Respond with updated user details
    res.json({
      msg: 'User details updated successfully',
      user: {
        name: user.name,
        email: user.email,
        age: user.age,
        contactNumber: user.contactNumber,
        profilePhoto: user.profilePhoto,
        profession: user.profession,
        interestedSubject: user.interestedSubject,
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
