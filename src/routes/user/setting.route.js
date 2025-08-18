const express = require('express');
const route = express.Router();

const settingController = require('../../controllers/setting.controller.js');

/**
 * @swagger
 * tags:
 *   name: Setting
 *   description: Setting management APIs
 */

/**
 * @swagger
 * /user/setting/get:
 *   get:
 *     summary: Get setting
 *     tags: [Setting]
 *     responses:
 *       200:
 *         description: Successfully retrieved setting
 *       500:
 *         description: Server error
 */
route.get('/get', settingController.getSetting);

module.exports = route;
