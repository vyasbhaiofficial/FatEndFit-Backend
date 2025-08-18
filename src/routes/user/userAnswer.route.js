const express = require('express');
const route = express.Router();

const userAnswerController = require('../../controllers/userAnswer.controller.js');

route.post('/submit', userAnswerController.submitAnswers);

module.exports = route;
