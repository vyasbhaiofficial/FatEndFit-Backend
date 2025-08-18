const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, default: 'New User' },
        surname: { type: String, trim: true, default: '' },
        patientId: { type: Number, required: true, unique: true },
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
        age: { type: Number, required: true, min: 18, default: 18 },
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
        activated: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false },
        isBlocked: { type: Boolean, default: false }
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
