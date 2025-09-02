const mongoose = require('mongoose');

const referenceSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        mobile: { type: String, required: true },
        relation: { type: String, required: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Reference', referenceSchema);
