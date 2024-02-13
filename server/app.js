const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');
const AuthController = require('./AuthController'); // Assurez-vous d'utiliser le bon chemin vers le contrôleur d'authentification

// Charge les variables d'environnement
dotenv.config();

// Importe les modèles MongoDB
require('./userDetails');
require('./admin');

// Configuration de l'application Express
const app = express();
app.use(express.json());
app.use(morgan('dev'));

// Configure CORS avant les routes
app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

// Configure la session avant Passport
app.use(session({
  secret: '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', // Assurez-vous d'utiliser votre propre clé secrète, sans doublon
  resave: true,
  saveUninitialized: true,
}));

// Initialise Passport après la session
app.use(passport.initialize());
app.use(passport.session());

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
}).then(() => console.log('Connecté à MongoDB'))
.catch((err) => {
  console.error('Erreur lors de la connexion à MongoDB :', err);
  process.exit(1);
});

// Crée une instance du contrôleur d'authentification avant de définir les routes qui l'utilisent
const authController = new AuthController();

// Importe les routes
const postRoutes = require('./routes/postRoutes');
const registerRoutes = require('./routes/registerRoutes');

// Configuration des routes
app.use('/post', postRoutes);
app.use('/register', registerRoutes);

// Configure la route de rappel d'authentification Google avant d'utiliser authController.router
app.get("/auth/google/callback", passport.authenticate("google", { successRedirect: "http://localhost:3000", failureRedirect: "http://localhost:3000/login" }));

// Utilise le routeur du contrôleur d'authentification
app.use('/', authController.router);

// Ajoute les options CORS pour /loginuser
app.post('/loginuser', cors(), authController.loginUser.bind(authController));

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const validationErrors = Object.values(err.errors).map((error) => error.message);
    res.status(400).json({ error: 'Validation failed', details: validationErrors });
  } else {
    console.error(err.stack);
    res.status(500).send(`Une erreur s'est produite ! Erreur : ${err.message}`);
  }
});

// Lance le serveur
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Le serveur fonctionne sur le port ${port}`));
