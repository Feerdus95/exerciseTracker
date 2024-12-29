const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Exercise = require('../models/Exercise');

// POST /api/users - Create new user
router.post('/users', async (req, res) => {
  try {
    // Ensure username is provided
    if (!req.body.username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const user = new User({
      username: req.body.username
    });

    const savedUser = await user.save();
    // Return exactly the format required: username and _id only
    return res.json({
      username: savedUser.username,
      _id: savedUser._id.toString()
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// GET /api/users - Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}).select('username _id');
    res.json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/users/:_id/exercises - Add exercise
router.post('/users/:_id/exercises', async (req, res) => {
  try {
    const user = await User.findById(req.params._id);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Validate required fields
    if (!req.body.description || !req.body.duration) {
      return res.status(400).json({ error: 'Description and duration are required' });
    }

    // Parse duration to ensure it's a number
    const duration = parseInt(req.body.duration);
    if (isNaN(duration)) {
      return res.status(400).json({ error: 'Duration must be a number' });
    }

    // Handle date (use current date if not provided)
    let date = req.body.date ? new Date(req.body.date) : new Date();
    
    // Check if date is valid
    if (req.body.date && date.toString() === 'Invalid Date') {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    const exercise = new Exercise({
      userId: user._id,
      description: req.body.description,
      duration: duration,
      date: date
    });

    await exercise.save();

    // Return exactly the format required
    return res.json({
      _id: user._id.toString(),
      username: user.username,
      date: exercise.date.toDateString(),
      duration: exercise.duration,
      description: exercise.description
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// GET /api/users/:_id/logs - Get user's exercise log
router.get('/users/:_id/logs', async (req, res) => {
  try {
    const user = await User.findById(req.params._id);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    let query = { userId: user._id };

    // Handle date filters
    if (req.query.from || req.query.to) {
      query.date = {};
      if (req.query.from) {
        query.date.$gte = new Date(req.query.from);
      }
      if (req.query.to) {
        query.date.$lte = new Date(req.query.to);
      }
    }

    // Get exercises
    let exercises = await Exercise.find(query)
      .limit(Number(req.query.limit) || 0)
      .select('description duration date -_id');

    // Format exercises
    const log = exercises.map(e => ({
      description: e.description,
      duration: e.duration,
      date: e.date.toDateString()
    }));

    // Return in required format
    return res.json({
      _id: user._id.toString(),
      username: user.username,
      count: log.length,
      log: log
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

module.exports = router;