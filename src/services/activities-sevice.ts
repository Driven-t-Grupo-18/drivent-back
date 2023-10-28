import { notFoundError } from '@/errors';
import { activitiesRepository } from '@/repositories/activities-repository';

async function getListDates() {
  const activitiesDay = await activitiesRepository.getAllActivitiesDay();
  if (!activitiesDay) throw notFoundError();

  return activitiesDay;
}

async function getDayActivities(activityDayId: number, userId: number) {
  const activitiesFromDay = await activitiesRepository.findActivitiesFromDay(activityDayId);

  if (!activitiesFromDay) throw notFoundError();

  const userActivities = await activitiesRepository.findActivitiesFromUser(userId);

  const userActivitiesIds = userActivities.map((activity) => activity.id);

  return { activitiesFromDay, userActivitiesIds };
}

export const activitiesService = {
  getListDates,
  getDayActivities,
};
