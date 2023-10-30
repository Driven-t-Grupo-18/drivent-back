import { CreateBookingParams, UpdateBookingParams } from '@/protocols';
import { prisma } from '@/config';
import { getRedis, setRedis } from '@/redisConfig';
// Redis Aplicado
async function create({ roomId, userId }: CreateBookingParams) {
  const booking = await prisma.booking.create({
    data: { roomId, userId },
  });
  await setRedis(`bookingByUserId-${userId}`, JSON.stringify(booking));

  return booking;
}
// Redis Aplicado
async function findByRoomId(roomId: number) {
  const bookings = await prisma.booking.findMany({
    where: { roomId },
    include: { Room: true },
  });

  return bookings;
}
// Redis Aplicado
async function findByUserId(userId: number) {
  const bookingRedis = JSON.parse(await getRedis(`bookingByUserId-${userId}`));
  if (bookingRedis && bookingRedis.id) {
    return bookingRedis;
  } else {
    const booking = await prisma.booking.findFirst({
      where: { userId },
      include: { Room: true },
    });

    await setRedis(`bookingByUserId-${userId}`, JSON.stringify(booking));
    return booking;
  }
}
// Redis Aplicado
async function upsertBooking({ id, roomId, userId }: UpdateBookingParams) {
  const redisBooking = await getRedis(`bookingByUserId-${userId}`);
  const booking = await prisma.booking.upsert({
    where: { id },
    create: { roomId, userId },
    update: { roomId },
  });
  if (booking) {
    redisBooking.roomId === roomId;
    await setRedis(`bookingByUserId-${userId}`, JSON.stringify(redisBooking));
  }
  return booking;
}
// Redis Aplicado
async function getAll() {
  const hotels = await prisma.hotel.findMany({
    include: {
      Rooms: {
        include: { Booking: true },
      },
    },
  });

  return hotels;
}
export const bookingRepository = {
  create,
  findByRoomId,
  findByUserId,
  upsertBooking,
  getAll,
};
