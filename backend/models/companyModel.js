const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String },
  linkedin: { type: String },
  emails: [String],
  phoneNumbers: [String],
  comments: { type: String },
  communicationPeriodicity: { type: Number, default: 14 },
});

module.exports = mongoose.model('Company', companySchema);
