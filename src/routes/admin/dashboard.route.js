const express = require('express');
const route = express.Router();
const dashboardController = require('../../controllers/dashboard.controller.js');

/**
 * @swagger
 * /admin/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics for admin
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 code:
 *                   type: integer
 *                   example: 1001
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalUsers:
 *                       type: integer
 *                       example: 150
 *                       description: Total number of users
 *                     activePlanUsers:
 *                       type: integer
 *                       example: 120
 *                       description: Users with active plans
 *                     holdPlanUsers:
 *                       type: integer
 *                       example: 15
 *                       description: Users with plans on hold
 *                     chartData:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "Active Plans"
 *                           value:
 *                             type: integer
 *                             example: 120
 *                           color:
 *                             type: string
 *                             example: "#10B981"
 *                     lastUpdated:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-01-15T12:00:00.000Z"
 *       403:
 *         description: Forbidden - Admin not found
 *       500:
 *         description: Server error
 */
route.get('/stats', dashboardController.getDashboardStats);

module.exports = route;
