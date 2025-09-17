const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
    {
        // Multi-language support for title
        title: {
            english: { type: String, required: true },
            gujarati: { type: String, required: true },
            hindi: { type: String, required: true }
        },
        // Multi-language support for video
        video: {
            english: { type: String, required: true },
            gujarati: { type: String, required: true },
            hindi: { type: String, required: true }
        },
        // Multi-language support for description
        description: {
            english: { type: String, default: '' },
            gujarati: { type: String, default: '' },
            hindi: { type: String, default: '' }
        },
        videoType: { type: Number, required: true, enum: [1, 2], default: 1 }, // 1 : video, 2 : link
        // Multi-language support for thumbnail
        thumbnail: {
            english: { type: String, required: true },
            gujarati: { type: String, required: true },
            hindi: { type: String, required: true }
        },
        thumbnailType: { type: Number, required: true, enum: [1, 2], default: 1 }, // 1 : image, 2 : link
        day: { type: Number, default: null }, // 0 , 1, 2 // day wise videoes multiple
        isDeleted: { type: Boolean, default: false },
        videoSec: { type: Number, default: 0 },
        videoSize: { type: Number, default: 0 },
        type: {
            type: Number,
            required: true,
            enum: [1, 2, 3, 4, 5], // 1 : video day wise //2 : webinar (live section) // 3 : testimonial video // 4: category wise //5:setting vedio
            default: 1
        },
        category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: '' } // if type 4 then required
    },
    { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('Video', videoSchema);
