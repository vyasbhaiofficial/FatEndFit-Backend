const express = require('express');
const route = express.Router();

const otherController = require('../../controllers/other.controller.js');

/**
 * @swagger
 * /user/other/generateUrl:
 *   post:
 *     summary: Generate a URL for an uploaded image
 *     tags:
 *       - Other
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Success
 */
route.post('/generateUrl', otherController.generateUrl);

module.exports = route;
