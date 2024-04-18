const express = require('express');
const fs = require('fs').promises;

const router = express.Router();

router.get('/cv', async (req, res) => {
  try {
    const cvModel = await fs.readFile('./cv_model.json', 'utf-8');
    res.json({ cvModel });
  } catch (error) {
    console.error('Error loading CV model:', error);
    res.status(500).json({ error: 'Failed to load CV model' });
  }
});

router.put('/cv', async (req, res) => {
  try {
    const editedCvModel = req.body.cvModel;
    await fs.writeFile('./cv_model.json', editedCvModel);
    res.json({ message: 'CV model saved successfully' });
  } catch (error) {
    console.error('Error saving CV model:', error);
    res.status(500).json({ error: 'Failed to save CV model' });
  }
});

module.exports = router;
