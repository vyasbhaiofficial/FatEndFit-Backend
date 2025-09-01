const mongoose = require('mongoose');
const { db } = require('../models/index.model.js');
const RESPONSE = require('../../utils/response.js');
const { getVideoDurationInSeconds } = require('get-video-duration');
const { pagination } = require('../../utils/function.js');

// Create Video
exports.createVideo = async (req, res) => {
    try {
        const { title, video, videoType, thumbnail, thumbnailType, description, day, videoSecond, type, category } =
            req.body;

        if (Number(type) === 4 && !category) {
            return RESPONSE.error(res, 400, 1883);
        }

        // thumbnailType == 2 && (thumbnail = req.body.thumbnail)
        // thumbnailType == 1 && (thumbnail = req.file.path);
        // type == 1 , 2 if type 1 then day required

        // File size in bytes
        const videoSize = req.files?.video[0].size; // bytes
        const videoSizeMB = (videoSize / (1024 * 1024)).toFixed(2); // MB
        // Duration in seconds
        const videoSec = await getVideoDurationInSeconds(req.files?.video[0].path);

        const imageFile = req.files?.thumbnail?.[0]?.path || undefined;
        const videoFile = req.files?.video?.[0]?.path || undefined;
        console.log('------------------', req.body);
        if (category) {
            console.log('------------------', req.body);
        }
        const newVideo = await db.Video.create({
            title,
            video: videoType == 2 ? video : videoFile,
            videoType,
            thumbnail: thumbnailType == 2 ? thumbnail : imageFile,
            thumbnailType,
            description,
            day: Number(type) == 1 ? day : null,
            type,
            videoSec: videoType == 2 ? Number(videoSecond) : Math.round(videoSec),
            videoSize: videoSizeMB,
            ...(category ? { category } : { category: null })
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
        const { day, start = 1, limit = 20 } = req.query;

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
        const videoId = req.params.videoId;
        const { title, video, videoType, thumbnail, thumbnailType, description, day, videoSecond, category } = req.body;
        console.log('-----------------------------------', req.body);

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
            day: day ?? existingVideo.day,
            category: category ?? existingVideo.category
        };

        // Handle video file update
        let videoFile = req.files?.video?.[0]?.path;
        if (videoType == 2) {
            updatedData.video = video ?? existingVideo.video; // URL from body
            updatedData.videoSec = Number(videoSecond) ?? existingVideo.videoSec;
        } else if (videoFile) {
            updatedData.video = videoFile;

            // Recalculate size & duration
            const videoSize = req.files.video[0].size; // bytes
            updatedData.videoSize = (videoSize / (1024 * 1024)).toFixed(2); // MB
            updatedData.videoSec = await getVideoDurationInSeconds(videoFile);
        }

        // Handle thumbnail file update
        let imageFile = req.files?.thumbnail?.[0]?.path;
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

// Get All Videos
exports.getAllVideosByUser = async (req, res) => {
    try {
        const role = req.role;
        const { start = 0, limit = 20, type = 1 } = req.query;
        let day = req.query.day;
        if (type == 2) day = null;
        const userId = req.user.id;
        const options = pagination({ start, limit, role });
        console.log(day);

        const videos = await db.Video.aggregate([
            { $match: { isDeleted: false, type: Number(type), ...(day && { day: Number(day) }) } },
            { $sort: { createdAt: -1 } },
            { $skip: options.skip },
            { $limit: options.limit },
            {
                $lookup: {
                    from: 'uservideoprogresses', // ✅ correct collection name
                    let: { videoId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$videoId', '$$videoId'] },
                                        { $eq: ['$userId', new mongoose.Types.ObjectId(userId)] }
                                    ]
                                }
                            }
                        },
                        { $project: { watchedSeconds: 1, lastWatchedAt: 1, isCompleted: 1, _id: 0 } }
                    ],
                    as: 'userVideoProgress'
                }
            },
            // lookup on userAnswer table
            {
                $lookup: {
                    from: 'useranswers',
                    let: { videoId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$video', '$$videoId'] },
                                        { $eq: ['$user', new mongoose.Types.ObjectId(userId)] }
                                    ]
                                }
                            }
                        },
                        { $project: { _id: 1 } }
                    ],
                    as: 'userAnswer'
                }
            },
            {
                $addFields: {
                    userAnswer: {
                        $cond: [
                            { $eq: [{ $size: '$userAnswer' }, 0] }, // if no answers found
                            false,
                            true // → answered
                        ]
                    }
                }
            },
            {
                $addFields: {
                    userVideoProgress: {
                        $cond: [
                            { $eq: [{ $size: '$userVideoProgress' }, 0] },
                            { watchedSeconds: 0, lastWatchedAt: 0, isCompleted: false },
                            { $first: '$userVideoProgress' }
                        ]
                    }
                }
            }
        ]);

        return RESPONSE.success(res, 200, 7002, videos);
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};
