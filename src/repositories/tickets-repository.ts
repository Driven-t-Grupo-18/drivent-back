import { TicketStatus } from '@prisma/client';
import { prisma } from '@/config';
import { CreateTicketParams } from '@/protocols';
import { getRedis, setRedis } from '@/redisConfig';

// Redis Aplicado
async function findTicketTypes() {
  const result = await prisma.ticketType.findMany();
  await setRedis(`ticketTypes`, JSON.stringify(result));
  return result;
}
// Redis Aplicado
async function findTicketByEnrollmentId(enrollmentId: number) {
  const redis = JSON.parse(await getRedis(`ticketsByEnrollmentId-${enrollmentId}`));
  if (redis) {
    return redis;
  } else {
    const result = await prisma.ticket.findUnique({
      where: { enrollmentId },
      include: { TicketType: true },
    });
    await setRedis(`ticketsByEnrollmentId-${enrollmentId}`, JSON.stringify(result));
    return result;
  }
}
// Redis Aplicado
async function createTicket(ticket: CreateTicketParams) {
  const result = await prisma.ticket.create({
    data: ticket,
    include: { TicketType: true },
  });
  await setRedis(`ticket-${ticket}`, JSON.stringify(result));
  return result;
}
// Redis Aplicado
async function findTicketById(ticketId: number) {
  const redis = JSON.parse(await getRedis(`ticketById-${ticketId}`));
  if (redis) {
    return redis;
  } else {
    const result = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: { TicketType: true },
    });
    await setRedis(`ticketsById-${ticketId}`, JSON.stringify(result));
    return result;
  }
}
// Redis Aplicado
async function ticketProcessPayment(ticketId: number) {
  const result = prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      status: TicketStatus.PAID,
    },
  });
  await setRedis(`ticketById-${ticketId}`, JSON.stringify(result));
  return result;
}

export const ticketsRepository = {
  findTicketTypes,
  findTicketByEnrollmentId,
  createTicket,
  findTicketById,
  ticketProcessPayment,
};
