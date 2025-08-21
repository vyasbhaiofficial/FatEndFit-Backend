const { db } = require('../models/index.model.js');
const RESPONSE = require('../../utils/response.js');

// POST /progress/update
exports.updateProgress = async (req, res) => {
    try {
        const { videoId, currentTime } = req.body;
        const userId = req.user.id;
        let [videoDuration, progress] = await Promise.all([
            db.Video.findOne({ _id: videoId }).select('videoSec'),
            db.UserVideoProgress.findOne({ userId, videoId })
        ]);
        if (currentTime > videoDuration.videoSec) {
            return RESPONSE.error(res, 400, 1202);
        }
        if (!progress) {
            progress = new db.UserVideoProgress({
                userId,
                videoId,
                watchedSeconds: currentTime,
                lastWatchedAt: currentTime,
                videoSec: videoDuration.videoSec
            });
        } else {
            // Only increase watchedSeconds if moving forward
            if (currentTime > progress.lastWatchedAt) {
                progress.watchedSeconds += currentTime - progress.lastWatchedAt;
            }
            progress.lastWatchedAt = currentTime;
        }

        // Mark completed if 90% watched (for example)
        if (progress.watchedSeconds >= 0.95 * videoDuration?.videoSec) {
            progress.isCompleted = true;
        }

        await progress.save();

        return RESPONSE.success(res, 200, 1201, progress);
    } catch (err) {
        console.log('err', err);
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};
