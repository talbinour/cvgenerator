const express = require('express');
const router = express.Router();
const CvModel = require('./cvModel'); // Importez votre modèle de CV

// Enregistrer un CV spécifique par son ID
router.put('/cv/:userId/:cvId/', async (req, res) => {
  try {
    const userId = req.params.userId;
    const cvId = req.params.cvId;
    const _id = req.params._id;
    const cvData = req.body; // Les données du formulaire de CV sont envoyées dans le corps de la requête
    // Créer un nouvel objet CV basé sur les données reçues
    const newCv = new CvModel({
      userId: userId,
      cvId: cvId,
      _id: _id,
      name: cvData.name,
      jobTitle: cvData.jobTitle,
      phone: cvData.phone,
      email: cvData.email,
      website: cvData.website,
      linkedin: cvData.linkedin,
      address: cvData.address,
      education: cvData.education,
      languages: cvData.languages
      // Ajoutez d'autres champs du CV ici
    });

    // Enregistrer le nouveau CV dans la base de données
    await newCv.save();

    // Répondre avec un message de réussite
    res.json({ message: 'CV saved successfully', cvId: cvId, _id: _id });
  } catch (error) {
    console.error('Error saving CV:', error);
    res.status(500).json({ error: 'Failed to save CV' });
  }
});

module.exports = router;
