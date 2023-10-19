import { prisma } from '@/config';

async function findAllByHotelId(hotelId: number) {
  return prisma.room.findMany({
    where: { hotelId },
  });
}

async function findById(roomId: number) {
  return prisma.room.findFirst({
    where: { id: roomId },
  });
}

export const roomRepository = {
  findAllByHotelId,
  findById,
};
