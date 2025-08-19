const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    videoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
    questionText: { type: String, required: true },
    correctAnswer: { type: String, enum: ['Yes', 'No'], required: true, default: 'Yes' }
});
module.exports = mongoose.model('Question', questionSchema);
