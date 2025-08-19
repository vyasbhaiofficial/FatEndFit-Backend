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
 * /admin/question/create:
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

route.post('/create', questionController.createQuestion);

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

/**
 * @swagger
 * /admin/question/update/{questionId}:
 *   put:
 *     summary: Update a question
 *     tags: [Question]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               questionText:
 *                 type: string
 *                 example: "Is yoga good for improving sleep?"
 *               correctAnswer:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Question updated successfully
 *       404:
 *         description: Question not found
 *       500:
 *         description: Server error
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
