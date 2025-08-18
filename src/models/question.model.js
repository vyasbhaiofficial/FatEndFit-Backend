const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    videoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
    questionText: { type: String, required: true },
    correctAnswer: { type: Boolean, required: true }
});
module.exports = mongoose.model('Question', questionSchema);
