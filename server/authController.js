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

class AuthController {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
    this.initializePassport();
  }

  initializeRoutes() {
    this.router.options('/loginuser', cors());
    this.router.post('/loginuser', cors(), this.loginUser.bind(this));
    this.router.get('/forgotpassword/:identifier', (req, res) => this.getUserByIdOrEmail(req, res));
    // ... Add other routes here
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
        if(user.role === 'admin') {
          // Réponse pour un admin
          res.status(200).json({ status: 'ok', data: token, role: 'admin' });
        } else {
          // Réponse pour un utilisateur standard
          res.status(200).json({ status: 'ok', data: token, role: 'user' });
        }
      } else {
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
 
 
  
}

module.exports = AuthController;