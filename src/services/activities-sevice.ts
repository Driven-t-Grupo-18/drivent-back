import { conflictError, notFoundError } from '@/errors';
import { ActivityInputSelected } from '@/protocols';
import { activitiesRepository } from '@/repositories/activities-repository';
import { Activity } from '@prisma/client';

async function getListDates() {
  const activitiesDay = await activitiesRepository.getAllActivitiesDay();
  if (!activitiesDay) throw notFoundError();

  return activitiesDay;
}
//FUNÇÃO PARA PEGAR AS DISPONIBILIDADES DE CADA ATIVIDADE (ACRESCENTA UM ITEM 'occupied' NO OBJETO DELA)
async function getAvailabilityByDay(activityDayId: number, activities: Activity[]){
  const registrations = await activitiesRepository.getReservationsByDay(activityDayId)
  
  const newActivitiesArray =  activities.map(activity => {

    const registered = registrations.find(registration => {
      return (registration.activityId === activity.id)
    })
    activity.occupied = registered ? registered._count : 0
    return activity
  })

  return newActivitiesArray

}

async function getDayActivities(activityDayId: number, userId: number) {
  const activitiesFromDay = await activitiesRepository.findActivitiesFromDay(activityDayId);

  if (!activitiesFromDay) throw notFoundError();
  const activitiesFromDayWithOccupation = (await getAvailabilityByDay(activityDayId, activitiesFromDay)).sort((x, y) => {
    if (x.startsAt > y.startsAt) return 1
    if (x.startsAt < y.startsAt) return -1
  })

  const userActivities = await activitiesRepository.findActivitiesFromUser(userId);

  const userActivitiesIds = userActivities.map((activity) => activity.id);
  return { activitiesFromDayWithOccupation, userActivitiesIds };
}

async function recordAcivity(params: ActivityInputSelected, userId: number) {
  const { activityId, activityDayId } = params;

  const activityDay = await activitiesRepository.findActivityDayById(activityDayId);
  if (!activityDay) throw notFoundError();

  const activity = await activitiesRepository.findActivityById(activityId);
  if (!activity) throw notFoundError();

  if (activity.capacity <= 0) throw conflictError('Limit capacity reached for this event.');

  await activitiesRepository.recordUserActivity(activity.capacity, activityId, activityDayId, userId);

}

export const activitiesService = {
  getListDates,
  getDayActivities,
  recordAcivity,
};
