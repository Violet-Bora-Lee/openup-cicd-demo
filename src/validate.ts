/**
 * 📌 이 파일의 역할: "입력값 검증(validation)"
 *
 * predict() 함수에 이상한 값이 들어가면 NaN이 나오거나 서버가 터질 수 있다.
 * 그래서 외부에서 들어온 값이 안전한지 먼저 확인하는 "문지기" 역할.
 *
 * 🚪 3단계로 검사한다:
 *   1) 배열인가?           (객체/문자열/null이면 거부)
 *   2) 길이가 1~10인가?    (너무 짧거나 너무 길면 거부)
 *   3) 모든 원소가 숫자인가? (문자열, NaN 섞여 있으면 거부)
 *
 * ❌ 검증 실패 시 ValidationError를 던지고,
 *    이걸 app.ts의 에러 핸들러가 받아서 HTTP 400으로 응답한다.
 */

import { PredictInput } from './predict';

// 일반 Error와 구분하기 위한 커스텀 에러 클래스.
// app.ts에서 "이건 사용자 입력 잘못이니까 400으로 처리하자"고 판단할 때 사용.
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// 허용 길이 범위 (이 숫자를 바꾸면 정책이 바뀐다)
const MIN_FEATURES = 1;
const MAX_FEATURES = 10;

/**
 * features 배열 자체를 검증한다.
 * 통과하면 number[] 타입으로 정제해 반환, 실패하면 ValidationError를 던진다.
 */
export function validateFeatures(features: unknown): number[] {
  // ① 배열인지 확인
  if (!Array.isArray(features)) {
    throw new ValidationError('features must be an array of numbers');
  }

  // ② 길이가 허용 범위 안인지 확인
  if (features.length < MIN_FEATURES || features.length > MAX_FEATURES) {
    throw new ValidationError(
      `features length must be between ${MIN_FEATURES} and ${MAX_FEATURES}`
    );
  }

  // ③ 모든 원소가 진짜 숫자인지 확인 (NaN도 거부)
  for (const value of features) {
    if (typeof value !== 'number' || Number.isNaN(value)) {
      throw new ValidationError('every element of features must be a number');
    }
  }

  return features;
}

/**
 * HTTP 요청 body 전체를 검증한다.
 * body가 객체인지 먼저 확인한 뒤, 안의 features를 위 함수에 위임한다.
 */
export function validatePredictInput(body: unknown): PredictInput {
  if (typeof body !== 'object' || body === null) {
    throw new ValidationError('Request body must be an object');
  }

  const { features } = body as { features?: unknown };
  return { features: validateFeatures(features) };
}
