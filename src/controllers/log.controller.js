const { db } = require('../models/index.model.js');
const RESPONSE = require('../../utils/response.js');
const os = require('os');

// Helper function to get actual network IP address
const getNetworkIpAddress = () => {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Skip internal (loopback) and non-IPv4 addresses
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return null;
};

// Helper function to get IP address from request
const getIpAddress = req => {
    // First try to get from request headers (for proxied requests)
    let ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim();
    if (ip && ip !== '::1' && ip !== '127.0.0.1' && !ip.startsWith('::ffff:127')) {
        return ip;
    }

    ip = req.headers['x-real-ip'];
    if (ip && ip !== '::1' && ip !== '127.0.0.1' && !ip.startsWith('::ffff:127')) {
        return ip;
    }

    // Get from connection
    ip = req.connection?.remoteAddress || req.socket?.remoteAddress || req.ip;

    // If it's localhost (::1 or 127.0.0.1), get actual network IP
    if (!ip || ip === '::1' || ip === '127.0.0.1' || ip.startsWith('::ffff:127')) {
        const networkIp = getNetworkIpAddress();
        if (networkIp) {
            return networkIp;
        }
    }

    // Remove IPv6 prefix if present
    if (ip && ip.startsWith('::ffff:')) {
        ip = ip.replace('::ffff:', '');
    }

    return ip || getNetworkIpAddress() || 'Unknown';
};

// Create log entry (internal function)
const createLogEntry = async (req, user, action, branchId = null) => {
    try {
        const ipAddress = getIpAddress(req);

        await db.Log.create({
            user: user._id || user.id,
            userType: user.adminType || 'Admin',
            action: action,
            branch: branchId,
            ipAddress: ipAddress,
            timestamp: new Date()
        });
    } catch (err) {
        console.error('Error creating log:', err);
    }
};

// Export createLog for use in other controllers
exports.createLog = createLogEntry;

// Get all logs - subadmin login + panel open/close events
exports.getLogs = async (req, res) => {
    try {
        const { startDate, endDate, userId, branchId, action } = req.query;

        // Build filter
        const filter = {};

        // Filter by action (login, panel_open, panel_close)
        if (action && ['login', 'panel_open', 'panel_close'].includes(action)) {
            filter.action = action;
            // For login, only show Sub Admin
            if (action === 'login') {
                filter.userType = 'Sub Admin';
            }
        } else {
            // Default: show Sub Admin logins + all panel events (Admin & Sub Admin)
            filter.$or = [
                { action: 'login', userType: 'Sub Admin' },
                { action: { $in: ['panel_open', 'panel_close'] } }
            ];
        }

        // Filter by specific user
        if (userId) {
            filter.user = userId;
        }

        // Filter by branch
        if (branchId) {
            filter.branch = branchId;
        }

        // Date range filter
        if (startDate || endDate) {
            filter.timestamp = {};
            if (startDate) {
                const start = new Date(startDate);
                if (!isNaN(start)) filter.timestamp.$gte = start;
            }
            if (endDate) {
                const end = new Date(endDate);
                if (!isNaN(end)) {
                    end.setHours(23, 59, 59, 999);
                    filter.timestamp.$lte = end;
                }
            }
        }

        // Get logs with pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        const [logs, totalCount] = await Promise.all([
            db.Log.find(filter)
                .populate('user', 'username email adminType')
                .populate('branch', 'name')
                .sort({ timestamp: -1 })
                .skip(skip)
                .limit(limit),
            db.Log.countDocuments(filter)
        ]);

        // Format logs
        const formattedLogs = logs.map(log => ({
            _id: log._id,
            user: {
                _id: log.user?._id,
                username: log.user?.username,
                email: log.user?.email,
                adminType: log.user?.adminType
            },
            userType: log.userType,
            action: log.action,
            branch: log.branch
                ? {
                      _id: log.branch._id,
                      name: log.branch.name
                  }
                : null,
            ipAddress: log.ipAddress,
            timestamp: log.timestamp,
            createdAt: log.createdAt
        }));

        // Get login count per subadmin (only for Sub Admin logins)
        const loginStatsFilter = {
            userType: 'Sub Admin',
            action: 'login'
        };
        if (userId) loginStatsFilter.user = userId;
        if (branchId) loginStatsFilter.branch = branchId;
        if (startDate || endDate) {
            loginStatsFilter.timestamp = {};
            if (startDate) {
                const start = new Date(startDate);
                if (!isNaN(start)) loginStatsFilter.timestamp.$gte = start;
            }
            if (endDate) {
                const end = new Date(endDate);
                if (!isNaN(end)) {
                    end.setHours(23, 59, 59, 999);
                    loginStatsFilter.timestamp.$lte = end;
                }
            }
        }

        const loginStats = await db.Log.aggregate([
            { $match: loginStatsFilter },
            {
                $group: {
                    _id: '$user',
                    loginCount: { $sum: 1 },
                    lastLogin: { $max: '$timestamp' },
                    firstLogin: { $min: '$timestamp' }
                }
            },
            {
                $lookup: {
                    from: 'admins',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userInfo'
                }
            },
            { $unwind: '$userInfo' },
            {
                $lookup: {
                    from: 'branches',
                    localField: 'userInfo.branch',
                    foreignField: '_id',
                    as: 'branches'
                }
            },
            {
                $project: {
                    userId: '$_id',
                    username: '$userInfo.username',
                    email: '$userInfo.email',
                    loginCount: 1,
                    lastLogin: 1,
                    firstLogin: 1,
                    branches: { $map: { input: '$branches', as: 'b', in: { _id: '$$b._id', name: '$$b.name' } } }
                }
            }
        ]);

        return RESPONSE.success(res, 200, 1001, {
            logs: formattedLogs,
            loginStatistics: loginStats,
            pagination: {
                page,
                limit,
                total: totalCount,
                totalPages: Math.ceil(totalCount / limit)
            }
        });
    } catch (err) {
        console.error('Get logs error:', err);
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

// Track panel open event
exports.trackPanelOpen = async (req, res) => {
    try {
        const admin = await db.Admin.findById(req.admin?.id);
        if (!admin) {
            return RESPONSE.error(res, 404, 2003, 'Admin not found');
        }

        // Get branch for subadmin
        let branchId = null;
        if (admin.adminType === 'Sub Admin' && admin.branch && admin.branch.length > 0) {
            branchId = admin.branch[0];
        }

        await createLogEntry(req, admin, 'panel_open', branchId);

        return RESPONSE.success(res, 200, 1001, { message: 'Panel open logged successfully' });
    } catch (err) {
        console.error('Track panel open error:', err);
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

// Track panel close event
exports.trackPanelClose = async (req, res) => {
    try {
        const admin = await db.Admin.findById(req.admin?.id);
        if (!admin) {
            return RESPONSE.error(res, 404, 2003, 'Admin not found');
        }

        // Get branch for subadmin
        let branchId = null;
        if (admin.adminType === 'Sub Admin' && admin.branch && admin.branch.length > 0) {
            branchId = admin.branch[0];
        }

        await createLogEntry(req, admin, 'panel_close', branchId);

        return RESPONSE.success(res, 200, 1001, { message: 'Panel close logged successfully' });
    } catch (err) {
        console.error('Track panel close error:', err);
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};
