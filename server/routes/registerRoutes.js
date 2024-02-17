const express = require('express');
const router = express.Router();
const UserInfo = require('../userDetails');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Route pour l'enregistrement des utilisateurs
router.post('/', async (req, res) => {
  const { nom, prenom, email, date_naissance, mot_passe, Nbphone } = req.body;
  console.log('Requête POST reçue:', req.body);
 

  try {
    // Vérifier si l'utilisateur existe déjà
    let user = await UserInfo.findOne({ email });
    if (user) {
      return res.status(400).json("User already exists...");
    }

    // Générer un token unique pour la validation de l'e-mail
    const emailToken = crypto.randomBytes(64).toString('hex');

    // Création d'un nouvel utilisateur avec le token d'e-mail
    user = new UserInfo({
      nom,
      prenom,
      email,
      date_naissance,
      mot_passe,
      Nbphone,
      emailToken,
      isVerified: false
    });

    // Sauvegarde de l'utilisateur dans la base de données
    await user.save();
    

    // Configuration et envoi de l'e-mail de confirmation
    const transporter = nodemailer.createTransport({
      // Configuration de votre serveur de messagerie sortante
      service: 'gmail',
      auth: {
        user: 'nt0506972@gmail.com', // Remplacez par votre adresse e-mail
        pass: 'evrz qnsg pume fhdf' // Remplacez par votre mot de passe
      }
    });

    const mailOptions = {
      from: 'nt0506972@gmail.com', // Remplacez par votre adresse e-mail
      to: email,
      subject: 'Confirmation de votre adresse e-mail',
      text: `Bonjour ${prenom}, veuillez cliquer sur le lien suivant pour confirmer votre adresse e-mail : http://localhost:8080/verify-email/${emailToken}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Erreur lors de l\'envoi de l\'e-mail de confirmation:', error);
        return res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'e-mail de confirmation' });
      }
      console.log('E-mail de confirmation envoyé:', info.response);
      res.status(200).json({ message: 'Utilisateur enregistré avec succès. Veuillez vérifier votre adresse e-mail pour activer votre compte.' });
    });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur lors de l\'enregistrement de l\'utilisateur' });
  }
});

module.exports = router;
