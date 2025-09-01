const express = require('express');
const route = express.Router();
const questionController = require('../../controllers/testimonial.controller.js');

/**
 * @swagger
 * /user/testimonial/get-testimonial:
 *   get:
 *     summary: Get all testimonial (type 3) and category-wise (type 4) videos
 *     tags:
 *       - Testimonial
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched testimonials and category-wise videos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 titleVideo:
 *                   type: string
 *                   description: Title of the testimonial video
 *                   example: "Testimonial Video Title"
 *                 urlVideo:
 *                   type: string
 *                   description: URL of the testimonial video
 *                   example: "https://example.com/video.mp4"
 *                 thumUrl:
 *                   type: string
 *                   description: Thumbnail URL of the testimonial video
 *                   example: "https://example.com/thumbnail.jpg"
 *                 category:
 *                   type: array
 *                   description: Category-wise videos
 *                   items:
 *                     type: object
 *                     properties:
 *                       categoryId:
 *                         type: string
 *                         example: "64f1b3c5d6f3e12a34567890"
 *                       categoryTitle:
 *                         type: string
 *                         example: "Fitness"
 *                       list:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             title:
 *                               type: string
 *                               example: "Morning Yoga"
 *                             dec:
 *                               type: string
 *                               example: "A short yoga tutorial"
 *                             thubnail:
 *                               type: string
 *                               example: "https://example.com/yoga-thumbnail.jpg"
 *                             videoid:
 *                               type: string
 *                               example: "64f1b3c5d6f3e12a34567891"
 *                             videoUrl:
 *                               type: string
 *                               example: "https://example.com/yoga.mp4"
 *       401:
 *         description: Unauthorized, JWT token missing or invalid
 *       500:
 *         description: Server Error
 */

route.get('/get-testimonial', questionController.getAllTestimonials);

module.exports = route;