const express = require('express');
const router = express.Router();
const UserInfo = require('../userDetails');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

router.post('/', async (req, res) => {
  const { nom, prenom, email, date_naissance, mot_passe, Nbphone ,genre, pays} = req.body;
  console.log('Requête POST reçue:', req.body);

  try {
    let user = await UserInfo.findOne({ email });
    if (user) {
      return res.status(400).json("L'utilisateur avec cette adresse e-mail existe déjà.");
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
      genre, // Added gender
      pays ,  // Added country
      emailToken,
      isVerified: false,
      photo
    });

    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'verif.cevor@gmail.com',
        pass: 'bslf cnyx hudg sllz'
      }
    });

    const mailOptions = {
      from: 'verif.cevor@gmail.com',
      to: email,
      subject: 'Confirmation de votre adresse e-mail',
      html: `
      <p>Bonjour ${prenom},</p>
      <p>Merci de vous être inscrit. Veuillez cliquer sur le bouton ci-dessous pour confirmer votre adresse e-mail :</p>
      <form action="http://localhost:8080/verify-email/${emailToken}" method="get">
        <button type="submit"style={{ backgroundColor: '#1f4172', color: 'white' }}>Confirmer mon adresse e-mail</button>
      </form>
    `,    };

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