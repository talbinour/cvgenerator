// admin.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  
   mot_passe: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'admin',
  },
});

// Ajoutez une méthode pour comparer les mots de passe
adminSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.mot_passe);
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
