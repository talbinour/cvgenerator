const express = require('express');
const Review = require('./reviewmodel');

const router = express.Router();
router.post('/api/reviews', async (req, res) => {
    try {
        const { iduser, stars, message, name, photo } = req.body;

        const newReview = new Review({
            iduser,
            stars,
            message,
            name,
            photo
        });
    
        await newReview.save();
    
        res.status(201).json({ message: 'Avis enregistré avec succès.' });
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement de l\'avis :', error);
        res.status(500).json({ error: 'Une erreur s\'est produite lors de l\'enregistrement de l\'avis.' });
    }
});

router.get('/api/reviews', async (req, res) => {
    try {
        const reviews = await Review.find();
        res.json(reviews);
    } catch (error) {
        console.error('Erreur lors de la récupération des avis :', error);
        res.status(500).json({ error: 'Une erreur s\'est produite lors de la récupération des avis.' });
    }
});

module.exports = router;


