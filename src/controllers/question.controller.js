const { db } = require('../models/index.model.js');
const RESPONSE = require('../../utils/response.js');
const { pagination } = require('../../utils/function.js');

// Create Question
exports.createQuestionByVideoId = async (req, res) => {
    try {
        const { videoId, questionText, correctAnswer } = req.body;

        const question = await db.Question.create({
            videoId,
            questionText,
            correctAnswer,
            type: 1
        });

        return RESPONSE.success(res, 201, 8001, question);
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

// Create Question daily
exports.createQuestionDaily = async (req, res) => {
    try {
        const { questionText, section } = req.body;

        const question = await db.Question.create({
            questionText,
            section: section || 'first',
            type: 2,
            userAnswer
        });

        return RESPONSE.success(res, 201, 8001, question);
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

// Get All Questions
exports.getAllQuestionsByVideoId = async (req, res) => {
    try {
        const { videoId } = req.query;
        const questions = await db.Question.find({ videoId }).sort({ createdAt: -1 });
        return RESPONSE.success(res, 200, 8002, questions);
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

// Get All Questions by daily
exports.getAllQuestionsDailyRoutine = async (req, res) => {
    try {
        const { role } = req;
        const { day } = req.query; // @todo swagger

        let firstQuestions = await db.Question.find({ type: 2, section: 'first' }).sort({ createdAt: 1 }).lean();
        let lastQuestions = await db.Question.find({ type: 2, section: 'second' }).sort({ createdAt: 1 }).lean();

        if (role == 'user') {
            const { id: userId } = req.user;
            const userAnswer = await db.UserAnswer.findOne({ user: userId, day }).sort({
                createdAt: -1
            });

            if (userAnswer) {
                const questionIds = userAnswer.answers.map(a => a.questionId.toString());

                const markAnswers = questions => {
                    questions.forEach(q => {
                        q.answer = '';
                        if (questionIds.includes(q._id.toString())) {
                            q.answer = userAnswer.answers.find(
                                a => a.questionId.toString() == q._id.toString()
                            )?.answer;
                        }
                    });
                };
                markAnswers(firstQuestions);
                markAnswers(lastQuestions);
            } else {
                firstQuestions = firstQuestions.map(q => {
                    q.answer = '';
                    return q;
                });
                lastQuestions = lastQuestions.map(q => {
                    q.answer = '';
                    return q;
                });
            }
        }

        return RESPONSE.success(res, 200, 8002, {
            firstQuestions,
            lastQuestions
        });
    } catch (err) {
        console.log('err', err);
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

// Update Question
exports.updateQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const { questionText, correctAnswer, videoId } = req.body;

        const question = await db.Question.findById(questionId);

        if (!question) {
            return RESPONSE.error(res, 404, 8003);
        }
        question.questionText = questionText ? questionText : question.questionText;

        if (question.type == 1 && videoId) {
            question.correctAnswer = correctAnswer ? correctAnswer : question.correctAnswer;
            question.videoId = videoId;
        }

        await question.save();
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
