const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
    {
        username: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isDeleted: { type: Boolean, default: false },
        image: { type: String, default: `uploads/${process.env.DEFAULT_ADMIN_IMAGE}` },
        adminType: { type: String, enum: ['Admin', 'Sub Admin'], default: 'Sub Admin' },
        branch: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Branch' }],
            default: []
        }
    },
    { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('Admin', adminSchema);
