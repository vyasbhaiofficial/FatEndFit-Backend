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
 *     summary: Get all daily routine questions for a user
 *     description: Fetches first and second section daily routine questions for the given day. If the user has already answered, their answers will be included.
 *     tags: [Question]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: day
 *         schema:
 *           type: integer
 *         required: true
 *         description: Day number for which questions are fetched
 *     responses:
 *       200:
 *         description: Successfully retrieved daily routine questions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 code:
 *                   type: integer
 *                   example: 8002
 *                 data:
 *                   type: object
 *                   properties:
 *                     firstQuestions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           questionText:
 *                             type: string
 *                           answer:
 *                             type: integer
 *                             example: 0
 *                     lastQuestions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           questionText:
 *                             type: string
 *                           answer:
 *                             type: integer
 *                             example: 0
 *       401:
 *         description: Unauthorized, token missing or invalid
 *       500:
 *         description: Internal server error
 */
route.get('/get-daily', questionController.getAllQuestionsDailyRoutine);

module.exports = route;
