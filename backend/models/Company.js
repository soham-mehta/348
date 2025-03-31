const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  industry: String,
  location: String,
  website: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Company', companySchema); 