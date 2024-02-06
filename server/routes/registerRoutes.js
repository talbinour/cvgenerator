const express = require('express');
const router = express.Router();
const UserInfo = require('../userDetails'); // Assuming registerRoutes.js is in the routes folder


router.post('/', async (req, res, next) => {
  const { nom, prenom, email, date_naissance, mot_passe, Nbphone } = req.body;

  try {
    const newUser = new UserInfo({
      nom,
      prenom,
      email,
      date_naissance,
      mot_passe,
      Nbphone,
    });
    await newUser.save();
    res.json({ status: 'ok' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;