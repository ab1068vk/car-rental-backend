// tests/integration/health.test.ts

import request from 'supertest';
import { describe, it, expect } from '@jest/globals';
import app from '../../src/app';

describe('Health Check', () => {
  it('GET /health should return 200', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('healthy');
  });

  it('GET /unknown-route should return 404', async () => {
    const response = await request(app).get('/api/nonexistent');

    expect(response.status).toBe(404);
  });
});