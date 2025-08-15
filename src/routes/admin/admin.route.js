const express = require('express');
const route = express.Router();
const adminController = require('../../controllers/admin.controller.js');
const upload = require('../../../middleware/multer.js');

/**
 * @swagger
 * /admin/update:
 *   put:
 *     summary: Update admin profile details
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "Super Admin"
 *                 description: New username for the admin
 *               password:
 *                 type: string
 *                 example: "Admin@123"
 *                 description: New password for the admin (will be hashed)
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: New profile image for the admin
 *     responses:
 *       200:
 *         description: Admin updated successfully
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
 *                   example: 1007
 *                 data:
 *                   type: object
 *                   properties:
 *                     admin:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 64dc9f07a12b3f001e5c9d1a
 *                         username:
 *                           type: string
 *                           example: "Super Admin"
 *                         image:
 *                           type: string
 *                           example: "uploads/admin123.jpg"
 *       500:
 *         description: Server error
 */

route.put('/update', upload.single('image'), adminController.updateAdmin);

module.exports = route;
