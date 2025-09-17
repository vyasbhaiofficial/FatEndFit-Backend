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
 *               title_english:
 *                 type: string
 *                 example: "Morning Yoga Session"
 *                 description: Video title in English
 *               title_gujarati:
 *                 type: string
 *                 example: "સવારની યોગ સત્ર"
 *                 description: Video title in Gujarati
 *               title_hindi:
 *                 type: string
 *                 example: "सुबह की योग सत्र"
 *                 description: Video title in Hindi
 *               videoType:
 *                 type: integer
 *                 enum: [1, 2]
 *                 example: 1
 *                 description: 1 = File Upload, 2 = URL
 *               video_english:
 *                 type: string
 *                 format: binary
 *                 description: English video file (required if videoType = 1)
 *               video_gujarati:
 *                 type: string
 *                 format: binary
 *                 description: Gujarati video file (required if videoType = 1)
 *               video_hindi:
 *                 type: string
 *                 format: binary
 *                 description: Hindi video file (required if videoType = 1)
 *               video_english_url:
 *                 type: string
 *                 description: English video URL (required if videoType = 2)
 *               video_gujarati_url:
 *                 type: string
 *                 description: Gujarati video URL (required if videoType = 2)
 *               video_hindi_url:
 *                 type: string
 *                 description: Hindi video URL (required if videoType = 2)
 *               videoSecond:
 *                 type: number
 *                 example: 120
 *                 description: Required if videoType = 2 (video duration in seconds)
 *               thumbnailType:
 *                 type: integer
 *                 enum: [1, 2]
 *                 example: 1
 *                 description: 1 = File Upload, 2 = URL
 *               thumbnail_english:
 *                 type: string
 *                 format: binary
 *                 description: English thumbnail file (required if thumbnailType = 1)
 *               thumbnail_gujarati:
 *                 type: string
 *                 format: binary
 *                 description: Gujarati thumbnail file (required if thumbnailType = 1)
 *               thumbnail_hindi:
 *                 type: string
 *                 format: binary
 *                 description: Hindi thumbnail file (required if thumbnailType = 1)
 *               thumbnail_english_url:
 *                 type: string
 *                 description: English thumbnail URL (required if thumbnailType = 2)
 *               thumbnail_gujarati_url:
 *                 type: string
 *                 description: Gujarati thumbnail URL (required if thumbnailType = 2)
 *               thumbnail_hindi_url:
 *                 type: string
 *                 description: Hindi thumbnail URL (required if thumbnailType = 2)
 *               description_english:
 *                 type: string
 *                 example: "A 20-minute yoga routine for beginners."
 *                 description: Video description in English
 *               description_gujarati:
 *                 type: string
 *                 example: "શરૂઆત કરનારાઓ માટે 20 મિનિટની યોગ રૂટિન."
 *                 description: Video description in Gujarati
 *               description_hindi:
 *                 type: string
 *                 example: "शुरुआती लोगों के लिए 20 मिनट का योग रूटीन।"
 *                 description: Video description in Hindi
 *               type:
 *                 type: integer
 *                 enum: [1, 2, 3, 4 ,5]
 *                 example: 1
 *                 description: |
 *                   1 = Day wise video (day required)
 *                   2 = Webinar/Live video
 *                   3 = Testimonial video
 *                   4 = Testimonial video (category required)
 *                   5 = Setting video
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
        { name: 'video_english', maxCount: 1 },
        { name: 'video_gujarati', maxCount: 1 },
        { name: 'video_hindi', maxCount: 1 },
        { name: 'thumbnail_english', maxCount: 1 },
        { name: 'thumbnail_gujarati', maxCount: 1 },
        { name: 'thumbnail_hindi', maxCount: 1 }
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
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *           enum: [english, gujarati, hindi]
 *           default: english
 *         required: false
 *         description: Language for video content (english, gujarati, hindi)
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
        { name: 'video_english', maxCount: 1 },
        { name: 'video_gujarati', maxCount: 1 },
        { name: 'video_hindi', maxCount: 1 },
        { name: 'thumbnail_english', maxCount: 1 },
        { name: 'thumbnail_gujarati', maxCount: 1 },
        { name: 'thumbnail_hindi', maxCount: 1 }
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
