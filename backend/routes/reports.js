const express = require('express');
const router = express.Router();
const { 
  getApplicationsByDateRange,
  getApplicationStatistics,
  getPositionStatistics,
  getSimplePositionCounts,
  getApplicationTimeline
} = require('../utils/sanitizedQueries');

// Get applications by date range using sanitized query
router.get('/applications-by-date', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }
    
    const applications = await getApplicationsByDateRange(startDate, endDate);
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get application statistics using sanitized query
router.get('/statistics', async (req, res) => {
  try {
    const filters = {
      user: req.query.user,
      company: req.query.company,
      status: req.query.status,
      dateFrom: req.query.dateFrom,
      dateTo: req.query.dateTo
    };
    
    const statistics = await getApplicationStatistics(filters);
    res.json(statistics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get position statistics using sanitized query
router.get('/position-statistics', async (req, res) => {
  try {
    const filters = {
      user: req.query.user,
      company: req.query.company,
      status: req.query.status,
      dateFrom: req.query.dateFrom,
      dateTo: req.query.dateTo
    };
    
    const statistics = await getPositionStatistics(filters);
    res.json(statistics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get simple position counts using sanitized query
router.get('/simple-position-counts', async (req, res) => {
  try {
    const result = await getSimplePositionCounts();
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get application timeline using sanitized query
router.get('/application-timeline', async (req, res) => {
  try {
    const { userId } = req.query;
    const result = await getApplicationTimeline(userId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 