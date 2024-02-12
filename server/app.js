const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const AuthController = require('./authController');
const passport = require('passport');
const session = require('express-session');

// Load environment variables
dotenv.config();

// Import MongoDB models
require('./userDetails'); // Make sure to register the model

// Create an instance of the AuthController
const authController = new AuthController();

// App setup
const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cors({ origin: true, credentials: true }));

// Add express-session middleware
app.use(session({
  secret: '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', // Replace with your own secret key
  resave: true,
  saveUninitialized: true,
}));

// Initialize Passport and restore authentication state from the session
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Set a timeout to detect initial connection
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Terminate the application on connection error
  });

// Initialize routes from the AuthController
authController.initializeRoutes();

// Import routes
const postRoutes = require('./routes/postRoutes');
const registerRoutes = require('./routes/registerRoutes');

// Routes setup
app.use('/post', postRoutes);
app.use('/register', registerRoutes);
app.get(("/auth/google/callback",passport.authenticate("google",{successRedirect:"http://localhost:3000",failureRedirect:"http://localhost:3000/login"})))

app.use('/', authController.router);

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    // Handle Mongoose validation errors
    const validationErrors = Object.values(err.errors).map((error) => error.message);
    res.status(400).json({ error: 'Validation failed', details: validationErrors });
  } else {
    // Handle other types of errors
    console.error(err.stack);
    res.status(500).send(`Something went wrong! Error: ${err.message}`);
  }
});
// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server is running on port ${port}`));
