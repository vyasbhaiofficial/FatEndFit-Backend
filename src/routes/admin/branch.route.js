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

module.exports = route;
