const express = require('express');
const route = express.Router();
const userController = require('../../controllers/user.controller.js');

/**
 * @swagger
 * /admin/user/add:
 *   post:
 *     summary: Add a new user
 *     tags:
 *       - User
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
 *               - mobileNumber
 *               - branchId
 *               - planId
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *                 description: Full name of the user
 *               mobilePrefix:
 *                 type: string
 *                 example: "+91"
 *                 description: Mobile prefix (country code)
 *               mobileNumber:
 *                 type: string
 *                 example: "9876543210"
 *                 description: Mobile number of the user (must be unique)
 *               branchId:
 *                 type: string
 *                 example: "689edec7c67887dc81f51934"
 *                 description: ID of the branch where the user is registered
 *               planId:
 *                 type: string
 *                 example: "689f0dde31d1fabdda2d4ac1"
 *                 description: ID of the plan assigned to the user
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 201
 *                 code:
 *                   type: integer
 *                   example: 1001
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "64dc9f07a12b3f001e5c9d1c"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     mobileNumber:
 *                       type: string
 *                       example: "9876543210"
 *                     branch:
 *                       type: string
 *                       example: "64dc9f07a12b3f001e5c9d1a"
 *                     plan:
 *                       type: string
 *                       example: "64dc9f07a12b3f001e5c9d1b"
 *                     patientId:
 *                       type: string
 *                       example: "PAT-20250814-001"
 *       400:
 *         description: Mobile number already exists
 *       404:
 *         description: Branch or plan not found
 *       500:
 *         description: Server error
 */

route.post('/add', userController.addUser);

// update user
/**
 * @swagger
 * /admin/user/update/{userId}:
 *   put:
 *     summary: Update an existing user
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           example: "64dc9f07a12b3f001e5c9d1c"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *                 description: Full name of the user
 *               mobilePrefix:
 *                 type: string
 *                 example: "+91"
 *                 description: Mobile prefix (country code)
 *               mobileNumber:
 *                 type: string
 *                 example: "9876543210"
 *               branchId:
 *                 type: string
 *                 example: "64dc9f07a12b3f001e5c9d1a"
 *               planId:
 *                 type: string
 *                 example: "64dc9f07a12b3f001e5c9d1b"
 *     responses:
 *       200:
 *         description: User updated successfully
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
 *                     _id:
 *                       type: string
 *                       example: "64dc9f07a12b3f001e5c9d1c"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     mobileNumber:
 *                       type: string
 *                       example: "9876543210"
 *                     branch:
 *                       type: string
 *                       example: "64dc9f07a12b3f001e5c9d1a"
 *                     plan:
 *                       type: string
 *                       example: "64dc9f07a12b3f001e5c9d1b"
 *                     patientId:
 *                       type: string
 *                       example: "PAT-20250814-001"
 *       400:
 *         description: Mobile number already exists
 *       404:
 *         description: Branch or plan not found
 *       500:
 *         description: Server error
 */

route.put('/update/:userId', userController.updateUserByAdmin);

module.exports = route;
