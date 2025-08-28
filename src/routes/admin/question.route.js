const express = require('express');
const route = express.Router();
const questionController = require('../../controllers/question.controller.js');

/**
 * @swagger
 * tags:
 *   name: Question
 *   description: Video Question management
 */

/**
 * @swagger
 * /admin/question/create-by-video:
 *   post:
 *     summary: Create a new question for a video
 *     tags: [Question]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               videoId:
 *                 type: string
 *                 example: "64d21c7a8b1c5f9a12345678"
 *               questionText:
 *                 type: string
 *                 example: "Is yoga good for stress relief?"
 *               correctAnswer:
 *                 type: string
 *                 example: Yes
 *     responses:
 *       201:
 *         description: Question created successfully
 *       500:
 *         description: Server error
 */
route.post('/create-by-video', questionController.createQuestionByVideoId);

/**
 * @swagger
 * /admin/question/create-daily:
 *   post:
 *     summary: Create a new question daily routine
 *     tags: [Question]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               questionText:
 *                 type: string
 *                 example: "Do you practice yoga daily?"
 *               section:
 *                 type: string
 *                 example: first
 *     responses:
 *       201:
 *         description: Question created successfully
 *       500:
 *         description: Server error
 * */
route.post('/create-daily', questionController.createQuestionDaily);

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
 *         description: List of questions
 *       500:
 *         description: Server error
 */
route.get('/get-by-video', questionController.getAllQuestionsByVideoId);

/**
 * @swagger
 * /admin/question/get-daily:
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

/**
 * @swagger
 * /admin/question/update/{questionId}:
 *   put:
 *     summary: Update a question
 *     description: Update a question by ID. If the question type is 1, you can also update `correctAnswer` and `videoId`.
 *     tags: [Question]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the question to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               questionText:
 *                 type: string
 *                 example: "What is Node.js?"
 *               correctAnswer:
 *                 type: boolean
 *                 example: true
 *               videoId:
 *                 type: string
 *                 example: "64f1234567890abcdef12345"
 *     responses:
 *       200:
 *         description: Question updated successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Question not found
 *       500:
 *         description: Internal server error
 */
route.put('/update/:questionId', questionController.updateQuestion);

/**
 * @swagger
 * /admin/question/{questionId}:
 *   delete:
 *     summary: Delete a question
 *     tags: [Question]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Question deleted successfully
 *       404:
 *         description: Question not found
 *       500:
 *         description: Server error
 */
route.delete('/:questionId', questionController.deleteQuestion);

module.exports = route;
