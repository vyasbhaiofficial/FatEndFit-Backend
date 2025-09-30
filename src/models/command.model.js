const mongoose = require('mongoose');

const commandSchema = new mongoose.Schema(
    {
        type: { type: String, enum: ['text', 'audio'], required: true },
        title: { type: String, required: true },
        description: { type: String },
        audioUrl: { type: String },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', index: true },
        createdByRole: { type: String, enum: ['admin', 'subadmin'], required: true, index: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Command', commandSchema);
