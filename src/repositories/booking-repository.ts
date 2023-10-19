import { CreateBookingParams, UpdateBookingParams } from '@/protocols';
import { prisma } from '@/config';

async function create({ roomId, userId }: CreateBookingParams) {
  return prisma.booking.create({
    data: { roomId, userId },
  });
}

async function findByRoomId(roomId: number) {
  return prisma.booking.findMany({
    where: { roomId },
    include: { Room: true },
  });
}

async function findByUserId(userId: number) {
  return prisma.booking.findFirst({
    where: { userId },
    include: { Room: true },
  });
}

async function upsertBooking({ id, roomId, userId }: UpdateBookingParams) {
  return prisma.booking.upsert({
    where: { id },
    create: { roomId, userId },
    update: { roomId },
  });
}
async function getAll(){
  return prisma.hotel.findMany({
    include: {
      Rooms: {
        include: {Booking: true}
      }
  }
  })
}
export const bookingRepository = {
  create,
  findByRoomId,
  findByUserId,
  upsertBooking,
  getAll
};
