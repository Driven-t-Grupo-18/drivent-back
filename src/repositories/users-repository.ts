import { Prisma } from '@prisma/client';
import { prisma } from '@/config';
import { getRedis, setRedis } from '@/redisConfig';

async function findByEmail(email: string, select?: Prisma.UserSelect) {
  const params: Prisma.UserFindUniqueArgs = {
    where: {
      email,
    },
  };

  if (select) {
    params.select = select;
  }

  const redis = JSON.parse(await getRedis(`user-${email}`))
  if (redis) {
    return redis
  } else {
    const result = await prisma.user.findUnique(params);
    await setRedis(`user-${email}`, JSON.stringify(result))
    return result
  }
}

async function create(data: Prisma.UserUncheckedCreateInput) {
  const result = await prisma.user.create({
    data,
  });
  await setRedis(`user-${result.email}`, JSON.stringify(result))
  await setRedis(`user-${result.id}`, JSON.stringify(result))

  return result
}

export const userRepository = {
  findByEmail,
  create,
};
