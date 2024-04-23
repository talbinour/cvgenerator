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
  Nbphone: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
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
  pays :{
    type: String,
    required: true ,
    default : '...',
  },
  role: {
    type: String,
    default: 'user',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  emailToken: String,
  verificationCode: String,
  photo: String, // Stocker le chemin de l'image dans la propriété photo  
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


const UserInfo = mongoose.model('UserInfo', userDetailsSchema);

module.exports = UserInfo;