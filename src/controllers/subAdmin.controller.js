const bcrypt = require('bcryptjs');
const { db } = require('../models/index.model.js');
const RESPONSE = require('../../utils/response.js');

// Admin creates Sub Admin
exports.createSubAdmin = async (req, res) => {
    try {
        const requester = req.admin; // { id, email, role }
        const adminDoc = await db.Admin.findById(requester.id);
        let branchIds = req.body.branch;
        if (!adminDoc) {
            return RESPONSE.error(res, 403, 2003);
        }
        // Only main Admin can create subadmins
        if (adminDoc.adminType !== 'Admin') {
            return RESPONSE.error(res, 403, 5001, 'Only Admin can create Sub Admin');
        }

        const { username, email, password, branch } = req.body;
        const imageUrl = req.file?.path;
        if (!username || !email || !password) {
            return RESPONSE.error(res, 400, 1002, 'username, email, password required');
        }

        const exists = await db.Admin.exists({ email });
        if (exists) {
            return RESPONSE.error(res, 400, 5003, 'Email already in use');
        }

        if (branchIds && !Array.isArray(branchIds)) {
            branchIds = [branchIds];
        }

        let validBranchIds = [];
        if (Array.isArray(branchIds) && branchIds.length) {
            validBranchIds = await db.Branch.find({ _id: { $in: branchIds } }).distinct('_id');
        }
        console.log('validBranchIds------------------------------------', validBranchIds);

        const hashedPassword = await bcrypt.hash(password, 10);
        const subAdmin = await db.Admin.create({
            username,
            email,
            password: hashedPassword,
            adminType: 'Sub Admin',
            branch: validBranchIds,
            image: imageUrl
        });

        return RESPONSE.success(res, 201, 5002, subAdmin);
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

// List all Sub Admins (admin only)
exports.listSubAdmins = async (req, res) => {
    try {
        const subAdmins = await db.Admin.find({ adminType: 'Sub Admin', isDeleted: false }).select('-password').populate('branch', 'name');;
        console.log('subAdmins------------------------------------', subAdmins);
        return RESPONSE.success(res, 200, 1001, subAdmins);
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

// Admin updates a Sub Admin by id
exports.updateSubAdminByAdmin = async (req, res) => {
    try {
        const admin = await db.Admin.findById(req.admin.id);
        if (!admin || admin.adminType !== 'Admin') {
            return RESPONSE.error(res, 403, 5001);
        }

        const { id } = req.params;
        const { username, email, password, branch, isDeleted } = req.body;
        const subAdmin = await db.Admin.findOne({ _id: id, adminType: 'Sub Admin' });
        if (!subAdmin) {
            return RESPONSE.error(res, 404, 2003, 'Sub Admin not found');
        }

        if (email && email !== subAdmin.email) {
            const exists = await db.Admin.exists({ email });
            if (exists) {
                return RESPONSE.error(res, 400, 5003, 'Email already in use');
            }
            subAdmin.email = email;
        }
        if (username) subAdmin.username = username;
        if (typeof isDeleted !== 'undefined') subAdmin.isDeleted = Boolean(isDeleted);
        if (Array.isArray(branch)) {
            const validBranchIds = await db.Branch.find({ _id: { $in: branch } }).distinct('_id');
            subAdmin.branch = validBranchIds;
        }
        if (req.file) subAdmin.image = req.file.path;
        if (password) subAdmin.password = await bcrypt.hash(password, 10);

        await subAdmin.save();
        const sanitized = subAdmin.toObject();
        delete sanitized.password;
        return RESPONSE.success(res, 200, 1007, sanitized);
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};
