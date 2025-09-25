const request = require('supertest');
const app = require('../server');

describe('App Routes', () => {
  it('should return Hello message on root', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('Hello Production CI/CD');
  });

  it('should return UP status on /health', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('UP');
  });
});
