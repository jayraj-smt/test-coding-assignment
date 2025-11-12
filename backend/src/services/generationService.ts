import Generation from '../models/Generation';

const simulateModelOverload = (): boolean => {
  return Math.random() < 0.2;
};

const simulateDelay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const createGeneration = async (
  userId: string,
  prompt: string,
  style: string,
  imageFilename: string
) => {
  await simulateDelay(1000 + Math.random() * 1000);

  // if (simulateModelOverload()) {
  //   throw new Error('Model overloaded');
  // }

  const imageUrl = `/uploads/${imageFilename}`;
  const generation = await Generation.create({
    userId,
    prompt,
    style,
    imageUrl,
    status: 'completed',
  });

  return {
    id: generation.id,
    imageUrl: generation.imageUrl,
    prompt: generation.prompt,
    style: generation.style,
    createdAt: generation.createdAt,
    status: generation.status,
  };
};

export const getRecentGenerations = async (userId: string, limit: number = 5) => {
  const generations = await Generation.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']],
    limit,
    attributes: ['id', 'prompt', 'style', 'imageUrl', 'createdAt', 'status'],
  });

  return generations.map((gen) => ({
    id: gen.id,
    prompt: gen.prompt,
    style: gen.style,
    imageUrl: gen.imageUrl,
    createdAt: gen.createdAt,
    status: gen.status,
  }));
};
