import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
<<<<<<< HEAD
import { bookRoom, changeBooking, getBooking, getAllBookings } from '@/controllers';
=======
import { bookRoom, changeBooking, getBooking } from '@/controllers';
>>>>>>> 556a463476d4d0ce81f5e57323728507a35f9376
import { bookingSchema } from '@/schemas/booking-schema';

const bookingRouter = Router();

bookingRouter
  .all('/*', authenticateToken)
  .get('/', getBooking)
<<<<<<< HEAD
  .get('/all', getAllBookings)
=======
>>>>>>> 556a463476d4d0ce81f5e57323728507a35f9376
  .post('/', validateBody(bookingSchema), bookRoom)
  .put('/:bookingId', validateBody(bookingSchema), changeBooking);

export { bookingRouter };
