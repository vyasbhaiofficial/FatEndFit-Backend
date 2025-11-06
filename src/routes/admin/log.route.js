const express = require('express');
const route = express.Router();
const logController = require('../../controllers/log.controller.js');

/**
 * @swagger
 * /admin/logs:
 *   get:
 *     summary: Get subadmin login logs and panel open/close events (Admin & Sub Admin)
 *     tags: [Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *           enum: [login, panel_open, panel_close]
 *         description: Filter by action type (default: all)
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter by specific user ID
 *       - in: query
 *         name: branchId
 *         schema:
 *           type: string
 *         description: Filter by branch ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of logs per page
 *     responses:
 *       200:
 *         description: Logs retrieved successfully
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
 *                     logs:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           user:
 *                             type: object
 *                           branch:
 *                             type: object
 *                           userType:
 *                             type: string
 *                             enum: [Admin, Sub Admin]
 *                           action:
 *                             type: string
 *                             enum: [login, panel_open, panel_close]
 *                           ipAddress:
 *                             type: string
 *                           timestamp:
 *                             type: string
 *                             format: date-time
 *                     loginStatistics:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           userId:
 *                             type: string
 *                           username:
 *                             type: string
 *                           email:
 *                             type: string
 *                           loginCount:
 *                             type: integer
 *                           lastLogin:
 *                             type: string
 *                           firstLogin:
 *                             type: string
 *                           branches:
 *                             type: array
 *                     pagination:
 *                       type: object
 *       500:
 *         description: Server error
 */
route.get('/', logController.getLogs);

/**
 * @swagger
 * /admin/logs/panel/open:
 *   post:
 *     summary: Track panel open event
 *     tags: [Logs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Panel open event logged successfully
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
 *                     message:
 *                       type: string
 *                       example: "Panel open logged successfully"
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Server error
 */
route.post('/panel/open', logController.trackPanelOpen);

/**
 * @swagger
 * /admin/logs/panel/close:
 *   post:
 *     summary: Track panel close event
 *     tags: [Logs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Panel close event logged successfully
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
 *                     message:
 *                       type: string
 *                       example: "Panel close logged successfully"
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Server error
 */
route.post('/panel/close', logController.trackPanelClose);

module.exports = route;
