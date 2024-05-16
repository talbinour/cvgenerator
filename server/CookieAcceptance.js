const mongoose = require('mongoose');

const cookieAcceptanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  accepted: {
    type: Boolean,
    default: false
  }
});

const CookieAcceptance = mongoose.model('CookieAcceptance', cookieAcceptanceSchema);

module.exports = CookieAcceptance;
