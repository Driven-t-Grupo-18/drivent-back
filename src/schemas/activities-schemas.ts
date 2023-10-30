import Joi from 'joi';
import { ActivityInputSelected } from '@/protocols';

export const activitySchema = Joi.object<ActivityInputSelected>({
  activityDayId: Joi.number().integer().required(),
  activityId: Joi.number().integer().required(),
});
