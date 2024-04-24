const express = require('express');
const router = express.Router();
const CvModel = require('./CV'); // Importez votre modèle de CV
const ImageModel = require('./ImageModel');
const fs = require('fs');
const sharp = require('sharp');
const bodyParser = require('body-parser'); // Importez le module bodyParser
router.use(bodyParser.json({ limit: '50MB' }));
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // Définir le répertoire de destination des fichiers téléchargés
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Définir le nom du fichier téléchargé
  }
});

const upload = multer({ storage: storage });
// Enregistrer un CV spécifique par son ID
router.use(express.json());
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
// Define the isValidBase64 function
// Importez la fonction saveBase64Image
// Function to save base64 image to disk
/* const saveBase64Image = async (base64String, filename) => {
  if (typeof base64String !== 'string') {
    throw new Error('Base64 data is not a string.');
  }

  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');
  const filePath = path.join(__dirname, '..', 'uploads', filename);
  await promisify(fs.writeFile)(filePath, buffer);
  return filePath;
};
// Function to compress image
const compressImage = async (imagePath) => {
  try {
    const compressedImagePath = path.join(__dirname, '..', 'uploads', 'compressed_' + path.basename(imagePath));
    await sharp(imagePath).resize({ width: 800, height: 600 }).toFile(compressedImagePath);
    return compressedImagePath;
  } catch (error) {
    console.error('Error compressing image:', error);
    throw error;
  }
};
 */
// Route to save base64 image and compress it
router.post('/api/save-image', upload.single('image'), async (req, res) => {
  try {
    const userId = req.body.userId;
    const image = req.file;
    const imageURL = req.body.imageURL; // Récupérer l'URL de l'image depuis le corps de la requête

    console.log('userId received:', userId);
    console.log('image received:', image);
    console.log('imageURL received:', imageURL);

    if (!userId || !image) {
      throw new Error('Invalid request: userId or image is missing.');
    }

    // Créer une nouvelle instance du modèle d'image avec les données reçues
    const newImage = new ImageModel({
      userId: userId,
      imageName: image.originalname,
      imagePath: image.path,
      imageSize: image.size,
      imageUrl: imageURL // Ajouter l'URL de l'image au modèle
    });

    // Sauvegarder l'image en base de données
    const savedImage = await newImage.save();

    // Répondre avec un message de succès
    res.status(200).json({ message: 'Image saved successfully', image: savedImage });
  } catch (error) {
    console.error('Error saving image:', error);
    res.status(500).json({ error: 'Failed to save image' });
  }
});

module.exports = router;