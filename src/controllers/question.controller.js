const { db } = require('../models/index.model.js');
const RESPONSE = require('../../utils/response.js');
const { pagination } = require('../../utils/function.js');
const { validateQuestionMultiLanguage, getTextInLanguage } = require('../../utils/languageHelper.js');

// Create Question
exports.createQuestionByVideoId = async (req, res) => {
    try {
        const { videoId } = req.body;

        // Validate multi-language data
        const validation = validateQuestionMultiLanguage(req.body);
        if (!validation.isValid) {
            return RESPONSE.error(res, 400, 8007, validation.errors.join(', '));
        }

        const question = await db.Question.create({
            videoId,
            questionText: validation.data.questionText,
            correctAnswer: validation.data.correctAnswer,
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
        const { section } = req.body;

        // Validate multi-language data
        const validation = validateQuestionMultiLanguage(req.body);
        if (!validation.isValid) {
            return RESPONSE.error(res, 400, 8007, validation.errors.join(', '));
        }

        const question = await db.Question.create({
            questionText: validation.data.questionText,
            correctAnswer: validation.data.correctAnswer,
            section: section || 'first',
            type: 2
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
        const language = req.role === 'user' ? req.preferredLanguage || 'english' : req.query.language || 'english';
        const role = req.role;
        const questions = await db.Question.find({ videoId }).sort({ createdAt: -1 });

        // Transform questions to include language-specific content
        const transformedQuestions = questions.map(question => ({
            ...question.toObject(),
            questionText: getTextInLanguage(question.questionText, language),
            correctAnswer: getTextInLanguage(question.correctAnswer, language),
            // Keep original multi-language data for admin
            ...(role === 'admin' || role === 'subadmin'
                ? {
                      questionTextMultiLang: question.questionText,
                      correctAnswerMultiLang: question.correctAnswer
                  }
                : {})
        }));

        return RESPONSE.success(res, 200, 8002, transformedQuestions);
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

// Get All Questions (Admin only)
exports.getAllQuestions = async (req, res) => {
    try {
        const { type, section, videoId, page = 1, limit = 10 } = req.query;
        const language = req.role === 'user' ? req.preferredLanguage || 'english' : req.query.language || 'english';
        const role = req.role;

        // Build filter
        let filter = {};
        if (type) filter.type = Number(type);
        if (section) filter.section = section;

        // If type is video (1) and videoId is provided, filter by videoId
        if (type && Number(type) === 1 && videoId) {
            filter.videoId = videoId;
        }

        // Calculate pagination
        const skip = (Number(page) - 1) * Number(limit);

        const questions = await db.Question.find(filter)
            .populate('videoId', 'title day type')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const totalQuestions = await db.Question.countDocuments(filter);

        // Transform questions to include language-specific content
        const transformedQuestions = questions.map(question => ({
            ...question.toObject(),
            questionText: getTextInLanguage(question.questionText, language),
            correctAnswer: getTextInLanguage(question.correctAnswer, language),
            // Keep original multi-language data for admin
            ...(role === 'admin' || role === 'subadmin'
                ? {
                      questionTextMultiLang: question.questionText,
                      correctAnswerMultiLang: question.correctAnswer
                  }
                : {})
        }));

        return RESPONSE.success(res, 200, 8002, {
            questions: transformedQuestions,
            pagination: pagination({ start: page, limit: limit, role })
        });
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

// Get All Questions by daily
exports.getAllQuestionsDailyRoutine = async (req, res) => {
    try {
        const { role } = req;
        const { day } = req.query;
        const language = req.role === 'user' ? req.preferredLanguage || 'english' : req.query.language || 'english';

        let firstQuestions = await db.Question.find({ type: 2, section: 'first' }).sort({ createdAt: 1 }).lean();
        let lastQuestions = await db.Question.find({ type: 2, section: 'second' }).sort({ createdAt: 1 }).lean();

        // Transform questions to include language-specific content
        const transformQuestions = questions => {
            return questions.map(q => ({
                ...q,
                questionText: getTextInLanguage(q.questionText, language),
                correctAnswer: getTextInLanguage(q.correctAnswer, language),
                // Keep original multi-language data for admin
                ...(role === 'admin' || role === 'subadmin'
                    ? {
                          questionTextMultiLang: q.questionText,
                          correctAnswerMultiLang: q.correctAnswer
                      }
                    : {})
            }));
        };

        firstQuestions = transformQuestions(firstQuestions);
        lastQuestions = transformQuestions(lastQuestions);

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
        const { videoId } = req.body;

        const question = await db.Question.findById(questionId);

        if (!question) {
            return RESPONSE.error(res, 404, 8003);
        }

        // Check if multi-language data is being updated
        const hasQuestionTextUpdate =
            req.body.questionText_english || req.body.questionText_gujarati || req.body.questionText_hindi;
        const hasCorrectAnswerUpdate =
            req.body.correctAnswer_english || req.body.correctAnswer_gujarati || req.body.correctAnswer_hindi;

        if (hasQuestionTextUpdate || hasCorrectAnswerUpdate) {
            const validation = validateQuestionMultiLanguage(req.body);
            if (!validation.isValid) {
                return RESPONSE.error(res, 400, 8007, validation.errors.join(', '));
            }
            if (hasQuestionTextUpdate) question.questionText = validation.data.questionText;
            if (hasCorrectAnswerUpdate) question.correctAnswer = validation.data.correctAnswer;
        }

        if (question.type == 1 && videoId) {
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
