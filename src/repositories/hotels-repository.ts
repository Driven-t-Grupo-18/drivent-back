import { prisma } from '@/config';
import { getRedis, setRedis } from '@/redisConfig';

async function findHotels() {
  const redis = JSON.parse(await getRedis(`hotels`))

  if(redis){
    return redis
  } else{
  
  const result = await prisma.hotel.findMany();

  await setRedis(`hotels`, JSON.stringify(result))

  return result
  }
}

async function findRoomsByHotelId(hotelId: number) {
  const redis = JSON.parse(await getRedis(`roomsByHotelId-${hotelId}`))

  if(redis){
    return redis
  } else{

    const result = await prisma.hotel.findFirst({
      where: {
        id: hotelId,
      },
      include: {
        Rooms: true,
      },
    });

    await setRedis(`roomsByHotelId-${hotelId}`, JSON.stringify(result))
    return result
  }
  
}

export const hotelRepository = {
  findHotels,
  findRoomsByHotelId,
};
