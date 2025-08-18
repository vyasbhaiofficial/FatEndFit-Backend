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
 * /admin/video/create:
 *   post:
 *     summary: Create a new video
 *     tags: [Video]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Morning Yoga Session"
 *               videoType:
 *                 type: integer
 *                 enum: [1, 2]
 *                 example: 1
 *                 description: 1 = File Upload, 2 = URL
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: Required if videoType = 1
 *               language:
 *                 type: string
 *                 example: "English"
 *               thumbnailType:
 *                 type: integer
 *                 enum: [1, 2]
 *                 example: 1
 *                 description: 1 = File Upload, 2 = URL
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *                 description: Required if thumbnailType = 1
 *               description:
 *                 type: string
 *                 example: "A 20-minute yoga routine for beginners."
 *               day:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Video created successfully
 *       500:
 *         description: Server error
 */
route.post('/create', videoController.createVideo);

/**
 * @swagger
 * /admin/video/all:
 *   get:
 *     summary: Get all videos
 *     tags: [Video]
 *     parameters:
 *       - in: query
 *         name: day
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filter by day
 *       - in: query
 *         name: start
 *         schema:
 *           type: integer
 *         required: false
 *         description: Pagination start index
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Pagination limit
 *     responses:
 *       200:
 *         description: List of videos
 *       500:
 *         description: Server error
 */
route.get('/all', videoController.getAllVideos);

/**
 * @swagger
 * /admin/video/byId/{videoId}:
 *   get:
 *     summary: Get video by ID
 *     tags: [Video]
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Video details
 *       404:
 *         description: Video not found
 *       500:
 *         description: Server error
 */
route.get('/byId/:videoId', videoController.getVideoById);

/**
 * @swagger
 * /admin/video/update/{id}:
 *   put:
 *     summary: Update a video
 *     tags: [Video]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               language:
 *                 type: string
 *               videoType:
 *                 type: integer
 *                 enum: [1, 2]
 *               video:
 *                 type: string
 *                 format: binary
 *               thumbnailType:
 *                 type: integer
 *                 enum: [1, 2]
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *               description:
 *                 type: string
 *               day:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Video updated successfully
 *       404:
 *         description: Video not found
 *       500:
 *         description: Server error
 */
route.put('/update/:videoId', videoController.updateVideo);

/**
 * @swagger
 * /admin/video/{videoId}:
 *   delete:
 *     summary: Delete (soft delete) a video
 *     tags: [Video]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Video deleted successfully
 *       404:
 *         description: Video not found
 *       500:
 *         description: Server error
 */
route.delete('/:videoId', videoController.deleteVideo);

module.exports = route;
