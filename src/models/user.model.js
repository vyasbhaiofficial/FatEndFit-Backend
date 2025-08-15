const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        uniqueId: { type: String, required: true, unique: true },
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
        bio: { type: String, default: '' },
        image: { type: String, default: '' },
        fcmToken: { type: String, default: '' },
        isDeleted: { type: Boolean, default: false },
        isBlocked: { type: Boolean, default: false }
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
