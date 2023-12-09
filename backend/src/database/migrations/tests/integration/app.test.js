const request = require('supertest');
const app = require('../../src/app');

describe('CORS Middleware', () => {
  it('should allow cross-origin requests', async () => {
    const res = await request(app).get('/eans');
    expect(res.headers['access-control-allow-origin']).toBe('*');
  });
});
