const mongoose = require('mongoose');

const commandSchema = new mongoose.Schema(
    {
        type: { type: String, enum: ['text', 'audio'], required: true },
        title: { type: String, required: true },
        description: { type: String },
        audioUrl: { type: String }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Command', commandSchema);
