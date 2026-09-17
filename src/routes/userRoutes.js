const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public Route (કોઈપણ નવો યુઝર બનાવી શકે)
router.post('/', userController.createUser);

// Admin Only Routes: પહેલા protect (Login ચેક), પછી authorize (Admin ચેક)
router.get('/', protect, authorize('admin'), userController.getAllUsers);
router.delete('/:id', protect, authorize('admin'), userController.deleteUser);

// Login થયેલ કોઈપણ યુઝર પોતાની કે બીજાની ID જોઈ શકે
router.get('/:id', protect, userController.getUserById);

module.exports = router;