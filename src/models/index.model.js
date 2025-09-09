const db = {};

db.Admin = require('../models/admin.model.js');
db.User = require('../models/user.model.js');
db.Branch = require('../models/branch.model.js');
db.Plan = require('../models/plan.model.js');
db.Video = require('../models/video.model.js');
db.Question = require('../models/question.model.js');
db.UserAnswer = require('../models/userAnswer.model.js');
db.History = require('../models/history.model.js');
db.UserVideoProgress = require('../models/userVideoProgress.model.js');
db.Setting = require('../models/setting.model.js');
db.Category = require('../models/category.model.js');
db.Reference = require('../models/reference.model.js');
db.Command = require('../models/command.model.js');

module.exports = { db };
