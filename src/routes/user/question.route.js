const express = require('express');
const route = express.Router();
const questionController = require('../../controllers/question.controller.js');

/**
 * @swagger
 * /admin/question/get:
 *   get:
 *     summary: Get all questions by videoId
 *     tags: [Question]
 *     parameters:
 *       - in: query
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the video
 *     responses:
 *       200:
 *         description: List of questions
 *       500:
 *         description: Server error
 */
route.get('/get', questionController.getAllQuestionsByVideoId);

module.exports = route;
