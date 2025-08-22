const express = require('express');
const route = express.Router();

const branchRoute = require('./branch.route.js');
const adminRoute = require('./admin.route.js');
const userRoute = require('./user.route.js');
const planRoute = require('./plan.route.js');
const videoRoute = require('./video.route.js');
const questionRoute = require('./question.route.js');
const settingRoute = require('./setting.route.js');

route.use('/branch', branchRoute);
route.use('/plan', planRoute);
route.use('/user', userRoute);
route.use('/video', videoRoute);
route.use('/question', questionRoute);
route.use('/setting', settingRoute);
route.use('/', adminRoute);

module.exports = route;
