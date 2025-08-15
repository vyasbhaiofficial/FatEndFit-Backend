const mongoose = require('mongoose');
require('dotenv').config();

mongoose
    .connect(
        `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@e-commerce.of30n2o.mongodb.net/${process.env.DB_NAME}`
    )
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const { db } = mongoose.connection;
module.exports = db;
