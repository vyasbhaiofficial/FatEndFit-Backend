const { db } = require('../src/models/index.model.js');
const twilio = require('twilio');

// Helper to generate branch-specific patient ID: branch_name_4digit_unique_number
exports.generatePatientId = async branchId => {
    // Get branch details
    const branch = await db.Branch.findById(branchId).select('name');
    if (!branch) {
        throw new Error('Branch not found');
    }

    // Clean branch name for patient ID (remove spaces, special characters, convert to lowercase)
    const branchName = branch.name.toLowerCase().replace(/[^a-z0-9]/g, '');

    // Find the highest patient ID for this branch (both old numeric and new format)
    const users = await db.User.find({
        $or: [
            { patientId: { $regex: `^${branchName}_` } }, // New format: branchname_1000
            { patientId: { $regex: /^\d+$/ } } // Old format: just numbers
        ],
        isDeleted: false
    })
        .select('patientId')
        .sort({ patientId: -1 });

    let nextNumber = 1000; // Start from 1000

    if (users.length > 0) {
        // Check if any user has the new format for this branch
        const newFormatUsers = users.filter(user => user.patientId.match(new RegExp(`^${branchName}_(\\d{4})$`)));

        if (newFormatUsers.length > 0) {
            // Extract the number from the last new format patient ID
            const lastPatientId = newFormatUsers[0].patientId;
            const match = lastPatientId.match(new RegExp(`^${branchName}_(\\d{4})$`));
            if (match) {
                nextNumber = parseInt(match[1]) + 1;
            }
        } else {
            // If no new format exists, start from 1000
            nextNumber = 1000;
        }
    }

    // Ensure we have a 4-digit number
    const paddedNumber = nextNumber.toString().padStart(4, '0');
    const patientId = `${branchName}_${paddedNumber}`;

    // Check if this patient ID already exists (safety check)
    const exists = await db.User.exists({ patientId });
    if (exists) {
        // If exists, try next number
        return await exports.generatePatientId(branchId);
    }

    return patientId;
};

exports.generateOTP = async () => {
    const number = Math.floor(1000 + Math.random() * 9000);
    console.log('number', number);
    return number;
};

exports.pagination = ({ start, limit = 20, role }) => {
    let options = {};
    console.log('role', role, start, limit);
    // If role is admin, allow page-wise pagination
    if (role == 'admin') {
        // Page-wise
        if (!start) start = 1;
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
        options.skip = parseInt(start) ? parseInt(start) : 0;
        options.limit = parseInt(limit) ? parseInt(limit) : 20;
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
