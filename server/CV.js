const mongoose = require('mongoose');
const { Schema } = mongoose;

const cvSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  cvId: {
    type: String,
    required: true
  },
  name: String,
  jobTitle: String,
  phone: String,
  email: String,
  website: String,
  linkedin: String,
  address: String,
  education: [
    {
      period: String,
      degree: String,
      institution: String
    }
  ],
  languages: [
    {
      name: String,
      proficiency: Number
    }
  ],
  profile: String,
  experiences: [
    {
      period: String,
      companyName: String,
      jobTitle: String,
      description: String
    }
  ],
  professionalSkills: [
    {
      skillName: String,
      proficiency: Number
    }
  ],
  interests: [String]
});

const CvModel = mongoose.model('Cv', cvSchema);

module.exports = CvModel;