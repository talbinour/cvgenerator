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
  },
      // Add new routes for handling successful login and logout
      router.get('/login/success', this.loginSuccess.bind(this)),
      router.get('/logout', this.logout.bind(this)),
);
  }

  initializePassport() {
    passport.use(new GoogleStrategy({
      clientID: '1009937116596-6f9r93cvhchvr1oc9424it9citjo1drv.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: '/auth/google/callback',
      scope: ['profile', 'email'], 
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await UserInfo.findOne({ googleId: profile.id });
    
        if (!user) {
          // User not found, create a new user in the database
          user = new UserInfo({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value,
            image:profile.photos[0].value,
            // Add any additional fields you want to save from the Google profile
          });
    
          await user.save();
        }
    
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }));
    
  
    // Serialize and deserialize user
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
    res.redirect('/login/success');
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
      // Redirect to the home page after logout
      res.redirect('http://localhost:3000');
    });
  }
   // Add other authentication methods as needed
   
}

 


module.exports = AuthController;
