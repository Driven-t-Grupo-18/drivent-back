import Joi from 'joi';
import { InputBookingBody } from '@/protocols';

export const bookingSchema = Joi.object<InputBookingBody>({
  roomId: Joi.number().integer().min(1).required(),
});
