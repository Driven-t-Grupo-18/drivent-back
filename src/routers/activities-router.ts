import { Router } from 'express';
import { getDayActivities, getShowActivities, postActivityRecord } from '@/controllers/activities-controller';
import { authenticateToken } from '@/middlewares';

const activitiesRouter = Router();

activitiesRouter.all('/*', authenticateToken);
activitiesRouter.get('/', getShowActivities);
activitiesRouter.get('/Day/:id', getDayActivities);
activitiesRouter.get('/registry', postActivityRecord);

export { activitiesRouter };
