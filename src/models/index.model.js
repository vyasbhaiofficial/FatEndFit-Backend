const db = {};

db.Admin = require('../models/admin.model.js');
db.User = require('../models/user.model.js');
db.Branch = require('../models/branch.model.js');
db.Plan = require('../models/plan.model.js');
db.Video = require('../models/video.model.js');
db.Question = require('../models/question.model.js');
db.UserAnswer = require('../models/userAnswer.model.js');

module.exports = { db };
