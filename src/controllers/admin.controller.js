const { db } = require('../models/index.model.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const RESPONSE = require('../../utils/response.js');
const crypto = require('crypto');
const { sendResetEmail } = require('../../utils/email.js');
const mongoose = require('mongoose');

// Admin Signup (only allowed for first-time setup)
exports.adminSignup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return RESPONSE.error(res, 400, 1002, 'Username, email and password are required');
        }
        // Allow signup only if no Admin exists yet
        const existingMainAdmin = await db.Admin.countDocuments({ adminType: 'Admin', isDeleted: false });
        if (existingMainAdmin > 0) {
            return RESPONSE.error(res, 403, 1003, 'Admin signup disabled. Contact existing Admin.');
        }
        const existingAdmin = await db.Admin.findOne({ email });
        if (existingAdmin) {
            return RESPONSE.error(res, 400, 1003, 'Admin already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = await db.Admin.create({
            username,
            email,
            password: hashedPassword,
            adminType: 'Admin',
            branch: []
        });

        // Generate JWT token on signup
        const token = jwt.sign(
            { id: admin._id, email: admin.email, adminType: admin.adminType },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d'
            }
        );

        return RESPONSE.success(res, 201, 1004, { admin, token });
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

// Admin Login
exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return RESPONSE.error(res, 400, 1002, 'Email and password are required');
        }
        const admin = await db.Admin.findOne({ email });
        if (!admin) {
            return RESPONSE.error(res, 401, 1005, 'Invalid email or password');
        }
        // check deleted
        if (admin.isDeleted) {
            return RESPONSE.error(res, 403, 6000);
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return RESPONSE.error(res, 401, 1005, 'Invalid email or password');
        }
        const role = admin.adminType === 'Admin' ? 'admin' : 'subadmin';
        console.log('role------------------------------------', role);
        const token = jwt.sign({ id: admin._id, email: admin.email, role }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });
        return RESPONSE.success(res, 200, 1006, { admin, token });
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

