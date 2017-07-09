'use strict';

// if (process.env.NODE_ENV !== 'production') {
//     require('@glimpse/glimpse').init();
// }

const express = require('express');
const jsonParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes');
const User = require('./user');
const logger = require('morgan');

const passport = require('passport');
const expressJWT = require('express-jwt');

const app = express();

if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
};

app.use(jsonParser.json());
app.use(jsonParser.urlencoded({ extended: false }));

mongoose.Promise = require('bluebird');

mongoose.connect(process.env.DB_HOST);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.use(passport.initialize());

const ignoredPaths = [
  '/trip-planner/',
  '/trip-planner/users',
  '/trip-planner/login',
  '/trip-planner/logout',
  '/trip-planner/trips'
];

app.use(expressJWT({ secret: 'shhh' }).unless({ path: ignoredPaths }));

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH');
        return res.status(200).json({});
    };
    next();
});

app.use('/trip-planner', routes);

module.exports = {
  app
};
