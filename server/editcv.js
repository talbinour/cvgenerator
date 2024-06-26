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
const { v4: uuidv4 } = require('uuid');


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
  router.put('/cv/:userId/:cvId/:id', async (req, res) => {
    try {
      const userId = req.params.userId;
      const cvId = req.params.cvId;
      const id = req.params._id;
      const cvData = req.body; // Les données du formulaire de CV sont envoyées dans le corps de la requête
    
      let existingCV = await CvModel.findOne({ userId: userId, cvId: cvId ,id: id });

      if (!existingCV) {
        // Si le CV n'existe pas, créer un nouveau document CV
        existingCV = new CvModel({
          userId: userId,
          cvId: cvId,
          id: id,
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
      console.log('Updated CV Data:', reloadedCV);
        // Ajoutez des en-têtes pour empêcher la mise en cache des réponses
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      res.status(200).json({ message: 'CV saved successfully', cvId: cvId, cvData: reloadedCV });
    } catch (error) {
      console.error('Error saving CV:', error);
      res.status(500).json({ error: 'Failed to save CV' });
    }
  });



router.post('/cv/:userId/:cvId/', async (req, res) => {
    try {
      const cvData = req.body; 
      const userId = req.params.userId;
      const cvId = req.params.cvId;
         // Générer un nouvel ID unique pour le CV

        // Créer un nouveau document CV
        const newCV = new CvModel({
            userId: userId,
            cvId: cvId,
            ...cvData
        });

        // Enregistrer le nouveau CV dans la base de données
        const savedCV = await newCV.save();

        console.log('New CV Data:', savedCV);
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.status(201).json({ message: 'New CV created successfully', cvId: cvId, cvData: savedCV });
    } catch (error) {
        console.error('Error creating CV:', error);
        res.status(500).json({ error: 'Failed to create CV' });
    }
});

router.get('/cv/:userId/:cvId/:id', async (req, res) => {
  try {
    const userId = req.params.userId;
    const cvId = req.params.cvId;
    const id = req.params.id; // Utilisez req.params.id pour récupérer l'ID du CV

    // Recherche du CV dans la base de données en fonction de l'ID utilisateur et de l'ID du CV
    const cvData = await CvModel.findOne({ userId: userId, cvId: cvId, _id: id });

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


// Route to save base64 image and compress it
router.post('/api/save-image/:userId/:cvId/:id', upload.single('image'), async (req, res) => {
  try {
    const image = req.file;
    const imageURL = req.body.imageURL;
    const userId = req.params.userId;
    const cvId = req.params.cvId;
    const id = req.params.id;
    const editurl = req.body.editurl;

    if (!userId || !image) {
      throw new Error('Invalid request: userId or image is missing.');
    }

    // Recherchez d'abord s'il existe déjà une image avec le même ID dans la base de données
    let existingImage = await ImageModel.findOne({ userId, cvId, id });

    if (existingImage) {
      // Si une image avec le même ID est trouvée, mettez à jour ses données
      existingImage.imageName = image.originalname;
      existingImage.imagePath = image.path;
      existingImage.imageSize = image.size;
      existingImage.pageURL = req.body.pageURL;
      existingImage.imageUrl = imageURL;
      existingImage.editurl = editurl;

      // Enregistrez les modifications apportées à l'image existante
      existingImage = await existingImage.save();

      // Répondre avec un message de succès
      return res.status(200).json({ message: 'Image updated successfully', image: existingImage });
    }

    // Si aucune image avec le même ID n'est trouvée, créez une nouvelle instance d'image
    const newImage = new ImageModel({
      userId,
      cvId,
      id,
      imageName: image.originalname,
      imagePath: image.path,
      imageSize: image.size,
      pageURL: req.body.pageURL,
      imageUrl: imageURL, 
      editurl :editurl
    });

    // Sauvegarder la nouvelle image dans la base de données
    const savedImage = await newImage.save();

    // Répondre avec un message de succès
    res.status(200).json({ message: 'Image saved successfully', image: savedImage });
  } catch (error) {
    console.error('Error saving/updating image:', error);
    res.status(500).json({ error: 'Failed to save/update image' });
  }
});

router.get('/user-cvs/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Recherche des CV dans la base de données en fonction de l'ID de l'utilisateur
    const userCvs = await ImageModel.find({ userId  });

    // Renvoyer les CV trouvés dans la réponse
    res.status(200).json(userCvs);
  } catch (error) {
    console.error('Erreur lors de la récupération des CV de l\'utilisateur:', error);
    // En cas d'erreur, renvoyer une réponse 500 Internal Server Error
    res.status(500).json({ error: 'Erreur lors de la récupération des CV de l\'utilisateur' });
  }
});
// Supprimer un CV spécifique par son ID
router.delete('/cv/:userId/:cvId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const cvId = req.params.id;

    // Supprimer le CV de la base de données
    await ImageModel.deleteOne({ userId: userId, cvId: cvId });

    res.status(200).json({ message: 'CV deleted successfully' });
  } catch (error) {
    console.error('Error deleting CV:', error);
    res.status(500).json({ error: 'Failed to delete CV' });
  }
});


router.post('/cv/:userId/', async (req, res) => {
  try {
      const userId = req.params.userId;
      const cvData = req.body; // Les données du formulaire de CV sont envoyées dans le corps de la requête
      const cvId = uuidv4(); // Générer un nouvel ID unique pour le CV

      // Créer un nouveau document CV
      const newCV = new CvModel({
          userId: userId,
          cvId: cvId,
          ...cvData
      });

      // Enregistrer le nouveau CV dans la base de données
      const savedCV = await newCV.save();

      console.log('New CV Data:', savedCV);
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.status(201).json({ message: 'New CV created successfully', cvId: cvId, cvData: savedCV });
  } catch (error) {
      console.error('Error creating CV:', error);
      res.status(500).json({ error: 'Failed to create CV' });
  }
});

module.exports = router;