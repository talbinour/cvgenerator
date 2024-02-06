const mongoose = require('mongoose');

const userDetailsSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
  prenom: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  date_naissance: {
    type: Date,
    required: true,
  },
  Nbphone: {
    type: String,
    required: true,
  },
  mot_passe: {
    type: String,
    required: true,
  },
  // Add more fields as needed based on your application's requirements
});

const UserInfo = mongoose.model('UserInfo', userDetailsSchema);

module.exports = UserInfo;
