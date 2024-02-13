const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userDetailsSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    default: "nn",
  },
  prenom: {
    type: String,
    required: true,
    default: "...",
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
  },
  date_naissance: {
    type: Date,
    required: true,
    default: Date.now
  },
  Nbphone: {
    type: String,
    required: true,
    default: "...",
  },
  mot_passe: {
    type: String,
    required: true,
    minlength: [6, 'Password must be at least 6 characters long'],
    default: ".......",
  },
  role: {
    type: String,
    default: 'user',
  },
});

userDetailsSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.mot_passe);
};

const UserInfo = mongoose.model('UserInfo', userDetailsSchema);

module.exports = UserInfo;