const express = require('express');
const route = express.Router();
const userController = require('../../controllers/user.controller.js');

/**
 * @swagger
 * /auth/user/login:
 *   post:
 *     summary: Login user with mobile number
 *     tags:
 *       - Auth
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

/**
 * @swagger
 * /auth/user/refresh-token:
 *   post:
 *     summary: Refresh JWT token
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "your_refresh_token_here"
 *     responses:
 *       200:
 *         description: Token refreshed successfully
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
 *                   example: 1002
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: "new_access_token_here"
 *       401:
 *         description: Refresh token required
 *       403:
 *         description: Invalid or expired refresh token / User is blocked
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
route.post('/refresh-token', userController.refreshToken);

module.exports = route;
