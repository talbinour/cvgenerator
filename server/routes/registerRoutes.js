const express = require('express');
const router = express.Router();
const UserInfo = require('../userDetails');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

router.post('/', async (req, res) => {
  const { nom, prenom, email, date_naissance, mot_passe, Nbphone } = req.body;
  console.log('Requête POST reçue:', req.body);

  try {
    let user = await UserInfo.findOne({ email });
    if (user) {
      return res.status(400).json("User already exists...");
    }

    const birthDate = new Date(date_naissance);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();

    if (age < 18) {
      return res.status(400).json({ error: 'Vous devez avoir au moins 18 ans pour vous inscrire.' });
    }

    const emailToken = crypto.randomBytes(64).toString('hex');

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

    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'nt0506972@gmail.com',
        pass: 'evrz qnsg pume fhdf'
      }
    });

    const mailOptions = {
      from: 'nt0506972@gmail.com',
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
