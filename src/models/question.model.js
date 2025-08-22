const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
    {
        videoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Video' },
        day: { type: Number }, // for only daily wuestion
        questionText: { type: String, required: true },
        correctAnswer: { type: String }, // Yes No and daily questions answer in number
        type: { type: Number, required: true, enum: [1, 2], default: 1 } // 1 : video question, 2 :  daily wuestion
    },
    {
        timestamps: false,
        versionKey: false
    }
);
module.exports = mongoose.model('Question', questionSchema);
