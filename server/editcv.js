const express = require('express');
const router = express.Router();
const CvModel = require('./CVModel'); // Importez votre modèle de CV

// Enregistrer un CV spécifique par son ID
router.put('/cv/:userId/:cvId/', async (req, res) => {
  try {
    const userId = req.params.userId;
    const cvId = req.params.cvId;
    const cvData = req.body; // Les données du formulaire de CV sont envoyées dans le corps de la requête
   
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

    // Récupérer à nouveau le CV depuis la base de données pour refléter les modifications
    const reloadedCV = await CvModel.findOne({ userId: userId, cvId: cvId });
    res.status(200).json({ message: 'CV saved successfully', cvId: cvId, cvData: reloadedCV });
  } catch (error) {
    console.error('Error saving CV:', error);
    res.status(500).json({ error: 'Failed to save CV' });
  }
});
router.get('/cv/:userId/:cvId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const cvId = req.params.cvId;

    // Recherche du CV dans la base de données en fonction de l'ID utilisateur et de l'ID du CV
    const cvData = await CvModel.findOne({ userId: userId, cvId: cvId });

    if (!cvData) {
      // Si aucun CV correspondant n'est trouvé, renvoyer une réponse 404 Not Found
      return res.status(404).json({ error: 'CV not found' });
    }

    // Si le CV est trouvé, renvoyer les données du CV dans la réponse
    res.status(200).json({ cvData: cvData });
  } catch (error) {
    console.error('Error loading CV:', error);
    // En cas d'erreur, renvoyer une réponse 500 Internal Server Error
    res.status(500).json({ error: 'Failed to load CV' });
  }
});

module.exports = router;