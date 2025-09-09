const express = require('express');
const route = express.Router();
const adminController = require('../../controllers/admin.controller.js');
const subAdminController = require('../../controllers/subAdmin.controller.js');
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

// Sub Admin management
/**
 * @swagger
 * /admin/sub-admin:
 *   post:
 *     summary: Create a Sub Admin
 *     tags:
 *       - SubAdmin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "John"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@company.com"
 *               password:
 *                 type: string
 *                 example: "Admin@123"
 *               branch:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["689edec7c67887dc81f51934"]
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Profile image of sub-admin
 *     responses:
 *       201:
 *         description: Sub Admin created
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden
 */
route.post('/sub-admin', upload.single('image'), subAdminController.createSubAdmin);
/**
 * @swagger
 * /admin/sub-admin:
 *   get:
 *     summary: List all Sub Admins
 *     tags:
 *       - SubAdmin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of Sub Admins
 */
route.get('/sub-admin', subAdminController.listSubAdmins);

/**
 * @swagger
 * /admin/sub-admin/{id}:
 *   put:
 *     summary: Admin updates a Sub Admin
 *     tags:
 *       - SubAdmin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Sub Admin id
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               branch:
 *                 type: array
 *                 items:
 *                   type: string
 *               isDeleted:
 *                 type: boolean
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Updated successfully
 *       404:
 *         description: Sub Admin not found
 */
route.put('/sub-admin/:id', upload.single('image'), subAdminController.updateSubAdminByAdmin);
module.exports = route;
