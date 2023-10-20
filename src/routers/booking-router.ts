import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { bookRoom, changeBooking, getBooking, getAllBookings } from '@/controllers';
import { bookingSchema } from '@/schemas/booking-schema';

const bookingRouter = Router();

bookingRouter
  .all('/*', authenticateToken)
  .get('/', getBooking)
  .get('/all', getAllBookings)
  .post('/', validateBody(bookingSchema), bookRoom)
  .put('/:bookingId', validateBody(bookingSchema), changeBooking);

export { bookingRouter };
