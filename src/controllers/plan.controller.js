const { db } = require('../models/index.model.js');
const RESPONSE = require('../../utils/response.js');
const { pagination } = require('../../utils/function.js');

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
        const { role } = req;
        const { start, limit } = req.query;
        const options = pagination({ start, limit, role });

        const plans = await db.Plan.find({ isDeleted: false }).skip(options.skip).limit(options.limit);
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

const mongoose = require('mongoose');

exports.planAssignToUser = async (req, res) => {
    try {
        const { userId, planId } = req.body;

        if (!userId || !planId) {
            return RESPONSE.error(res, 400, 6003);
        }
        console.log('.........');
        //  Check if user exists
        const user = await db.User.exists({ _id: userId });
        if (!user) return RESPONSE.error(res, 404, 3001);

        //  Check if plan exists
        const plan = await db.Plan.findById(planId);
        if (!plan || plan.isDeleted) {
            return RESPONSE.error(res, 404, 6003);
        }
        console.log('.......fdsf..');

        console.log(userId);
        //  Get highest days plan from History
        const lastHistory = await db.History.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId), type: 1 } },
            {
                $lookup: {
                    from: 'plans',
                    localField: 'plan',
                    foreignField: '_id',
                    as: 'plan'
                }
            },
            { $unwind: '$plan' },
            { $sort: { 'plan.days': -1 } },
            { $limit: 1 }
        ]);
        console.log('histroy--------------------', lastHistory);

        let currentPlan = null;
        if (lastHistory.length > 0) {
            currentPlan = lastHistory[0].plan; // sabse bada plan history se
        } else if (user.plan) {
            currentPlan = await db.Plan.findById(user.plan); // fallback to user.plan
        }

        //  Agar user ke paas already plan hai
        if (currentPlan) {
            // Agar new plan chhota hai -> reject
            if (plan.days < currentPlan.days) {
                return RESPONSE.error(
                    res,
                    400,
                    6004,
                    `User already has ${currentPlan.days}-day plan. Cannot assign shorter ${plan.days}-day plan.`
                );
            }

            // Agar new plan bada hai -> assign karo + history
            if (plan.days > currentPlan.days) {
                user.plan = plan._id;
                await user.save();

                await db.History.create({
                    user: userId,
                    plan: planId,
                    type: 1
                });

                return RESPONSE.success(res, 200, 6004, {
                    message: `${plan.days}-day plan assigned successfully`
                });
            }

            // Agar same plan hai -> reject
            return RESPONSE.error(res, 400, 6004, `User already has same ${plan.days}-day plan.`);
        }

        //  Agar user ke paas plan hi nahi hai -> assign karo
        user.plan = plan._id;
        await user.save();

        await db.History.create({
            user: userId,
            plan: planId,
            type: 1
        });

        return RESPONSE.success(res, 200, 6004, {
            message: `${plan.days}-day plan assigned successfully`
        });
    } catch (err) {
        console.error(err);
        return RESPONSE.error(res, 500, 'SERVER_ERROR', err.message);
    }
};

// plan hold or resume by the user
exports.planHoldOrResume = async (req, res) => {
    try {
        const { planId } = req.query; // type = 1 -> hold , type = 2 -> resume
        let type = Number(req.query.type);
        const userId = req.user.id;

        //  Check if plan exists
        const plan = await db.Plan.findById(planId);
        if (!plan || plan.isDeleted) {
            return RESPONSE.error(res, 404, 6003);
        }
        const user = await db.User.findById(userId);
        if (user.plan.toString() !== planId) {
            return RESPONSE.error(res, 404, 6009);
        }
        const now = new Date();
        const date = now.toISOString().split('T')[0];
        if (type == 1) {
            // hold
            user.planHoldDate = date;
            user.planResumeDate = null;
        } else {
            // resume
            user.planHoldDate = null;
            user.planResumeDate = date;
            if (user.planCurrentDate !== date) {
                user.planCurrentDate = date;
                user.planCurrentDay += 1;
            }
        }
        await user.save();
        return RESPONSE.success(res, 200, type === 1 ? 'Plan hold successfully' : 'Plan resume successfully');
    } catch (err) {
        console.error(err);
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};
