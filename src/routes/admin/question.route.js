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
 *               questionText_english:
 *                 type: string
 *                 example: "Is yoga good for stress relief?"
 *                 description: Question text in English
 *               questionText_gujarati:
 *                 type: string
 *                 example: "શું યોગ તણાવ મુક્તિ માટે સારું છે?"
 *                 description: Question text in Gujarati
 *               questionText_hindi:
 *                 type: string
 *                 example: "क्या योग तनाव मुक्ति के लिए अच्छा है?"
 *                 description: Question text in Hindi
 *               correctAnswer_english:
 *                 type: string
 *                 example: "Yes"
 *                 description: Correct answer in English
 *               correctAnswer_gujarati:
 *                 type: string
 *                 example: "હા"
 *                 description: Correct answer in Gujarati
 *               correctAnswer_hindi:
 *                 type: string
 *                 example: "हाँ"
 *                 description: Correct answer in Hindi
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
 *               questionText_english:
 *                 type: string
 *                 example: "Do you practice yoga daily?"
 *                 description: Question text in English
 *               questionText_gujarati:
 *                 type: string
 *                 example: "શું તમે દરરોજ યોગ કરો છો?"
 *                 description: Question text in Gujarati
 *               questionText_hindi:
 *                 type: string
 *                 example: "क्या आप रोजाना योग करते हैं?"
 *                 description: Question text in Hindi
 *               correctAnswer_english:
 *                 type: string
 *                 example: "Yes"
 *                 description: Correct answer in English
 *               correctAnswer_gujarati:
 *                 type: string
 *                 example: "હા"
 *                 description: Correct answer in Gujarati
 *               correctAnswer_hindi:
 *                 type: string
 *                 example: "हाँ"
 *                 description: Correct answer in Hindi
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
 * security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the video
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *           enum: [english, gujarati, hindi]
 *           default: english
 *         required: false
 *         description: Language for question content (english, gujarati, hindi)
 *     responses:
 *       200:
 *         description: List of questions
 *       500:
 *         description: Server error
 */
route.get('/get-by-video', questionController.getAllQuestionsByVideoId);

/**
 * @swagger
 * /admin/question/get-all:
 *   get:
 *     summary: Get all questions (Admin only)
 *     description: Get all questions with optional filtering. By default returns all questions. When type=1 and videoId is provided, returns only questions for that specific video.
 *     tags: [Question]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *           enum: [english, gujarati, hindi]
 *           default: english
 *         required: false
 *         description: Language for question content (english, gujarati, hindi)
 *       - in: query
 *         name: type
 *         schema:
 *           type: integer
 *           enum: [1, 2]
 *         required: false
 *         description: Question type (1 = video question, 2 = daily question)
 *       - in: query
 *         name: videoId
 *         schema:
 *           type: string
 *           example: "64d21c7a8b1c5f9a12345678"
 *         required: false
 *         description: Video ID to filter questions (only works when type=1)
 *       - in: query
 *         name: section
 *         schema:
 *           type: string
 *           enum: [first, second]
 *         required: false
 *         description: Section for daily questions (first, second)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         required: false
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         required: false
 *         description: Number of questions per page
 *     responses:
 *       200:
 *         description: List of questions with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Questions retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     questions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "64d21c7a8b1c5f9a12345678"
 *                           questionText:
 *                             type: string
 *                             example: "Is yoga good for stress relief?"
 *                           correctAnswer:
 *                             type: string
 *                             example: "Yes"
 *                           type:
 *                             type: integer
 *                             example: 1
 *                           videoId:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                               title:
 *                                 type: string
 *                               day:
 *                                 type: integer
 *                               type:
 *                                 type: integer
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                         totalItems:
 *                           type: integer
 *                         itemsPerPage:
 *                           type: integer
 *       500:
 *         description: Server error
 */
route.get('/get-all', questionController.getAllQuestions);

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
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *           enum: [english, gujarati, hindi]
 *           default: english
 *         required: false
 *         description: Language for question content (english, gujarati, hindi)
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
 *               questionText_english:
 *                 type: string
 *                 example: "What is Node.js?"
 *                 description: Question text in English
 *               questionText_gujarati:
 *                 type: string
 *                 example: "Node.js શું છે?"
 *                 description: Question text in Gujarati
 *               questionText_hindi:
 *                 type: string
 *                 example: "Node.js क्या है?"
 *                 description: Question text in Hindi
 *               correctAnswer_english:
 *                 type: string
 *                 example: "JavaScript runtime"
 *                 description: Correct answer in English
 *               correctAnswer_gujarati:
 *                 type: string
 *                 example: "JavaScript રનટાઇમ"
 *                 description: Correct answer in Gujarati
 *               correctAnswer_hindi:
 *                 type: string
 *                 example: "JavaScript रनटाइम"
 *                 description: Correct answer in Hindi
 *               videoId:
 *                 type: string
 *                 example: "64f1234567890abcdef12345"
 *                 description: Video ID (only for type 1 questions)
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
