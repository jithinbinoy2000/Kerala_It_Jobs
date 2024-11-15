const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  jobId: {
    type: String,
    required: true
  },
  jobTitle: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  jobDate: {
    type: String,
    required: true
  },
  jobLink: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ["FullStack", "Flutter", "Python", "DataScience", "Testing", "Java"]
  },
  isJobNew: {
    type:Boolean,
    default:true
  }
});

const Job = mongoose.model('Jobs', jobSchema);
module.exports = Job;
