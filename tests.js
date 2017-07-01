const request = require('supertest');
const { app } = require('./app');
const User = require('./user');

describe('Request to the root path', function() {
  it('returns 200 status code', function(done) {
    request(app)
      .get('/trip-planner/')
      .expect(200, done)
  });
});

describe('Request to the users path', function() {
  const payload = {
    email: "testemail@email.com",
    username: "testusername",
    password: "testpassword",
    confirmPassword: "testpassword"
  };
  it('returns 409 status code for duplicate user', function(done) {
    request(app)
      .post('/trip-planner/users')
      .set('Content-Type', 'application/json')
      .send(payload)
      .expect(409, done)
  });
});

describe('Request to the users path', function() {
  const payload = {
    email: "testemail@email.com",
    username: "testusername",
    password: "testpassword",
    confirmPassword: "testpassword"
  };
  beforeEach(done => {
    User.remove({}, (err) => {
       done();
    });
  });
  it('returns 201 status code for new user', function(done) {
    request(app)
      .post('/trip-planner/users')
      .set('Content-Type', 'application/json')
      .send(payload)
      .expect(201, {
        body: 'test'
      }, done)
  });
});

describe('Request to the login path', function() {
  const payload = {
    username: "testusername",
    password: "testpassword"
  };
  it('returns 200 status code with correct credentials', function(done) {
    request(app)
      .post('/trip-planner/login')
      .set('Content-Type', 'application/json')
      .send(payload)
      .expect(200, {
        body: 'test'
      }, done)
  });

  const passwordPayload = {
    password: "testpassword"
  };
  it('returns 400 status code without username', function(done) {
    request(app)
      .post('/trip-planner/login')
      .set('Content-Type', 'application/json')
      .send(passwordPayload)
      .expect(400, done)
  });

  const usernamePayload = {
    username: "testusername"
  };
  it('returns 400 status code without password', function(done) {
    request(app)
      .post('/trip-planner/login')
      .set('Content-Type', 'application/json')
      .send(usernamePayload)
      .expect(400, done)
  });

  const wrongUsernamePayload = {
    username: "wrongusername",
    password: "testpassword"
  };
  it('returns 401 status code with wrong username', function(done) {
    request(app)
      .post('/trip-planner/login')
      .set('Content-Type', 'application/json')
      .send(wrongUsernamePayload)
      .expect(401, done)
  });

  const wrongPasswordPayload = {
    username: "testusername",
    password: "wrongpassword"
  };
  it('returns 401 status code with wrong password', function(done) {
    request(app)
      .post('/trip-planner/login')
      .set('Content-Type', 'application/json')
      .send(wrongPasswordPayload)
      .expect(401, done)
  });
});
