import { Enrollment } from '@prisma/client';
import { prisma } from '@/config';
import { setRedis } from '@/redisConfig';

// Redis Aplicado
async function findWithAddressByUserId(userId: number) {
  const enrollment = await prisma.enrollment.findFirst({
    where: { userId },
    include: {
      Address: true,
    },
  });
  setRedis(`enrollmentByUserId-${userId}`, JSON.stringify(enrollment));

  return enrollment;
}

// Redis Aplicado
async function upsert(
  userId: number,
  createdEnrollment: CreateEnrollmentParams,
  updatedEnrollment: UpdateEnrollmentParams,
) {
  const enrollment = await prisma.enrollment.upsert({
    where: {
      userId,
    },
    create: createdEnrollment,
    update: updatedEnrollment,
  });
  return enrollment;
}

export type CreateEnrollmentParams = Omit<Enrollment, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateEnrollmentParams = Omit<CreateEnrollmentParams, 'userId'>;

export const enrollmentRepository = {
  findWithAddressByUserId,
  upsert,
};
