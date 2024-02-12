const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

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
    unique: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
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
    minlength: [6, 'Password must be at least 6 characters long'],
  },

  role: {
    type: String,
    default: 'user',
  },
});
userDetailsSchema.pre('save', async function (next) {
  try {
    // Hash the password only if it's modified or a new user
    if (this.isModified('mot_passe') || this.isNew) {
      const hashedPassword = await bcrypt.hash(this.mot_passe, SALT_ROUNDS);
      this.mot_passe = hashedPassword;
    }
    return next();
  } catch (error) {
    return next(error);
  }
});

userDetailsSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    console.log('Comparing passwords:', candidatePassword, this.mot_passe);
    const result = await bcrypt.compare(candidatePassword, this.mot_passe);
    console.log('Password comparison result:', result);
    return result;
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
};

const UserInfo = mongoose.model('UserInfo', userDetailsSchema);

module.exports = UserInfo;