const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');

describe('API E2E Tests', () => {
  beforeAll(async () => {
    // Ustawienie zmiennej środowiskowej dla testów
    process.env.JWT_SECRET = 'test-secret';
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('Health Check', () => {
    it('should return 200 OK for health check endpoint', async () => {
      const response = await request(app)
        .get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
    });
  });

  describe('Authentication', () => {
    it('should return 401 for protected route without token', async () => {
      const response = await request(app)
        .get('/api/prompts');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });
  });
}); 