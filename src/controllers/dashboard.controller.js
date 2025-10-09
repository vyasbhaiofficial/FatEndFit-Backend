const { db } = require('../models/index.model.js');
const RESPONSE = require('../../utils/response.js');

// Get dashboard statistics for admin
exports.getDashboardStats = async (req, res) => {
    try {
        const baseFilter = { isDeleted: false };

        // Subadmin branch scoping
        let scopedFilter = baseFilter;
        if (req.role === 'subadmin') {
            const adminDoc = await db.Admin.findById(req.admin?.id).select('branch');
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
            chartData,
            lastUpdated: new Date().toISOString()
        });
    } catch (err) {
        console.error('Dashboard stats error:', err);
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};
