const express = require('express');
const route = express.Router();
const adminController = require('../../controllers/admin.controller.js');
const subAdminController = require('../../controllers/subAdmin.controller.js');
const dashboardRoutes = require('./dashboard.route.js');
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

/**
 * @swagger
 * /admin/get-profile:
 *   get:
 *     summary: Get admin profile
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin profile details
 *       500:
 *         description: Server error
 */
route.get('/get-profile', adminController.getAdminAndSubadminProfile);

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

/**
 * @swagger
 * /admin/user-overview/{userId}:
 *   get:
 *     summary: Get consolidated user info, progress, daily reports, and plan history
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: User overview data
 */
route.get('/user-overview/:userId', adminController.getUserOverview);

/**
 * @swagger
 * /admin/user/{userId}/plan/hold:
 *   post:
 *     summary: Hold a user's plan (Admin/Subadmin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           example: "64dc9f07a12b3f001e5c9d1a"
 *         description: User ID whose plan needs to be held
 *     responses:
 *       200:
 *         description: Plan held successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Plan held successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         plan:
 *                           type: object
 *                         planHoldDate:
 *                           type: string
 *                         planCurrentDay:
 *                           type: number
 *       400:
 *         description: Plan already on hold or user has no active plan
 *       403:
 *         description: Not authorized to hold plan for this user
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
route.post('/user/:userId/plan/hold', adminController.adminHoldUserPlan);

/**
 * @swagger
 * /admin/user/{userId}/plan/resume:
 *   post:
 *     summary: Resume a user's plan (Admin/Subadmin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           example: "64dc9f07a12b3f001e5c9d1a"
 *         description: User ID whose plan needs to be resumed
 *     responses:
 *       200:
 *         description: Plan resumed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Plan resumed successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         plan:
 *                           type: object
 *                         planResumeDate:
 *                           type: string
 *                         planCurrentDay:
 *                           type: number
 *                         planCurrentDate:
 *                           type: string
 *       400:
 *         description: Plan is not on hold or user has no active plan
 *       403:
 *         description: Not authorized to resume plan for this user
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
route.post('/user/:userId/plan/resume', adminController.adminResumeUserPlan);

/**
 * @swagger
 * /admin/user/{userId}/plan/status:
 *   get:
 *     summary: Get user plan status (Admin/Subadmin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           example: "64dc9f07a12b3f001e5c9d1a"
 *         description: User ID to get plan status for
 *     responses:
 *       200:
 *         description: User plan status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                     name:
 *                       type: string
 *                     plan:
 *                       type: object
 *                     planCurrentDay:
 *                       type: number
 *                     planCurrentDate:
 *                       type: string
 *                     planHoldDate:
 *                       type: string
 *                     planResumeDate:
 *                       type: string
 *                     isOnHold:
 *                       type: boolean
 *                     isActive:
 *                       type: boolean
 *       403:
 *         description: Not authorized to view this user
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
route.get('/user/:userId/plan/status', adminController.getUserPlanStatus);

// Dashboard routes
route.use('/dashboard', dashboardRoutes);

module.exports = route;
