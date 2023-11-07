import { Activity, ActivityDay } from '@prisma/client';
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

async function findActivityDayById(activityDayId: number) {
  return await prisma.activityDay.findUnique({
    where: { id: activityDayId },
  });
}

async function findActivityById(activityId: number) {
  return await prisma.activity.findUnique({
    where: { id: activityId },
  });
}


async function recordUserActivity(capacity: number, activityId: number, activityDayId: number, userId: number) {
  const result = await prisma.$transaction([
    prisma.activityRegistration.create({
      data: {
        activityId,
        activityDayId,
        userId,
      }
    }),
    prisma.activity.update({
      data: { capacity: capacity - 1 },
      where: { id: activityId },
    })
  ])
  console.log(result)
  return result
}

async function getReservationsByDay(activityDayId: number){
  return await prisma.activityRegistration.groupBy({
    where: {activityDayId},
    by: ['activityId'],
    _count: true 
  })
}

export const activitiesRepository = {
  getAllActivitiesDay,
  findActivitiesFromDay,
  findActivitiesFromUser,
  findActivityDayById,
  findActivityById,
  recordUserActivity,
  getReservationsByDay
};
