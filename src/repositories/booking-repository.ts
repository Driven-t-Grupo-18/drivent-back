import { CreateBookingParams, UpdateBookingParams } from '@/protocols';
import { prisma } from '@/config';
import { getRedis, setRedis } from '@/redisConfig';

async function create({ roomId, userId }: CreateBookingParams) {
  const booking = prisma.booking.create({
    data: { roomId, userId },
  });
  await setRedis(`bookingByRoomId-${roomId}`, JSON.stringify(booking));
  await setRedis(`bookingByUserId-${userId}`, JSON.stringify(booking));

  return booking;
}

async function findByRoomId(roomId: number) {
  const bookingRedis = JSON.parse(await getRedis(`bookingByRoomId-${roomId}`));
  if (bookingRedis) {
    return bookingRedis;
  } else {
    const booking = await prisma.booking.findMany({
      where: { roomId },
      include: { Room: true },
    });
    await setRedis(`bookingByRoomId-${roomId}`, JSON.stringify(booking));

    return booking;
  }
}

async function findByUserId(userId: number) {
  const bookingRedis = JSON.parse(await getRedis(`bookingByUserId-${userId}`));
  if (bookingRedis) {
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

async function upsertBooking({ id, roomId, userId }: UpdateBookingParams) {
  const booking = prisma.booking.upsert({
    where: { id },
    create: { roomId, userId },
    update: { roomId },
  });

  await setRedis(`bookingByRoomId-${roomId}`, JSON.stringify(booking));
  await setRedis(`bookingByUserId-${userId}`, JSON.stringify(booking));
  return booking;
}
async function getAll() {
  if (JSON.parse(await getRedis(`hotels`))) {
    return JSON.parse(await getRedis(`hotels`));
  } else {
    const hotels = await prisma.hotel.findMany({
      include: {
        Rooms: {
          include: { Booking: true },
        },
      },
    });
    await setRedis(`hotelsWithRoomsAndBookings`, JSON.stringify(hotels));

    return hotels;
  }
}
export const bookingRepository = {
  create,
  findByRoomId,
  findByUserId,
  upsertBooking,
  getAll,
};
