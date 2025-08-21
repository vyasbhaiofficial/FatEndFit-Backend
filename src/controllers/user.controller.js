const mongoose = require('mongoose');
const { db } = require('../models/index.model.js');
const jwt = require('jsonwebtoken');
const RESPONSE = require('../../utils/response.js');
const { generateOTP, generatePatientId, sendOTP } = require('../../utils/function.js');

exports.login = async (req, res) => {
    try {
        const { mobileNumber, fcmToken } = req.body;
        let token = null;
        let user;
        user = await db.User.findOne({ mobileNumber });
        if (!user) {
            return RESPONSE.error(res, 404, 3001);
        }

        if (fcmToken) user.fcmToken = fcmToken;
        await user.save();

        token = jwt.sign(
            { id: user._id, mobileNumber: user.mobileNumber, role: 'user' },
            process.env.JWT_SECRET, // use env secret
            { expiresIn: '7d' }
        );

        // const OTP = generateOTP();

        const OTP = 1234;
        // sendOTP({ OTP, mobileNumber }); // @todo

        return RESPONSE.success(res, 200, 1001, { user, OTP, token });
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

// add user by admin
exports.addUser = async (req, res) => {
    try {
        const { name, mobilePrefix, mobileNumber, branchId, planId } = req.body;

        const [existingUser, branch, plan] = await Promise.all([
            db.User.exists({ mobileNumber }),
            db.Branch.exists({ _id: branchId }),
            db.Plan.exists({ _id: planId })
        ]);
        if (existingUser) {
            return RESPONSE.error(res, 400, 3002);
        }
        if (!branch || !plan) {
            return RESPONSE.error(res, 404, 3003);
        }

        const user = await db.User.create({
            name,
            mobilePrefix,
            mobileNumber,
            branch: branchId,
            plan: planId,
            patientId: await generatePatientId()
        });

        return RESPONSE.success(res, 201, 1001, user);
    } catch (err) {
        console.log('err', err);
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

// update user by admin
exports.updateUserByAdmin = async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, mobilePrefix, mobileNumber, branchId, planId } = req.body;

        const [existingUser, branch, plan, user] = await Promise.all([
            db.User.exists({ mobileNumber, _id: { $ne: userId } }),
            db.Branch.exists({ _id: branchId }),
            db.Plan.exists({ _id: planId }),
            db.User.findOne({ _id: userId })
        ]);
        if (existingUser) {
            return RESPONSE.error(res, 400, 3002);
        }
        if (!branch || !plan) {
            return RESPONSE.error(res, 404, 3003);
        }
        if (!user) {
            return RESPONSE.error(res, 404, 3001);
        }
        if (name) user.name = name;
        if (mobilePrefix) user.mobilePrefix = mobilePrefix;
        if (mobileNumber) user.mobileNumber = mobileNumber;
        if (branchId) user.branch = branchId;
        if (planId) user.plan = planId;
        await user.save();

        return RESPONSE.success(res, 200, 1001, user);
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

// update user by user
exports.updateUserByUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            name,
            surname,
            fcmToken,
            gender,
            age,
            height,
            weight,
            language,
            medicalDescription,
            city,
            state,
            country
        } = req.body;

        const user = await db.User.findOne({ _id: userId });
        if (!user) {
            return RESPONSE.error(res, 404, 3001);
        }
        if (name) user.name = name;
        if (fcmToken) user.fcmToken = fcmToken;
        if (surname) user.surname = surname;
        if (gender) user.gender = gender;
        if (age) user.age = age;
        if (height) user.height = height;
        if (weight) user.weight = weight;
        if (language) user.language = language;
        if (medicalDescription) user.medicalDescription = medicalDescription;
        if (city) user.city = city;
        if (state) user.state = state;
        if (country) user.country = country;
        if (req.file) user.image = req.file.path;
        user.isProfileUpdated = true;
        await user.save();

        return RESPONSE.success(res, 200, 1001, user);
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

// get profileby User
exports.getProfileByUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await db.User.findOne({ _id: userId });
        if (!user) {
            return RESPONSE.error(res, 404, 3001);
        }
        return RESPONSE.success(res, 200, 1001, user);
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

// get first page day by progress
exports.getFirstPageDayWiseProgress = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await db.User.findOne({ _id: userId }).select('planCurrentDay');
        const maxDay = parseInt(user.planCurrentDay);
        let videoProgress = await db.Video.aggregate([
            {
                $match: {
                    isDeleted: false,
                    day: { $lte: maxDay }
                }
            },
            {
                $lookup: {
                    from: 'uservideoprogresses', // 👈 collection name (check in Mongo)
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
                        }
                    ],
                    as: 'progress'
                }
            },
            {
                $addFields: {
                    watchedSeconds: { $ifNull: [{ $arrayElemAt: ['$progress.watchedSeconds', 0] }, 0] },
                    progressPercent: {
                        $cond: [
                            { $gt: ['$videoSec', 0] },
                            {
                                $round: [
                                    {
                                        $multiply: [
                                            {
                                                $divide: [
                                                    { $ifNull: [{ $arrayElemAt: ['$progress.watchedSeconds', 0] }, 0] },
                                                    '$videoSec'
                                                ]
                                            },
                                            100
                                        ]
                                    },
                                    0
                                ]
                            },
                            0
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: '$day',
                    firstThumbnail: { $first: '$thumbnail' },
                    totalVideoSec: { $sum: '$videoSec' },
                    totalWatched: { $sum: '$watchedSeconds' }
                }
            },
            {
                $addFields: {
                    dayProgressPercent: {
                        $cond: [
                            { $gt: ['$totalVideoSec', 0] },
                            { $round: [{ $multiply: [{ $divide: ['$totalWatched', '$totalVideoSec'] }, 100] }, 0] },
                            0
                        ]
                    }
                }
            },
            { $sort: { _id: -1 } }, // latest day first
            { $project: { day: '$_id', _id: 0, firstThumbnail: 1, dayProgressPercent: 1 } }
        ]);

        // 2) Create full range of days [maxDay..1]
        const fullDays = Array.from({ length: maxDay }, (_, i) => ({
            day: maxDay - i,
            firstThumbnail: null,
            dayProgressPercent: 0
        }));

        // 3) Merge aggregation results into fullDays
        const progress = fullDays.map(d => {
            const found = videoProgress.find(p => p.day === d.day);
            return found ? found : d;
        });

        return RESPONSE.success(res, 200, 1001, {
            progress,
            isHold: user.planHoldDate ? true : false
        });
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

// update fcm token
exports.updateFcmToken = async (req, res) => {
    try {
        const userId = req.user.id;
        const { fcmToken } = req.body;
        const user = await db.User.findById(userId);
        if (!user) {
            return RESPONSE.error(res, 404, 3001);
        }
        user.fcmToken = fcmToken;
        await user.save();
        return RESPONSE.success(res, 200, 1001, user);
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};
