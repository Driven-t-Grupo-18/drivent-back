import { prisma } from '@/config';
import { PaymentParams } from '@/protocols';
import { getRedis, setRedis } from '@/redisConfig';

async function findPaymentByTicketId(ticketId: number) {
  const redis = JSON.parse(await getRedis(`paymentByTicketId-${ticketId}`))

  if(redis){
    return redis
  } else{

    const result = await prisma.payment.findFirst({
      where: { ticketId },
    });

    await setRedis(`paymentByTicketId-${ticketId}`, JSON.stringify(result))
    return result
  }
  
  
  

}

async function createPayment(ticketId: number, params: PaymentParams) {
  const result = await prisma.payment.create({
    data: {
      ticketId,
      ...params,
    },
  });

  await setRedis(`paymentByTicketId-${ticketId}`, JSON.stringify(result))

  return result;
}

export const paymentsRepository = {
  findPaymentByTicketId,
  createPayment,
};
