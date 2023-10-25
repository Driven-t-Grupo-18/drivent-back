import { Prisma } from '@prisma/client';
import { prisma } from '@/config';
import { getRedis, setRedis } from '@/redisConfig';

async function createSession(data: Prisma.SessionUncheckedCreateInput) {
  const result = await prisma.session.create({
    data,
  });
  await setRedis(`user-${result.token}`, JSON.stringify(result))
  return result
}

async function findSession(token: string) {

  const redis = JSON.parse(await getRedis(`user-${token}`))
  if(redis){
    return redis
  } else{

    const result = await prisma.session.findFirst({
      where: {
        token,
      },
    });

    await setRedis(`user-${token}`, JSON.stringify(result))
    return result
  }
}

export const authenticationRepository = {
  createSession,
  findSession,
};
