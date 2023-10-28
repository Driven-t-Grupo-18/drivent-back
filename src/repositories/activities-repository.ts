import { prisma } from '@/config';

async function getAllActivitiesDay() {
  return await prisma.activityDay.findMany({
    orderBy: { startsAt: 'asc' },
  });
}

export const activitiesRepository = {
  getAllActivitiesDay,
};
