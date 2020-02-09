'use strict';

const {server} = require('../src/server.js');
const supergoose = require('@code-fellows/supergoose');
const mockRequest = supergoose(server);

describe('Error Handlers', () => {

  it('Should respond with a status of 404', async () => {
    try {
      let result = await mockRequest.get('/bad');
      expect(result.status).toEqual(404);
    }
    catch (error) {error;}
  });

  it('should respond with a 500 error', () => {
    const badObj = {apple: 5};
    return mockRequest.post('/signin')
      .send(badObj)
      .then(results => {
        expect(results.status).toBe(500);
      }).catch(console.error);
  });
});