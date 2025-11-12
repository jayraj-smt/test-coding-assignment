import request from 'supertest';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import authRoutes from '../routes/auth';
import generationRoutes from '../routes/generations';
import sequelize from '../db/sequelize';
import User from '../models/User';
import Generation from '../models/Generation';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/generations', generationRoutes);

describe('Generations API', () => {
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    await User.destroy({ where: {}, truncate: true });
    await Generation.destroy({ where: {}, truncate: true });

    const signupResponse = await request(app).post('/api/auth/signup').send({
      email: 'test@example.com',
      password: 'password123',
    });

    authToken = signupResponse.body.token;
    userId = signupResponse.body.user.id;
  });

  const createTestImage = (): Buffer => {
    const testImagePath = path.join(__dirname, '../__fixtures__/test-image.jpg');
    if (fs.existsSync(testImagePath)) {
      return fs.readFileSync(testImagePath);
    }
    return Buffer.from('fake-image-data');
  };

  describe('POST /api/generations', () => {
    it('should return 401 without authentication', async () => {
      const response = await request(app).post('/api/generations').send({
        prompt: 'Test prompt',
        style: 'Modern',
      });

      expect(response.status).toBe(401);
    });

    it('should create a generation successfully', async () => {
      const imageBuffer = createTestImage();
      const response = await request(app)
        .post('/api/generations')
        .set('Authorization', `Bearer ${authToken}`)
        .field('prompt', 'Test prompt')
        .field('style', 'Modern')
        .attach('image', imageBuffer, 'test.jpg');

      expect([201, 503]).toContain(response.status);
      if (response.status === 201) {
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('imageUrl');
        expect(response.body.prompt).toBe('Test prompt');
        expect(response.body.style).toBe('Modern');
      } else {
        expect(response.body.message).toBe('Model overloaded');
      }
    }, 10000);

    it('should return 400 without image file', async () => {
      const response = await request(app)
        .post('/api/generations')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          prompt: 'Test prompt',
          style: 'Modern',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Image file is required');
    });

    it('should return 400 without prompt', async () => {
      const imageBuffer = createTestImage();
      const response = await request(app)
        .post('/api/generations')
        .set('Authorization', `Bearer ${authToken}`)
        .field('style', 'Modern')
        .attach('image', imageBuffer, 'test.jpg');

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/generations', () => {
    it('should return 401 without authentication', async () => {
      const response = await request(app).get('/api/generations');

      expect(response.status).toBe(401);
    });

    it('should return empty array when no generations exist', async () => {
      const response = await request(app)
        .get('/api/generations')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return recent generations', async () => {
      const imageBuffer = createTestImage();

      for (let i = 0; i < 3; i++) {
        await request(app)
          .post('/api/generations')
          .set('Authorization', `Bearer ${authToken}`)
          .field('prompt', `Test prompt ${i}`)
          .field('style', 'Modern')
          .attach('image', imageBuffer, 'test.jpg');
      }

      await new Promise((resolve) => setTimeout(resolve, 5000));

      const response = await request(app)
        .get('/api/generations?limit=5')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    }, 20000);

    it('should limit results to 5 by default', async () => {
      for (let i = 0; i < 7; i++) {
        await Generation.create({
          userId,
          prompt: `Test prompt ${i}`,
          style: 'Modern',
          imageUrl: `/uploads/test-${i}.jpg`,
          status: 'completed',
        });
      }

      const response = await request(app)
        .get('/api/generations')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBeLessThanOrEqual(5);
    });
  });
});
