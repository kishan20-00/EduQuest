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
  const { name, age, contactNumber, profilePhoto, profession, interestedSubject, courseScore, learningScore, quizScore, recommendedSub, recommendedComplex, recommendedContent, preferredStudyTime, goal, curriculumStructure, externalFactor, timeSpentOnContent } = req.body;

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
    user.courseScore= courseScore !== undefined ? courseScore : user.courseScore;
    user.learningScore= learningScore !== undefined ? learningScore : user.learningScore;
    user.quizScore= quizScore !== undefined ? quizScore : user.quizScore;
    user.recommendedSub= recommendedSub !== undefined ? recommendedSub : user.recommendedSub;
    user.recommendedComplex= recommendedComplex !== undefined ? recommendedComplex : user.recommendedComplex;
    user.recommendedContent= recommendedContent !== undefined ? recommendedContent : user.recommendedContent;
    user.preferredStudyTime= preferredStudyTime !== undefined ? preferredStudyTime : user.preferredStudyTime;
    user.goal= goal !== undefined ? goal : user.goal;
    user.curriculumStructure= curriculumStructure !== undefined ? curriculumStructure : user.curriculumStructure;
    user.externalFactor= externalFactor !== undefined ? externalFactor : user.externalFactor;
    user.timeSpentOnContent= timeSpentOnContent !== undefined ? timeSpentOnContent : user.timeSpentOnContent;

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
        courseScore: user.courseScore,
        learningScore: user.learningScore,
        quizScore: user.quizScore,
        recommendedSub: user.recommendedSub,
        recommendedComplex: user.recommendedComplex,
        recommendedContent: user.recommendedContent,
        timeSpentOnContent: user.timeSpentOnContent,
        goal: user.goal,
        curriculumStructure: user.curriculumStructure,
        externalFactor: user.externalFactor,
        timeSpentOnContent: user.timeSpentOnContent,
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update Course Score on Complete Button Click
router.put('/updateCourseScore/:id', async (req, res) => {
  const { id } = req.params;

  try {
    let user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Update courseScore and reset if it hits 100
    let newCourseScore = (parseInt(user.courseScore) || 0) + 10;
    if (newCourseScore >= 100) {
      newCourseScore = 0;
    }
    user.courseScore = newCourseScore.toString();
    await user.save();

    res.json({ msg: 'Course score updated successfully', courseScore: user.courseScore });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update Learning Score Based on Eye-Tracking
router.put('/updateLearningScore/:id', async (req, res) => {
  const { id } = req.params;
  const { decrementValue } = req.body;

  try {
    let user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Decrease learning score and ensure it doesn't go below 0
    let newLearningScore = (parseInt(user.learningScore) || 100) - decrementValue;
    user.learningScore = newLearningScore < 0 ? '0' : newLearningScore.toString();
    await user.save();

    res.json({ msg: 'Learning score updated successfully', learningScore: user.learningScore });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update Quiz Score
router.put('/updateQuizScore/:id', async (req, res) => {
  const { id } = req.params;
  const { quizScore } = req.body;

  try {
    let user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Update the quizScore and reset if it hits 100
    let newQuizScore = quizScore !== undefined ? quizScore : user.quizScore;
    if (newQuizScore >= 100) {
      newQuizScore = 0;
    }
    user.quizScore = newQuizScore;
    await user.save();

    res.json({ msg: 'Quiz score updated successfully', quizScore: user.quizScore });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.put('/update-monitoring/:id', async (req, res) => {
  const { id } = req.params;  // Get the user ID from the URL parameter
  const { preferredStudyTime, goal, curriculumStructure, externalFactor, timeSpentOnContent } = req.body;

  try {
    await User.findByIdAndUpdate(id, {  // Use the `id` from the URL parameter
      preferredStudyTime,
      goal,
      curriculumStructure,
      externalFactor,
      timeSpentOnContent,
    });
    res.status(200).json({ message: 'Monitoring data updated successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Failed to update monitoring data', error });
  }
});



module.exports = router;
