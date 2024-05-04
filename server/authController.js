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
const { Strategy: LocalStrategy } = require('passport-local');
const fs = require('fs').promises;
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nt0506972@gmail.com',
    pass: 'evrz qnsg pume fhdf',
  },
});

const generateToken = (user) => {
  return jwt.sign({ userId: user._id }, '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', { expiresIn: '1h' });
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
    this.router.get('/current-username', cors(), this.getCurrentUsername.bind(this));

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
            let user = await UserInfo.findOne({ email: profile.emails[0].value });
    
            if (user) {
              // Si l'utilisateur existe mais n'a pas de googleId, mettez à jour son googleId
              if (!user.googleId) {
                user.googleId = profile.id;
                await user.save();
              }
            } else {
              // Créez un nouvel utilisateur si aucun utilisateur avec l'email donné n'existe
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
                role: 'user', 
                genre : profile.genre || '..',
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
    passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await UserInfo.findOne({ email });

      if (!user) {
        return done(null, false, { message: 'User not found' });
      }

      // Check if the user is using Google OAuth
      if (user.googleId) {
        return done(null, user);
      }

      const passwordMatch = await bcrypt.compare(password, user.mot_passe);

      if (!passwordMatch) {
        return done(null, false, { message: 'Incorrect password' });
      }

      return done(null, user); // Passport gère automatiquement la session après l'authentification
    } catch (error) {
      return done(error);
    }
  })
);

  
    // Serialize and deserialize user
    passport.serializeUser((user, done) => {
      done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
      try {
        const user = await UserInfo.findById(id);
        done(null, user);
      } catch (error) {
        done(error);
      }
    });
  
  }
  async getCurrentUsername(req, res) {
    try {
      const currentUser = req.user;
  
      if (!currentUser || !currentUser._id) {
        return res.status(401).json({ error: 'User not authenticated' });
      }
  
      // Supposons que vous souhaitez renvoyer plus de données utilisateur
      const user = {
        id: currentUser._id,
        nom: currentUser.nom,
        prenom: currentUser.prenom,
        email: currentUser.email,
        Nbphone: currentUser.Nbphone,
        date_naissance: currentUser.date_naissance,
        role: currentUser.role,
        pays: currentUser.pays,
        profession: currentUser.profession,
        
         photo: currentUser.photo,
        // Ajoutez d'autres champs nécessaires
      };
  
      res.status(200).json({ user });
    } catch (error) {
      console.error('Error in getCurrentUsername:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
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
        

        if (!user) {
            return res.status(401).json({ status: 'User not found' });
        }
        if (!user.isVerified) {
          return res.status(403).json({ status: 'Unverified', message: 'Votre compte n\'a pas été vérifié. Veuillez vérifier votre e-mail.' });
      }

        // Temporairement ignorez la comparaison de mot de passe
        const passwordMatch = await bcrypt.compare(trimmedPassword, user.mot_passe);

        if (passwordMatch) {
          const token = generateToken(user);
          req.login(user, (err) => {
            if (user.role === 'admin') {
              // Réponse pour un admin
              res.status(200).json({ status: 'ok', data: token, role: 'admin', username: user.nom }); // Ajout du nom d'utilisateur
          } else {
              // Réponse pour un utilisateur standard
              res.status(200).json({ status: 'ok', data: token, role: user.role, username: user.nom}); 
          }
          });
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
/*
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
  }*/
  async  verifyEmail(req, res) {
    try {
      const emailToken = req.params.emailToken;
      const user = await UserInfo.findOne({ emailToken });
  
      if (user) {
        user.emailToken = null;
        user.isVerified = true; 
        await user.save();
  
        const successHtml = await fs.readFile('verification-success.html', 'utf-8');
        res.status(200).send(successHtml);
      } else {
        const failureHtml = await fs.readFile('verification-failure.html', 'utf-8');
        res.status(404).send(failureHtml);
      }
    } catch (error) {
      const errorHtml = await fs.readFile('error.html', 'utf-8');
      res.status(500).send(errorHtml);
    }
  }
 
 
  
}

module.exports = AuthController;