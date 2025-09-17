const express = require('express');
const route = express.Router();

const videoController = require('../../controllers/video.controller.js');

/**
 * @swagger
 * tags:
 *   name: Video
 *   description: Video management APIs
 */

/**
 * @swagger
 * /user/video/get:
 *   get:
 *     summary: Get all videos by user with progress
 *     description: Fetch all videos for the logged-in user and include their video progress if available.
 *       Language is automatically selected from the user's profile. Default fallback is english.
 *     tags: [Video]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: day
 *         schema:
 *           type: number
 *         required: false
 *         description: pass only if type = 1 to Filter videos by day
 *       - in: query
 *         name: type
 *         schema:
 *           type: number
 *         required: true
 *         description: type 1 video day wise 2 webinar in live section
 *       - in: query
 *         name: start
 *         schema:
 *           type: integer
 *           example: 0
 *         required: false
 *         description: Pagination start index
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         required: false
 *         description: Number of videos to return
 *     responses:
 *       200:
 *         description: List of videos with user progress
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Video'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
route.get('/get', videoController.getAllVideosByUser);

module.exports = route;
