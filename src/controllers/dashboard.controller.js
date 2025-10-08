const { db } = require('../models/index.model.js');
const RESPONSE = require('../../utils/response.js');

// Get dashboard statistics for admin
exports.getDashboardStats = async (req, res) => {
    try {
        // Base filter for non-deleted users
        const baseFilter = { isDeleted: false };

        // For subadmin, filter by their assigned branches
        let userFilter = baseFilter;
        if (req.role === 'subadmin') {
            const adminDoc = await db.Admin.findById(req.admin?.id).select('branch');
            if (!adminDoc) {
                return RESPONSE.error(res, 403, 2003, 'Admin not found');
            }
            const allowedBranchIds = adminDoc.branch || [];
            userFilter = { ...baseFilter, branch: { $in: allowedBranchIds } };
        }

        // Get only required statistics
        const [totalUsers, activePlanUsers, holdPlanUsers] = await Promise.all([
            // Total users count
            db.User.countDocuments(userFilter),

            // Active plan users (activated, not blocked, has plan, not on hold)
            db.User.countDocuments({
                ...userFilter,
                activated: true,
                isBlocked: false,
                plan: { $exists: true, $ne: null },
                planHoldDate: null
            }),

            // Hold plan users (has plan and planHoldDate is set)
            db.User.countDocuments({
                ...userFilter,
                plan: { $exists: true, $ne: null },
                planHoldDate: { $exists: true, $ne: null }
            })
        ]);

        // Create chart data for plan status
        const chartData = [
            {
                name: 'Active Plans',
                value: activePlanUsers,
            },
            {
                name: 'Hold Plans',
                value: holdPlanUsers,
            }
        ];

        const dashboardData = {
            totalUsers,
            activePlanUsers,
            holdPlanUsers,
            chartData,
            lastUpdated: new Date().toISOString()
        };

        return RESPONSE.success(res, 200, 1001, dashboardData);
    } catch (err) {
        console.error('Dashboard stats error:', err);
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};
