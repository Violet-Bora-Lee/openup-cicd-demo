import { predict } from '../src/predict';

describe('predict', () => {
  it('returns positive label when weighted sum is high', () => {
    const result = predict({ features: [10, 10, 10, 10] });
    expect(result.label).toBe('positive');
    expect(result.score).toBeGreaterThan(0.5);
  });

  it('returns negative label when weighted sum is very low', () => {
    const result = predict({ features: [-10, -10, -10, -10] });
    expect(result.label).toBe('negative');
    expect(result.score).toBeLessThan(0.5);
  });

  it('rounds score to 4 decimal places', () => {
    const result = predict({ features: [1, 2, 3, 4] });
    const decimals = result.score.toString().split('.')[1] ?? '';
    expect(decimals.length).toBeLessThanOrEqual(4);
  });

  it('handles features shorter than weight vector', () => {
    const result = predict({ features: [1] });
    expect(result.score).toBeGreaterThan(0);
    expect(result.score).toBeLessThan(1);
  });

  it('handles features longer than weight vector with default weight', () => {
    const result = predict({ features: [1, 1, 1, 1, 1, 1, 1, 1] });
    expect(result.score).toBeGreaterThan(0.5);
  });
});
