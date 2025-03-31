const mongoose = require('mongoose');

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
    required: true
  },
  position_title: {
    type: String,
    required: true
  },
  date_applied: {
    type: Date,
    default: Date.now
  },
  source: String,
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Application', applicationSchema); 