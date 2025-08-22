const express = require('express');
const route = express.Router();
const questionController = require('../../controllers/question.controller.js');

/**
 * @swagger
 * /user/question/get:
 *   get:
 *     summary: Get all questions by videoId
 *     tags: [Question]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the video
 *       - in: query
 *         name: start
 *         schema:
 *           type: integer
 *         example: 0
 *         required: false
 *         description: Pagination start index
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         example: 10
 *         required: false
 *         description: Pagination limit
 *     responses:
 *       200:
 *         description: List of questions
 *       500:
 *         description: Server error
 */
route.get('/get', questionController.getAllQuestionsByVideoId);

/**
 * @swagger
 * /user/question/get-daily:
 *   get:
 *     summary: Get all questions daily routine
 *     tags: [Question]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: start
 *         schema:
 *           type: integer
 *         example: 0
 *         required: false
 *         description: Pagination start index
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         example: 10
 *         required: false
 *         description: Pagination limit
 *     responses:
 *       200:
 *         description: List of questions
 *       500:
 *         description: Server error
 */
route.get('/get-daily', questionController.getAllQuestionsDailyRoutine);

module.exports = route;
