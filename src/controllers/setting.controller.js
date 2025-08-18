const { db } = require('../models/index.model.js');
const RESPONSE = require('../../utils/response.js');

// Create setting
exports.createSetting = async (req, res) => {
    try {
        const setting = new db.Setting(req.body);
        await setting.save();

        return RESPONSE.success(res, 200, 1101, setting);
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: false, message: 'Internal server error' });
    }
};

exports.updateSettingById = async (req, res) => {
    try {
        const setting = await db.Setting.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!setting) {
            return RESPONSE.error(res, 404, 1103);
        }
        return RESPONSE.success(res, 200, 1104, setting);
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: false, message: 'Internal server error' });
    }
};

exports.getSetting = async (req, res) => {
    try {
        const setting = await db.Setting.findOne();
        RESPONSE.success(res, 200, 1002, setting);
    } catch (err) {
        return res.status(500).send({ status: false, message: 'Internal server error' });
    }
};
