const mongoose = require('mongoose');

// Définition du schéma d'image
const imageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    
  },
  imageName: { type: String, required: true },
  imagePath: { type: String, required: true },
  imageSize: { type: Number, required: true },
  imageUrl: { type: String,required: true  } ,
  pageURL: { type: String },
  date: {
    type: Date,
    default: Date.now
  }
});

// Création du modèle d'image à partir du schéma
const ImageModel = mongoose.model('Image', imageSchema);

module.exports = ImageModel;
