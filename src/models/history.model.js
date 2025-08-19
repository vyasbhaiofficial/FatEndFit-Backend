const mongoose = require('mongoose');

const historySchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
        type: { type: Number, enum: [1, 2], required: true, default: 1 } // 1 : plan
    },
    { timestamps: true }
);

module.exports = mongoose.model('History', historySchema);
