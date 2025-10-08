const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, default: 'New User' },
        surname: { type: String, trim: true, default: '' },
        patientId: { type: String, required: true, unique: true },
        mobilePrefix: { type: String, required: true, default: '+91' },
        mobileNumber: {
            type: String,
            required: true,
            // add validation for mobile number
            validate: {
                validator: function (v) {
                    return /^\d{10}$/.test(v);
                },
                message: props => `${props.value} is not a valid mobile number!`
            }
        },
        gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true, default: 'Male' },
        age: { type: Number, required: true, min: 0, default: 18 },
        height: { type: Number, required: true, default: 170 },
        weight: { type: Number, required: true, default: 60 },
        language: { type: String, required: true, default: 'English' },
        medicalDescription: { type: String, default: '' },
        image: { type: String, default: `uploads/${process.env.DEFAULT_USER_IMAGE}` },
        fcmToken: { type: String, default: '' },
        city: { type: String, required: true, default: 'Mumbai' },
        state: { type: String, required: true, default: 'Maharashtra' },
        country: { type: String, required: true, default: 'India' },
        appReferer: { type: String, default: '' },
        plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
        branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
        planCurrentDay: { type: Number, default: 0 }, // 0 , 1 , 2
        planCurrentDate: { type: String, default: null }, //  const now = new Date();  const date = now.toISOString().split('T')[0];  // 2025-06-23
        planHoldDate: { type: String, default: null }, // 2025-06-23 // hold ni api ma update
        planResumeDate: { type: String, default: null }, // 2025-06-23  // check if planCurrentDate == planResumeDate to kai nai , nahitar planCurrentDay += 1 , planCurrentDate UPDATE & planHoldDate == null
        activated: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false },
        isBlocked: { type: Boolean, default: false },
        isProfileUpdated: { type: Boolean, default: false },
        refreshToken: { type: String }
    },
    { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('User', userSchema);
