import { conflictError, notFoundError } from '@/errors';
import { ActivityInputSelected } from '@/protocols';
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

async function recordAcivity(params: ActivityInputSelected, userId: number) {
  const { activityId, activityDayId } = params;

  const activityDay = await activitiesRepository.findActivityDayById(activityDayId);
  if (!activityDay) throw notFoundError();

  const activity = await activitiesRepository.findActivityById(activityId);
  if (!activity) throw notFoundError();

  if (activity.capacity <= 0) throw conflictError('Limit capacity reached for this event.');

  await activitiesRepository.recordUserActivity(activityId, activityDayId, userId);

  await activitiesRepository.updateActivityCapacity(activity);
}

export const activitiesService = {
  getListDates,
  getDayActivities,
  recordAcivity,
};
