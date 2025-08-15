const express = require('express');
const route = express.Router();

const userController = require('../../controllers/user.controller.js');
const upload = require('../../../middleware/multer.js');

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login user with mobile number
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mobileNumber
 *             properties:
 *               mobileNumber:
 *                 type: string
 *                 example: "9876543210"
 *                 description: Registered mobile number of the user
 *               fcmToken:
 *                 type: string
 *                 example: "fcm_token_example_here"
 *                 description: Optional Firebase Cloud Messaging token for push notifications
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 code:
 *                   type: integer
 *                   example: 1001
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       description: User details
 *                     OTP:
 *                       type: string
 *                       example: "1234"
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ..."
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

route.post('/login', userController.login);

// update user by user

/**
 * @swagger
 * /user/update:
 *   put:
 *     summary: Update user profile (self)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John
 *               surname:
 *                 type: string
 *                 example: Doe
 *               fcmToken:
 *                 type: string
 *                 example: "d8f7s6d8f76sd8f7sd"
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 example: male
 *               age:
 *                 type: integer
 *                 example: 28
 *               height:
 *                 type: number
 *                 example: 175
 *               weight:
 *                 type: number
 *                 example: 70
 *               language:
 *                 type: string
 *                 example: English
 *               medicalDescription:
 *                 type: string
 *                 example: "Diabetic"
 *               city:
 *                 type: string
 *                 example: Mumbai
 *               state:
 *                 type: string
 *                 example: Maharashtra
 *               country:
 *                 type: string
 *                 example: India
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

route.put('/update', upload.single('image'), userController.updateUserByUser);

module.exports = route;
