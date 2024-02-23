const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const session = require('express-session');
const UserInfo = require('./userDetails');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nt0506972@gmail.com',
    pass: 'evrz qnsg pume fhdf',
  },
});

const generateToken = (user) => {
  // Implémentez votre logique de génération de token ici
  // Assurez-vous d'utiliser une bibliothèque comme jsonwebtoken
  // Exemple : return jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });
};
 // Importez une fonction pour générer un code aléatoire
 const generateVerificationCode = () => {
  // Générez un code aléatoire à six chiffres
  return Math.floor(100000 + Math.random() * 900000);
};

class AuthController {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
    this.initializePassport();
  }

  initializeRoutes() {
    this.router.options('/loginuser', cors());
    this.router.post('/loginuser', cors(), this.loginUser.bind(this));
    // ... Ajoutez d'autres routes ici
  }

  initializePassport() {
    passport.use(
      new GoogleStrategy(
        {
          clientID: "1009937116596-6f9r93cvhchvr1oc9424it9citjo1drv.apps.googleusercontent.com",
          clientSecret: "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",
          callbackURL: "/auth/google/callback",
          scope: ["profile", "email", "openid", "https://www.googleapis.com/auth/user.birthday.read", "https://www.googleapis.com/auth/user.phonenumbers.read"]
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            let user = await UserInfo.findOne({ googleId: profile.id });

            if (!user) {
              const password = Math.random().toString(36).slice(-8);
              const hashedPassword = await bcrypt.hash(password, 10);
              user = new UserInfo({
                googleId: profile.id,
                displayName: profile.displayName,
                email: profile.emails[0].value,
                nom: profile.name.givenName || '..',
                prenom: profile.name.familyName || '..',
                date_naissance: profile.birthdate || Date.now(),
                Nbphone: profile.phonenumber || '..',
                mot_passe: hashedPassword,
              });
              await user.save();
            }

            return done(null, user);
          } catch (error) {
            return done(error, null);
          }
        }
      )
    );

    passport.serializeUser((user, done) => {
      done(null, user);
    });

    passport.deserializeUser((user, done) => {
      done(null, user);
    });
  }

  async loginUser(req, res) {
    try {
      // Utilisation de express-validator pour valider et nettoyer les données d'entrée
      await body('email').isEmail().run(req);
      await body('mot_passe').isLength({ min: 6 }).trim().run(req);
  
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { email, mot_passe } = req.body;
      console.log('Input Password:', mot_passe);
      const trimmedPassword = mot_passe.trim();
      console.log('Trimmed Password:', trimmedPassword);
  
      const user = await UserInfo.findOne({ email });
      console.log('Database Password:', user.mot_passe);
  
      // Temporairement ignorez la comparaison de mot de passe
      const passwordMatch = await bcrypt.compare(trimmedPassword, user.mot_passe);

      if (user && passwordMatch) {
        // Le mot de passe est correct ou la comparaison est ignorée
        const token = generateToken(user);
        console.log('Passwords Match');
        res.status(201).json({ status: 'ok', data: token, role: user.role });
      } else {
        console.log('Passwords do not match');
        res.status(401).json({ status: 'Invalid Password' });
      }
    } catch (error) {
      console.error('Error in loginUser:', error);
      res.status(500).json({ status: 'Error', error: error.message });
    }
  }
  
  
  
  
  async loginSuccess(req, res) {
    if (req.user) {
      res.status(200).json({ message: 'User Login', user: req.user });
    } else {
      res.status(400).json({ message: 'Not Authorized' });
    }
  }

  logout(req, res, next) {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect('http://localhost:3000');
    });
  }
  async protectedRouteHandler(req, res) {
    try {
      // Assurez-vous que l'utilisateur est authentifié avant d'accéder à cette route
      if (req.isAuthenticated()) {
        // Vous pouvez accéder aux données de l'utilisateur authentifié via req.user
        const user = req.user;
  
        // Ajoutez ici la logique spécifique pour la route protégée
        // Par exemple, renvoyer des données protégées
        res.status(200).json({ message: 'Route protégée réussie', user });
      } else {
        // Si l'utilisateur n'est pas authentifié, renvoyez une réponse appropriée
        res.status(401).json({ message: 'Non autorisé' });
      }
    } catch (error) {
      console.error('Erreur dans protectedRouteHandler:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }
  async verifyEmail(req, res) {
    try {
      const emailToken = req.params.emailToken;
      const user = await UserInfo.findOne({ emailToken });
  
      if (user) {
        user.emailToken = null;
        user.isVerified = true; 
        await user.save();
        res.status(200).json({ message: 'Email verified successfully' });
      } else {
        res.status(404).json({ message: 'Email verification failed, invalid token' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error verifying email', error: error.message });
    }
  }
 
 

async sendVerificationCode(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(401).json({ status: 401, message: "Enter Your Email" });
  }

  try {
    const user = await UserInfo.findOne({ email });

    // Générez un code de vérification
    const verificationCode = generateVerificationCode();

    // Enregistrez le code de vérification dans la base de données
    user.verificationCode = verificationCode;
    await user.save();

    // Options du courrier électronique
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Verification Code for Password Reset",
      text: `Your verification code is: ${verificationCode}`,
      html: `<p>Your verification code is: <strong>${verificationCode}</strong></p>`
    };

    // Utilisez votre transporter nodemailer ici
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.error('Error sending email:', error);
      }
      console.log('Email sent:', info.response);
    });

    res.status(201).json({ status: 201, message: "Verification code sent successfully" });
  } catch (error) {
    console.error('Error sending verification code:', error);
    res.status(401).json({ status: 401, message: "Invalid user or server error" });
  }
}

  
  async verifyForgotPasswordToken(req, res) {
    const { id, token } = req.params;

    try {
      const user = await UserInfo.findOne({ _id: id, resetToken: token, resetTokenExpiration: { $gt: Date.now() } });

      if (user) {
        res.status(201).json({ status: 201, user });
      } else {
        res.status(401).json({ status: 401, message: "Invalid user or expired token" });
      }
    } catch (error) {
      console.error('Error verifying forgot password token:', error);
      res.status(401).json({ status: 401, error });
    }
  }

  async changePassword(req, res) {
    const { id, token } = req.params;
    const { password } = req.body;

    try {
      const user = await UserInfo.findOne({ _id: id, resetToken: token, resetTokenExpiration: { $gt: Date.now() } });

      if (user) {
        // Update the user's password
        const hashedPassword = await bcrypt.hash(password, 10);
        user.mot_passe = hashedPassword;

        // Invalidate the reset token
        user.resetToken = null;
        user.resetTokenExpiration = null;

        // Save the updated user
        await user.save();

        res.status(201).json({ status: 201, message: 'Password reset successfully' });
      } else {
        res.status(401).json({ status: 401, message: "Invalid user or expired token" });
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      res.status(401).json({ status: 401, error });
    }
  }
  async verifyResetCode(req, res) {
    try {
      const { verificationCode } = req.body;
      const user = await UserInfo.findOne({ verificationCode });
  
      if (user) {
        // Verification successful
        res.status(201).json({ status: 201, message: 'Verification successful' });
      } else {
        // Verification failed
        res.status(401).json({ status: 401, message: "Invalid verification code" });
      }
    } catch (error) {
      console.error('E  rror verifying reset code:', error);
      res.status(500).json({ status: 500, error: 'Internal server error' });
    }
  }
  
}

module.exports = AuthController;