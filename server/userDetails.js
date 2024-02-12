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
<<<<<<< HEAD
    unique: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
=======
    unique: true, // Ensures the email is unique in the database
    lowercase: true, // Converts email to lowercase before saving
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'], // Validates the email format

>>>>>>> 244590a2cc6b6d74937a3353aef0611d6135bd02
  },
  date_naissance: {
    type: Date,
    required: true,
    default: Date.now
  },
  Nbphone: {
    type: String,
    required: true,
    default: "nn", 
  },
  mot_passe: {
    type: String,
    required: true,
<<<<<<< HEAD
    minlength: [6, 'Password must be at least 6 characters long'], 
    default: "nnnnnn", 
=======
    minlength: [6, 'Password must be at least 6 characters long'],
<<<<<<< HEAD
=======
    
>>>>>>> 5b3018c1871fdc4436e3fe5e83aa9c013522cf66
>>>>>>> 244590a2cc6b6d74937a3353aef0611d6135bd02
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