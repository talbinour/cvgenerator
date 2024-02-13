const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const userDetailsSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    default: "nn",
  },
  prenom: {
    type: String,
    required: true,
    default: "nn",
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
    default: Date.now,
  },
  Nbphone: {
    type: String,
    required: true,
    default: "nn",
  },
  mot_passe: {
    type: String,
    required: true,
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  role: {
    type: String,
    default: 'user',
  },
  jwtToken: {
    type: String,
  },
});
userDetailsSchema.pre('save', async function (next) {
  try {
    if (this.isModified('mot_passe')) {
      const hashedPassword = await bcrypt.hash(this.mot_passe, SALT_ROUNDS);
      this.mot_passe = hashedPassword;
    }
    next();
  } catch (error) {
    next(error);
  }
});

userDetailsSchema.methods.comparePassword = async function (candidatePassword) {
  const result = await bcrypt.compare(candidatePassword, this.mot_passe);
  return result;
};


// Create the UserInfo model
const UserInfo = mongoose.model('UserInfo', userDetailsSchema);

// Export the UserInfo model
module.exports = { UserInfo };