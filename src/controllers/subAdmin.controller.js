const { db } = require('../models/index.model.js');
const RESPONSE = require('../../utils/response.js');

exports.createSubAdmin = async (req, res) => {
    try {
        const loggedInAdmin = req.admin; // from middleware

        // Only Super Admin can create Sub Admin
        if (loggedInAdmin.adminType !== 'Super Admin') {
            return RESPONSE.error(res, 403, 5001);
        }

        const { username, email, password, branchIds } = req.body;

        // Check if email exists
        const [existing, validBranchIds] = await Promise.all([
            db.Admin.exists({ email }),
            db.Branch.find({ _id: { $in: branchIds } }).distinct('_id')
        ]);
        if (existing) {
            return RESPONSE.error(res, 400, 5003);
        }

        if (!validBranchIds.length) {
            return RESPONSE.error(res, 400, 4003);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create Sub Admin
        const subAdmin = await Admin.create({
            username,
            email,
            password: hashedPassword,
            adminType: 'Sub Admin',
            branch: validBranchIds
        });

        return RESPONSE.success(res, 201, 5002, { subAdmin });
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

module.exports = router;
