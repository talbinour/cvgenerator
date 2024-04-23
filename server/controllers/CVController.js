const fs = require('fs');
const path = require('path');
const CVModel = require('../CVModel');
const multer = require('multer');

// Function to save base64 image to file
function saveBase64Image(base64String, filename) {
  return new Promise((resolve, reject) => {
    // Remove data URL scheme and extract base64 data
    const base64Image = base64String.split(';base64,').pop();
    const filePath = path.join(__dirname, '..', 'uploads', filename);
    
    // Convert base64 to binary
    fs.writeFile(filePath, base64Image, { encoding: 'base64' }, (err) => {
      if (err) reject(err);
      else resolve(filePath);
    });
  });
}

// Function to validate base64 image data
function isValidBase64(str) {
  return true; // Bypass validation temporarily
}

// Configure storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Set your upload directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// Set up multer with the configured storage and increased file size limit to 50MB (50000000 bytes)
// Set up multer with the configured storage and increased field size limit to 5MB (5000000 bytes)
const upload = multer({
  storage: storage,
  limits: { fileSize: 50000000, fieldSize: 5000000 }, // 50 MB and 5 MB in bytes
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
  } else {
      cb(new Error('Invalid file type. Only JPEG and PNG files are allowed.'), false);
  }
};

class CVController {
  async createCV(req, res) {
    try {
      console.log('Received CV data:', req.body);
      const { title, imageURL, content, image } = req.body;

      // Validate base64 image
      if (!isValidBase64(image)) {
        throw new Error('Invalid image data');
      }

      // Save image from base64 string
      const filename = `CVImage_${Date.now()}.png`;
      const imagePath = await saveBase64Image(image, filename);

      // Create the new CV with the validated data and saved image path
      const newCV = new CVModel({ title, imageURL, content, image: imagePath });
      
      // Save the new CV in the database
      const savedCV = await newCV.save();

      res.status(201).json(savedCV);
    } catch (error) {
      console.error('Error creating CV:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async getCVs(req, res) {
    try {
      const cvs = await CVModel.find();
      res.status(200).json(cvs);
    } catch (error) {
      console.error('Error getting CVs:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async getCVById(req, res) {
    try {
      const cvId = req.params.id;
      const cv = await CVModel.findById(cvId);
      
      if (!cv) {
        return res.status(404).json({ error: 'CV not found' });
      }

      res.status(200).json(cv);
    } catch (error) {
      console.error('Error getting CV by ID:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async updateCV(req, res) {
    try {
      const cvId = req.params.id;
      const { title, imageURL, content } = req.body;
      const updatedCV = await CVModel.findByIdAndUpdate(
        cvId,
        { title, imageURL, content },
        { new: true }
      );

      if (!updatedCV) {
        return res.status(404).json({ error: 'CV not found' });
      }

      res.status(200).json(updatedCV);
    } catch (error) {
      console.error('Error updating CV:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async deleteCV(req, res) {
    try {
      const cvId = req.params.id;
      const deletedCV = await CVModel.findByIdAndDelete(cvId);

      if (!deletedCV) {
        return res.status(404).json({ error: 'CV not found' });
      }

      res.status(200).json(deletedCV);
    } catch (error) {
      console.error('Error deleting CV:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = CVController;
