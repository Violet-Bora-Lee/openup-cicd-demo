import { validatePredictInput, ValidationError } from '../src/validate';

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
