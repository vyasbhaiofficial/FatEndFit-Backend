const express = require('express');
const route = express.Router();
const userRoute = require('./user.route.js');
const userAnswerRoute = require('./userAnswer.route.js');
const settingRoute = require('./setting.route.js');

route.use('/userAnswer', userAnswerRoute);
route.use('/setting', settingRoute);
route.use('/', userRoute);

module.exports = route;
