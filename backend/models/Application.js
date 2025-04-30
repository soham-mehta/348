const mongoose = require('mongoose');
//SCHEMA
const applicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  status: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Status',
    required: true,
    index: true // index defintion
  },
  position_title: {
    type: String,
    required: true,
    index: true
  },
  date_applied: {
    type: Date,
    default: Date.now,
    index: true
  },
  source: String,
  notes: String
}, {
  timestamps: true
});

// Create a compound index for common query patterns
applicationSchema.index({ status: 1, date_applied: -1 });

// Ensure indexes are created
applicationSchema.set('autoIndex', true);

const Application = mongoose.model('Application', applicationSchema);

// Build the indexes
Application.createIndexes().catch(error => {
  console.error('Error creating indexes:', error);
});

module.exports = Application; 