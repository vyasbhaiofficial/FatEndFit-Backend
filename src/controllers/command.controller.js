const { db } = require('../models/index.model.js');
const RESPONSE = require('../../utils/response.js');

// Create Command
exports.createCommand = async (req, res) => {
    try {
        const { type, title, description } = req.body;
        const audioUrl = req.file ? req.file.path : undefined;
        console.log(audioUrl, '-------------------------------audio');

        const command = await db.Command.create({
            type,
            title,
            description: type === 'text' ? description : undefined,
            audioUrl: type === 'audio' ? audioUrl : undefined,
            createdBy: req.admin?.id || null,
            createdByRole: req.role || 'admin'
        });

        return RESPONSE.success(res, 201, 1001, command);
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

// Get All Commands
exports.getCommands = async (req, res) => {
    try {
        // Admin sees all; Sub Admin sees own + admin-created
        let filter = {};
        if (req.role === 'subadmin') {
            filter = {
                $or: [
                    { createdByRole: 'admin' },
                    { createdByRole: { $exists: false } }, // legacy treated as admin-created
                    { createdBy: req.admin?.id }
                ]
            };
        }
        const commands = await db.Command.find(filter).sort({ createdAt: -1 });
        return RESPONSE.success(res, 200, 1002, commands);
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

// Update Command
exports.updateCommand = async (req, res) => {
    try {
        const commandId = req.params.id;
        const { type, title, description } = req.body;
        const audioUrl = req.file ? req.file.path : undefined;

        const command = await db.Command.findById(commandId);
        if (!command) {
            return RESPONSE.error(res, 404, 3001, 'Command not found');
        }

        // authorize: admin OR owning subadmin
        if (req.role === 'subadmin' && String(command.createdBy) !== String(req.admin?.id)) {
            return RESPONSE.error(res, 403, 3002, 'Not allowed');
        }

        command.type = type || command.type;
        command.title = title || command.title;

        if (command.type === 'text') {
            command.description = description || command.description;
            command.audioUrl = undefined;
        } else if (command.type === 'audio') {
            if (audioUrl) command.audioUrl = audioUrl;
            command.description = undefined;
        }

        await command.save();
        return RESPONSE.success(res, 200, 1003, command);
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

// Delete Command
exports.deleteCommand = async (req, res) => {
    try {
        const command = await db.Command.findById(req.params.id);
        if (!command) {
            return RESPONSE.error(res, 404, 3001, 'Command not found');
        }
        if (req.role === 'subadmin' && String(command.createdBy) !== String(req.admin?.id)) {
            return RESPONSE.error(res, 403, 3002, 'Not allowed');
        }
        await db.Command.findByIdAndDelete(req.params.id);
        return RESPONSE.success(res, 200, 1004, 'Deleted successfully');
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};
