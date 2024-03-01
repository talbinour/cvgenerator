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
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nt0506972@gmail.com',
    pass: 'evrz qnsg pume fhdf',
  },
});

const generateToken = (user) => {
  try {
    // Implémentez votre logique de génération de token ici
    // Assurez-vous d'utiliser une bibliothèque comme jsonwebtoken
    // Exemple : return jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });
  } catch (error) {
    throw new Error(error);
  }
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
                isVerified : true
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
              return done(null, false, { message: 'utilisateur n existe pas ' });
            }
    
            const passwordMatch = await bcrypt.compare(password, user.mot_passe);
    
            if (!passwordMatch) {
              return done(null, false, { message: 'Incorrect password' });
            }
    
            return done(null, user);
          } catch (error) {
            return done(error);
          }
        })
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
      //const passwordMatch = await user.comparePassword(trimmedPassword);
      const passwordMatch = await user.comparePassword(mot_passe);  
      if (!user) {
        return res.status(401).json({ status: 'Utilisateur n existe pas' });
      }
      // Ajo                                                                                                                                                                                                                          utez cette vérification pour vous assurer que l'utilisateur a vérifié son email
      if (!user.isVerified) {
        return res.status(401).json({ status: 'Account not verified', message: 'Veuiller vérifier votre compte avant de vous connecter' });
      }
      if (user && passwordMatch) {
        // Le mot de passe est correct ou la comparaison est ignorée
        // Stocker l'utilisateur dans la session
        req.session.user = user;
        const token = generateToken(user);
        if (user.role === 'admin') {
          // Réponse pour un admin
          res.status(200).json({ status: 'ok', data: token, role: 'admin', username: user.nom }); // Ajout du nom d'utilisateur
        } else {
          // Réponse pour un utilisateur standard
          res.status(200).json({ status: 'ok', data: token, role: user.role, username: user.nom }); // Ajout du nom d'utilisateur
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
  async getCurrentUsername(req, res) {
    try {
      // Récupérer l'utilisateur actuel à partir de la session ou de la base de données
      const currentUser = req.user; // Supposons que vous stockiez l'utilisateur dans la session
  
      // Vérifier si l'utilisateur est défini et si oui, récupérer le nom d'utilisateur
      const username = currentUser ? currentUser.nom : null; // Remplacez "username" par le champ approprié de votre modèle UserInfo
  
      // Renvoyer le nom d'utilisateur actuel dans la réponse
      res.status(200).json({ username });
    } catch (error) {
      console.error('Erreur lors de la récupération du nom d utilisateur :', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }
  
 
 
  
}

module.exports = AuthController;