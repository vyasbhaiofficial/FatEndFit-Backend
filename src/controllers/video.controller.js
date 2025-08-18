const { db } = require('../models/index.model.js');
const RESPONSE = require('../../utils/response.js');
const { getVideoDurationInSeconds } = require('get-video-duration');
const { pagination } = require('../../utils/function.js');

// Create Video
exports.createVideo = async (req, res) => {
    try {
        const { title, video, videoType, thumbnail, thumbnailType, description, day } = req.body;

        // thumbnailType == 2 && (thumbnail = req.body.thumbnail)
        // thumbnailType == 1 && (thumbnail = req.file.path);

        // File size in bytes
        const videoSize = req.file.size; // bytes
        const videoSizeMB = (videoSize / (1024 * 1024)).toFixed(2); // MB

        // Duration in seconds
        const videoSec = await getVideoDurationInSeconds(req.file.path);

        const imageFile = req.files?.image?.[0]?.path || undefined;
        const videoFile = req.files?.video?.[0]?.path || undefined;

        const newVideo = await db.Video.create({
            title,
            video: videoType == 2 ? video : videoFile,
            videoType,
            thumbnail: thumbnailType == 2 ? thumbnail : imageFile,
            thumbnailType,
            description,
            day,
            videoSec,
            videoSize: videoSizeMB
        });

        return RESPONSE.success(res, 201, 7001, newVideo);
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

// Get All Videos
exports.getAllVideos = async (req, res) => {
    try {
        const role = req.role;
        const { day, start, limit } = req.query;

        const options = pagination({ start, limit, role });
        const videos = await db.Video.find({ isDeleted: false, ...(day && { day }) })
            .sort({ createdAt: -1 })
            .skip(options.skip)
            .limit(options.limit);

        return RESPONSE.success(res, 200, 7002, videos);
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

// Get Video By ID
exports.getVideoById = async (req, res) => {
    try {
        const { videoId } = req.params;

        const video = await db.Video.findOne({ _id: videoId, isDeleted: false }); // @todo
        if (!video) {
            return RESPONSE.error(res, 404, 7003);
        }

        return RESPONSE.success(res, 200, 7004, video);
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

// Update Video
exports.updateVideo = async (req, res) => {
    try {
        const videoId = req.params.id;
        const { title, video, videoType, thumbnail, thumbnailType, description, day } = req.body;

        // Find existing video
        const existingVideo = await db.Video.findById(videoId);
        if (!existingVideo) {
            return RESPONSE.error(res, 404, 7003);
        }

        let updatedData = {
            title: title ?? existingVideo.title,
            videoType: videoType ?? existingVideo.videoType,
            thumbnailType: thumbnailType ?? existingVideo.thumbnailType,
            description: description ?? existingVideo.description,
            day: day ?? existingVideo.day
        };

        // Handle video file update
        let videoFile = req.files?.video?.[0]?.path;
        if (videoType == 2) {
            updatedData.video = video ?? existingVideo.video; // URL from body
        } else if (videoFile) {
            updatedData.video = videoFile;

            // Recalculate size & duration
            const videoSize = req.files.video[0].size; // bytes
            updatedData.videoSize = (videoSize / (1024 * 1024)).toFixed(2); // MB
            updatedData.videoSec = await getVideoDurationInSeconds(videoFile);
        }

        // Handle thumbnail file update
        let imageFile = req.files?.image?.[0]?.path;
        if (thumbnailType == 2) {
            updatedData.thumbnail = thumbnail ?? existingVideo.thumbnail; // URL from body
        } else if (imageFile) {
            updatedData.thumbnail = imageFile;
        }

        // Update video
        const updatedVideo = await db.Video.findByIdAndUpdate(videoId, updatedData, { new: true });

        return RESPONSE.success(res, 200, 7005, updatedVideo);
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

// Delete Video (Soft Delete)
exports.deleteVideo = async (req, res) => {
    try {
        const { videoId } = req.params;

        const video = await db.Video.findOneAndUpdate(
            { _id: videoId, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );

        if (!video) {
            return RESPONSE.error(res, 404, 7003);
        }

        return RESPONSE.success(res, 200, 7006);
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};
