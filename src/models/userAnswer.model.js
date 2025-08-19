const mongoose = require('mongoose');

const userAnswerSchema = new mongoose.Schema({
    video: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    answers: [
        {
            questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
            answer: { type: String, required: true }, // User's True/False choice
            isCorrect: { type: Boolean, required: true } // Auto-calc at submit
        }
    ],
    score: { type: Number, required: true },
    submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserAnswer', userAnswerSchema);