// update api
exports.updateAdmin = async (req, res) => {
    try {
        console.log('req.body', req.body.username);
        const { username, password } = req.body;
        const admin = await db.Admin.findOne({ _id: req.admin.id });

        if (username) admin.username = username;
        if (req.file) admin.image = req.file.path;
        if (password) admin.password = await bcrypt.hash(password, 10);

        await admin.save();
        return RESPONSE.success(res, 200, 1007, { admin });
    } catch (err) {
        console.log('err', err);
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

// Admin Forgot Password
exports.adminForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return RESPONSE.error(res, 400, 1002, 'Email is required');
        }

        const admin = await db.Admin.findOne({ email, isDeleted: false });
        if (!admin) {
            return RESPONSE.error(res, 404, 5004, 'Admin not Found');
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes

        admin.resetPasswordToken = token;
        admin.resetPasswordExpiresAt = expiresAt;
        await admin.save();

        const appBaseUrl = process.env.APP_BASE_URL || 'http://localhost:3000';
        const resetUrl = `${appBaseUrl}/admin/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

        const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #f0c040; border-radius: 12px; padding: 24px; background: #fffbe6;">
        <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #d4a017; margin: 0;">🔐 Admin Password Reset</h2>
        </div>

        <p style="font-size: 15px; color: #444;">Hello,</p>
        <p style="font-size: 15px; color: #444;">
        We received a request to reset your admin account password. 
        Click the button below to set a new password. 
        <strong>This link is valid for 30 minutes.</strong>
        </p>

         <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background: #facc15; color: #000; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        Reset Password
        </a>
        </div>

        <p style="font-size: 14px; color: #555;">
        If the button above doesn’t work, copy and paste the following link into your browser:
        </p>
        <p style="word-break: break-all; color: #d97706; font-size: 14px;">
         <a href="${resetUrl}" style="color: #d97706;">${resetUrl}</a>
        </p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #f0c040;" />

        <p style="font-size: 13px; color: #777; text-align: center;">
        If you did not request this password reset, please ignore this email.
        </p>
        </div>
`;

        await sendResetEmail({ to: email, subject: 'Admin Password Reset', html });

        return RESPONSE.success(res, 200, 1001, { message: 'Password reset link sent if email exists' });
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

// Admin Reset Password
exports.adminResetPassword = async (req, res) => {
    try {
        const { token, email, password } = req.body;
        if (!token || !email || !password) {
            return RESPONSE.error(res, 400, 1002, 'Token, email and new password are required');
        }

        const admin = await db.Admin.findOne({ email, resetPasswordToken: token, isDeleted: false });
        if (!admin) {
            return RESPONSE.error(res, 404, 5004, 'Invalid reset token');
        }

        if (!admin.resetPasswordExpiresAt || admin.resetPasswordExpiresAt < new Date()) {
            return RESPONSE.error(res, 400, 2004, 'Token expired');
        }

        admin.password = await bcrypt.hash(password, 10);
        admin.resetPasswordToken = null;
        admin.resetPasswordExpiresAt = null;
        await admin.save();

        return RESPONSE.success(res, 200, 1001, { message: 'Password updated successfully' });
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

//get admin and subadmin profile
exports.getAdminAndSubadminProfile = async (req, res) => {
    try {
        const admin = await db.Admin.findById(req.admin.id).select('-password').populate('branch');
        return RESPONSE.success(res, 200, 1001, admin);
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

// Consolidated: user info + progress + daily reports + plan history
exports.getUserOverview = async (req, res) => {
    try {
        const { userId } = req.params;

        // 1) Basic user
        const user = await db.User.findById(userId).select('-refreshToken').populate('plan').populate('branch');
        if (!user) return RESPONSE.error(res, 404, 3001);

        // 2) Progress summary by day (reuse logic similar to getUserProgress)
        const maxDay = parseInt(user.planCurrentDay || 0);
        let videoProgress = [];
        if (maxDay > 0) {
            videoProgress = await db.Video.aggregate([
                { $match: { isDeleted: false, day: { $lte: maxDay } } },
                {
                    $lookup: {
                        from: 'uservideoprogresses',
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
                        watchedSeconds: { $ifNull: [{ $arrayElemAt: ['$progress.watchedSeconds', 0] }, 0] }
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
                { $sort: { _id: -1 } },
                { $project: { day: '$_id', _id: 0, firstThumbnail: 1, dayProgressPercent: 1 } }
            ]);
        }

        const fullDays = Array.from({ length: maxDay }, (_, i) => ({
            day: maxDay - i,
            firstThumbnail: '',
            dayProgressPercent: 0
        }));
        const progress = fullDays.map(d => {
            const found = videoProgress.find(p => p.day === d.day);
            return {
                day: found ? found.day : d.day,
                firstThumbnail: found ? found.firstThumbnail : '',
                dayProgressPercent: found ? found.dayProgressPercent : 0
            };
        });

        // 3) Daily question reports (by day with populated question data)
        const dailyReportsDocs = await db.UserAnswer.find({ user: userId })
            .populate({
                path: 'answers.questionId',
                model: 'Question',
                select: 'questionText correctAnswer type section'
            })
            .sort({ day: 1 });
        // Get user's preferred language with better detection
        const getUserLanguage = language => {
            if (!language) return 'english';
            const lang = language.toLowerCase();
            if (lang === 'gujarati' || lang === 'guj') return 'gujarati';
            if (lang === 'hindi' || lang === 'hin') return 'hindi';
            return 'english'; // Default fallback
        };

        const userLanguage = getUserLanguage(user.language);

        const dailyReports = dailyReportsDocs.map(r => ({
            day: r.day,
            answers: r.answers.map(a => {
                // Get question and answer in user's preferred language
                let questionText = '';
                let correctAnswerText = '';

                if (userLanguage === 'gujarati') {
                    questionText = a.questionId?.questionText?.gujarati || '';
                    correctAnswerText = a.questionId?.correctAnswer?.gujarati || '';
                } else if (userLanguage === 'hindi') {
                    questionText = a.questionId?.questionText?.hindi || '';
                    correctAnswerText = a.questionId?.correctAnswer?.hindi || '';
                } else {
                    // Default to English
                    questionText = a.questionId?.questionText?.english || '';
                    correctAnswerText = a.questionId?.correctAnswer?.english || '';
                }

                return {
                    questionId: a.questionId?._id,
                    question: questionText,
                    correctAnswer: correctAnswerText,
                    type: a.questionId?.type,
                    section: a.questionId?.section,
                    givenAnswer: a.answer,
                    language: userLanguage
                };
            }),
            submittedAt: r.createdAt
        }));

        // 4) Plan history (most recent first) + include plan name/days
        const planHistoryDocs = await db.History.find({ user: userId, type: 1 })
            .populate('plan')
            .sort({ createdAt: -1 })
            .lean();

        const planHistory = planHistoryDocs.map(history => ({
            _id: history._id,
            user: history.user,
            plan: history.plan,
            type: history.type,
            createdAt: history.createdAt,
            updatedAt: history.updatedAt
        }));

        // Format user data to ensure proper structure
        const formattedUser = {
            _id: user._id,
            name: user.name,
            surname: user.surname,
            patientId: user.patientId,
            mobilePrefix: user.mobilePrefix,
            mobileNumber: user.mobileNumber,
            gender: user.gender,
            age: user.age,
            height: user.height,
            weight: user.weight,
            language: user.language,
            medicalDescription: user.medicalDescription,
            image: user.image,
            fcmToken: user.fcmToken,
            city: user.city,
            state: user.state,
            country: user.country,
            appReferer: user.appReferer,
            plan: user.plan,
            branch: user.branch,
            planCurrentDay: user.planCurrentDay,
            planCurrentDate: user.planCurrentDate,
            planHoldDate: user.planHoldDate,
            planResumeDate: user.planResumeDate,
            activated: user.activated,
            isDeleted: user.isDeleted,
            isBlocked: user.isBlocked,
            isProfileUpdated: user.isProfileUpdated,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        return RESPONSE.success(res, 200, 1001, {
            user: formattedUser,
            progress,
            dailyReports,
            planHistory,
            userLanguage: userLanguage // Include user's language for frontend reference
        });
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

// Admin/Subadmin plan hold functionality
exports.adminHoldUserPlan = async (req, res) => {
    try {
        const { userId } = req.params;

        // Check if user exists
        const user = await db.User.findById(userId).populate('plan').populate('branch');
        if (!user) {
            return RESPONSE.error(res, 404, 3001, 'User not found');
        }

        // Check if user has an active plan
        if (!user.plan) {
            return RESPONSE.error(res, 400, 6009, 'User does not have an active plan');
        }

        // Subadmin can only hold plans for users in their assigned branches
        if (req.role === 'subadmin') {
            const adminDoc = await db.Admin.findById(req.admin?.id).select('branch');
            if (!adminDoc) {
                return RESPONSE.error(res, 403, 2003, 'Admin not found');
            }
            const allowedBranchIds = (adminDoc.branch || []).map(id => String(id));
            if (!allowedBranchIds.includes(String(user.branch))) {
                return RESPONSE.error(res, 403, 4444, 'Not allowed to hold plan for user outside your branches');
            }
        }

        // Check if plan is already on hold
        if (user.planHoldDate) {
            return RESPONSE.error(res, 400, 6010, 'Plan is already on hold');
        }

        const now = new Date();
        const date = now.toISOString().split('T')[0];

        // Hold the plan
        user.planHoldDate = date;
        user.planResumeDate = null;
        await user.save();

        return RESPONSE.success(res, 200, 1001, {
            message: 'Plan held successfully',
            user: {
                id: user._id,
                name: user.name,
                plan: user.plan,
                planHoldDate: user.planHoldDate,
                planCurrentDay: user.planCurrentDay
            }
        });
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

// Admin/Subadmin plan resume functionality
exports.adminResumeUserPlan = async (req, res) => {
    try {
        const { userId } = req.params;

        // Check if user exists
        const user = await db.User.findById(userId).populate('plan').populate('branch');
        if (!user) {
            return RESPONSE.error(res, 404, 3001, 'User not found');
        }

        // Check if user has an active plan
        if (!user.plan) {
            return RESPONSE.error(res, 400, 6009, 'User does not have an active plan');
        }

        // Subadmin can only resume plans for users in their assigned branches
        if (req.role === 'subadmin') {
            const adminDoc = await db.Admin.findById(req.admin?.id).select('branch');
            if (!adminDoc) {
                return RESPONSE.error(res, 403, 2003, 'Admin not found');
            }
            const allowedBranchIds = (adminDoc.branch || []).map(id => String(id));
            if (!allowedBranchIds.includes(String(user.branch))) {
                return RESPONSE.error(res, 403, 4444, 'Not allowed to resume plan for user outside your branches');
            }
        }

        // Check if plan is on hold
        if (!user.planHoldDate) {
            return RESPONSE.error(res, 400, 6011, 'Plan is not on hold');
        }

        const now = new Date();
        const date = now.toISOString().split('T')[0];

        // Resume the plan
        user.planHoldDate = null;
        user.planResumeDate = date;

        // If plan was resumed on a different date, increment the day
        if (user.planCurrentDate !== date) {
            user.planCurrentDate = date;
            user.planCurrentDay += 1;
        }

        await user.save();

        return RESPONSE.success(res, 200, 1001, {
            message: 'Plan resumed successfully',
            user: {
                id: user._id,
                name: user.name,
                plan: user.plan,
                planResumeDate: user.planResumeDate,
                planCurrentDay: user.planCurrentDay,
                planCurrentDate: user.planCurrentDate
            }
        });
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};

// Get user plan status (for admin panel)
exports.getUserPlanStatus = async (req, res) => {
    try {
        const { userId } = req.params;

        // Check if user exists
        const user = await db.User.findById(userId)
            .select('name plan planCurrentDay planCurrentDate planHoldDate planResumeDate activated')
            .populate('plan')
            .populate('branch');
        if (!user) {
            return RESPONSE.error(res, 404, 3001, 'User not found');
        }

        // Subadmin can only view users in their assigned branches
        if (req.role === 'subadmin') {
            const adminDoc = await db.Admin.findById(req.admin?.id).select('branch');
            if (!adminDoc) {
                return RESPONSE.error(res, 403, 2003, 'Admin not found');
            }
            const allowedBranchIds = (adminDoc.branch || []).map(id => String(id));
            if (!allowedBranchIds.includes(String(user.branch))) {
                return RESPONSE.error(res, 403, 4444, 'Not allowed to view user outside your branches');
            }
        }

        const planStatus = {
            userId: user._id,
            name: user.name,
            plan: user.plan,
            planCurrentDay: user.planCurrentDay,
            planCurrentDate: user.planCurrentDate,
            planHoldDate: user.planHoldDate,
            planResumeDate: user.planResumeDate,
            isOnHold: !!user.planHoldDate,
            isActive: user.activated && !user.isDeleted && !user.isBlocked
        };

        return RESPONSE.success(res, 200, 1001, planStatus);
    } catch (err) {
        return RESPONSE.error(res, 500, 9999, err.message);
    }
};
