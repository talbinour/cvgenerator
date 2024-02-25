const express = require('express');
const UserController = require('../userController');
const AuthController= require('../authController'); 
const Passwordreset= require('../passwordreset');// Import 
const router = express.Router();

// Define your routes
router.post('/createUser', UserController.createUser);
router.put('/updateUser/:userId', UserController.updateUser);
router.delete('/deleteUser/:userId', UserController.deleteUser);
router.get('/getAllUsers', UserController.getAllUsers);
router.put('/deleteAttribute/:userId', UserController.deleteAttribute);
router.get('/getUserByEmail/:email', UserController.getUserByEmail);
router.get('/getUserById/:id', UserController.getUserById);
//router.get('/forgotpassword/:identifier',AuthController.getUserByIdOrEmail);
// Define the new route
router.get('/validateUser/:identifier', UserController.validateUser);
// Create an instance of Passwordreset class
const passwordResetInstance = new Passwordreset();

// Route for sending a password link
router.post('/sendpasswordlink', (req, res) => passwordResetInstance.sendVerificationCode(req, res));

// Route to verify verification code
router.post('/verify-reset-code', (req, res) => passwordResetInstance.verifyResetCode(req, res));

// Route to change password
router.post('/change-password/:id/:token', (req, res) => passwordResetInstance.changePassword(req, res));
router.post('/handleUserRequest/:type',(req, res) =>handleUserRequest.changePassword(req, res));

module.exports = router;