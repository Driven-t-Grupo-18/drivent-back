import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { activitiesService } from '@/services/activities-sevice';

export async function getShowActivities(req: AuthenticatedRequest, res: Response) {
  const activitiesList = await activitiesService.getListActivityDays();
  return res.status(httpStatus.OK).send(activitiesList);
}

export async function getDayActivities(req: AuthenticatedRequest, res: Response) {
  return res.status(httpStatus.OK).send('teste');
}

export async function postActivityRecord(req: AuthenticatedRequest, res: Response) {
  return res.status(httpStatus.OK).send('teste');
}
