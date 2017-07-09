'use strict';

const express = require('express');
const User = require('./user');
const Trip = require('./trip');
const passport = require('./passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

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
        const error = new Error('Username already exists.')
        error.status = 409;
        return next(error);
      }
    });

    if (req.body.password !== req.body.confirmPassword) {
      const error = new Error('Passwords do not match.')
      error.status = 400;
      return next(error);
    }
  } else {
    const error = new Error('All fields required.');
    error.status = 400;
    return next(error);
  }
});

router.post('/login', function(req, res, next) {
  if (!req.body.username || !req.body.password) {
    const error = new Error('Username and password are required.')
    error.status = 400;
    return next(error);
  } else {
    const authenticate = passport.authenticate('local', function(error, user, info) {
      if (error) {
        return next(error);
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
  jwt.verify(req.body.token, 'shhh', function(error, decoded) {
    if (error) {
      return next(error)
    } else {
      const newTrip = {
        name: req.body.name
      };
      Trip.create(newTrip, function (error, trip) {
        if (error) {
          return next(error);
        } else {
          User.update({ username: req.body.username },
            { $push: { trips: trip.id } },
            { upsert: true },
            function (error) {
              if (error) {
                return next(error);
              } else {
                return res.status(201).json({ id: trip.id });
              };
            });
        };
      });
    }
  });
});

module.exports = router;
