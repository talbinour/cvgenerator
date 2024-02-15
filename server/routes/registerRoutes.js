const express = require('express');
const router = express.Router();
const UserInfo = require('../userDetails');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});
router.get('/verify-email/:emailToken', async (req, res) => {
  try {
    const user = await UserInfo.findOne({ emailToken: req.params.emailToken });

    if (!user) {
      return res.status(400).send('Lien invalide ou expiré');
    }

    user.isVerified = true;
    user.emailToken = undefined; // ou null, selon votre préférence
    await user.save();

    res.send('Email vérifié avec succès. Vous pouvez maintenant vous connecter.');
  } catch (error) {
    console.log(error);
    res.status(500).send('Erreur interne du serveur');
  }
});

// Route pour l'enregistrement des utilisateurs
router.post('/', async (req, res) => {
  const { nom, prenom, email, date_naissance, mot_passe, Nbphone } = req.body;
  console.log('Requête POST reçue:', req.body);

  try {
    let user = await UserInfo.findOne({ email });
    if (user) {
      return res.status(400).json("User already exists...");
    }

    const emailToken = crypto.randomBytes(64).toString('hex');

    // Création d'un nouvel utilisateur avec le jeton d'e-mail
    user = new UserInfo({
      nom,
      prenom,
      email,
      date_naissance,
      mot_passe,
      Nbphone,
      emailToken,
      isVerified: false // Assurez-vous d'avoir ce champ dans votre modèle d'utilisateur
    });

    await user.save();

    // Configuration et envoi de l'e-mail de vérification
    const mailOptions = {
      from: 'talbinourelhouda00@gmail.com', // Remplacez par votre adresse e-mail
      to: email,
      subject: 'Vérification de l\'adresse e-mail',
      text: `Cliquez sur le lien suivant pour vérifier votre adresse e-mail : http://localhost:8080/verify-email/${emailToken}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Erreur lors de l\'envoi de l\'e-mail de vérification:', error);
        return res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'e-mail de vérification' });
      }
      console.log('E-mail de vérification envoyé:', info.response);
      res.status(200).json({ message: 'Utilisateur enregistré avec succès. Veuillez vérifier votre adresse e-mail pour activer votre compte.' });
    });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur lors de l\'enregistrement de l\'utilisateur' });
  }
});

module.exports = router;
