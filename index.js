require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const cron = require('node-cron');

const { user_auth } = require('./middleware/authorization/authorization.js');
const { check_validation } = require('./utils/validateRequest.js');
const swaggerSpec = require('./utils/swagger.js');
const route = require('./src/routes/index.route.js');
require('./middleware/database/connectDatabase.js');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(`${process.env.API_COMMON_ROUTE}/uploads`, express.static(path.join(__dirname, 'uploads')));

app.use(`${process.env.API_COMMON_ROUTE}/api-docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(`${process.env.API_COMMON_ROUTE}`, user_auth, check_validation, route);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const { db } = require('./src/models/index.model.js');

// @todo check this will work right way or not
//cron set i 5 minutes
cron.schedule('*/5 * * * *', async () => {
    // ✅ This runs once per day at 00:00 (midnight)
    console.log('Running cron job...');

    const now = new Date();
    const date = now.toISOString().split('T')[0];
    try {
        const users = await db.User.find({ isDeleted: false, activated: true, planHoldDate: { $eq: null } }).populate(
            'plan'
        );
        for (const user of users) {
            const planDay = user.plan.days;
            const nextDay = user.planCurrentDay + 1;
            if (nextDay <= planDay) {
                user.planCurrentDay = nextDay;
                user.planCurrentDate = date;
                await user.save();
            } else {
                const lastHistory = await db.History.aggregate([
                    { $match: { user: user._id, type: 1, plan: { $ne: user?.plan?._id } } },
                    {
                        $lookup: {
                            from: 'plans',
                            localField: 'plan',
                            foreignField: '_id',
                            as: 'plan'
                        }
                    },
                    { $unwind: '$plan' },
                    { $sort: { 'plan.days': 1 } }, // small days plan but not user's current plan
                    { $limit: 1 }
                ]);
                if (lastHistory.length > 0) {
                    let currentPlan = lastHistory[0].plan;
                    user.plan = currentPlan._id;
                    user.planCurrentDay = nextDay;
                    user.planCurrentDate = date;
                    await user.save();
                }
            }
        }
    } catch (err) {
        console.error('❌ Error in cron job:', err);
    }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Magic happens on port ${PORT}`);
});
