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

// Add a method to compare passwords
adminSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.mot_passe);
};

// Add a hook to hash the password before saving (if modified or new)
adminSchema.pre('save', async function(next) {
  if (!this.isModified('mot_passe') && !this.isNew) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.mot_passe, salt);
    this.mot_passe = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
