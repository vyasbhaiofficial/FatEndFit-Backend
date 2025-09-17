const { db } = require('../models/index.model.js');
const RESPONSE = require('../../utils/response.js');

exports.createBranch = async (req, res) => {
    try {
        const { name, address, city, state, pincode, email, latitude, longitude, mobilePrefix, mobileNumber } =
            req.body;

        const existingBranch = await db.Branch.findOne({ name, isDeleted: false });
        if (existingBranch) {
            return RESPONSE.error(res, 400, 4007);
        }
        const branch = await db.Branch.create({
            name,
            address,
            city,
            state,
            pincode,
            latitude,
            longitude,
            email,
            mobilePrefix: mobilePrefix || '+91',
            mobileNumber
        });

        return RESPONSE.success(res, 201, 4001, branch);
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

exports.getAllBranches = async (req, res) => {
    try {
        const branches = await db.Branch.find({ isDeleted: false })
        return RESPONSE.success(res, 200, 4002, branches);
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

exports.updateBranch = async (req, res) => {
    try {
        const { branchId } = req.params;
        const existingBranch = await db.Branch.findOne({
            name: req.body.name,
            _id: { $ne: branchId },
            isDeleted: false
        });
        if (existingBranch) {
            return RESPONSE.error(res, 400, 4007);
        }
        const branch = await db.Branch.findOneAndUpdate(
            { _id: branchId, isDeleted: false },
            {
                ...req.body,
                mobilePrefix: req.body.mobilePrefix || '+91'
            },
            { new: true }
        );
        if (!branch) {
            return RESPONSE.error(res, 404, 4003);
        }

        return RESPONSE.success(res, 200, 4005, branch);
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

exports.deleteBranch = async (req, res) => {
    try {
        const { branchId } = req.params;

        const branch = await db.Branch.findOneAndUpdate(
            { _id: branchId, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );

        if (!branch) {
            return RESPONSE.error(res, 404, 4003);
        }

        return RESPONSE.success(res, 200, 4006);
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

//branchwise user get 
exports.getBranchwiseUser = async (req, res) => {
    try {
        const { branchId } = req.params;
        const branch = await db.Branch.findOne({ _id: branchId, isDeleted: false });  
        if (!branch) {
            return RESPONSE.error(res, 404, 4003);
        }
        const users = await db.User.find({ branch: branchId, isDeleted: false }).populate('branch', 'name').populate('plan', 'name');
        return RESPONSE.success(res, 200, 4002, users);
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};