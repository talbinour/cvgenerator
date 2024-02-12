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
    this.initializePassport();
    this.router = router; // Call the function to initialize Passport
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
              const password = Math.random().toString(36).slice(-8); // Générez un mot de passe aléatoire de 8 caractères
              const hashedPassword = await bcrypt.hash(password, 10); // Hasher le mot de passe

              user = new UserInfo({
                googleId: profile.id,
                displayName: profile.displayName,
                email: profile.emails[0].value,
                nom: profile.name.givenName , // Utilisez le prénom de Google s'il est disponible, sinon laissez-le vide
                prenom: profile.name.familyName , // Utilisez le nom de famille de Google s'il est disponible, sinon laissez-le vide
                date_naissance: profile.birthdate , // Utilise la date de naissance de Google s'il est disponible, sinon laissez-le vide
                Nbphone: profile.phonenumber , // Utilise le numéro de téléphone de Google s'il est disponible, sinon laissez-le vide
                mot_passe: hashedPassword, // Vous pouvez générer un mot de passe aléatoire si nécessaire
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
