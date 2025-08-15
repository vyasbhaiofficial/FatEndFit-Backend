const { db } = require('../src/models/index.model.js');

// Helper to generate 8-digit unique numeric ID
exports.generatePatientId = async () => {
    let number = await db.User.findOne({}).sort({ patientId: -1 }).select('patientId');
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

exports.pagination = async ({ start, limit, role }) => {
    let options = {};

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
        if (skip && limit) {
            // Infinite scroll uses start & limit directly
            options.skip = parseInt(start);
            options.limit = parseInt(limit);
        }
    }

    return options;
};
