const request = require('supertest');
const app = require('./app'); // Import just the app (no server started)

describe('App Routes', () => {
  it('GET / should return Hello Production CI/CD!', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Hello Production CI/CD!');
  });

  it('GET /health should return status UP', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'UP' });
  });
});
