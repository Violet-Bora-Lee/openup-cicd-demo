/**
 * 📌 이 파일의 역할: "Express 웹 서버 앱(설계도) 정의"
 *
 * Node.js의 대표적인 웹 프레임워크 Express로 API 서버를 만든다.
 * 단, 이 파일은 서버를 "켜지(listen)"는 않는다.
 * 앱 객체만 만들어서 반환 → 그래야 테스트 코드에서도 같은 앱을 띄울 수 있다.
 * (실제 서버 시작은 server.ts에서 함)
 *
 * 🛣 제공하는 라우트:
 *   - GET  /health   : 서버가 살아있는지 확인용 (헬스체크)
 *   - POST /predict  : features를 받아 추론 결과를 반환
 *
 * 🚨 에러 처리:
 *   - 입력 잘못 → 400 Bad Request
 *   - 그 외 예외  → 500 Internal Server Error
 */

import express, { Request, Response, NextFunction } from 'express';
import { predict } from './predict';
import { validatePredictInput, ValidationError } from './validate';

export function createApp(): express.Express {
  const app = express();

  // JSON 형태로 들어오는 요청 body를 파싱해주는 미들웨어
  app.use(express.json());

  // ── 라우트 1: 헬스체크 ─────────────────────────────
  // 모니터링/배포 도구가 "서버 떠 있어?"를 물어볼 때 사용
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  // ── 라우트 2: 추론 ───────────────────────────────
  // 흐름: 검증 → 추론 → JSON 응답
  // 검증 실패 시 ValidationError가 throw되고 → 아래 에러 핸들러로 흘러간다.
  app.post('/predict', (req, res, next) => {
    try {
      const input = validatePredictInput(req.body);
      const result = predict(input);
      res.json(result);
    } catch (err) {
      next(err); // Express 에러 핸들러로 위임
    }
  });

  // ── 에러 핸들러 (반드시 마지막에 등록) ─────────────
  //   ValidationError → 400 (사용자 잘못)
  //   그 외           → 500 (서버 잘못)
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.status(500).json({ error: 'Internal Server Error' });
  });

  return app;
}
