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
 * /admin/plan/create:
 *   post:
 *     summary: Create a new plan
 *     tags: [Plan]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - days
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Basic Plan"
 *               description:
 *                 type: string
 *                 example: "Access to basic features for 30 days."
 *               days:
 *                 type: integer
 *                 example: 30
 *     responses:
 *       201:
 *         description: Plan created successfully
 *       500:
 *         description: Server error
 */
route.post('/create', planController.createPlan);

/**
 * @swagger
 * /admin/plan/all:
 *   get:
 *     summary: Get all active plans
 *     tags: [Plan]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all plans
 *       500:
 *         description: Server error
 */
route.get('/all', planController.getAllPlans);

/**
 * @swagger
 * /admin/plan/update/{planId}:
 *   put:
 *     summary: Update an existing plan
 *     tags: [Plan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: planId
 *         required: true
 *         schema:
 *           type: string
 *           example: 64dc9f07a12b3f001e5c9d1a
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Premium Plan"
 *               description:
 *                 type: string
 *                 example: "Access to all features for 90 days."
 *               days:
 *                 type: integer
 *                 example: 90
 *     responses:
 *       200:
 *         description: Plan updated successfully
 *       404:
 *         description: Plan not found
 *       500:
 *         description: Server error
 */
route.put('/update/:planId', planController.updatePlan);

/**
 * @swagger
 * /admin/plan/delete/{planId}:
 *   delete:
 *     summary: Soft delete a plan
 *     tags: [Plan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: planId
 *         required: true
 *         schema:
 *           type: string
 *           example: 64dc9f07a12b3f001e5c9d1a
 *     responses:
 *       200:
 *         description: Plan deleted successfully
 *       404:
 *         description: Plan not found
 *       500:
 *         description: Server error
 */

route.delete('/delete/:planId', planController.deletePlan);

module.exports = route;
