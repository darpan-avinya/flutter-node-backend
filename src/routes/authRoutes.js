const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMyProfile, uploadAvatar, forgotPassword, resetPassword } = require('../controllers/authController');
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User Authentication & Profile
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Darpan Raval
 *               email:
 *                 type: string
 *                 example: darpan@gmail.com
 *               password:
 *                 type: string
 *                 example: Avinya@2026
 *               role:
 *                 type: string
 *                 example: Flutter Developer
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists or validation error
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: darpan@gmail.com
 *               password:
 *                 type: string
 *                 example: Avinya@2026
 *     responses:
 *       200:
 *         description: Login successful with JWT token
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', loginUser);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get logged-in user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched user profile
 *       401:
 *         description: Unauthorized token missing or invalid
 */
router.get('/me', protect, getMyProfile); 

// Upload Avatar Route
router.put('/avatar', protect, upload.single('image'), uploadAvatar);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resetToken', resetPassword);

module.exports = router;