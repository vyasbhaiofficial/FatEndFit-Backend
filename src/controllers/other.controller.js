const { db } = require('../models/index.model.js');
const RESPONSE = require('../../utils/response.js');

// Create Plan
exports.generateUrl = async (req, res) => {
    try {
        // The uploaded file info is in req.file
        return RESPONSE.success(res, 200, 1001, req.file.path);
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

exports.contactUs = async (req, res) => {
    try {
        const { id: userId } = req.user;
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};
