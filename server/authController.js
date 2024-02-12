const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cors = require('cors');
const jwt = require('jsonwebtoken');
const UserInfo = require('./userDetails');
const Admin = require('./admin'); // Import Admin model
const session = require('express-session');

// Ajoutez la fonction generateToken
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
    this.router.post('/loginuser', cors(), this.loginUser.bind(this));
    this.router.get('/auth/google/callback',
      passport.authenticate('google', {
        successRedirect: "/dashboard",
        failureRedirect: "/Login",
      }),
      (req, res) => {
        res.redirect('/dashboard');
      }
    );

    this.router.get('/login/success', this.loginSuccess.bind(this));
    this.router.get('/logout', this.logout.bind(this));
  }

  initializePassport() {
    passport.use(
      new GoogleStrategy(
        {
          clientID: "1009937116596-6f9r93cvhchvr1oc9424it9citjo1drv.apps.googleusercontent.com",
          clientSecret: "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",
          callbackURL: "/auth/google/callback",
          scope: ["profile", "email"]
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            let user = await UserInfo.findOne({ googleId: profile.id });

            if (!user) {
              user = new UserInfo({
                googleId: profile.id,
                displayName: profile.displayName,
                email: profile.emails[0].value,
                image: profile.photos[0].value
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
    const { email, mot_passe } = req.body;

    try {
      // Try to find both admin and user with the provided email
      const user = await UserInfo.findOne({ email });
      const admin = await Admin.findOne({ email });

      if (user || admin) {
        // Determine if it's an admin or user login
        const targetUser = user || admin;

        const passwordMatch = await targetUser.comparePassword(mot_passe);

        if (passwordMatch) {
          const token = generateToken(targetUser);

          res.status(201).json({ status: 'ok', data: token, role: targetUser.role });
        } else {
          res.status(401).json({ status: 'Invalid Password' });
        }
      } else {
        res.status(404).json({ status: 'User/Admin Not Found' });
      }
    } catch (error) {
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
}

module.exports = AuthController;
