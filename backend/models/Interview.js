const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  round_number: Number,
  type: String,
  feedback: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Interview', interviewSchema); 