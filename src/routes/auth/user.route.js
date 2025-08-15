const express = require('express');
const route = express.Router();
const userController = require('../../controllers/user.controller.js');

/**
 * @swagger
 * /auth/user/login:
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

module.exports = route;
