const express = require('express');
const route = express.Router();

const userAnswerController = require('../../controllers/userAnswer.controller.js');

/**
 * @swagger
 * /user/useranswer/submit:
 *   post:
 *     summary: Submit answers for a video
 *     description: User submits answers for a video quiz. The system checks correctness (Yes/No) and stores the report.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - videoId
 *               - answers
 *             properties:
 *               videoId:
 *                 type: string
 *                 example: "64df6c7f1a2bcd9f12345678"
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - questionId
 *                     - answer
 *                   properties:
 *                     questionId:
 *                       type: string
 *                       example: "64df6d0f1a2bcd9f87654321"
 *                     answer:
 *                       type: boolean
 *                       description: User's answer (true for Yes, false for No)
 *                       example: true
 *     responses:
 *       200:
 *         description: Answers submitted successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: 9001
 *               data:
 *                 _id: "64df701e1a2bcd9f98765432"
 *                 video: "64df6c7f1a2bcd9f12345678"
 *                 user: "64df6c9a1a2bcd9f23456789"
 *                 answers:
 *                   - questionId: "64df6d0f1a2bcd9f87654321"
 *                     answer: true
 *                     isCorrect: true
 *                 score: 1
 *       404:
 *         description: Video not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: 7003
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: 9999
 *               error: "Something went wrong"
 */

route.post('/submit', userAnswerController.submitAnswers);

/**
 * @swagger
 * /user/useranswer/submit-daily-report:
 *   post:
 *     summary: Submit answers for a daily progress
 *     description: User submits answers for a dailyprogress or update currentDay progress.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - answers
 *             properties:
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - questionId
 *                     - answer
 *                   properties:
 *                     questionId:
 *                       type: string
 *                       example: "64df6d0f1a2bcd9f87654321"
 *                     answer:
 *                       type: boolean
 *                       description: User's answer (true for Yes, false for No)
 *                       example: true
 *     responses:
 *       200:
 *         description: Answers submitted successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: 9001
 *               data:
 *                 _id: "64df701e1a2bcd9f98765432"
 *                 user: "64df6c9a1a2bcd9f23456789"
 *                 answers:
 *                   - questionId: "64df6d0f1a2bcd9f87654321"
 *                     answer: true
 *                     isCorrect: false
 *                 score: 0
 *       404:
 *         description: Video not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: 7003
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: 9999
 *               error: "Something went wrong"
 */
route.post('/submit-daily-report', userAnswerController.submitDailyReport);

module.exports = route;
