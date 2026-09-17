const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Routes mapping
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;