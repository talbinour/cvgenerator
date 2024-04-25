const mongoose = require('mongoose');

// Définition du schéma d'image
const imageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    
  },
  imageUrl: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Création du modèle d'image à partir du schéma
const ImageModel = mongoose.model('Image', imageSchema);

module.exports = ImageModel;
