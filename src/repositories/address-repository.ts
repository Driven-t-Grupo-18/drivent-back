import { Address } from '@prisma/client';
import { prisma } from '@/config';
import { setRedis } from '@/redisConfig';
// Redis Aplicado
async function upsert(enrollmentId: number, createdAddress: CreateAddressParams, updatedAddress: UpdateAddressParams) {
  const result = await prisma.address.upsert({
    where: {
      enrollmentId,
    },
    create: {
      ...createdAddress,
      Enrollment: { connect: { id: enrollmentId } },
    },
    update: updatedAddress,
  });
  await setRedis(`addressByEnrollmentId-${enrollmentId}`, JSON.stringify(result));
  return result;
}

export type CreateAddressParams = Omit<Address, 'id' | 'createdAt' | 'updatedAt' | 'enrollmentId'>;
export type UpdateAddressParams = CreateAddressParams;

export const addressRepository = {
  upsert,
};
