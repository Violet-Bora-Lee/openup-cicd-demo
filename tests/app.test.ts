import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

describe('GET /health', () => {
  it('returns ok status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('POST /predict', () => {
  it('returns prediction for valid input', async () => {
    const res = await request(app)
      .post('/predict')
      .send({ features: [1, 2, 3, 4] });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('score');
    expect(res.body).toHaveProperty('label');
    expect(['positive', 'negative']).toContain(res.body.label);
  });

  it('returns 400 for missing features', async () => {
    const res = await request(app).post('/predict').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/features/);
  });

  it('returns 400 for non-number element', async () => {
    const res = await request(app)
      .post('/predict')
      .send({ features: [1, 'oops'] });

    expect(res.status).toBe(400);
  });

  it('returns 400 for too many features', async () => {
    const res = await request(app)
      .post('/predict')
      .send({ features: Array(11).fill(0.5) });

    expect(res.status).toBe(400);
  });
});
