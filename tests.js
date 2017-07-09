const request = require('supertest');
const { app } = require('./app');
const User = require('./user');
const Trip = require('./trip');

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
    User.remove({ username: "testusername" }, (err) => {
       done();
    });
  });
  it('returns 201 status code for new user', function(done) {
    request(app)
      .post('/trip-planner/users')
      .set('Content-Type', 'application/json')
      .send(payload)
      .expect(201, done)
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
      .expect(200, done)
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

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QyIiwiaWF0IjoxNDk5NTY2Njg4fQ.7HMrRQ_XTpjiB33ZuMiY44BMwbhm0VFk0aS2cv2PzaI"

describe('Request to the trips path', function() {
  beforeEach(done => {
    Trip.remove({ name: "Test Trip Name 2017" }, (err) => {
       done();
    });
    User.update({ _id: '59619260063760177cdcd27c' },
      { $set: { trips: [] } }).exec();
  });
  const tripPayload = {
    username: "test2",
    name: "Test Trip Name 2017",
    token: token
  };
  it('returns 201 status code when posting a new trip', function(done) {
    request(app)
      .post('/trip-planner/trips')
      .set('Content-Type', 'application/json')
      .send(tripPayload)
      .expect(201, done)
  });
});

describe('Request to the trips path', function() {
  it('returns 200 status code when getting trips for a user', function(done) {
    request(app)
      .get('/trip-planner/trips/59619260063760177cdcd27c')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(200, done)
  });
});
