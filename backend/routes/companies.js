const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const Application = require('../models/Application');

// Get all companies
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create company
router.post('/', async (req, res) => {
  const company = new Company({
    name: req.body.name,
    industry: req.body.industry,
    location: req.body.location,
    website: req.body.website
  });

  try {
    const newCompany = await company.save();
    res.status(201).json(newCompany);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete company
router.delete('/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Company not found' });
    
    // Delete all applications associated with this company
    await Application.deleteMany({ company: req.params.id });
    
    // Delete the company
    await Company.deleteOne({ _id: req.params.id });
    
    res.json({ message: 'Company and all associated applications deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 