const express = require('express');
const route = express.Router();

const planController = require('../../controllers/plan.controller.js');

/**
 * @swagger
 * tags:
 *   name: Plan
 *   description: Subscription plan management
 */

/**
 * @swagger
 * /user/plan/hold-resume:
 *   post:
 *     summary: Hold or resume a user's plan
 *     description: Allows the logged-in user to hold or resume their current plan.
 *     tags: [Plan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: planId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the plan to hold or resume
 *       - in: query
 *         name: type
 *         schema:
 *           type: integer
 *           enum: [1, 2]
 *           example: 1
 *         required: true
 *         description: Action type (1 = Hold, 2 = Resume)
 *     responses:
 *       200:
 *         description: Plan status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserPlan'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Plan not found or user not subscribed to it
 *       500:
 *         description: Internal server error
 */
route.post('/hold-resume', planController.planHoldOrResume);

module.exports = route;
