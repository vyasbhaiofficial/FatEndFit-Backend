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
    return Math.floor(1000 + Math.random() * 9000);
};
