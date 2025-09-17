const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
    {
        videoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Video' },
        // Multi-language support for question text
        questionText: {
            english: { type: String, required: true },
            gujarati: { type: String, required: true },
            hindi: { type: String, required: true }
        },
        // Multi-language support for correct answer
        correctAnswer: {
            english: { type: String },
            gujarati: { type: String },
            hindi: { type: String }
        },
        type: { type: Number, required: true, enum: [1, 2], default: 1 }, // 1 : video question, 2 :  daily wuestion
        section: { type: String, enum: ['first', 'second'], default: null }
    },
    {
        timestamps: false,
        versionKey: false
    }
);
module.exports = mongoose.model('Question', questionSchema);
