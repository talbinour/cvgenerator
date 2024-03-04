const express = require('express');
const UserController = require('../userController');
const AuthController = require('../authController');
const Passwordreset = require('../passwordreset');
const UserInfo = require('../userDetails'); // Import UserInfo
const LogoutController = require('../LogoutController'); 
const bcrypt = require('bcrypt'); // Import bcrypt
const router = express.Router();
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
// Define your routes
router.post('/createUser', UserController.createUser);
router.put('/updateUser/:userId', UserController.updateUser);
router.delete('/deleteUser/:userId', UserController.deleteUser);
router.get('/getAllUsers', UserController.getAllUsers);
router.put('/deleteAttribute/:userId', UserController.deleteAttribute);
router.get('/getUserByEmail/:email', UserController.getUserByEmail);
router.get('/getUserById/:id', UserController.getUserById);

// Create an instance of AuthController
const authControllerInstance = new AuthController();

// Use the getCurrentUsername method as a callback
router.get('/current-username', (req, res) => authControllerInstance.getCurrentUsername(req, res));

// Create an instance of Passwordreset class
const passwordResetInstance = new Passwordreset();

// Route for sending a password link
router.post('/sendpasswordlink', (req, res) => passwordResetInstance.sendVerificationCode(req, res));

// Route to verify verification code
router.post('/verify-reset-code', (req, res) => passwordResetInstance.verifyResetCode(req, res));

// Route to change password
// Utilisez l'instance déjà créée en haut du fichier
router.post('/change-password/:email/:token', async (req, res) => {
    try {
        console.log('Change Password Route Hit');
        const email = req.params.email;
        const { oldPassword, newPassword } = req.body;

        // Utilisez la même instance de Passwordreset
        await passwordResetInstance.changePassword(req, res);
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
const logoutControllerInstance = new LogoutController();
router.get('/logout', (req, res) => logoutControllerInstance.logout(req, res));


async function verifyTokenByEmail(email, token) {
    try {
        // Find the user by email
        const user = await UserInfo.findOne({ email });

        // Check if the user and the token exist
        if (user && user.verificationCode === token) {
            // Optionally, you may want to check if the token is expired or implement additional security checks
            return true;  // Token is valid
        } else {
            return false; // Token is invalid
        }
    } catch (error) {
        console.error('Error verifying token:', error);
        return false; // Assume token is invalid in case of an error
    }
}
  

module.exports = router;
