import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { activitiesService } from '@/services/activities-sevice';

export async function getShowDates(req: AuthenticatedRequest, res: Response) {
  const listDates = await activitiesService.getListDates();
  return res.status(httpStatus.OK).send(listDates);
}

export async function getDayActivities(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const activityDayId = Number(req.params.activityDayId);

  const listDayActivities = await activitiesService.getDayActivities(activityDayId, userId);
  return res.status(httpStatus.OK).send(listDayActivities);
}

export async function postActivityRecord(req: AuthenticatedRequest, res: Response) {
  return res.status(httpStatus.OK).send('teste');
}
