const mongoose = require('mongoose');

const cvSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  imageURL: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  // Ajoutez d'autres propriétés du CV selon vos besoins
});

const CVModel = mongoose.model('CVmodel', cvSchema);

module.exports = CVModel;
