import { prisma } from '@/config';
import { getRedis, setRedis } from '@/redisConfig';

// Redis Aplicado ------------------------------------ //
async function findAllByHotelId(hotelId: number) {
  const redis = JSON.parse(await getRedis(`RoomsByHotelId-${hotelId}`));
  if (redis) {
    return redis;
  } else {
    const result = await prisma.room.findMany({
      where: { hotelId },
    });
    setRedis(`RoomsByHotelId-${hotelId}`, JSON.stringify(result));
    return result;
  }
}
// Redis Aplicado ------------------------------------ //
async function findById(roomId: number) {
  const redis = JSON.parse(await getRedis(`roomById-${roomId}`));
  if (redis) {
    return redis;
  } else {
    const result = await prisma.room.findFirst({
      where: { id: roomId },
    });
    setRedis(`roomById-${roomId}`, JSON.stringify(result));
    return;
  }
}

export const roomRepository = {
  findAllByHotelId,
  findById,
};
