import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { createGeneration, getRecentGenerations } from '../services/generationService';

export const createGenerationController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: 'Image file is required' });
      return;
    }

    const { prompt, style } = req.body;
    const result = await createGeneration(req.userId, prompt, style, req.file.filename);
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Model overloaded') {
        res.status(503).json({ message: 'Model overloaded' });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const getGenerationsController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const limit = parseInt(req.query.limit as string) || 5;
    const generations = await getRecentGenerations(req.userId, limit);
    res.status(200).json(generations);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
