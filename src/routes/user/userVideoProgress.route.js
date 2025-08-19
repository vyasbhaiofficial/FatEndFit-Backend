const express = require('express');
const route = express.Router();

const userVideoProgressController = require('../../controllers/userVideoProgress.controller.js');

/**
 * @swagger
 * /user/videoProgress/update:
 *   post:
 *     summary: Update user video progress
 *     description: Save or update a user's progress on a video. Marks video as completed if at least 95% watched.
 *     tags: [Video Progress]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - videoId
 *               - currentTime
 *             properties:
 *               videoId:
 *                 type: string
 *                 example: "68a410a93be021c705beb981"
 *               currentTime:
 *                 type: number
 *                 description: Current playback time in seconds
 *                 example: 125
 *     responses:
 *       200:
 *         description: Video progress updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserVideoProgress'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Video not found
 *       500:
 *         description: Internal server error
 */
route.post('/update', userVideoProgressController.updateProgress);

module.exports = route;
