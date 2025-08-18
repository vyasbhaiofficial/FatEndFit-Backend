const { db } = require('../models/index.model.js');

// submit answers
exports.submitAnswers = async (req, res) => {
    try {
        const { videoId, answers } = req.body; // answers = [{ questionId, answer }]
        const userId = req.user.id; // From auth middleware

        const video = await db.Video.findById(videoId);
        if (!video) return RESPONSE.error(res, 404, 7003);

        let correctCount = 0;
        const checkedAnswers = answers.map(a => {
            const q = video.questions.id(a.questionId);
            const isCorrect = q.correctAnswer === a.answer;
            if (isCorrect) correctCount++;
            return {
                questionId: a.questionId,
                answer: a.answer,
                isCorrect
            };
        });

        const report = await db.UserAnswer.create({
            video: videoId,
            user: userId,
            answers: checkedAnswers,
            score: correctCount
        });

        return RESPONSE.success(res, 200, 9001, report);
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};


