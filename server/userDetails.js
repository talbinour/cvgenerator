const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const userDetailsSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    default: ".....",
  },
  prenom: {
    type: String,
    required: true,
    default: ".....",
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
  },
  role: {
    type: String,
    default: 'user',
  },
  emailVerification: {
    type: Boolean,
    default: false,
  },
  emailVerificationCode: {
    type: String,
  },
});
userDetailsSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.mot_passe);
  } catch (error) {
    throw new Error(error);
  }
};
userDetailsSchema.pre('save', async function (next) {
  try {
    const hashedPassword = await bcrypt.hash(this.mot_passe, 10);
    this.mot_passe = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});
const UserInfo = mongoose.model('UserInfo', userDetailsSchema);

module.exports = UserInfo;