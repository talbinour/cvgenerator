const express = require('express');
const router = express.Router();
const CvModel = require('./cvModel'); // Importez votre modèle de CV
const multer = require('multer');

// Enregistrer un CV spécifique par son ID
router.put('/cv/:userId/:cvId/', async (req, res) => {
  try {
    const userId = req.params.userId;
    const cvId = req.params.cvId;
    const cvData = req.body; // Les données du formulaire de CV sont envoyées dans le corps de la requête

    // Créer un nouvel objet CV basé sur les données reçues
    const newCv = new CvModel({
      userId: userId,
      cvId: cvId,
      ...cvData,
    });

    // Enregistrer le nouveau CV dans la base de données
    await newCv.save();

    // Répondre avec un message de réussite
    res.json({ message: 'CV saved successfully', cvId: cvId });
  } catch (error) {
    console.error('Error saving CV:', error);
    res.status(500).json({ error: 'Failed to save CV' });
  }
});

// Route pour récupérer l'URL de l'image d'un CV par son ID utilisateur et son ID CV
router.get('/getImage/:cvId', async (req, res) => {
  try {
    const cvId = req.params.cvId;

    // Recherchez le CV dans la base de données en fonction de l'ID CV
    const cv = await CvModel.findById(cvId);

    if (!cv) {
      // Si le CV n'est pas trouvé, retournez une erreur 404
      return res.status(404).json({ error: 'CV not found' });
    }

    // Si le CV est trouvé, récupérez l'URL de l'image et renvoyez-la dans la réponse
    const imageUrl = cv.imageURL;
    res.json({ imageUrl: imageUrl });
  } catch (error) {
    console.error('Error fetching CV image:', error);
    res.status(500).json({ error: 'Failed to fetch CV image' });
  }
});

// Configuration de Multer pour gérer les fichiers téléchargés
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Répertoire de destination des fichiers téléchargés
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Utilisez le nom de fichier d'origine
  }
});
const upload = multer({ storage: storage });

// Route pour télécharger une image de CV
router.post('/uploadImage/:userId/:cvId', upload.single('cvImage'), async (req, res) => {
  try {
    const userId = req.params.userId;
    const cvId = req.params.cvId;
    const imageUrl = req.file.path; // Chemin de l'image téléchargée

    // Mettez à jour le CV avec l'URL de l'image
    await CvModel.findOneAndUpdate({ userId: userId, cvId: cvId }, { imageURL: imageUrl });

    res.json({ message: 'Image uploaded successfully', imageUrl: imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

module.exports = router;
