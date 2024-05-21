// models/Job.js
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  employmentType: String,
  datePosted: String,
  description: String,
  userId: String
});

module.exports = mongoose.model('Job', jobSchema);
