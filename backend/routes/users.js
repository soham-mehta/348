const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Application = require('../models/Application');

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create user
router.post('/', async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Delete all applications associated with this user
    await Application.deleteMany({ user: req.params.id });
    
    // Delete the user
    await User.deleteOne({ _id: req.params.id });
    
    res.json({ message: 'User and all associated applications deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 