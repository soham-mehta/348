const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Company = require('../models/Company');
const mongoose = require('mongoose');
const { executeTransaction, TransactionLevels } = require('../utils/transactionManager');

// Get all applications
router.get('/', async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('user', 'name email')
      .populate('company', 'name industry location')
      .populate('status', 'label');
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one application
router.get('/:id', async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('user', 'name email')
      .populate('company', 'name industry location')
      .populate('status', 'label');
    if (!application) return res.status(404).json({ message: 'Application not found' });
    res.json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create application
router.post('/', async (req, res) => {
  const application = new Application({
    user: req.body.user,
    company: req.body.company,
    status: req.body.status,
    position_title: req.body.position_title,
    date_applied: req.body.date_applied,
    source: req.body.source,
    notes: req.body.notes
  });

  try {
    const newApplication = await application.save();
    
    // Populate the references
    const populatedApp = await Application.findById(newApplication._id)
      .populate('user')
      .populate('status');
    
    res.status(201).json(populatedApp);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update application
router.patch('/:id', async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });
    
    if (req.body.user) application.user = req.body.user;
    if (req.body.company) application.company = req.body.company;
    if (req.body.status) application.status = req.body.status;
    if (req.body.position_title) application.position_title = req.body.position_title;
    if (req.body.date_applied) application.date_applied = req.body.date_applied;
    if (req.body.source) application.source = req.body.source;
    if (req.body.notes) application.notes = req.body.notes;

    const updatedApplication = await application.save();
    res.json(updatedApplication);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete application
router.delete('/:id', async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });
    
    await Application.deleteOne({ _id: req.params.id });
    res.json({ message: 'Application deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Transfer application between users (with transaction)
router.post('/:id/transfer', async (req, res) => {
  try {
    const { newUserId, isolationLevel = 'SERIALIZABLE' } = req.body;
    const applicationId = req.params.id;

    // Define the transaction operations
    const transferOperations = async (session) => {
      // Find and update application
      const application = await Application.findById(applicationId).session(session);
      if (!application) {
        throw new Error('Application not found');
      }

      const oldUserId = application.user;
      application.user = newUserId;
      
      // Save the changes within the transaction
      await application.save({ session });

      // Return the updated application
      return {
        message: 'Application transferred successfully',
        from: oldUserId,
        to: newUserId,
        application
      };
    };

    // Execute the transfer within a transaction
    const result = await executeTransaction(
      transferOperations,
      TransactionLevels[isolationLevel]
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Bulk update applications with transaction
router.post('/bulk-update', async (req, res) => {
  try {
    const { updates, isolationLevel = 'SERIALIZABLE' } = req.body;

    const bulkUpdateOperations = async (session) => {
      const results = [];
      
      // Perform all updates within the same transaction
      for (const update of updates) {
        const application = await Application.findById(update.id).session(session);
        if (!application) {
          throw new Error(`Application ${update.id} not found`);
        }

        // Update the application fields
        Object.assign(application, update.changes);
        await application.save({ session });
        
        results.push(application);
      }

      return {
        message: 'Bulk update completed successfully',
        updatedApplications: results
      };
    };

    // Execute bulk update within a transaction
    const result = await executeTransaction(
      bulkUpdateOperations,
      TransactionLevels[isolationLevel]
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 