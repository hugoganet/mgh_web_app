const request = require('supertest');
const app = require('../../src/app');

describe('Server Test', () => {
  it('should start the server and respond on the base URL', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('Hello World!');
  });
});
