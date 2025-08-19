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
 *     summary: Get all plans
 *     tags: [Plan]
 *     parameters:
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
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved plans
 *       500:
 *         description: Server error
 * */
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
 * /admin/plan/{planId}:
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

route.delete('/:planId', planController.deletePlan);

/**
 * @swagger
 * /admin/plan/plan-assign:
 *   post:
 *     summary: Assign a plan to a user
 *     description: Assigns a subscription plan to a user. If the user already has a longer plan, a shorter plan cannot be assigned.
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
 *               - userId
 *               - planId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "689f1b4ad152f478fe1e88ac"
 *               planId:
 *                 type: string
 *                 example: "689f0dde31d1fabdda2d4ac1"
 *     responses:
 *       200:
 *         description: Plan assigned successfully
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
 *                   example: "PLAN_ASSIGNED"
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "30-day plan assigned successfully"
 *       400:
 *         description: Invalid request or assignment error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "PLAN_ASSIGN_ERROR"
 *                 error:
 *                   type: string
 *                   example: "User already has 50-day plan. Cannot assign shorter 30-day plan."
 *       401:
 *         description: Unauthorized (No token provided or invalid token)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "User not Found"
 *                 error:
 *                   type: string
 *                   example: "No token provided"
 *       404:
 *         description: User or Plan not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "USER_NOT_FOUND"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "SERVER_ERROR"
 *                 error:
 *                   type: string
 *                   example: "Something went wrong"
 */

route.post('/plan-assign', planController.planAssignToUser);

module.exports = route;
