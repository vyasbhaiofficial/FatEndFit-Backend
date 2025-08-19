const express = require('express');
const route = express.Router();

const videoController = require('../../controllers/video.controller.js');

/**
 * @swagger
 * tags:
 *   name: video
 *   description: video management APIs
 */

/**
 * @swagger
 * /user/video/get:
 *   get:
 *     summary: Get all videos by user with progress
 *     description: Fetch all videos for the logged-in user and include their video progress if available.
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: day
 *         schema:
 *           type: number
 *         required: false
 *         description: Filter videos by day
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
