const mongoose = require('mongoose');

const userVideoProgressSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        videoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
        watchedSeconds: { type: Number, default: 0 }, // how many seconds total watched
        lastWatchedAt: { type: Number, default: 0 }, // last second position in video
        videoSec: { type: Number, default: 0 },
        isCompleted: { type: Boolean, default: false }
    },
    { timestamps: true }
);

module.exports = mongoose.model('UserVideoProgress', userVideoProgressSchema);
