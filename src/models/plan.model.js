const mongoose = require('mongoose');

const planSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, uniuqe: true, trim: true },
        description: { type: String, required: true },
        days: { type: Number, required: true, default: 1 },
        isDeleted: { type: Boolean, default: false }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Plan', planSchema);
