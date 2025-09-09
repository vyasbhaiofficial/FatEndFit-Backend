const express = require("express");
const router = express.Router();
const upload = require("../../../middleware/multer");
const {
  createCommand,
  getCommands,
  updateCommand,
  deleteCommand,
} = require("../../controllers/command.controller.js");

/**
 * @swagger
 * /admin/command/create-command:
 *   post:
 *     summary: Create a new command (text or audio)
 *     tags: [Commands]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - title
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [text, audio]
 *                 example: text
 *               title:
 *                 type: string
 *                 example: Greeting Command
 *               description:
 *                 type: string
 *                 example: This is a sample text command
 *               audio:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Command created successfully
 *       500:
 *         description: Server error
 */
router.post("/create-command", upload.single("audio"), createCommand);


/**
 * @swagger
 * /admin/command/get-command:
 *   get:
 *     summary: Get all commands
 *     tags: [Commands]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of commands
 */
router.get("/get-command", getCommands);

/**
 * @swagger
 * /admin/command/update-command/{id}:
 *   put:
 *     summary: Update a command
 *     tags: [Commands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Command ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Command Title
 *               description:
 *                 type: string
 *                 example: Updated description text
 *               audio:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Command updated successfully
 *       404:
 *         description: Command not found
 */
router.put("/update-command/:id", upload.single("audio"), updateCommand);

/**
 * @swagger
 * /admin/command/delete-command/{id}:
 *   delete:
 *     summary: Delete a command
 *     tags: [Commands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Command ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Command deleted successfully
 *       404:
 *         description: Command not found
 */
router.delete("/delete-command/:id", deleteCommand);


module.exports = router;
