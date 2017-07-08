'use strict';

const express = require('express');
const User = require('./user');
const Trip = require('./trip');
const passport = require('./passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

// const authenticate = passport.authenticate('local', { session: false });

router.get('/', function(req, res, next) {
  res.send('OK');
});

router.post('/users', function(req, res, next) {
  if (req.body.email && req.body.username && req.body.password) {
    const userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    };

    User.find({ username: userData.username }, function(error, users) {
      if (!users.length) {
        User.create(userData, function (error, user) {
          if (error) {
            return next(error);
          } else {
            res.status(201).json({
              token: jwt.sign({ username: req.body.username }, 'shhh'),
              email: user.email,
            });
          }
        });
      } else {
        const err = new Error('Username already exists.')
        err.status = 409;
        return next(err);
      }
    });

    if (req.body.password !== req.body.confirmPassword) {
      const err = new Error('Passwords do not match.')
      err.status = 400;
      return next(err);
    }
  } else {
    const err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
});

router.post('/login', function(req, res, next) {
  if (!req.body.username || !req.body.password) {
    const err = new Error('Username and password are required.')
    err.status = 400;
    return next(err);
  } else {
    const authenticate = passport.authenticate('local', function(err, user, info) {
      if (err) {
        return next(err);
      };
      if (user) {
        return res.status(200).json({
          token: jwt.sign({ username: req.body.username }, 'shhh'),
          email: user.email,
        });
      };
      if (!user) {
        return res.status(401).json(info);;
      };
    });
    return authenticate(req, res);
  };
});

router.post('/trips', function(req, res, next) {
  const newTrip = {
    name: req.body.name
  };
  Trip.create(newTrip, function (error, trip) {
    if (error) {
      return next(error);
    } else {
      return res.status(201).json({ id: 'someidhere' });
    };
  });
});

module.exports = router;
