const express = require('express');
const route = express.Router();
const videoController = require('../../controllers/video.controller.js');
const upload = require('../../../middleware/multer.js');

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
 *               videoSecond:
 *                 type: number
 *                 example: 120
 *                 description: Required if videoType = 2 (video duration in seconds)
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
 *               type:
 *                 type: integer
 *                 enum: [1, 2, 3, 4]
 *                 example: 1
 *                 description: |
 *                   1 = Day wise video (day required)
 *                   2 = Webinar/Live video
 *                   3 = Testimonial video
 *                   4 = Testimonial video (category required)
 *               day:
 *                 type: integer
 *                 example: 1
 *                 description: Required if type = 1
 *               category:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["64f2a1b9c83d1a7b2f4d9a1e", "64f2a1b9c83d1a7b2f4d9a1f"]
 *                 description: Required if type = 4 (Array of Category IDs)
 *     responses:
 *       201:
 *         description: Video created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */

route.post(
    '/create',
    upload.fields([
        { name: 'video', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 }
    ]),
    videoController.createVideo
);

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
 * /admin/video/update/{videoId}:
 *   put:
 *     summary: Update a video
 *     tags: [Video]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the video to update
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               videoType:
 *                 type: integer
 *                 enum: [1, 2]
 *                 description: "1 = Upload video file, 2 = Video URL"
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: "Upload video file if videoType = 1, else provide URL in body"
 *               videoSecond:
 *                 type: number
 *                 description: "Required if videoType = 2 (URL video duration)"
 *               thumbnailType:
 *                 type: integer
 *                 enum: [1, 2]
 *                 description: "1 = Upload thumbnail file, 2 = Thumbnail URL"
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *                 description: "Upload thumbnail file if thumbnailType = 1, else provide URL in body"
 *               description:
 *                 type: string
 *               day:
 *                 type: integer
 *               type:
 *                 type: integer
 *                 enum: [1, 2, 3, 4]
 *                 description: |
 *                   1 = Day wise video (day required)
 *                   2 = Webinar/Live video
 *                   3 = Category wise video (category required)
 *                   4 = Testimonial video (category required)
 *               category:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: "Array of category IDs (required if type = 3 or 4)"
 *     responses:
 *       200:
 *         description: Video updated successfully
 *       404:
 *         description: Video not found
 *       500:
 *         description: Server error
 */

route.put(
    '/update/:videoId',
    upload.fields([
        { name: 'video', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 }
    ]),
    videoController.updateVideo
);

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
