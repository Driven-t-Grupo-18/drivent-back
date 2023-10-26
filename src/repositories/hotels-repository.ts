import { prisma } from '@/config';
import { getRedis, setRedis } from '@/redisConfig';
// Redis Aplicado
async function findHotels() {
  const redis = JSON.parse(await getRedis(`hotels`));

  if (redis) {
    return redis;
  } else {
    const result = await prisma.hotel.findMany();

    await setRedis(`hotels`, JSON.stringify(result));

    return result;
  }
}
// Redis Aplicado
async function findRoomsByHotelId(hotelId: number) {
  const redis = JSON.parse(await getRedis(`hotelWithRoomsByHotelId-${hotelId}`));

  if (redis) {
    return redis;
  } else {
    const result = await prisma.hotel.findFirst({
      where: {
        id: hotelId,
      },
      include: {
        Rooms: true,
      },
    });

    await setRedis(`hotelWithRoomsByHotelId-${hotelId}`, JSON.stringify(result));
    return result;
  }
}

export const hotelRepository = {
  findHotels,
  findRoomsByHotelId,
};
