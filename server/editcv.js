const express = require('express');
const router = express.Router();
const CvModel = require('./CV'); // Importez votre modèle de CV
const ImageModel = require('./ImageModel');
const bcrypt = require('bcrypt');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null,file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG and PNG files are allowed.'), false);
    }
};

const upload = multer({
  storage: storage,
  limits: {
      fileSize: 10 * 1024 * 1024, // 10 MB limit, adjust as needed
  },
  fileFilter: fileFilter
});
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
router.post('/api/save-reduced-image', upload.single('cv-content'), async (req, res) => {
  try {
    const { userId, reducedImageUrl } = req.body;

    // Vérifiez si l'URL de l'image réduite et l'ID de l'utilisateur sont fournis
    if (!userId || !reducedImageUrl) {
      return res.status(400).json({ error: 'L\'URL de l\'image réduite ou l\'ID de l\'utilisateur est manquant.' });
    }

    // Créez un nouvel objet d'image en utilisant le modèle approprié
    const newImage = new ImageModel({
      userId: userId,
      reducedImageUrl: reducedImageUrl,
    });

    // Enregistrez l'image réduite dans la base de données
    const savedImage = await newImage.save();

    // Envoyer une réponse de réussite au frontend
    res.status(201).json({ message: 'Image réduite enregistrée avec succès dans la base de données.' });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'image réduite dans la base de données:', error);
    // Envoyer une réponse d'erreur au frontend
    res.status(500).json({ error: 'Erreur lors de l\'enregistrement de l\'image réduite dans la base de données.' });
  }
});


module.exports = router;