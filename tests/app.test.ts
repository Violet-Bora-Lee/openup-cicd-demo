/**
 * 📌 이 파일의 역할: "app.ts의 통합 테스트(Integration Test)"
 *
 * 🧪 통합 테스트(Integration Test)란?
 *   → 단위 테스트가 "함수 한 개"를 검사한다면,
 *      통합 테스트는 "여러 부품이 합쳐진 흐름"을 검사한다.
 *   → 여기서는 검증(validate) → 추론(predict) → HTTP 응답까지 한 번에 본다.
 *
 * 🛠 supertest:
 *   진짜 서버를 띄우지 않고도 Express 앱에 가짜 HTTP 요청을 보낼 수 있게 해주는 도구.
 *   덕분에 테스트가 빠르고, 포트 충돌도 없다.
 *
 * ✅ 검사 대상:
 *   - GET /health        → 200 + { status: 'ok' }
 *   - POST /predict      → 정상 입력은 200 + score/label
 *                        → 잘못된 입력은 400
 */

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
