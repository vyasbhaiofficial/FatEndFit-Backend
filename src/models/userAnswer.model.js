const mongoose = require('mongoose');

const userAnswerSchema = new mongoose.Schema(
    {
        video: { type: mongoose.Schema.Types.ObjectId, ref: 'Video' },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        day: { type: Number },
        answers: [
            {
                questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
                answer: { type: String, required: true }, // User's Yes/No choice
                isCorrect: { type: Boolean, required: true, default: false } // Auto-calc at submit
            }
        ],
        score: { type: Number },
        submittedAt: { type: Date, default: Date.now }
    },
    {
        timestamps: false,
        versionKey: false
    }
);

module.exports = mongoose.model('UserAnswer', userAnswerSchema);
