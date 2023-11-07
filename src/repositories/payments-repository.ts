import { prisma } from '@/config';
import { PaymentParams } from '@/protocols';
import { getRedis, setRedis } from '@/redisConfig';
import { TicketStatus } from '@prisma/client';
// Redis Aplicado
async function findPaymentByTicketId(ticketId: number) {
  const redis = JSON.parse(await getRedis(`paymentByTicketId-${ticketId}`));

  if (redis) {
    return redis;
  } else {
    const result = await prisma.payment.findFirst({
      where: { ticketId },
    });

    await setRedis(`paymentByTicketId-${ticketId}`, JSON.stringify(result));
    return result;
  }
}
// Redis Aplicado
async function createPayment(ticketId: number, params: PaymentParams) {
  const result = await prisma.$transaction(
    [prisma.payment.create({
      data: {
        ticketId,
        ...params,
      },
    }),
    prisma.ticket.update({
      where: {
        id: ticketId,
      },
      data: {
        status: TicketStatus.PAID,
      },
      include: {
        TicketType: true,
      },
    })
    ])

  await setRedis(`paymentByTicketId-${ticketId}`, JSON.stringify(result[0]))
  await setRedis(`ticketById-${ticketId}`, JSON.stringify(result[1]));
  await setRedis(`ticketByEnrollmentId-${result[1].enrollmentId}`, JSON.stringify(result[1]));
  return result
}



export const paymentsRepository = {
  findPaymentByTicketId,
  createPayment,
};
