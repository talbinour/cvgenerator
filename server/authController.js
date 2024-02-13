const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cors = require('cors');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const jwt = require('jsonwebtoken');
const { UserInfo } = require('./userDetails');
const flash = require('express-flash'); // Add this line
// Import the User model if it's not imported already
// const User = require('./models/User'); // Replace with your actual path

class AuthController {
  constructor(app, passport, jwt, bcrypt) {
    this.app = app;
    this.passport = passport;
    this.jwt = jwt;
    this.bcrypt = bcrypt;
    this.initializeRoutes();
    this.initializePassport();
  }

  initializeRoutes() {
    this.app.post('/loginuser', this.loginUser.bind(this));
    this.app.get('/auth/google/callback', passport.authenticate('google', {
      successRedirect: '/dashboard',
      failureRedirect: '/login',
    }), (req, res) => {
      res.redirect('/dashboard');
    });
    //this.app.use(flash());

    //this.app.get('/login/success', this.loginSuccess.bind(this));
    //this.app.get('/logout', this.logout.bind(this));
  }
  initializePassport() {
    this.app.use(
      session({
        secret: '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',
        resave: true,
        saveUninitialized: true,
        cookie: {
          secure: true, // Set to true for HTTPS
          sameSite: 'strict', // Adjust based on your needs
        },
      })
    );
  
    
  this.app.use(this.passport.initialize());
  this.app.use(this.passport.session());

  this.passport.use(
    new GoogleStrategy(
      {
        clientID: '1009937116596-6f9r93cvhchvr1oc9424it9citjo1drv.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: '/auth/google/callback',
        scope: ['profile', 'email', 'openid', 'https://www.googleapis.com/auth/user.birthday.read', 'https://www.googleapis.com/auth/user.phonenumbers.read'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await UserInfo.findOne({ googleId: profile.id });

          if (!user) {
            const password = Math.random().toString(36).slice(-8);
            const hashedPassword = await this.bcrypt.hash(password, 10);
            user = new UserInfo({
              googleId: profile.id,
              displayName: profile.displayName,
              email: profile.emails[0].value,
              image: profile.photos[0].value,
              nom: profile.name.givenName || '',
              prenom: profile.name.familyName || '',
              date_naissance: profile.birthdate || '',
              Nbphone: profile.phonenumber || '',
              mot_passe: hashedPassword,
              image: profile.photos[0].value,
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

  // Local Strategy
  this.passport.use(
    new LocalStrategy(
      { usernameField: 'email' },
      async (email, password, done) => {
        try {
          const user = await UserInfo.findOne({ email });

          if (!user) {
            return done(null, false, { message: 'Incorrect email.' });
          }

          const isValidPassword = await bcrypt.compare(password, user.mot_passe);

          if (!isValidPassword) {
            return done(null, false, { message: 'Incorrect password.' });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Serialize and deserialize user
  this.passport.serializeUser(function (user, done) {
    done(null, user);
  });

  this.passport.deserializeUser(function (user, done) {
    done(null, user);
  });
}
  loginUser = async (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.json({ status: 'error', error: info.message });
      }

      req.login(user, (err) => {
        if (err) {
          return next(err);
        }

        const token = jwt.sign({ email: user.email }, 'yourSecretKey', {
          expiresIn: '15m',
        });

        return res.json({ status: 'ok', data: token });
      });
    })(req, res, next);
  };

  checkToken = async (req, res) => {
    const { token } = req.body;
    try {
      const user = jwt.verify(token, 'yourSecretKey', (err, decoded) => {
        if (err) {
          return 'token expired';
        }
        return decoded;
      });

      if (user === 'token expired') {
        return res.send({ status: 'error', data: 'token expired' });
      }

      const useremail = user.email;
      UserInfo.findOne({ email: useremail })
        .then((data) => {
          res.send({ status: 'ok', data: data });
        })
        .catch((error) => {
          res.send({ status: 'error', data: error });
        });
    } catch (error) { }
  };
}

module.exports = AuthController;