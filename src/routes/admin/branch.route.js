const express = require('express');
const route = express.Router();
const branchController = require('../../controllers/branch.controller.js');

/**
 * @swagger
 * tags:
 *   name: Branch
 *   description: Branch management APIs
 */

/**
 * @swagger
 * /admin/branch/create:
 *   post:
 *     summary: Create a new branch
 *     tags: [Branch]
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
 *               - address
 *               - city
 *               - state
 *               - pincode
 *               - latitude
 *               - longitude
 *               - mobileNumber
 *             properties:
 *               name:
 *                 type: string
 *                 example: Main Branch
 *               address:
 *                 type: string
 *                 example: 123 Main Street
 *               city:
 *                 type: string
 *                 example: Mumbai
 *               state:
 *                 type: string
 *                 example: Maharashtra
 *               pincode:
 *                 type: string
 *                 example: 400001
 *               mobilePrefix:
 *                 type: string
 *                 example: "+91"
 *               mobileNumber:
 *                 type: string
 *                 example: "9876543210"
 *               latitude:
 *                 type: string
 *                 example: "19.0760"
 *               longitude:
 *                 type: string
 *                 example: "72.8777"
 *               email:
 *                 type: string
 *                 example: "n9yYQ@example.com"
 *     responses:
 *       201:
 *         description: Branch created successfully
 *       500:
 *         description: Server error
 */

route.post('/create', branchController.createBranch);

/**
 * @swagger
 * /admin/branch/all:
 *   get:
 *     summary: Get all branches
 *     tags: [Branch]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved branches
 *       500:
 *         description: Server error
 */

route.get('/all', branchController.getAllBranches);

/**
 * @swagger
 * /admin/branch/update/{branchId}:
 *   put:
 *     summary: Update an existing branch
 *     tags: [Branch]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: branchId
 *         required: true
 *         schema:
 *           type: string
 *           example: 64dc9f07a12b3f001e5c9d1a
 *         description: The ID of the branch to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Branch
 *               address:
 *                 type: string
 *                 example: 456 Updated Street
 *               city:
 *                 type: string
 *                 example: Pune
 *               state:
 *                 type: string
 *                 example: Maharashtra
 *               pincode:
 *                 type: string
 *                 example: 411001
 *               mobilePrefix:
 *                 type: string
 *                 example: "+91"
 *               mobileNumber:
 *                 type: string
 *                 example: "9123456789"
 *               latitude:
 *                 type: string
 *                 example: "18.5204"
 *               longitude:
 *                 type: string
 *                 example: "73.8567"
 *               email:
 *                 type: string
 *                 example: "n9yYQ@example.com"
 *     responses:
 *       200:
 *         description: Branch updated successfully
 *       404:
 *         description: Branch not found
 *       500:
 *         description: Server error
 */

route.put('/update/:branchId', branchController.updateBranch);

/**
 * @swagger
 * /admin/branch/{branchId}:
 *   delete:
 *     summary: Delete (soft delete) a branch
 *     tags: [Branch]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: branchId
 *         required: true
 *         schema:
 *           type: string
 *           example: 64dc9f07a12b3f001e5c9d1a
 *         description: The ID of the branch to delete
 *     responses:
 *       200:
 *         description: Branch deleted successfully
 *       404:
 *         description: Branch not found
 *       500:
 *         description: Server error
 */

route.delete('/:branchId', branchController.deleteBranch);

/**
 * @swagger
 * /admin/branch/{branchId}:
 *   get:
 *     summary: Get all users of a branch
 *     description: Fetch all users linked to a specific branch (excluding deleted ones).
 *     tags:
 *       - Branch
 *     security:
 *       - bearerAuth: []   # <--- security added
 *     parameters:
 *       - in: path
 *         name: branchId
 *         required: true
 *         schema:
 *           type: string
 *         description: Branch ID
 *     responses:
 *       200:
 *         description: Successfully fetched users of the branch
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 code:
 *                   type: integer
 *                   example: 4008
 *                 message:
 *                   type: string
 *                   example: Users fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "66d123abc456..."
 *                       name:
 *                         type: string
 *                         example: "Rahul Sharma"
 *                       email:
 *                         type: string
 *                         example: "rahul@test.com"
 *                       mobilePrefix:
 *                         type: string
 *                         example: "+91"
 *                       mobileNumber:
 *                         type: string
 *                         example: "9876543210"
 *                       branchId:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "66cabc123..."
 *                           name:
 *                             type: string
 *                             example: "Delhi Branch"
 *                           city:
 *                             type: string
 *                             example: "Delhi"
 *                       planId:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "66dplan456..."
 *                           name:
 *                             type: string
 *                             example: "Gold Plan"
 *                           price:
 *                             type: number
 *                             example: 499
 *       404:
 *         description: Branch not found
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
 *                   example: Branch not found
 *       500:
 *         description: Internal server error
 */
route.get('/:branchId', branchController.getBranchwiseUser);
module.exports = route;
