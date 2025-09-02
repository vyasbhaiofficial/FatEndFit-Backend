const express = require('express');
const route = express.Router();
const referenceController = require('../../controllers/reference.controller.js');

/**
 * @swagger
 * tags:
 *   name: Reference
 *   description: User reference management
 */

/**
 * @swagger
 * /user/reference/create:
 *   post:
 *     summary: Create a new reference
 *     tags: [Reference]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Rahul Sharma
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
 *               relation:
 *                 type: string
 *                 example: Friend
 *     responses:
 *       201:
 *         description: Reference created successfully
 *       400:
 *         description: Reference already exists
 *       500:
 *         description: Server error
 */
route.post('/create', referenceController.createReference);

/**
 * @swagger
 * /user/reference/list:
 *   get:
 *     summary: Get logged-in user's references
 *     tags: [Reference]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of references
 *       500:
 *         description: Server error
 */
route.get('/list', referenceController.getUserReferences);
module.exports = route;

