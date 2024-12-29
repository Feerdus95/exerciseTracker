const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Exercise = require('../models/Exercise');

// POST /api/users - Create new user
router.post('/users', async (req, res) => {
  try {
    const user = new User({ username: req.body.username });
    const savedUser = await user.save();
    res.json({ username: savedUser.username, _id: savedUser._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
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
    if (!user) throw new Error('User not found');

    const exercise = new Exercise({
      userId: user._id,
      description: req.body.description,
      duration: Number(req.body.duration),
      date: req.body.date ? new Date(req.body.date) : new Date()
    });

    await exercise.save();

    res.json({
      username: user.username,
      description: exercise.description,
      duration: exercise.duration,
      date: exercise.date.toDateString(),
      _id: user._id
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/users/:_id/logs - Get user's exercise log
router.get('/users/:_id/logs', async (req, res) => {
  try {
    const user = await User.findById(req.params._id);
    if (!user) throw new Error('User not found');

    let query = { userId: user._id };

    if (req.query.from || req.query.to) {
      query.date = {};
      if (req.query.from) {
        query.date.$gte = new Date(req.query.from);
      }
      if (req.query.to) {
        query.date.$lte = new Date(req.query.to);
      }
    }

    let exercises = await Exercise.find(query)
      .limit(Number(req.query.limit) || 0)
      .select('-_id description duration date');

    exercises = exercises.map(e => ({
      description: e.description,
      duration: e.duration,
      date: e.date.toDateString()
    }));

    res.json({
      username: user.username,
      count: exercises.length,
      _id: user._id,
      log: exercises
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;