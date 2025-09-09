const { db } = require('../models/index.model.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const RESPONSE = require('../../utils/response.js');

// Admin Signup (only allowed for first-time setup)
exports.adminSignup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return RESPONSE.error(res, 400, 1002, 'Username, email and password are required');
        }
        // Allow signup only if no Admin exists yet
        const existingMainAdmin = await db.Admin.countDocuments({ adminType: 'Admin', isDeleted: false });
        if (existingMainAdmin > 0) {
            return RESPONSE.error(res, 403, 1003, 'Admin signup disabled. Contact existing Admin.');
        }
        const existingAdmin = await db.Admin.findOne({ email });
        if (existingAdmin) {
            return RESPONSE.error(res, 400, 1003, 'Admin already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = await db.Admin.create({
            username,
            email,
            password: hashedPassword,
            adminType: 'Admin',
            branch: []
        });

        // Generate JWT token on signup
        const token = jwt.sign(
            { id: admin._id, email: admin.email, adminType: admin.adminType },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d'
            }
        );

        return RESPONSE.success(res, 201, 1004, { admin, token });
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

// Admin Login
exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return RESPONSE.error(res, 400, 1002, 'Email and password are required');
        }
        const admin = await db.Admin.findOne({ email });
        if (!admin) {
            return RESPONSE.error(res, 401, 1005, 'Invalid email or password');
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return RESPONSE.error(res, 401, 1005, 'Invalid email or password');
        }
        const role = admin.adminType === 'Admin' ? 'admin' : 'subadmin';
        console.log('role------------------------------------', role);
        const token = jwt.sign({ id: admin._id, email: admin.email, role }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });
        return RESPONSE.success(res, 200, 1006, { admin, token });
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

// update api
exports.updateAdmin = async (req, res) => {
    try {
        console.log('req.body', req.body.username);
        const { username, password } = req.body;
        const admin = await db.Admin.findOne({ _id: req.admin.id });

        if (username) admin.username = username;
        if (req.file) admin.image = req.file.path;
        if (password) admin.password = await bcrypt.hash(password, 10);

        await admin.save();
        return RESPONSE.success(res, 200, 1007, { admin });
    } catch (err) {
        console.log('err', err);
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};
