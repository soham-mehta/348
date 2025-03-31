const express = require('express');
const router = express.Router();
const Status = require('../models/Status');

// Get all statuses
router.get('/', async (req, res) => {
  try {
    const statuses = await Status.find();
    res.json(statuses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create status
router.post('/', async (req, res) => {
  const status = new Status({
    label: req.body.label
  });

  try {
    const newStatus = await status.save();
    res.status(201).json(newStatus);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router; 