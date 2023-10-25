import { prisma } from '@/config';
import { setRedis } from '@/redisConfig';

// Redis Aplicado
async function findFirst() {
  const result = await prisma.event.findFirst();
  await setRedis(`events`, JSON.stringify(result));
  return result;
}

export const eventRepository = {
  findFirst,
};
