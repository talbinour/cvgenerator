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
  image: {
    type: String, // Path to the image file
    required: true,
  },
  // Add other CV properties as needed
});

const CVModel = mongoose.model('CV', cvSchema);

module.exports = CVModel;
