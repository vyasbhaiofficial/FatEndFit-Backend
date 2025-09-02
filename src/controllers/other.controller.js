const { db } = require('../models/index.model.js');
const RESPONSE = require('../../utils/response.js');

// Create Plan
exports.generateUrl = async (req, res) => {
    try {
        // The uploaded file info is in req.file
        return RESPONSE.success(res, 200, 1001, req.file.path);
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

exports.getContactDetails = async (req, res) => {
    try {
        const userId = req.user.id;


        const user = await db.User.findById(userId).populate('branch');
        if (!user) {
            return RESPONSE.error(res, 404, 3001);
        }

        if (!user.branch) {
            return RESPONSE.error(res, 404, 4003);
        }
        const branch = user.branch;
        const fullAddress = `${branch.address}, ${branch.city}, ${branch.state} - ${branch.pincode}`;

        return RESPONSE.success(res, 200,4004, {
            title: branch.name,
            fullAddress,
            email: branch.email||'',
            mobile: `${branch.mobilePrefix} ${branch.mobileNumber}`,
            latitude: branch.latitude,
            longitude: branch.longitude
        });
    } catch (err) {
        console.error(err);
        return RESPONSE.error(res, 500, 'Something went wrong');
    }
};
