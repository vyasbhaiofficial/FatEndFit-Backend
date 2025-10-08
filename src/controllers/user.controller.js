const mongoose = require('mongoose');
const { db } = require('../models/index.model.js');
const jwt = require('jsonwebtoken');
const RESPONSE = require('../../utils/response.js');
const { generateOTP, generatePatientId, sendOTP } = require('../../utils/function.js');
const { sendNotificationEmail } = require('../../utils/email.js');

exports.login = async (req, res) => {
    try {
        const { mobileNumber, fcmToken } = req.body;

        let user = await db.User.findOne({ mobileNumber });
        if (!user) {
            return RESPONSE.error(res, 404, 3001);
        }

        if (fcmToken) user.fcmToken = fcmToken;
        if (!user.activated) {
            user.activated = true;
            user.planCurrentDay = 1;
            user.planCurrentDate = new Date().toISOString().split('T')[0];
        }

        // Access token (short expiry)
        const accessToken = jwt.sign(
            { id: user._id, mobileNumber: user.mobileNumber, role: 'user' },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        // Refresh token (long expiry)
        const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

        user.refreshToken = refreshToken;
        await user.save();

        const OTP = 1234; // @todo: real OTP

        return RESPONSE.success(res, 200, 1001, { user, OTP, accessToken, refreshToken });
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

// add user by admin
exports.addUser = async (req, res) => {
    try {
        const { name, mobilePrefix, mobileNumber, branchId, planId } = req.body;

        const [existingActiveUser, existingDeletedUser, branch, plan] = await Promise.all([
            db.User.findOne({ mobileNumber, isDeleted: false }),
            db.User.findOne({ mobileNumber, isDeleted: true }),
            db.Branch.exists({ _id: branchId }),
            db.Plan.exists({ _id: planId })
        ]);
        if (existingActiveUser) {
            return RESPONSE.error(res, 400, 3002);
        }
        if (!branch || !plan) {
            return RESPONSE.error(res, 404, 3003);
        }

        // Sub Admins can only add users to their assigned branches
        if (req.role === 'subadmin') {
            const adminDoc = await db.Admin.findById(req.admin?.id).select('branch');
            if (!adminDoc) {
                return RESPONSE.error(res, 403, 2003);
            }
            const allowedBranchIds = (adminDoc.branch || []).map(id => String(id));
            if (!allowedBranchIds.includes(String(branchId))) {
                return RESPONSE.error(res, 403, 4444, 'Not allowed to add user in this branch');
            }
        }

        let user;
        if (existingDeletedUser) {
            // Revive soft-deleted user with new details
            existingDeletedUser.name = name;
            existingDeletedUser.mobilePrefix = mobilePrefix;
            existingDeletedUser.mobileNumber = mobileNumber;
            existingDeletedUser.branch = branchId;
            existingDeletedUser.plan = planId;
            existingDeletedUser.isDeleted = false;
            if (!existingDeletedUser.patientId) {
                existingDeletedUser.patientId = await generatePatientId(branchId);
            }
            await existingDeletedUser.save();
            user = existingDeletedUser;
        } else {
            user = await db.User.create({
                name,
                mobilePrefix,
                mobileNumber,
                branch: branchId,
                plan: planId,
                patientId: await generatePatientId(branchId)
            });
        }

        await db.History.create({
            user: user._id,
            plan: planId,
            type: 1
        });

        // notify admins if created by subadmin
        if (req.role === 'subadmin') {
            const admins = await db.Admin.find({ adminType: 'Admin', isDeleted: false }).select('email');
            const to = admins.map(a => a.email).filter(Boolean);
            if (to.length) {
                const { renderSubadminActionEmail } = require('../../utils/email.js');
                const html = renderSubadminActionEmail({
                    heading: 'User Created',
                    actor: req.admin?.username || req.admin?.email,
                    intro: 'A sub admin created or reactivated a user.',
                    items: [
                        { label: 'Name', value: name },
                        { label: 'Mobile', value: `${mobilePrefix} ${mobileNumber}` }
                    ]
                });
                await sendNotificationEmail({ to, subject: 'Sub Admin created a user', html });
            }
        }

        return RESPONSE.success(res, 201, 1001, user);
    } catch (err) {
        console.log('err', err);
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

//get All user in admin
exports.getAllUsers = async (req, res) => {
    try {
        let filter = {};
        if (req.role === 'subadmin') {
            const adminDoc = await db.Admin.findById(req.admin?.id).select('branch');
            if (!adminDoc) {
                return RESPONSE.error(res, 403, 2003);
            }
            const allowedBranchIds = adminDoc.branch || [];
            filter.branch = { $in: allowedBranchIds };
        }
        const users = await db.User.find(filter).populate('branch', 'name').populate('plan', 'name');
        return RESPONSE.success(res, 200, 1001, users);
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

// update user by admin
exports.updateUserByAdmin = async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, mobilePrefix, mobileNumber, branchId, planId, isDeleted } = req.body;

        const [existingActiveUser, branch, plan, user] = await Promise.all([
            db.User.findOne({ mobileNumber, _id: { $ne: userId }, isDeleted: false }),
            db.Branch.exists({ _id: branchId }),
            db.Plan.exists({ _id: planId }),
            db.User.findOne({ _id: userId })
        ]);
        if (existingActiveUser) {
            return RESPONSE.error(res, 400, 3002);
        }
        if (!branch || !plan) {
            return RESPONSE.error(res, 404, 3003);
        }
        if (!user) {
            return RESPONSE.error(res, 404, 3001);
        }
        // Sub Admins can only update users within their assigned branches
        if (req.role === 'subadmin') {
            const adminDoc = await db.Admin.findById(req.admin?.id).select('branch');
            if (!adminDoc) {
                return RESPONSE.error(res, 403, 2003);
            }
            const allowedBranchIds = (adminDoc.branch || []).map(id => String(id));
            if (branchId && !allowedBranchIds.includes(String(branchId))) {
                return RESPONSE.error(res, 403, 4444, 'Not allowed to assign this branch');
            }
            if (!branchId && user.branch && !allowedBranchIds.includes(String(user.branch))) {
                return RESPONSE.error(res, 403, 4444, 'Not allowed to update user outside your branches');
            }
        }
        if (name) user.name = name;
        if (mobilePrefix) user.mobilePrefix = mobilePrefix;
        if (mobileNumber) user.mobileNumber = mobileNumber;
        if (branchId) user.branch = branchId;
        if (planId) user.plan = planId;
        if (isDeleted !== undefined) user.isDeleted = isDeleted;
        await user.save();
        // notify admins if updated by subadmin (differentiate delete/restore/update)
        if (req.role === 'subadmin') {
            const admins = await db.Admin.find({ adminType: 'Admin', isDeleted: false }).select('email');
            const to = admins.map(a => a.email).filter(Boolean);
            if (to.length) {
                const { renderSubadminActionEmail } = require('../../utils/email.js');
                let heading = 'User Updated';
                let intro = 'A sub admin updated a user.';
                let subject = 'Sub Admin updated a user';
                if (req.body && Object.prototype.hasOwnProperty.call(req.body, 'isDeleted')) {
                    if (req.body.isDeleted === true) {
                        heading = 'User Deleted';
                        intro = 'A sub admin soft-deleted a user.';
                        subject = 'Sub Admin deleted a user';
                    } else if (req.body.isDeleted === false) {
                        heading = 'User Restored';
                        intro = 'A sub admin restored a previously deleted user.';
                        subject = 'Sub Admin restored a user';
                    }
                }
                const html = renderSubadminActionEmail({
                    heading,
                    actor: req.admin?.username || req.admin?.email,
                    intro,
                    items: [
                        { label: 'User ID', value: userId },
                        { label: 'Name', value: user.name },
                        ...(Object.prototype.hasOwnProperty.call(req.body || {}, 'isDeleted')
                            ? [{ label: 'isDeleted', value: String(req.body.isDeleted) }]
                            : [])
                    ]
                });
                await sendNotificationEmail({ to, subject, html });
            }
        }
        await db.History.create({
            user: userId,
            plan: planId,
            type: 1
        });

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
        console.log('req.file', req.file, req.body);
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
        const user = await db.User.findOne({ _id: userId }).select('planCurrentDay planHoldDate');
        const maxDay = parseInt(user.planCurrentDay);
        console.log('maxDay--------------------', maxDay);
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
        // localize firstThumbnail by user preferred language
        const userPreferredLanguage = req.preferredLanguage || 'english';
        const progress = fullDays.map(d => {
            const found = videoProgress.find(p => p.day === d.day);
            if (!found) return d;
            let localizedThumb = found.firstThumbnail;
            if (localizedThumb && typeof localizedThumb === 'object') {
                localizedThumb =
                    localizedThumb[userPreferredLanguage] ||
                    localizedThumb.english ||
                    localizedThumb.hindi ||
                    localizedThumb.gujarati ||
                    null;
            }
            return { ...found, firstThumbnail: localizedThumb };
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

exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return RESPONSE.error(res, 401, 2005);
        }

        const user = await db.User.findOne({ refreshToken, isDeleted: false });
        if (!user) {
            return RESPONSE.error(res, 403, 3001);
        }
        if (user.isBlocked) {
            return RESPONSE.error(res, 403, 3004);
        }

        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
            if (err && err.name === 'TokenExpiredError') {
                const newRefreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
                const newAccessToken = jwt.sign(
                    { id: user._id, mobileNumber: user.mobileNumber, role: 'user' },
                    process.env.JWT_SECRET,
                    { expiresIn: '15m' }
                );
                user.refreshToken = newRefreshToken;
                await user.save();

                return RESPONSE.success(res, 200, 1002, {
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken
                });
            }

            if (!err) {
                const newAccessToken = jwt.sign(
                    { id: user._id, mobileNumber: user.mobileNumber, role: 'user' },
                    process.env.JWT_SECRET,
                    { expiresIn: '15m' }
                );

                return RESPONSE.success(res, 200, 1002, {
                    accessToken: newAccessToken,
                    refreshToken
                });
            }
            return RESPONSE.error(res, 403, 2002, 'Invalid refresh token');
        });
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};
