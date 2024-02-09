const express = require('express');
const router = express.Router();
const UserInfo = require('./userDetails');
const bcrypt = require('bcrypt');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Your existing AuthController class
class AuthController {
  constructor() {
    this.initializeRoutes();
    this.initializePassport(); // Call the function to initialize Passport
  }

  initializeRoutes() {
    router.post('/api/login', this.login.bind(this));
    // Add other authentication routes as needed
    router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
    router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
   (req, res) => {
    // Succès de l'authentification Google
    res.redirect('/'); // Redirigez vers la page d'accueil ou une autre route
  }
);
  }

  initializePassport() {
    passport.use(new GoogleStrategy({
        clientID: '250803111005-b271f2crrtjhe9idkhiv9fg6pqqel0el.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: 'http://localhost:8080/auth/google/callback',
      }, (accessToken, refreshToken, profile, done) => {
        // Handle the Google authentication callback
        // Store user information in the database if needed
        return done(null, profile);
      }));
      
    // Serialize user into the session
    passport.serializeUser((user, done) => {
      done(null, user);
    });

    passport.deserializeUser((obj, done) => {
      done(null, obj);
    });
  }

  async login(req, res, next) {
    const { email, mot_passe } = req.body;

    try {
      // Find the user by email
      const user = await UserInfo.findOne({ email });

      if (user) {
        // Compare the password
        const passwordMatch = await user.comparePassword(mot_passe);

        if (passwordMatch) {
          // Correct password, you can generate a JWT token here if needed
          res.json({ status: 'ok', user });
        } else {
          // Incorrect password
          res.json({ status: 'Mot de passe incorrect' });
        }
      } else {
        // User not found
        res.json({ status: 'Utilisateur non trouvé' });
      }
    } catch (error) {
      next(error);
    }
  }

  // Add other authentication methods as needed
}

module.exports = AuthController;
