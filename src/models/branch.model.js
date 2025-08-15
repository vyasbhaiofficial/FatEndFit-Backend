const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        latitude: { type: String, required: true },
        longitude: { type: String, required: true },
        isDeleted: { type: Boolean, default: false }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Branch', branchSchema);
