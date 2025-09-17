const mongoose = require('mongoose');
const { db } = require('../models/index.model.js');
const RESPONSE = require('../../utils/response.js');
const { getVideoDurationInSeconds } = require('get-video-duration');
const { pagination } = require('../../utils/function.js');
const { validateVideoMultiLanguage, getTextInLanguage } = require('../../utils/languageHelper.js');

// Create Video
exports.createVideo = async (req, res) => {
    try {
        const { videoType, thumbnailType, day, videoSecond, type, category } = req.body;

        // Validate multi-language data
        const validation = validateVideoMultiLanguage(req.body, req.files);
        if (!validation.isValid) {
            return RESPONSE.error(res, 400, 7007, validation.errors.join(', '));
        }

        if (Number(type) === 4 && !category) {
            return RESPONSE.error(res, 400, 1883);
        }

        // Handle multi-language video files
        let videoData = {};
        let videoSizeMB = 0;
        let videoSec = 0;

        if (videoType == 2) {
            // URL-based videos
            videoData = {
                english: req.body.video_english_url || '',
                gujarati: req.body.video_gujarati_url || '',
                hindi: req.body.video_hindi_url || ''
            };

            // Validate URL-based videos
            if (!videoData.english || !videoData.gujarati || !videoData.hindi) {
                return RESPONSE.error(
                    res,
                    400,
                    7008,
                    'Video URLs for all 3 languages (english, gujarati, hindi) are required'
                );
            }

            videoSec = Number(videoSecond) || 0;
        } else {
            // File upload videos - check for individual language files
            const videoFiles = req.files || {};
            console.log('Uploaded files:', Object.keys(videoFiles));
            const englishVideo = videoFiles.video_english?.[0];
            const gujaratiVideo = videoFiles.video_gujarati?.[0];
            const hindiVideo = videoFiles.video_hindi?.[0];

            if (!englishVideo || !gujaratiVideo || !hindiVideo) {
                return RESPONSE.error(
                    res,
                    400,
                    7008,
                    `Video files for all 3 languages are required. Found: ${Object.keys(videoFiles).join(', ')}`
                );
            }

            // Process video files for each language
            videoData = {
                english: englishVideo.path,
                gujarati: gujaratiVideo.path,
                hindi: hindiVideo.path
            };

            // Calculate size and duration from English video
            videoSizeMB = (englishVideo.size / (1024 * 1024)).toFixed(2);
            videoSec = await getVideoDurationInSeconds(englishVideo.path);
        }

        // Handle multi-language thumbnail files
        let thumbnailData = {};

        if (thumbnailType == 2) {
            // URL-based thumbnails
            thumbnailData = {
                english: req.body.thumbnail_english_url || '',
                gujarati: req.body.thumbnail_gujarati_url || '',
                hindi: req.body.thumbnail_hindi_url || ''
            };

            // Validate URL-based thumbnails
            if (!thumbnailData.english || !thumbnailData.gujarati || !thumbnailData.hindi) {
                return RESPONSE.error(
                    res,
                    400,
                    7009,
                    'Thumbnail URLs for all 3 languages (english, gujarati, hindi) are required'
                );
            }
        } else {
            // File upload thumbnails - check for individual language files
            const thumbnailFiles = req.files || {};
            console.log('Thumbnail files:', Object.keys(thumbnailFiles));
            const englishThumbnail = thumbnailFiles.thumbnail_english?.[0];
            const gujaratiThumbnail = thumbnailFiles.thumbnail_gujarati?.[0];
            const hindiThumbnail = thumbnailFiles.thumbnail_hindi?.[0];

            if (!englishThumbnail || !gujaratiThumbnail || !hindiThumbnail) {
                return RESPONSE.error(
                    res,
                    400,
                    7009,
                    `Thumbnail files for all 3 languages are required. Found: ${Object.keys(thumbnailFiles).join(', ')}`
                );
            }

            // Process thumbnail files for each language
            thumbnailData = {
                english: englishThumbnail.path,
                gujarati: gujaratiThumbnail.path,
                hindi: hindiThumbnail.path
            };
        }

        const newVideo = await db.Video.create({
            title: validation.data.title,
            video: videoData,
            videoType,
            thumbnail: thumbnailData,
            thumbnailType,
            description: validation.data.description,
            day: Number(type) == 1 ? day : null,
            type,
            videoSec: Math.round(videoSec),
            videoSize: videoSizeMB,
            ...(category ? { category } : { category: null })
        });

        if (Number(type) === 5) {
            await db.Setting.findOneAndUpdate({}, { resumeLink: newVideo.video.english }, { new: true, upsert: true });
        }

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
        const language = role === 'user' ? req.preferredLanguage || 'english' : req.query.language || 'english';

        const options = pagination({ start, limit, role });
        const videos = await db.Video.find({ isDeleted: false, ...(day && { day }) })
            .populate('category', 'categoryTitle')
            .sort({ createdAt: -1 })
            .skip(options.skip)
            .limit(options.limit);

        // Transform videos to include language-specific content
        const transformedVideos = videos.map(video => ({
            ...video.toObject(),
            title: getTextInLanguage(video.title, language),
            description: getTextInLanguage(video.description, language),
            video: getTextInLanguage(video.video, language),
            thumbnail: getTextInLanguage(video.thumbnail, language),
            // Keep original multi-language data for admin
            ...(role === 'admin' || role === 'subadmin'
                ? {
                      titleMultiLang: video.title,
                      descriptionMultiLang: video.description,
                      videoMultiLang: video.video,
                      thumbnailMultiLang: video.thumbnail
                  }
                : {})
        }));

        return RESPONSE.success(res, 200, 7002, transformedVideos);
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

// Get Video By ID
exports.getVideoById = async (req, res) => {
    try {
        const { videoId } = req.params;
        const language = req.role === 'user' ? req.preferredLanguage || 'english' : req.query.language || 'english';
        const role = req.role;

        const video = await db.Video.findOne({ _id: videoId, isDeleted: false });
        if (!video) {
            return RESPONSE.error(res, 404, 7003);
        }

        // Transform video to include language-specific content
        const transformedVideo = {
            ...video.toObject(),
            title: getTextInLanguage(video.title, language),
            description: getTextInLanguage(video.description, language),
            video: getTextInLanguage(video.video, language),
            thumbnail: getTextInLanguage(video.thumbnail, language),
            // Keep original multi-language data for admin
            ...(role === 'admin' || role === 'subadmin'
                ? {
                      titleMultiLang: video.title,
                      descriptionMultiLang: video.description,
                      videoMultiLang: video.video,
                      thumbnailMultiLang: video.thumbnail
                  }
                : {})
        };

        return RESPONSE.success(res, 200, 7004, transformedVideo);
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

// Update Video
exports.updateVideo = async (req, res) => {
    try {
        const videoId = req.params.videoId;
        const { video, videoType, thumbnail, thumbnailType, day, videoSecond, category } = req.body;

        // Find existing video
        const existingVideo = await db.Video.findById(videoId);
        if (!existingVideo) {
            return RESPONSE.error(res, 404, 7003);
        }

        // Validate multi-language data if provided
        let titleData = existingVideo.title;
        let descriptionData = existingVideo.description;
        let videoData = existingVideo.video;
        let thumbnailData = existingVideo.thumbnail;

        // Check if multi-language data is being updated
        const hasTitleUpdate = req.body.title_english || req.body.title_gujarati || req.body.title_hindi;
        const hasDescriptionUpdate =
            req.body.description_english || req.body.description_gujarati || req.body.description_hindi;
        const hasVideoUpdate =
            req.body.video_english ||
            req.body.video_gujarati ||
            req.body.video_hindi ||
            req.body.video_english_url ||
            req.body.video_gujarati_url ||
            req.body.video_hindi_url;
        const hasThumbnailUpdate =
            req.body.thumbnail_english ||
            req.body.thumbnail_gujarati ||
            req.body.thumbnail_hindi ||
            req.body.thumbnail_english_url ||
            req.body.thumbnail_gujarati_url ||
            req.body.thumbnail_hindi_url;

        if (hasTitleUpdate || hasDescriptionUpdate) {
            const validation = validateVideoMultiLanguage(req.body);
            if (!validation.isValid) {
                return RESPONSE.error(res, 400, 7007, validation.errors.join(', '));
            }
            if (hasTitleUpdate) titleData = validation.data.title;
            if (hasDescriptionUpdate) descriptionData = validation.data.description;
        }

        // Handle video updates
        if (hasVideoUpdate) {
            if (videoType == 2) {
                // URL-based videos
                videoData = {
                    english: req.body.video_english_url || existingVideo.video.english,
                    gujarati: req.body.video_gujarati_url || existingVideo.video.gujarati,
                    hindi: req.body.video_hindi_url || existingVideo.video.hindi
                };
            } else {
                // File upload videos
                const videoFiles = req.files || {};
                const englishVideo = videoFiles.video_english?.[0];
                const gujaratiVideo = videoFiles.video_gujarati?.[0];
                const hindiVideo = videoFiles.video_hindi?.[0];

                if (englishVideo) videoData.english = englishVideo.path;
                if (gujaratiVideo) videoData.gujarati = gujaratiVideo.path;
                if (hindiVideo) videoData.hindi = hindiVideo.path;
            }
        }

        // Handle thumbnail updates
        if (hasThumbnailUpdate) {
            if (thumbnailType == 2) {
                // URL-based thumbnails
                thumbnailData = {
                    english: req.body.thumbnail_english_url || existingVideo.thumbnail.english,
                    gujarati: req.body.thumbnail_gujarati_url || existingVideo.thumbnail.gujarati,
                    hindi: req.body.thumbnail_hindi_url || existingVideo.thumbnail.hindi
                };
            } else {
                // File upload thumbnails
                const thumbnailFiles = req.files || {};
                const englishThumbnail = thumbnailFiles.thumbnail_english?.[0];
                const gujaratiThumbnail = thumbnailFiles.thumbnail_gujarati?.[0];
                const hindiThumbnail = thumbnailFiles.thumbnail_hindi?.[0];

                if (englishThumbnail) thumbnailData.english = englishThumbnail.path;
                if (gujaratiThumbnail) thumbnailData.gujarati = gujaratiThumbnail.path;
                if (hindiThumbnail) thumbnailData.hindi = hindiThumbnail.path;
            }
        }

        let updatedData = {
            title: titleData,
            video: videoData,
            videoType: videoType ?? existingVideo.videoType,
            thumbnail: thumbnailData,
            thumbnailType: thumbnailType ?? existingVideo.thumbnailType,
            description: descriptionData,
            day: day ?? existingVideo.day,
            category: category ?? existingVideo.category
        };

        // Handle video size and duration updates
        if (hasVideoUpdate && videoType == 2) {
            updatedData.videoSec = Number(videoSecond) ?? existingVideo.videoSec;
        } else if (hasVideoUpdate && videoType == 1) {
            // Recalculate size & duration for file uploads
            const videoFiles = req.files || {};
            const englishVideo = videoFiles.video_english?.[0];
            if (englishVideo) {
                const videoSize = englishVideo.size; // bytes
                updatedData.videoSize = (videoSize / (1024 * 1024)).toFixed(2); // MB
                updatedData.videoSec = await getVideoDurationInSeconds(englishVideo.path);
            }
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
        const language = role === 'user' ? req.preferredLanguage || 'english' : req.query.language || 'english';
        let day = req.query.day;
        if (type == 2) day = null;
        const userId = req.user.id;
        const options = pagination({ start, limit, role });

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

        // Transform videos to include language-specific content
        const transformedVideos = videos.map(video => ({
            ...video,
            title: getTextInLanguage(video.title, language),
            description: getTextInLanguage(video.description, language),
            video: getTextInLanguage(video.video, language),
            thumbnail: getTextInLanguage(video.thumbnail, language)
        }));

        return RESPONSE.success(res, 200, 7002, transformedVideos);
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};
