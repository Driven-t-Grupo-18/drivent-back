import { prisma } from '@/config';

async function getAllActivitiesDay() {
  return await prisma.activityDay.findMany({
    orderBy: { startsAt: 'asc' },
  });
}

async function findActivitiesFromDay(activityDayId: number) {
  return await prisma.activity.findMany({
    where: { activityDayId },
    orderBy: [{ location: 'asc' }, { startsAt: 'asc' }],
  });
}

async function findActivitiesFromUser(userId: number) {
  const userRegisteredActivities = await prisma.activityRegistration.findMany({
    where: { userId },
    select: { activityId: true },
  });

  const activitiesIds = userRegisteredActivities.map((activities) => activities.activityId);

  const userActivities = await prisma.activity.findMany({
    where: {
      id: { in: activitiesIds },
    },
  });

  return userActivities;
}
export const activitiesRepository = {
  getAllActivitiesDay,
  findActivitiesFromDay,
  findActivitiesFromUser,
};
