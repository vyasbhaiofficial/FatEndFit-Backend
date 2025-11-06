const mongoose = require('mongoose');

const logSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin',
            required: true
        },
        userType: {
            type: String,
            enum: ['Admin', 'Sub Admin'],
            required: true
        },
        action: {
            type: String,
            enum: ['login', 'panel_open', 'panel_close'],
            required: true
        },
        branch: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Branch',
            default: null
        },
        ipAddress: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true, versionKey: false }
);

// Index for faster queries
logSchema.index({ user: 1, timestamp: -1 });
logSchema.index({ action: 1, timestamp: -1 });
logSchema.index({ userType: 1, timestamp: -1 });

module.exports = mongoose.model('Log', logSchema);
