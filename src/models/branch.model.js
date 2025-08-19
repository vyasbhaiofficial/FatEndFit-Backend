const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
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
        latitude: { type: String, required: true },
        longitude: { type: String, required: true },
        isDeleted: { type: Boolean, default: false }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Branch', branchSchema);
