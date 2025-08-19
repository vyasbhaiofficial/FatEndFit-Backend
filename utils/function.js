const { db } = require('../src/models/index.model.js');
const twilio = require('twilio');

// Helper to generate 8-digit unique numeric ID
exports.generatePatientId = async () => {
    let user = await db.User.findOne({}).sort({ patientId: -1 }).select('patientId');
    let number = user?.patientId || 0;
    console.log('number', number);
    if (!number) number = 1000;
    let exists = true;
    while (exists) {
        exists = await db.User.exists({ patientId: number + 1 });
    }
    return number + 1;
};

exports.generateOTP = async () => {
    const number = Math.floor(1000 + Math.random() * 9000);
    console.log('number', number);
    return number;
};

exports.pagination = ({ start = 1, limit = 20, role }) => {
    let options = {};
    console.log('role', role, start, limit);
    // If role is admin, allow page-wise pagination
    if (role == 'admin') {
        if (start && limit) {
            // Page-wise (e.g., start=2, limit=10 → skip=10)
            const startIndex = (start - 1) * limit;
            options.skip = parseInt(startIndex);
            options.limit = parseInt(limit);
        }
    }
    // App side infinite scroll
    else {
        // Infinite scroll uses start & limit directly
        options.skip = parseInt(start);
        options.limit = parseInt(limit);
    }
    console.log('options', options);
    return options;
};

// Send OTP
exports.sendOTP = async ({ OTP, mobileNumber }) => {
    try {
        // Save this OTP in DB/Redis with expiry (for verification later)
        const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        const message = await client.messages.create({
            body: `Your OTP is ${OTP}`,
            from: process.env.TWILIO_NUMBER, // Your Twilio Number
            to: mobileNumber // User mobile number (+91 for India)
        });

        console.log('OTP sent:', message.sid);
        return OTP; // return OTP to verify later
    } catch (err) {
        console.error('Error sending OTP:', err);
        throw err;
    }
};
