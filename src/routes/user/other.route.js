const express = require('express');
const route = express.Router();

const otherController = require('../../controllers/other.controller.js');
const upload = require('../../../middleware/multer.js');

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
route.post('/generateUrl', upload.single('image'), otherController.generateUrl);


/**
 * @swagger
 * /user/other/contactUs:
 *   get:
 *     summary: Get Contact Details of the logged-in user's branch
 *     tags:
 *       - Contact
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Contact details fetched successfully
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
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Darshan Hotel
 *                     address:
 *                       type: string
 *                       example: "6VCG+9FF, Varachha Main Rd, Mamata Park Society-1"
 *                     city:
 *                       type: string
 *                       example: Surat
 *                     state:
 *                       type: string
 *                       example: Gujarat
 *                     pincode:
 *                       type: string
 *                       example: "395006"
 *                     email:
 *                       type: string
 *                       example: "Contact@codzcartinfotech.com"
 *                     mobile:
 *                       type: string
 *                       example: "+91 92654 25326"
 *                     latitude:
 *                       type: number
 *                       example: 21.223
 *                     longitude:
 *                       type: number
 *                       example: 72.833
 *       404:
 *         description: User or Branch not found
 *       500:
 *         description: Internal server error
 */
route.get('/contactUs', otherController.getContactDetails);

module.exports = route;
