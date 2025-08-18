const { db } = require('../models/index.model.js');

// Create Question
exports.createQuestion = async (req, res) => {
    try {
        const { videoId, questionText, correctAnswer } = req.body;

        const question = await db.Question.create({
            videoId,
            questionText,
            correctAnswer
        });

        return RESPONSE.success(res, 201, 8001, question);
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

// Get All Questions
exports.getAllQuestionsByVideoId = async (req, res) => {
    try {
        const { videoId, start, limit } = req.query;
        const options = pagination({ start, limit, role });

        const questions = await db.Question.find({ videoId })
            .sort({ createdAt: -1 })
            .skip(options.skip)
            .limit(options.limit);
        return RESPONSE.success(res, 200, 8002, questions);
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

// Update Question
exports.updateQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;

        const question = await db.Question.findByIdAndUpdate(questionId, req.body, { new: true });
        if (!question) {
            return RESPONSE.error(res, 404, 8003);
        }

        return RESPONSE.success(res, 200, 8005, question);
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

// Delete Question
exports.deleteQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;

        const question = await db.Question.findByIdAndDelete(questionId);
        if (!question) {
            return RESPONSE.error(res, 404, 8003);
        }

        return RESPONSE.success(res, 200, 8006);
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};
