/**
 * 📌 이 파일의 역할: "validate.ts의 단위 테스트"
 *
 * 검증 함수가 정해진 규칙대로 통과/거부하는지 확인한다.
 *
 * 🧪 두 가지 함수를 따로 테스트한다:
 *   1) validateFeatures        → 배열 단독 검증
 *   2) validatePredictInput    → HTTP body 통째로 검증
 *
 * 핵심 패턴:
 *   - 정상 입력은 그대로 통과해야 한다 → expect(...).toEqual(...)
 *   - 잘못된 입력은 ValidationError를 던져야 한다 → expect(() => ...).toThrow(ValidationError)
 */

import {
  validateFeatures,
  validatePredictInput,
  ValidationError
} from '../src/validate';

describe('validateFeatures', () => {
  it('accepts arrays with 1 to 10 numbers', () => {
    expect(validateFeatures([1])).toEqual([1]);
    expect(validateFeatures([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10
    ]);
  });

  it('rejects non-array input', () => {
    expect(() => validateFeatures('not array')).toThrow(ValidationError);
  });

  it('rejects arrays shorter than 1 or longer than 10', () => {
    expect(() => validateFeatures([])).toThrow(ValidationError);
    expect(() => validateFeatures(Array(11).fill(1))).toThrow(ValidationError);
  });

  it('rejects non-number elements', () => {
    expect(() => validateFeatures([1, 'two'])).toThrow(ValidationError);
  });

  it('rejects NaN elements', () => {
    expect(() => validateFeatures([1, NaN])).toThrow(ValidationError);
  });
});

describe('validatePredictInput', () => {
  it('accepts valid number array', () => {
    const result = validatePredictInput({ features: [1, 2, 3] });
    expect(result.features).toEqual([1, 2, 3]);
  });

  it('rejects null body', () => {
    expect(() => validatePredictInput(null)).toThrow(ValidationError);
  });

  it('rejects non-array features', () => {
    expect(() => validatePredictInput({ features: 'not array' })).toThrow(
      ValidationError
    );
  });

  it('rejects empty array', () => {
    expect(() => validatePredictInput({ features: [] })).toThrow(ValidationError);
  });

  it('rejects array longer than 10', () => {
    const tooLong = Array(11).fill(1);
    expect(() => validatePredictInput({ features: tooLong })).toThrow(
      ValidationError
    );
  });

  it('rejects non-number element', () => {
    expect(() =>
      validatePredictInput({ features: [1, 'two' as unknown as number] })
    ).toThrow(ValidationError);
  });

  it('rejects NaN element', () => {
    expect(() => validatePredictInput({ features: [1, NaN] })).toThrow(
      ValidationError
    );
  });
});
