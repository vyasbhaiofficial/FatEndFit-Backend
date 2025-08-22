const express = require('express');
const route = express.Router();

const userController = require('../../controllers/user.controller.js');
const upload = require('../../../middleware/multer.js');

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
 *                 enum: [Male, Female, Other]
 *                 example: Male
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

// get user by user
/**
 * @swagger
 * /user/get:
 *   get:
 *     summary: Get user profile (self)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
route.get('/get', userController.getProfileByUser);

// getFirstPageDayWiseProgress
/**
 * @swagger
 * /user/getFirstPageDayWiseProgress:
 *   get:
 *     summary: Get first page - day wise progress
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Server error
 */

route.get('/getFirstPageDayWiseProgress', userController.getFirstPageDayWiseProgress);

// updateFcmToken
/**
 * @swagger
 * /user/updateFcmToken:
 *   put:
 *     summary: Update fcm token
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fcmToken:
 *                 type: string
 *                 example: "d8f7s6d8f76sd8f7sd"
 *     responses:
 *       200:
 *         description: FCM token updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
route.put('/updateFcmToken', userController.updateFcmToken);

module.exports = route;
