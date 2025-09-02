const { db } = require('../models/index.model.js');
const RESPONSE = require('../../utils/response.js');
const { pagination } = require('../../utils/function.js');
// Create Reference
exports.createReference = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, mobile, relation } = req.body;

        const exist = await db.Reference.findOne({ userId, mobile });
        if (exist) {
            return RESPONSE.error(res, 400, 7003);
        }
        const reference = await db.Reference.create({ userId, name, mobile, relation });
        return RESPONSE.success(res, 201, 7001, reference);
    } catch (error) {
        console.log(error);
        return RESPONSE.error(res, 500, 9999, error.message);
    }
};

exports.getUserReferences = async (req, res) => {
    try {
        const userId = req.user.id;

        const references = await db.Reference.find({ userId });

        return RESPONSE.success(res, 200, 7002, references);
    } catch (error) {
        console.error(error);
        return RESPONSE.error(res, 500, 9999, error.message);
    }
};
