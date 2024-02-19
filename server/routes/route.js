const express = require('express');
const UserController = require('../userController'); // Import 
const router = express.Router();

// Define your routes
router.post('/createUser', UserController.createUser);
router.put('/updateUser/:userId', UserController.updateUser);
router.delete('/deleteUser/:userId', UserController.deleteUser);
router.get('/getAllUsers', UserController.getAllUsers);
router.put('/deleteAttribute/:userId', UserController.deleteAttribute);

module.exports = router;