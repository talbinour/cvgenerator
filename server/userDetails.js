const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
    unique: true, // Ensures the email is unique in the database
    lowercase: true, // Converts email to lowercase before saving
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'], // Validates the email format
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
    default: 'user', // Par défaut, l'utilisateur a le rôle 'user'
  },
});

// Méthode pour comparer les mots de passe
userDetailsSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.mot_passe);
};

  // Add more fields as needed based on your application's requirements

const UserInfo = mongoose.model('UserInfo', userDetailsSchema);

module.exports = UserInfo;
