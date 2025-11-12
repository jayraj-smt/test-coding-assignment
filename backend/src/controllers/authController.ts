import { Request, Response } from 'express';
import { signup, login } from '../services/authService';

export const signupController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const result = await signup(email, password);
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'User already exists') {
        res.status(409).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const loginController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const result = await login(email, password);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Invalid credentials') {
        res.status(401).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};
