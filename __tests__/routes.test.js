'use strict';

process.env.SECRET = 'secrets';

const jwt = require('jsonwebtoken');

const server = require('../src/server.js').server;
const supergoose = require('./supergoose.js');

const mockRequest = supergoose.server(server);

let users = {
  admin: { username: 'admin', password: 'password', role: 'admin' },
  editor: { username: 'editor', password: 'password', role: 'editor' },
  user: { username: 'user', password: 'password', role: 'user' },
};

beforeAll(supergoose.startDB);
afterAll(supergoose.stopDB);

describe('Auth Router', () => {
  Object.keys(users).forEach(userType => {
    describe(`${userType} users`, () => {
      let id;
      let token;
      let resultsToken;

      it('Can create user', () => {
        return mockRequest
          .post('/v1/signup')
          .send(users[userType])
          .then(results => {
            resultsToken = results.text;
            token = jwt.verify(results.text, process.env.SECRET);
            id = token.id;
            expect(token.id).toEqual(id);
          });
      });

      it('Can authenticate user on signin', () => {
        return mockRequest
          .post('/v1/signin')
          .auth(users[userType].username, users[userType].password)
          .then(results => {
            var token = jwt.verify(results.text, process.env.SECRET);
            expect(token.id).toEqual(id);
          });
      });

      it('Returns single user', () => {
        return mockRequest
          .get('/v1/user')
          .set('Authorization', `Bearer ${resultsToken}`)
          .then(results => {
            expect(results.status).toEqual(200);
          });
      });
    });
  });

  it('/users returns all users', () => {
    return mockRequest.get('/v1/users').then(data => {
      expect(data.body.count).toEqual(3);
    });
  });

  it('Returns invalid login when wrong header', () => {
    return mockRequest
      .post('/v1/signin')
      .auth({ name: 5, password: 6 })
      .then(results => {
        expect(results.status).toEqual(500);
      });
  });
});
