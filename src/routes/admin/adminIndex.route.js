const express = require('express');
const route = express.Router();

const branchRoute = require('./branch.route.js');
const adminRoute = require('./admin.route.js');

route.use('/branch', branchRoute);
route.use('/', adminRoute);

module.exports = route;
