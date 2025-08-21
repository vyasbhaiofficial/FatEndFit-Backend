const { db } = require('../models/index.model.js');
const RESPONSE = require('../../utils/response.js');

// submit answers
exports.submitAnswers = async (req, res) => {
    try {
        const { videoId, answers } = req.body; // answers = [{ questionId, answer }]
        const userId = req.user.id; // From auth middleware

        //  Check if video exists
        const [video, userAnswer] = await Promise.all([
            db.Video.findById(videoId),
            db.UserAnswer.exists({ video: videoId, user: userId })
        ]);
        if (!video) return RESPONSE.error(res, 404, 7003);
        if (userAnswer) return RESPONSE.error(res, 400, 9007);

        let correctCount = 0;

        //  Loop through answers and check against Question collection
        const checkedAnswers = await Promise.all(
            answers.map(async a => {
                const question = await db.Question.findById(a.questionId);
                if (!question) {
                    return {
                        questionId: a.questionId,
                        answer: a.answer,
                        isCorrect: false // treat missing question as wrong
                    };
                }

                // NOTE: your Question.correctAnswer is stored as "Yes" | "No" (String)
                // but your UserAnswer.answer is Boolean. Let's normalize:
                const isCorrect = question.correctAnswer === (a.answer ? 'Yes' : 'No');

                if (isCorrect) correctCount++;

                return {
                    questionId: a.questionId,
                    answer: a.answer, // Boolean value
                    isCorrect
                };
            })
        );

        //  Save user’s attempt
        const report = await db.UserAnswer.create({
            video: videoId,
            user: userId,
            answers: checkedAnswers,
            score: correctCount
        });

        return RESPONSE.success(res, 200, 9001, report);
    } catch (err) {
        console.log(err, '---------------------');
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};
