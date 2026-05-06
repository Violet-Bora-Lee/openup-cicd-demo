import express, { Request, Response, NextFunction } from 'express';
import { predict } from './predict';
import { validatePredictInput, ValidationError } from './validate';

export function createApp(): express.Express {
  const app = express();
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.post('/predict', (req, res, next) => {
    try {
      const input = validatePredictInput(req.body);
      const result = predict(input);
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.status(500).json({ error: 'Internal Server Error' });
  });

  return app;
}
