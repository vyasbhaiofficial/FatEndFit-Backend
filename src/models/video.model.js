const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        video: { type: String, required: true },
        description: { type: String, default: '' },
        videoType: { type: Number, required: true, enum: [1, 2], default: 1 }, // 1 : video, 2 : link
        thumbnail: { type: String, required: true },
        thumbnailType: { type: Number, required: true, enum: [1, 2], default: 1 }, // 1 : image, 2 : link
        day: { type: Number, required: true }, // 0 , 1, 2 // day wise videoes multiple
        isDeleted: { type: Boolean, default: false },
        videoSec: { type: Number, default: 0 },
        videoSize: { type: Number, default: 0 },
        type: { type: Number, required: true, enum: [1, 2], default: 1 } // 1 : video day wise , 2 : webinar in live section
    },
    { timestamps: true }
);
module.exports = mongoose.model('Video', videoSchema);
