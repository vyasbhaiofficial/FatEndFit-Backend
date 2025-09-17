const jwt = require('jsonwebtoken');
const RESPONSE = require('../../utils/response.js');
const { isValidLanguage, getDefaultLanguage } = require('../../utils/languageHelper.js');
const { db } = require('../../src/models/index.model.js');

exports.user_auth = async (req, res, next) => {
    try {
        const exclude_employee_auth_routes = ['/auth'];
        req.request_url = req.url?.split('/')?.[1] || null;
        if (exclude_employee_auth_routes.includes(`/${req.request_url}`)) {
            return next();
        }

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return RESPONSE.error(res, 401, 3001, 'No token provided');
        }
        const currentPath = req.path || '';
        const roleRouteAccess = {
            admin: ['/admin', '/admin-agency', '/agency'],
            subadmin: ['/admin', '/admin-agency', '/agency'],
            user: ['/user', '/common', '/host']
        };
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.role = decoded.role;
            console.log('decode', decoded);
            const allowedRoutes = roleRouteAccess[req.role] || [];
            const isAllowed = allowedRoutes.some(prefix => currentPath.startsWith(prefix));

            if (!isAllowed) {
                return RESPONSE.error(res, 403, 4444);
            }

            if (decoded.role == 'user') {
                const user = await db.User.findById(decoded.id);
                if (!user || user.isDeleted) {
                    return RESPONSE.error(res, 500, 3001, null);
                } else if (user.isBlocked) {
                    return RESPONSE.error(res, 500, 3004, null);
                }
                req.user = decoded;
                req.user.planCurrentDay = user.planCurrentDay;
                // attach preferred language from user profile (fallback to default)
                const userLanguage = (user.language || '').toString().toLowerCase();
                req.preferredLanguage = isValidLanguage(userLanguage) ? userLanguage : getDefaultLanguage();
                console.log('req.preferredLanguage', req.preferredLanguage);
                next();
            } else if (decoded.role == 'admin' || decoded.role == 'subadmin') {
                const admin = await db.Admin.findById(decoded.id);
                if (!admin) {
                    return RESPONSE.error(res, 500, 2003, null);
                }
                req.admin = decoded;
                next();
            } else {
                return RESPONSE.error(res, 500, 2002, null); // @todo
            }
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return RESPONSE.error(res, 401, 2004, 'आपका token expire हो गया है');
            }
            if (err.name === 'JsonWebTokenError') {
                return RESPONSE.error(res, 401, 2002, 'Invalid token');
            }

            return RESPONSE.error(res, 500, 9999, err.message);
        }
    } catch (e) {
        console.log('error in user auth', e);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.verifyToken = async token => {
    try {
        let userObj = {};
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('token', decoded, process.env.JWT_SECRET, token);

        const user = await db.User.findById(decoded.id);
        if (!user || user.isDeleted) {
            throw new Error('User not found');
        } else if (user.isBlocked) {
            throw new Error('User is blocked');
        }
        userObj = decoded;
        return userObj;
    } catch (err) {
        console.log('err :>> ', err);
        throw new Error('Invalid token');
    }
};
