const express = require('express');
const route = express.Router();
const userRoute = require('./user.route.js');
const userAnswerRoute = require('./userAnswer.route.js');
const settingRoute = require('./setting.route.js');

const userVideoProgressRoute = require('./userVideoProgress.route.js');
const videoRoute = require('./video.route.js');
const otherRoute = require('./other.route.js');
const planRoute = require('./plan.route.js');
const questionRoute = require('./question.route.js');
const testimonialRoute = require('./testimonial.route.js');

route.use('/userAnswer', userAnswerRoute);
route.use('/setting', settingRoute);
route.use('/videoProgress', userVideoProgressRoute);
route.use('/video', videoRoute);
route.use('/other', otherRoute);
route.use('/plan', planRoute);
route.use('/question', questionRoute);
route.use('/testimonial', testimonialRoute);

route.use('/', userRoute);

module.exports = route;
