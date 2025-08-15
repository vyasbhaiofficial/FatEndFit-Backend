const { db } = require('../models/index.model.js');
const RESPONSE = require('../../utils/response.js');

exports.createBranch = async (req, res) => {
    try {
        const loggedInAdmin = req.admin; // from middleware

        // Only Super Admin can create Sub Admin
        if (loggedInAdmin.adminType !== 'Super Admin') {
            return RESPONSE.error(res, 403, 5001);
        }

        const { username, email, password } = req.body;

        // Check if email exists
        const existing = await Admin.findOne({ email });
        if (existing) {
            return RESPONSE.error(res, 400, 5003);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create Sub Admin
        const subAdmin = await Admin.create({
            username,
            email,
            password: hashedPassword,
            adminType: 'Sub Admin'
        });

        return RESPONSE.success(res, 201, 5002, { subAdmin });
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

module.exports = router;
