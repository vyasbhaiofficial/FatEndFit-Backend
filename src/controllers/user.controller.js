const { db } = require('../models/index.model.js');
const jwt = require('jsonwebtoken');
const RESPONSE = require('../../utils/response.js');

exports.login = async (req, res) => {
    try {
        const { mobileNumber, fcmToken } = req.body;
        let token = null;
        let user;
        user = await db.User.findOne({ mobileNumber });
        if (!user) {
            return RESPONSE.error(res, 404, 3001);
        }

        if (fcmToken) user.fcmToken = fcmToken;
        await user.save();

        token = jwt.sign(
            { id: user._id, mobileNumber: user.mobileNumber, role: 'user' },
            process.env.JWT_SECRET, // use env secret
            { expiresIn: '7d' }
        );
        return RESPONSE.success(res, 200, 1001, { user, token });
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};
