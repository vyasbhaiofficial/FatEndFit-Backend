const express = require('express');
const route = express.Router();
const dashboardController = require('../../controllers/dashboard.controller.js');

/**
 * @swagger
 * /admin/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics with date range
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Optional start date (inclusive). Example: 2025-10-01
 *       - in: query
 *         name: endDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Optional end date (inclusive, up to 23:59:59.999). Example: 2025-10-08
 *     responses:
 *       200:
 *         description: Dashboard statistics with date range
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
 *                       example: 100
 *                     activePlanUsers:
 *                       type: integer
 *                       example: 80
 *                     holdPlanUsers:
 *                       type: integer
 *                       example: 20
 *                     chartData:
 *                       type: array
 *                       example: [{ name: 'Active Plans', value: 80 }, { name: 'Hold Plans', value: 20 }]
 *                     lastUpdated:
 *                       type: string
 *                       example: "2025-10-08T12:00:00.000Z"
 *       500:
 *         description: Server error
 */
route.get('/stats', dashboardController.getDashboardStats);

module.exports = route;
