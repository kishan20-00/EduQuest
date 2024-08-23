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

    jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: 3600,
    }, (err, token) => {
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

    jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: 3600,
    }, (err, token) => {
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

// Update User Details
router.put('/update', async (req, res) => {
  const { id, age, contactNumber, profilePhoto, profession, interestedSubject } = req.body;
  
  try {
    let user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update the user's details
    user.age = age || user.age;
    user.contactNumber = contactNumber || user.contactNumber;
    user.profilePhoto = profilePhoto || user.profilePhoto;
    user.profession = profession || user.profession;
    user.interestedSubject = interestedSubject || user.interestedSubject;

    await user.save();

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
