// server/routes/verifyEmail.js

const express = require('express');
const router = express.Router();
const UserInfo = require('../userDetails');

// Endpoint pour valider l'email
router.get('/:emailToken', async (req, res) => {
  const { emailToken } = req.params;

  try {
    // Vérifier si le jeton est valide
    const user = await UserInfo.findOneAndUpdate(
      { emailToken },
      { $set: { isVerified: true } },
      { new: true }
    );

    if (user) {
      // Envoyer une réponse JSON indiquant que la validation a réussi
      res.status(200).json({ success: true, message: 'Votre adresse e-mail a été vérifiée avec succès.' });
    } else {
      // Envoyer une réponse JSON indiquant que le jeton est invalide
      res.status(404).json({ success: false, message: 'La validation du compte a échoué, jeton invalide.' });
    }
  } catch (error) {
    console.error('Erreur lors de la validation du compte:', error);
    // Envoyer une réponse JSON en cas d'erreur
    res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la validation du compte.' });
  }
});

module.exports = router;
