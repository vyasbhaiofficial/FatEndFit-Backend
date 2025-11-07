const { db } = require('../models/index.model.js');
const RESPONSE = require('../../utils/response.js');

// Get dashboard statistics for admin
exports.getDashboardStats = async (req, res) => {
    try {
        const baseFilter = { isDeleted: false };

        // Subadmin branch scoping
        let scopedFilter = baseFilter;
        let adminDoc = null;
        if (req.role === 'subadmin') {
            adminDoc = await db.Admin.findById(req.admin?.id).select('branch');
            if (!adminDoc) return RESPONSE.error(res, 403, 2003, 'Admin not found');
            const allowedBranchIds = adminDoc.branch || [];
            scopedFilter = { ...baseFilter, branch: { $in: allowedBranchIds } };
        }

        // Date window
        const { startDate, endDate } = req.query || {};
        let start = null,
            end = null;
        if (startDate) {
            const s = new Date(startDate);
            if (!isNaN(s)) start = s;
        }
        if (endDate) {
            const e = new Date(endDate);
            if (!isNaN(e)) {
                e.setHours(23, 59, 59, 999);
                end = e;
            }
        }
        const between = field =>
            start || end
                ? {
                      [field]: {
                          ...(start ? { $gte: start } : {}),
                          ...(end ? { $lte: end } : {})
                      }
                  }
                : {};

        // Queries
        const totalUsersQuery = {
            ...scopedFilter,
            ...between('createdAt')
        };

        // Use createdAt for active date since activatedAt field doesn't exist in model
        const activeDateField = 'createdAt';
        const activePlanUsersQuery = {
            ...scopedFilter,
            activated: true,
            isBlocked: false,
            plan: { $exists: true, $ne: null },
            planHoldDate: null,
            ...between(activeDateField)
        };

        const holdPlanUsersQuery = {
            ...scopedFilter,
            activated: true,
            isBlocked: false,
            plan: { $exists: true, $ne: null },
            planHoldDate: { $exists: true, $ne: null },
            ...between('planHoldDate')
        };

        // Build user match filter for aggregation (filter by isDeleted, branch, and date)
        // After $unwind, user fields are nested under 'user' key
        const userMatchFilter = { 'user.isDeleted': false };
        if (req.role === 'subadmin' && adminDoc && adminDoc.branch && adminDoc.branch.length > 0) {
            userMatchFilter['user.branch'] = { $in: adminDoc.branch };
        }
        // Add date filter similar to totalUsers (filter by user's createdAt date)
        if (start || end) {
            userMatchFilter['user.createdAt'] = {};
            if (start) userMatchFilter['user.createdAt'].$gte = start;
            if (end) userMatchFilter['user.createdAt'].$lte = end;
        }

        // Count users with only one plan (exactly 1 history entry with type: 1)
        // These are users who took plan only ONE TIME - count ALL plans, not just active
        const usersWithOnePlanAggregation = await db.History.aggregate([
            { $match: { type: 1 } },
            {
                $group: {
                    _id: '$user',
                    planCount: { $sum: 1 }
                }
            },
            { $match: { planCount: 1 } },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: { path: '$user', preserveNullAndEmptyArrays: false } },
            { $match: userMatchFilter }
        ]);

        const usersWithOnePlanCount = usersWithOnePlanAggregation.length;

        // Count users who upgraded their plan (more than 1 history entry with type: 1)
        // These are users who took plan once and then took plan again (upgraded) - count ALL plans
        const usersWithUpgradedPlanAggregation = await db.History.aggregate([
            { $match: { type: 1 } },
            {
                $group: {
                    _id: '$user',
                    planCount: { $sum: 1 }
                }
            },
            { $match: { planCount: { $gt: 1 } } },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: { path: '$user', preserveNullAndEmptyArrays: false } },
            { $match: userMatchFilter }
        ]);

        const usersWithUpgradedPlanCount = usersWithUpgradedPlanAggregation.length;

        const [totalUsers, activePlanUsers, holdPlanUsers] = await Promise.all([
            db.User.countDocuments(totalUsersQuery),
            db.User.countDocuments(activePlanUsersQuery),
            db.User.countDocuments(holdPlanUsersQuery)
        ]);

        const chartData = [
            { name: 'Active Plans', value: activePlanUsers },
            { name: 'Hold Plans', value: holdPlanUsers }
        ];

        return RESPONSE.success(res, 200, 1001, {
            totalUsers,
            activePlanUsers,
            holdPlanUsers,
            usersWithOnePlan: usersWithOnePlanCount,
            usersWithUpgradedPlan: usersWithUpgradedPlanCount,
            chartData,
            lastUpdated: new Date().toISOString()
        });
    } catch (err) {
        console.error('Dashboard stats error:', err);
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};
