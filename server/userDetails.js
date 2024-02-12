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
    default: "nn", 
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
    
>>>>>>> 5b3018c1871fdc4436e3fe5e83aa9c013522cf66
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