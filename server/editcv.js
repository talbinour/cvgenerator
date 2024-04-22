const express = require('express');
const router = express.Router();
const CvModel = require('./CVModel'); // Importez votre modèle de CV

// Enregistrer un CV spécifique par son ID
router.put('/cv/:userId/:cvId/', async (req, res) => {
  try {
    const userId = req.params.userId;
    const cvId = req.params.cvId;
    const cvData = req.body; // Les données du formulaire de CV sont envoyées dans le corps de la requête

    // Vérifier si le CV existe déjà dans la base de données
    let existingCV = await CvModel.findOne({ userId: userId, cvId: cvId });

    if (!existingCV) {
      // Si le CV n'existe pas, créer un nouveau document CV
      existingCV = new CvModel({
        userId: userId,
        cvId: cvId,
        ...cvData
      });
    } else {
      // Si le CV existe, mettre à jour les données existantes
      existingCV.set(cvData);
    }

    // Enregistrer le CV dans la base de données
    const savedCV = await existingCV.save();

    // Répondre avec un message de réussite
    res.status(200).json({ message: 'CV saved successfully', cvId: cvId });
  } catch (error) {
    console.error('Error saving CV:', error);
    res.status(500).json({ error: 'Failed to save CV' });
  }
});

module.exports = router;