const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const userInfoSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  prenom: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  date_naissance: {
    type: Date,
    required: true
  },
  mot_passe: {
    type: String,
    required: true
  },
  Nbphone: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  pays: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'user',
  },
  emailToken: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    required: true
  },
  verificationCode: String
});

userInfoSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.mot_passe);
  } catch (error) {
    throw new Error(error);
  }
};

userInfoSchema.pre('save', async function (next) {
  try {
    // Ne hacher le mot de passe que s'il a été modifié (nouveau mot de passe ou modification du mot de passe existant)
    if (!this.isModified('mot_passe')) {
      return next();
    }

    const hashedPassword = await bcrypt.hash(this.mot_passe, 10);
    this.mot_passe = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

const UserInfo = mongoose.model('UserInfo', userInfoSchema);

module.exports = UserInfo;
