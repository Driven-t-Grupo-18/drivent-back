import { Router } from 'express';
import { getDayActivities, getShowDates, postActivityRecord } from '@/controllers/activities-controller';
import { authenticateToken, validateBody, validateParams } from '@/middlewares';
import { activitySchema } from '@/schemas/activities-schemas';

const activitiesRouter = Router();

activitiesRouter.all('/*', authenticateToken);
activitiesRouter.get('/', getShowDates);
activitiesRouter.get('/Day/:activityDayId', getDayActivities);
activitiesRouter.post('/record', validateBody(activitySchema), postActivityRecord);

export { activitiesRouter };
 