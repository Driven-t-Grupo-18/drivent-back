import { notFoundError } from '@/errors';
import { activitiesRepository } from '@/repositories/activities-repository';

async function getListActivityDays() {
  const activitiesDay = await activitiesRepository.getAllActivitiesDay();
  if (!activitiesDay) throw notFoundError();

  return activitiesDay;
}

export const activitiesService = {
  getListActivityDays,
};
