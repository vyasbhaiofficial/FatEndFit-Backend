const express = require('express');
const route = express.Router();
const settingController = require('../../controllers/setting.controller.js');

// /**
//  * @swagger
//  * /admin/setting/create:
//  *   post:
//  *     summary: Create a new setting
//  *     tags:
//  *       - Setting
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *     responses:
//  *       200:
//  *         description: Success
//  */
// route.post('/create', settingController.createSetting);

/**
 * @swagger
 * /admin/setting/get:
 *   get:
 *     summary: Get all settings
 *     tags:
 *       - Setting
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
route.get('/get', settingController.getSetting);

route.put('/update/:id', settingController.updateSettingById);

module.exports = route;
