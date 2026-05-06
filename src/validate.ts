import { PredictInput } from './predict';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

const MIN_FEATURES = 1;
const MAX_FEATURES = 10;

export function validatePredictInput(body: unknown): PredictInput {
  if (typeof body !== 'object' || body === null) {
    throw new ValidationError('Request body must be an object');
  }

  const { features } = body as { features?: unknown };

  if (!Array.isArray(features)) {
    throw new ValidationError('features must be an array of numbers');
  }

  if (features.length < MIN_FEATURES || features.length > MAX_FEATURES) {
    throw new ValidationError(
      `features length must be between ${MIN_FEATURES} and ${MAX_FEATURES}`
    );
  }

  for (const value of features) {
    if (typeof value !== 'number' || Number.isNaN(value)) {
      throw new ValidationError('every element of features must be a number');
    }
  }

  return { features: features as number[] };
}
