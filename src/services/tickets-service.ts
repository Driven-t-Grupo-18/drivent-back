import { TicketStatus } from '@prisma/client';
import { invalidDataError, notFoundError } from '@/errors';
import { CreateTicketParams } from '@/protocols';
import { enrollmentRepository, ticketsRepository } from '@/repositories';
import { getRedis, setRedis } from '@/redisConfig';

async function findTicketTypes() {
  const ticketTypeA = JSON.parse(await getRedis('ticketTypeA'));
  const ticketTypeB = JSON.parse(await getRedis('ticketTypeB'));
  const ticketTypeC = JSON.parse(await getRedis('ticketTypeC'));
  /*   const ticketTypes = await ticketsRepository.findTicketTypes(); */
  return [ticketTypeA, ticketTypeB, ticketTypeC];
}

async function getTicketByUserId(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  /* const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id); */
  const ticket = JSON.parse(await getRedis(`ticket-${enrollment.id}`));
  if (!ticket) throw notFoundError();

  return ticket;
}

async function createTicket(userId: number, ticketTypeId: number) {
  if (!ticketTypeId) throw invalidDataError('ticketTypeId');
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticketData: CreateTicketParams = {
    enrollmentId: enrollment.id,
    ticketTypeId,
    status: TicketStatus.RESERVED,
  };

  const ticket = await ticketsRepository.createTicket(ticketData);
  await setRedis(`ticket-${enrollment.id}`, JSON.stringify(ticket));
  return ticket;
}

export const ticketsService = {
  findTicketTypes,
  getTicketByUserId,
  createTicket,
};
