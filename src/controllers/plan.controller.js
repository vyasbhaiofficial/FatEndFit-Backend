const { db } = require('../models/index.model.js');
const RESPONSE = require('../../utils/response.js');

// Create Plan
exports.createPlan = async (req, res) => {
    try {
        const { name, description, days } = req.body;

        const existingPlan = await db.Plan.findOne({ name, isDeleted: false });
        if (existingPlan) {
            return RESPONSE.error(res, 400, 6007);
        }
        const plan = await db.Plan.create({
            name,
            description,
            days
        });

        return RESPONSE.success(res, 201, 6001, plan);
    } catch (err) {
        return RESPONSE.error(res, 600, 9999, err.message);
    }
};

// Get All Plans
exports.getAllPlans = async (req, res) => {
    try {
        const plans = await db.Plan.find({ isDeleted: false });
        return RESPONSE.success(res, 200, 6002, plans);
    } catch (err) {
        return RESPONSE.error(res, 600, 9999, err.message);
    }
};

// Update Plan
exports.updatePlan = async (req, res) => {
    try {
        const { planId } = req.params;

        const existingPlan = await db.Plan.findOne({
            name: req.body.name,
            _id: { $ne: planId },
            isDeleted: false
        });
        if (existingPlan) {
            return RESPONSE.error(res, 400, 6007);
        }
        const plan = await db.Plan.findOneAndUpdate({ _id: planId, isDeleted: false }, req.body, { new: true });

        if (!plan) {
            return RESPONSE.error(res, 404, 6003);
        }

        return RESPONSE.success(res, 200, 6005, plan);
    } catch (err) {
        return RESPONSE.error(res, 600, 9999, err.message);
    }
};

// Delete Plan (Soft Delete)
exports.deletePlan = async (req, res) => {
    try {
        const { planId } = req.params;

        const plan = await db.Plan.findOneAndUpdate(
            { _id: planId, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );

        if (!plan) {
            return RESPONSE.error(res, 404, 6003);
        }

        return RESPONSE.success(res, 200, 6006);
    } catch (err) {
        return RESPONSE.error(res, 600, 9999, err.message);
    }
};
