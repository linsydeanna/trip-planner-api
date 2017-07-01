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

const config = require('config');
const passport = require('passport');
const expressJWT = require('express-jwt');

const app = express();
app.use(logger('dev'));

mongoose.Promise = require('bluebird');

const options = {
  server: {
    socketOptions: {
      keepAlive: 300000,
      connectTimeoutMS: 30000
    }
  },
  replset: {
    socketOptions: {
      keepAlive: 300000,
      connectTimeoutMS : 30000
    }
  }
};

mongoose.connect(config.DBHost, options);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.use(passport.initialize());

app.use(jsonParser.json());
app.use(jsonParser.urlencoded({ extended: false }));

app.use(expressJWT({ secret: 'shhh' }).unless({ path: ['/trip-planner/', '/trip-planner/users', '/trip-planner/login'] }));

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE');
        return res.status(200).json({});
    };
    next();
});

app.use('/trip-planner', routes);

module.exports = {
  app
};
